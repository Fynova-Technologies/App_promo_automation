import React from 'react';
import { InnerImage } from "./ScreenShot";
import {CaptionBox} from "./CaptionBox";
import '../Style/mockupContainer.css'

const MockupContainer = ({
  containerRef,
  frameRef,
  rotation,
  selected,
  innerImageSrc,
  background,
  showCaptionBox,
  setShowCaptionBox,
  captionText,
  fontColor,
  fontFamily,
  fontSize,
  screenArea,
  size,
  mobileFrame,
  handleSelect,
  handleDeselect,
  handleDragStart,
  handleTouchStart,
  handleRotationStart,
  handleResizeStart,
  handleCaptionChange,
  position
}) => (
  
  <div
    ref={containerRef}
    className="mockup-container"
    style={{background: background }}
    onClick={handleDeselect}
  > 
  
    <div className="canvas-container">
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

      <div
        ref={frameRef}
        className="image-container"
        style={{
          position: "relative",
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
          userSelect: "none",
          cursor: selected ? "move" : "pointer",
          zIndex: selected ? 1000 : 1,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        onClick={handleSelect}
        onMouseDown={selected ? handleDragStart : null}
        onTouchStart={handleTouchStart}
      >
        {innerImageSrc && (
          <InnerImage
            src={innerImageSrc}
            parentRotation={rotation}
            screenArea={screenArea}
          />
        )}
        <img
          src={mobileFrame}
          alt="image"
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
          draggable={false}
        />
        {selected && (
          <>
            {handleRotationStart && (
              <div className="rotation-handle" onMouseDown={handleRotationStart} />
            )}
            {handleResizeStart && (
              <div className="resize-handle" onMouseDown={handleResizeStart} />
            )}
          </>
        )}
      </div>
    </div> 
   
  </div>

  );
// );

export default MockupContainer;

