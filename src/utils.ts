import type { Editor, EventMap } from '@toast-ui/editor';
import type { EditorProps, EventNames } from '@toast-ui/react-editor';

export const getBindingEventNames = (props: EditorProps) =>
  Object.keys(props)
  .filter(key => /^on[A-Z][a-zA-Z]+/.test(key))
  .filter(key => props[key as EventNames]);

export const getInitEvents = (props: EditorProps) =>
  getBindingEventNames(props).reduce(
    (acc: Record<string, EventMap[keyof EventMap]>, key) => {
      const eventName = (key[2].toLowerCase() + key.slice(3)) as keyof EventMap;

      acc[eventName] = props[key as EventNames];

      return acc;
    },
    {},
  );

export const bindEventHandlers = (props: EditorProps, editor: Editor) => {
  getBindingEventNames(props).forEach(key => {
    const eventName = key[2].toLowerCase() + key.slice(3);

    editor.off(eventName);
    editor.on(eventName, props[key as EventNames]!);
  });
};
