"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import { produce, WritableDraft } from "immer";
import { Layer } from "@/types/layer";
import { Page } from "@/types/page";

export type EditorState = {
  page: Page;
  selectedLayerIds: string[];
  hoveredLayer: string | null;
  scale: number;
  sideBarTab: string | null;
  settingsOpen: boolean;
  notes: string;
  history: {
    past: EditorState[];
    future: EditorState[];
  };
  notesOpen: boolean;
  sideBarOpen: boolean;
};

// Initial state
const initialState: EditorState = {
  page: {
    name: "`My design`",
    layers: {},
    notes: "",
    size: {
      width: 800,
      height: 600,
    },
  },
  selectedLayerIds: [],
  hoveredLayer: null,
  scale: 1,
  sideBarTab: null,
  settingsOpen: false,
  history: {
    past: [],
    future: [],
  },
  notesOpen: false,
  notes: "",
  sideBarOpen: true,
};

// Action types
type Action =
  | { type: "SET_SIDEBAR_TAB"; payload: string | null }
  | { type: "SET_SETTINGS_OPEN"; payload: boolean }
  | { type: "SELECT_LAYER"; payload: string }
  | { type: "DESELECT_LAYER"; payload: string }
  | { type: "DESELECT_ALL" }
  | { type: "SET_SCALE"; payload: number }
  | { type: "ADD_LAYER"; payload: { layer: Layer } }
  | {
      type: "UPDATE_LAYER";
      payload: { layerId: string; props: Partial<Layer> };
    }
  | { type: "DELETE_LAYER"; payload: { layerId: string } }
  | { type: "SET_NOTES"; payload: string }
  | { type: "HOVER_LAYER"; payload: string | null }
  | { type: "SAVE_HISTORY" }
  | { type: "TOGGLE_NOTES" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "IMPORT_DESIGN"; payload: EditorState }
  | { type: "UPDATE_PAGE_STATE"; payload: Partial<Page> };

// Reducer function
function editorReducer(state: EditorState, action: Action): EditorState {
  return produce(state, (draft) => {
    switch (action.type) {
      case "SET_SIDEBAR_TAB":
        draft.sideBarTab = action.payload;
        break;
      case "SET_SETTINGS_OPEN":
        draft.settingsOpen = action.payload;
        break;
      case "SELECT_LAYER":
        if (!draft.selectedLayerIds.includes(action.payload)) {
          draft.selectedLayerIds.push(action.payload);
        }
        break;
      case "DESELECT_LAYER":
        draft.selectedLayerIds = draft.selectedLayerIds.filter(
          (id) => id !== action.payload
        );
        break;
      case "DESELECT_ALL":
        draft.selectedLayerIds = [];
        break;
      case "SET_SCALE":
        draft.scale = action.payload;
        break;
      case "ADD_LAYER": {
        const { layer } = action.payload;
        draft.page.layers[layer.id] = layer as WritableDraft<Layer>;
        draft.selectedLayerIds = [layer.id];
        break;
      }
      case "UPDATE_LAYER": {
        const { layerId, props } = action.payload;
        if (draft.page?.layers[layerId]) {
          Object.assign(draft.page.layers[layerId], props);
        }
        break;
      }
      case "DELETE_LAYER": {
        const { layerId } = action.payload;
        if (draft.page?.layers[layerId]) {
          delete draft.page.layers[layerId];
          draft.selectedLayerIds = draft.selectedLayerIds.filter(
            (id) => id !== layerId
          );
          if (draft.hoveredLayer === layerId) {
            draft.hoveredLayer = null;
          }
        }
        break;
      }
      case "TOGGLE_NOTES": {
        draft.notesOpen = !draft.notesOpen;
        break;
      }
      case "SET_NOTES":
        draft.notes = action.payload;
        break;
      case "HOVER_LAYER":
        draft.hoveredLayer = action.payload;
        break;
      case "SAVE_HISTORY":
        // Save current state to history
        draft.history.past.push(
          JSON.parse(
            JSON.stringify({
              ...state,
              history: { past: [], future: [] },
            })
          )
        );
        draft.history.future = [];
        break;
      case "UNDO":
        if (draft.history.past.length > 0) {
          const previous = draft.history.past.pop()!;
          draft.history.future.push(
            JSON.parse(
              JSON.stringify({
                ...state,
                history: { past: [], future: [] },
              })
            )
          );

          // Restore previous state
          const { history, ...restPrevious } = previous;
          Object.assign(draft, restPrevious);
        }
        break;
      case "REDO":
        if (draft.history.future.length > 0) {
          const next = draft.history.future.pop()!;
          draft.history.past.push(
            JSON.parse(
              JSON.stringify({
                ...state,
                history: { past: [], future: [] },
              })
            )
          );

          // Restore next state
          const { history, ...restNext } = next;
          Object.assign(draft, restNext);
        }
        break;
      case "IMPORT_DESIGN": {
        const { page, notes } = action.payload;

        if (page) {
          draft.page = JSON.parse(JSON.stringify(page)) as WritableDraft<Page>;
          if (notes) {
            draft.notes = notes;
          }
          draft.selectedLayerIds = [];
          draft.hoveredLayer = null;

          // Save current state to history
          draft.history.past.push(
            JSON.parse(
              JSON.stringify({
                ...state,
                history: { past: [], future: [] },
              })
            )
          );
          draft.history.future = [];
        }
        break;
      }
      case "UPDATE_PAGE_STATE": {
        Object.assign(draft.page, action.payload); // Merge updates into the page state
        break;
      }
    }
  });
}

