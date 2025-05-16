import { useEffect } from "react";
import { InnerImage } from "./ScreenShot";

const RenderSplitFrame = ({
  position,
  size,
  rotation,
  selected,
  canvasSize,
  innerImageSrc,
  mobileFrame,
  screenArea,
  gap,
  frameRef,
  handleDragStart,
  handleTouchStart,
  handleRotationStart,
  handleResizeStart,
  onDeselect,
  showCaptionBox,
}) => {
    // Define canvas boundaries in pixels
    const leftCanvasLeft = 0;
    const leftCanvasRight = canvasSize.width;
    const leftCanvasTop = 20;
    const leftCanvasBottom = canvasSize.height + 20;
    
    const rightCanvasLeft = canvasSize.width + gap;
    // const rightCanvasRight =( canvasSize.width * 2 ) + gap;
    const rightCanvasRight = canvasSize.width + gap + canvasSize.width;
    const rightCanvasTop = 20;
    const rightCanvasBottom = canvasSize.height + 20;
    
    // Calculate frame boundaries with rotation (simplification; accurate for small/no rotation)
    const frameLeft = position.x - 300;
    const frameRight = position.x + size.width + 300;
    const frameTop = position.y - 200;
    const frameBottom = position.y + size.height + 300;
    
    // Check if frame overlaps with left canvas
    const leftOverlap = !(
      frameRight <= leftCanvasLeft ||
      frameLeft >= leftCanvasRight ||
      frameBottom <= leftCanvasTop ||
      frameTop >= leftCanvasBottom
    );
    
    // Check if frame overlaps with right canvas
    const rightOverlap = !(
      frameRight <= rightCanvasLeft ||
      frameLeft >= rightCanvasRight ||
      frameBottom <= rightCanvasTop ||
      frameTop >= rightCanvasBottom
    );
    
    // Calculate visible portion in left canvas
    const leftVisibleLeft = Math.max(frameLeft, leftCanvasLeft);
    const leftVisibleRight = Math.min(frameRight, leftCanvasRight);
    const leftVisibleTop = Math.max(frameTop, leftCanvasTop);
    const leftVisibleBottom = Math.min(frameBottom, leftCanvasBottom);
    
    const leftVisibleWidth = leftVisibleRight - leftVisibleLeft;
    const leftVisibleHeight = leftVisibleBottom - leftVisibleTop;
    
    // Calculate visible portion in right canvas
    const rightVisibleLeft = Math.max(frameLeft, rightCanvasLeft);
    const rightVisibleRight = Math.min(frameRight, rightCanvasRight);
    const rightVisibleTop = Math.max(frameTop, rightCanvasTop);
    const rightVisibleBottom = Math.min(frameBottom, rightCanvasBottom);
    
    const rightVisibleWidth = rightVisibleRight - rightVisibleLeft;
    const rightVisibleHeight = rightVisibleBottom - rightVisibleTop;

    // const innerImageContainerStyle = {
    //   position: "absolute",
    //   top: screenArea?.top || "5%",
    //   left: screenArea?.left || "5%",
    //   width: screenArea?.width || "90%",
    //   height: screenArea?.height || "90%",
    //   overflow: "hidden",
    // };

  const innerImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const frameImageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: 200,
    draggable: false,
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (frameRef.current && !frameRef.current.contains(e.target)) {
        onDeselect();
      }
    };

    if (selected) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {};
  }, [onDeselect, selected, frameRef, showCaptionBox]);
    
    return (
    <>
      {/* Left frame part */}
      {leftOverlap && leftVisibleWidth > 0 && leftVisibleHeight > 0 && (
        <div 
          className="absolute overflow-hidden"
          style={{
            left: `${leftVisibleLeft}px`,
            top: `${leftVisibleTop}px`,
            width: `${leftVisibleWidth}px`,
            height: `${leftVisibleHeight}px`,
            zIndex: 5,
            position: "absolute"
          }}
        >
          <div style={{ transform: "translateZ(0)", }}>
            <div
              className="absolute overflow-hidden"
              style={{
                left: `${position.x - leftVisibleLeft}px`,
                top: `${position.y - leftVisibleTop}px`,
                width: `${size.width}px`,               
                height: `${size.height}px`,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
                
              
              {innerImageSrc && (
                // <div style={innerImageContainerStyle}>
                  <InnerImage
                    src={innerImageSrc}
                    alt="inner content"
                    screenArea={screenArea}
                    // adjustmentStep={{ width: 10, height: 20 }} 
                    style={innerImageStyle}
                  />
                // </div>
              )}
              
              <img
                src={mobileFrame}
                alt="device frame"
                style={frameImageStyle}
              />
            </div>
          </div>
        // </div>
      )}
      
      {/* Right frame part */}
      {rightOverlap && rightVisibleWidth > 0 && rightVisibleHeight > 0 && (
        <div 
          className="absolute overflow-hidden"
          style={{
            left: `${rightVisibleLeft}px`,
            top: `${rightVisibleTop}px`,
            width: `${rightVisibleWidth}px`,
            height: `${rightVisibleHeight}px`,
            zIndex: 5,
          }}
        >
          <div style={{ transform: "translateZ(0)" }}>
            <div
              className="absolute"
              style={{
                left: `${position.x - rightVisibleLeft}px`,
                top: `${position.y - rightVisibleTop}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              {/* Inner image content */}
              {innerImageSrc && (
                // <div style={innerImageContainerStyle}>
                  <InnerImage
                    src={innerImageSrc}
                    alt="inner content"
                    style={innerImageStyle}
                    screenArea={screenArea}
                  />
                // </div>
              )}
              {/* Mobile frame image */}
              <img
                src={mobileFrame}
                alt="device frame"
                style={frameImageStyle}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Invisible reference frame for dragging */}
      <div
        ref={frameRef}
        className="absolute cursor-move z-10"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          opacity: 0,
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleTouchStart}
      ></div>

      {/* Control handles (only visible when frame is selected) */}
      {selected && (
        <>
          <div 
            className="absolute z-20"
            style={{
              left: `${position.x + size.width / 2 - 10}px`,
              top: `${position.y - 20}px`,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4299e1",
              cursor: "grab",
            }}
            onMouseDown={handleRotationStart}
          />
          <div 
            className="absolute z-20"
            style={{
              left: `${position.x + size.width - 10}px`,
              top: `${position.y + size.height - 10}px`,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4299e1",
              cursor: "nwse-resize",
            }}
            onMouseDown={handleResizeStart}
          />
        </>
      )}
    </>
  );
  };

  export default RenderSplitFrame;
