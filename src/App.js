import './App.css';
import queryString from "query-string";
import React, {useRef, useState} from "react";
import Header from "./components/Header";
import DropZone from "./components/DropZone";
import ViewerBase from "./components/viewer2/ViewerBase";

function App() {
  const hash = document.body.hash ? queryString.parse(document.body.hash) : {};
  let viewer = null;
  let options = {
    kiosk: Boolean(hash.kiosk),
    model: hash.model || '',
    preset: hash.preset || '',
    cameraPosition: hash.cameraPosition
      ? hash.cameraPosition.split(',').map(Number)
      : null
  };
  const viewerEl = useRef();
  const spinnerEl = useRef();
  const dropEl = useRef();
  const inputEl = useRef();
  const [fileObj, setFileObj] = useState({
    rootFile: null,
    rootPath: null,
    fileMap: null,
  })
  const [rootFile, setRootFile] = useState(null)
  const [rootPath, setRootPath] = useState(null)
  const [fileMap, setFileMap] = useState(null)

  return (
    <div className="App">
      <main className="wrap">
        <Header/>
        <DropZone dropEl={dropEl}
                  inputEl={inputEl}
                  spinnerEl={spinnerEl}
                  viewerEl={viewerEl}
                  viewer={viewer}
                  options={options}
                  setRootFile={setRootFile}
                  setRootPath={setRootPath}
                  setFileMap={setFileMap}
                  setFileObj={setFileObj}
        />
        <div className="spinner" ref={spinnerEl}/>
      </main>
      <div className="viewerBase" style={{width: "100%"}} ref={viewerEl} />
      <ViewerBase rootFile={rootFile} rootPath={rootPath} fileMap={fileMap} fileObj={fileObj}/>
    </div>
  );
}

export default App;
