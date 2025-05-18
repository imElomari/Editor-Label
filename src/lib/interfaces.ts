import { EditorView } from 'prosemirror-view';
import { EventEmitter } from '../utils/EventEmitter';

export type TextEditor = EditorView & {
    events: EventEmitter;
};
