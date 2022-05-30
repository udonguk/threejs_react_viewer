import React, {useEffect} from 'react'
import {SimpleDropzone} from "simple-dropzone";

const DropZone = ({dropEl, inputEl, spinnerEl, setFileObj}) => {

  useEffect(() => {
    console.log('useEffected')
    createDropzone()
    hideSpinner()
  }, [])

  const createDropzone = () => {
    const dropCtrl = new SimpleDropzone(dropEl.current, inputEl.current);
    dropCtrl.on('drop', ({files}) => load(files));
    dropCtrl.on('dropstart', () => showSpinner());
    dropCtrl.on('droperror', () => hideSpinner());
  }

  const load = (fileMap) => {
    let rootFile;
    let rootPath;
    Array.from(fileMap).forEach(([path, file]) => {
      if (file.name.match(/\.(gltf|glb)$/)) {
        rootFile = file;
        rootPath = path.replace(file.name, '');
      }
    });

    if (!rootFile) {
      onError('No .gltf or .glb asset found.');
    }

    setFileObj({
      rootFile: rootFile,
      rootPath: rootPath,
      fileMap: fileMap,
    })
  }

  const onError = (error) => {
    let message = (error||{}).message || error.toString();
    if (message.match(/ProgressEvent/)) {
      message = 'Unable to retrieve this file. Check JS console and browser network tab.';
    } else if (message.match(/Unexpected token/)) {
      message = `Unable to parse file content. Verify that this file is valid. Error: "${message}"`;
    } else if (error && error.target && error.target instanceof Image) {
      message = 'Missing texture: ' + error.target.src.split('/').pop();
    }
    window.alert(message);
    console.error(error);
  }

  const showSpinner = () => {
    spinnerEl.current.style.display = '';
  }

  const hideSpinner = () => {
    spinnerEl.current.style.display = 'none';
  }

  return (
    <div className="dropzone"
         ref={dropEl}
    >
      <div className="placeholder">
        <p>Drag glTF 2.0 file or folder here</p>
      </div>
      <div className="upload-btn">
        <input type="file" name="file-input[]" id="file-input" multiple=""/>
        <label htmlFor="file-input" ref={inputEl}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
            <path
              d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
          </svg>
          <span>Upload</span>
        </label>
      </div>
    </div>
  )
}

export default DropZone