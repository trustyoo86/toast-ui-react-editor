import { createRoot } from 'react-dom/client';

import App from './examples/App';

const domNode = document.getElementById('app') as HTMLElement;
const root = createRoot(domNode);

// @ts-ignore
root.render(<App />);

