import React, {useState, useRef, useImperativeHandle} from 'react';
import {CaptionBox} from "./CaptionBox";
import { forwardRef } from 'react';
import '../Style/mockupContainer.css'

const MockupContainer = forwardRef(({
  containerRef,
  background,
  showCaptionBox,
  setShowCaptionBox,
  captionText,
  fontColor,
  fontFamily,
  fontSize,
  handleDeselect,
  handleCaptionChange,
  canvasSize,
}, ref) => {
  const canvasContainerRef = useRef();

  useImperativeHandle(ref, () => ({
    getCanvasContainer: () => canvasContainerRef.current,    
  }));

  return(
  <div
    ref={containerRef}
    className="mockup-container"
    style={{background: background }}
    onClick={handleDeselect}
  > 
    <div className="canvas-container" ref={canvasContainerRef} style={{width:`${canvasSize.width}px`, height: `${canvasSize.height}px`}}>
    {showCaptionBox && (
        <CaptionBox
          containerRef={containerRef}
          caption={captionText}
          fontColor={fontColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          onCaptionChange={handleCaptionChange}
          onDelete={() => setShowCaptionBox(false)}
        />
      )}
    </div> 
  </div>
)});

export default MockupContainer;

