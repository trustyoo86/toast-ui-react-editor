import { forwardRef, useEffect, useRef } from 'react';

/* eslint-disable import/named */
import Editor, { Editor as EditorInstance, EditorOptions, EventMap } from '@toast-ui/editor';

import type { EditorProps, EventNames } from '@toast-ui/react-editor';
interface TEditorPropsWithHandlers extends EditorProps {
  onChange(value: string): void;
}

export interface TEditorInstance {
  getInstance(): EditorInstance;
  getRootElement(): HTMLElement;
}

const getBindingEventNames = (props: EditorProps) =>
  Object.keys(props)
    .filter(key => /^on[A-Z][a-zA-Z]+/.test(key))
    .filter(key => props[key as EventNames]);

const getInitEvents = (props: EditorProps) =>
  getBindingEventNames(props).reduce(
    (acc: Record<string, EventMap[keyof EventMap]>, key) => {
      const eventName = (key[2].toLowerCase() + key.slice(3)) as keyof EventMap;

      acc[eventName] = props[key as EventNames];

      return acc;
    },
    {},
  );

const bindEventHandlers = (props: EditorProps, editor: EditorInstance) => {
  getBindingEventNames(props).forEach(key => {
    const eventName = key[2].toLowerCase() + key.slice(3);

    editor.off(eventName);
    editor.on(eventName, props[key as EventNames]!);
  });
};

const ToastEditor = forwardRef<TEditorInstance, TEditorPropsWithHandlers>(
  (props, ref) => {
    const rootEl = useRef<HTMLDivElement>(null);
    const editorRef = useRef<EditorInstance>();

    useEffect(() => {
      let editor: EditorInstance;

      if (rootEl.current) {
        editor = new Editor({
          el: rootEl.current,
          ...props,
          events: getInitEvents(props),
        } satisfies EditorOptions);
        editorRef.current = editor;

        if (editorRef.current) {
          if (typeof ref === 'function') {
            ref({
              getInstance: () => editor,
              getRootElement: () => rootEl.current as HTMLElement,
            });
          } else if (ref) {
            ref.current = {
              getInstance: () => editor,
              getRootElement: () => rootEl.current as HTMLElement,
            };
          }
        }
      }

      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
        }
      };
    }, [ref]);

    useEffect(() => {
      const { height, previewStyle } = props;

      if (editorRef.current) {
        if (height) {
          editorRef.current.setHeight(height);
        }

        if (previewStyle) {
          editorRef.current.changePreviewStyle(previewStyle);
        }

        bindEventHandlers(props, editorRef.current);
      }
    }, [props]);

    return <div ref={rootEl} />;
  },
);

ToastEditor.defaultProps = {
  previewStyle: 'vertical',
  initialEditType: 'wysiwyg',
  useCommandShortcut: true,
  autofocus: false,
  initialValue: '',
  toolbarItems: [['bold', 'strike'], ['ul', 'ol'], ['link']],
};

export default ToastEditor;
