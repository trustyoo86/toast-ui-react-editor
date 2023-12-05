import { forwardRef, useEffect, useRef } from 'react';

import Viewer, { EventMap, ViewerOptions } from '@toast-ui/editor/dist/toastui-editor-viewer';

import type ViewerInstance from '@toast-ui/editor/dist/toastui-editor-viewer';
import type { EventNames, ViewerProps } from '@toast-ui/react-editor';

export interface TViwerInstance {
  getInstance(): ViewerInstance;
  getRootElement(): HTMLElement;
}

const getBindingEventNames = (props: ViewerProps) =>
  Object.keys(props)
    .filter(key => /^on[A-Z][a-zA-Z]+/.test(key))
    .filter(key => props[key as EventNames]);

const getInitEvents = (props: ViewerProps) =>
  getBindingEventNames(props).reduce(
    (acc: Record<string, EventMap[keyof EventMap]>, key) => {
      const eventName = (key[2].toLowerCase() + key.slice(3)) as keyof EventMap;

      acc[eventName] = props[key as EventNames];

      return acc;
    },
    {},
  );

const bindEventHandlers = (props: ViewerProps, viewer: ViewerInstance) => {
  getBindingEventNames(props).forEach(key => {
    const eventName = key[2].toLowerCase() + key.slice(3);

    viewer.off(eventName);
    viewer.on(eventName, props[key as EventNames]!);
  });
};

const ToastEditorViewer = forwardRef<TViwerInstance, ViewerOptions>((props, ref) => {
  const rootEl = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerInstance>();

  useEffect(() => {
    let viewer: ViewerInstance;

    if (rootEl.current) {
      viewer = new Viewer({
        ...props,
        el: rootEl.current,
        events: getInitEvents(props),
      });
      viewerRef.current = viewer;

      if (viewerRef.current) {
        if (typeof ref === 'function') {
          ref({
            getInstance: () => viewer,
            getRootElement: () => rootEl.current as HTMLElement,
          });
        } else if (ref) {
          ref.current = {
            getInstance: () => viewer,
            getRootElement: () => rootEl.current as HTMLElement,
          };
        }
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [ref]);

  useEffect(() => {
    if (viewerRef.current) {
      bindEventHandlers(props, viewerRef.current);
    }
  }, [props]);

  return <div ref={rootEl} />;
});

export default ToastEditorViewer;
