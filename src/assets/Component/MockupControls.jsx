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
        // onChange={props.handleImageSelect}
        onChange={onFileChange}
        key={fileInputKey}
      />
    </label>

    <button
      onClick={props.toggleCaption}
      className="caption-button"
    //   style={{ background: showCaption ? "#f44336" : "#2196F3" }}
    >
      {props.showCaptionControls ? "Caption" : "Caption"}
    </button>

     <button onClick={props.toggleColorPicker} className="bg-button">
      Color
    </button>
    <button
      onClick={props.toggleFrame}
      className="frame-button"
    //   style={{ background: showFrameSelector ? "#f44336" : "#2196F3" }}
    >
      {props.showFrameSelector ? "Device" : "Device"}
    </button>
  </div>
</>
)};

export default MockupControls;
