import React, {useState} from 'react';
// import { InnerImage } from "./ScreenShot";
import {CaptionBox} from "./CaptionBox";
import { forwardRef } from 'react';
import '../Style/mockupContainer.css'
// import { FrameContent } from './FrameContent';

const MockupContainer = forwardRef(({
  containerRef,
  // frameRef,
  // rotation,
  // selected,
  // innerImageSrc,
  background,
  showCaptionBox,
  setShowCaptionBox,
  captionText,
  fontColor,
  fontFamily,
  fontSize,
  // screenArea,
  // size,
  // mobileFrame,
  // handleSelect,
  handleDeselect,
  // handleDragStart,
  // handleTouchStart,
  // handleRotationStart,
  // handleResizeStart,
  handleCaptionChange,
  // position,
  canvasSize,
}, ref) => {


  return(
  <div
    ref={containerRef}
    className="mockup-container"
    style={{background: background }}
    onClick={handleDeselect}
  > 
    <div className="canvas-container" style={{width:`${canvasSize.width}px`, height: `${canvasSize.height}px`}}>
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

