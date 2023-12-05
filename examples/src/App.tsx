import { useRef } from 'react'
import './App.css'

import { Editor, Viewer } from '../../dist/index';
import '../../dist/toastui-editor.css';
import './App.css';

function App() {
  const editorRef = useRef();
  const viewerRef = useRef();

  return (
    <div id="root">
      <Editor ref={editorRef} />
      <Viewer ref={viewerRef} initialValue={'테스트'} width={300} height={200} />
    </div>
  )
}

export default App
