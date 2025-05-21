import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { InnerImage } from "./ScreenShot";

const RenderSplitFrame = forwardRef(({
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
  index,
  onSelectFrame,
  orginalCanvas
}, ref) => {
  const wrapperRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getRenderSplitFrame: () => wrapperRef.current,
  }));

  const leftCanvasLeft = 0;
  const leftCanvasRight = canvasSize.width;
  const leftCanvasTop = 20;
  const leftCanvasBottom = canvasSize.height + 20;

  const rightCanvasLeft = canvasSize.width + gap;
  const rightCanvasRight = canvasSize.width * 2 + gap;
  const rightCanvasTop = 20;
  const rightCanvasBottom = canvasSize.height + 20;

  const frameLeft = position.x - 300;
  const frameRight = position.x + size.width + 300;
  const frameTop = position.y - 200;
  const frameBottom = position.y + size.height + 300;

  const leftOverlap = !(
    frameRight <= leftCanvasLeft ||
    frameLeft >= leftCanvasRight ||
    frameBottom <= leftCanvasTop ||
    frameTop >= leftCanvasBottom
  );

  const rightOverlap = !(
    frameRight <= rightCanvasLeft ||
    frameLeft >= rightCanvasRight ||
    frameBottom <= rightCanvasTop ||
    frameTop >= rightCanvasBottom
  );

  const leftVisibleLeft = Math.max(frameLeft, leftCanvasLeft);
  const leftVisibleRight = Math.min(frameRight, leftCanvasRight);
  const leftVisibleTop = Math.max(frameTop, leftCanvasTop);
  const leftVisibleBottom = Math.min(frameBottom, leftCanvasBottom);

  const leftVisibleWidth = leftVisibleRight - leftVisibleLeft;
  const leftVisibleHeight = leftVisibleBottom - leftVisibleTop;

  const rightVisibleLeft = Math.max(frameLeft, rightCanvasLeft);
  const rightVisibleRight = Math.min(frameRight, rightCanvasRight);
  const rightVisibleTop = Math.max(frameTop, rightCanvasTop);
  const rightVisibleBottom = Math.min(frameBottom, rightCanvasBottom);

  const rightVisibleWidth = rightVisibleRight - rightVisibleLeft;
  const rightVisibleHeight = rightVisibleBottom - rightVisibleTop;

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

  const canvasOffsetX = index === 1 ? canvasSize.width + gap : 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (frameRef.current && !frameRef.current.contains(e.target)) {
        onDeselect();
      }
    };

    if (selected) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {};
  }, [onDeselect, selected, frameRef, showCaptionBox]);

  return (
    <>
      <div ref={wrapperRef}>
      {/* Left frame part */}
      {leftOverlap && leftVisibleWidth > 0 && leftVisibleHeight > 0 && (
        <div
          className="absolute overflow-hidden"
          style={{
            left: `${leftVisibleLeft - canvasOffsetX}px`,
            top: `${leftVisibleTop}px`,
            width: `${leftVisibleWidth}px`,
            height: `${leftVisibleHeight}px`,
            zIndex: 5,
          }}
        >
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
              <InnerImage
                src={innerImageSrc}
                alt="inner content"
                screenArea={screenArea}
                style={innerImageStyle}
              />
            )}
            <img src={mobileFrame} alt="device frame" style={frameImageStyle} />
          </div>
        </div>
      )}

      {/* Right frame part */}
      {rightOverlap && rightVisibleWidth > 0 && rightVisibleHeight > 0 && (
        <div
          className="absolute overflow-hidden"
          style={{
            left: `${rightVisibleLeft - canvasOffsetX}px`,
            top: `${rightVisibleTop}px`,
            width: `${rightVisibleWidth}px`,
            height: `${rightVisibleHeight}px`,
            zIndex: 5,
          }}
        >
          <div
            className="absolute overflow-hidden"
            style={{
              left: `${position.x - rightVisibleLeft}px`,
              top: `${position.y - rightVisibleTop}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            {innerImageSrc && (
              <InnerImage
                src={innerImageSrc}
                alt="inner content"
                screenArea={screenArea}
                style={innerImageStyle}
              />
            )}
            <img src={mobileFrame} alt="device frame" style={frameImageStyle} />
          </div>
        </div>
      )}
      </div>

      {/* Invisible reference frame for dragging */}
      <div
        ref={frameRef}
        className="absolute cursor-move z-10"
        style={{
          left: `${position.x - canvasOffsetX}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          opacity: 0,
          overflow: 'hidden'
        }}
        // onMouseDown={handleDragStart}
        onMouseDown={(e) => {
          onSelectFrame(e);
          handleDragStart(e);
        }}
        onTouchStart={handleTouchStart}
      />

      {/* Control handles (only visible when frame is selected) */}
      {selected && (
        <>
          {/* Rotation handle */}
          <div
            className="absolute z-20 rotation-handle"
            style={{
              left: `${position.x + size.width / 2 - 10 - canvasOffsetX}px`,
              top: `${position.y - 20}px`,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4299e1",
              cursor: "grab",
            }}
            onMouseDown={handleRotationStart}
          />
          {/* Resize handle */}
          <div
            className="absolute z-20 resize-handle"
            style={{
              left: `${position.x + size.width - 10 - canvasOffsetX}px`,
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
});

export default RenderSplitFrame;
