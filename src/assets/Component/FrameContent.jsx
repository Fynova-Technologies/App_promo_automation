import { forwardRef } from "react";
import { InnerImage } from "./ScreenShot";

export const FrameContent = forwardRef(({
    frameRef,
    position,
    rotation,
    size,
    mobileFrame,
    innerImageSrc,
    screenArea,
    selected,
    handleSelect,
    handleDragStart,
    handleTouchStart,
    handleRotationStart,
    handleResizeStart,
  }, ref) => (
    <div
      ref={frameRef}
      className="image-container"
      style={{
        position: "relative",
        left: `${position.x}px`,
        top:  `${position.y}px`,
        width:  `${size.width}px`,
        height: `${size.height}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        cursor: selected ? "move" : "pointer",
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
        alt="device frame"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width:  `${size.width}px`,
          height: `${size.height}px`,
        }}
        draggable={false}
      />
      {selected && (
        <>
          <div className="rotation-handle" onMouseDown={handleRotationStart} />
          <div className="resize-handle"   onMouseDown={handleResizeStart} />
        </>
      )}
    </div>
  ));
  