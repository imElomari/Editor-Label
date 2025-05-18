import { EditorView } from 'prosemirror-view';
import { EventEmitter } from './EventEmitter';

export type TextEditor = EditorView & {
    events: EventEmitter;
};