// Create context
type EditorContextType = {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
  actions: {
    setSidebarTab: (tab: string | null) => void;
    setSettingsOpen: (open: boolean) => void;
    selectLayer: (id: string) => void;
    deselectLayer: (id: string) => void;
    deselectAllLayers: () => void;
    setScale: (scale: number) => void;
    addLayer: (layer: Layer) => void;
    updateLayer: (layerId: string, props: Partial<Layer>) => void;
    deleteLayer: (layerId: string) => void;
    setNotes: (notes: string) => void;
    hoverLayer: (id: string | null) => void;
    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;
    updatePageState: (updates: Partial<Page>) => void;
  };
};

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

// Provider component
export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Create action methods
  const updatePageState = (updates: Partial<Page>) => {
    dispatch({
      type: "UPDATE_PAGE_STATE",
      payload: updates,
    });
  };

  const actions = {
    setSidebarTab: (tab: string | null) =>
      dispatch({ type: "SET_SIDEBAR_TAB", payload: tab }),
    setSettingsOpen: (open: boolean) =>
      dispatch({ type: "SET_SETTINGS_OPEN", payload: open }),
    selectLayer: (id: string) =>
      dispatch({ type: "SELECT_LAYER", payload: id }),
    deselectLayer: (id: string) =>
      dispatch({ type: "DESELECT_LAYER", payload: id }),
    deselectAllLayers: () => dispatch({ type: "DESELECT_ALL" }),
    setScale: (scale: number) =>
      dispatch({ type: "SET_SCALE", payload: scale }),
    addLayer: (layer: Layer) =>
      dispatch({
        type: "ADD_LAYER",
        payload: { layer },
      }),
    updateLayer: (layerId: string, props: Partial<Layer>) =>
      dispatch({
        type: "UPDATE_LAYER",
        payload: { layerId, props },
      }),
    deleteLayer: (layerId: string) =>
      dispatch({
        type: "DELETE_LAYER",
        payload: { layerId },
      }),
    setNotes: (notes: string) =>
      dispatch({ type: "SET_NOTES", payload: notes }),
    hoverLayer: (id: string | null) =>
      dispatch({ type: "HOVER_LAYER", payload: id }),
    saveToHistory: () => dispatch({ type: "SAVE_HISTORY" }),
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
    updatePageState,
  };

  return (
    <EditorContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </EditorContext.Provider>
  );
}

// Custom hook to use the editor context
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
