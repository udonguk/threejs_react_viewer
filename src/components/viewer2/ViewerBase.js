import React, {useEffect, useRef} from "react";
import queryString from "query-string";
import {Viewer} from "../viewer/Viewer";

const ViewerBase = ({fileObj}) => {
  const baseEl = useRef()
  let viewer = null
  const hash = document.body.hash ? queryString.parse(document.body.hash) : {};
  let options = {
    kiosk: Boolean(hash.kiosk),
    model: hash.model || '',
    preset: hash.preset || '',
    cameraPosition: hash.cameraPosition
      ? hash.cameraPosition.split(',').map(Number)
      : null
  };

  const validationParam = (fileObj) => {
    console.log('validationParam')
    console.log('fileObj', fileObj)
    let result = true;
    if(undefined === fileObj.rootFile || null === fileObj.rootFile){
      result = false;
    }

    if(undefined === fileObj.fileMap || null === fileObj.fileMap || !(fileObj.fileMap instanceof Map)){
      result = false;
    }
    return result;
  }

  const draw = () => {
    if(!validationParam(fileObj)){
      console.debug('invalid')
      return null
    }
    console.debug('valid')

    if(viewer) { viewer.clear() }
    const viewerObj = viewer || createViewer();

    const fileURL = typeof rootFile === 'string'
      ? fileObj.rootFile
      : URL.createObjectURL(fileObj.rootFile);

    const cleanup = () => {
      if (typeof rootFile === 'object') URL.revokeObjectURL(fileURL);
    };

    viewerObj
      .load(fileURL, fileObj.rootPath, fileObj.fileMap)
      .catch((e) => this.onError(e))
      .then((gltf) => {
        cleanup();
      });
  }

  const createViewer = () => {
    baseEl.current.innerHTML = '';
    viewer = new Viewer(baseEl.current, options, baseEl.current.clientWidth, 1000);
    return viewer;
  }

  useEffect(() => {
    draw()
  }, [fileObj])

  return (
    <div className="base"
         style={{
           backgroundColor: "red",
           height: "900px",
           width: "100%",
           position: "relative"}}
         ref={baseEl}/>
  )
}

export default ViewerBase