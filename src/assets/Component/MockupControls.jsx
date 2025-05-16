import React, { useEffect, useState } from 'react';
import CaptionControls from "./CaptionControls";
import '../Style/mockupControls.css'

const MockupControls = (props) => {
  const [fileInputKey, setFileInputKey] = useState(0);

  const onFileChange = (e) => {
    props.handleImageSelect(e);
    setFileInputKey((prev) => prev+1);
  }

  return ( 
  <>
  <div className="mockup-controls">
    <label className="select-image-button">
      Image
      <input
        type="file"
        accept="image/jpeg, image/png, image/gif, image/svg+xml"
        style={{ display: "none" }}
        onChange={onFileChange}
        key={fileInputKey}
      />
    </label>

    <button
      onClick={props.toggleCaption}
      className="caption-button"
    >
      {props.showCaptionControls ? "Caption" : "Caption"}
    </button>

     <button onClick={props.toggleColorPicker} className="bg-button">
      Color
    </button>
    <button
      onClick={props.toggleFrame}
      className="frame-button"
    >
      {props.showFrameSelector ? "Device" : "Device"}
    </button>

    <div className="mockup-indicator">
      Active Mockup: {props.activeMockupIndex + 1}
    </div>

  </div>
</>
)};

export default MockupControls;
