import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import MockupContainer from "./MockupContainer";
import googlepixel4 from '../Pictures/googlepixel4.png';

const MockupInstance = forwardRef(({ index, onSelect, background, onDownload, isActive}, ref) => {
  const [position, setPosition] = useState(index === 0 ? { x: 80, y: 100 } : { x: 80, y: 100 });
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState({ width: 225, height: 450 });
  const [selected, setSelected] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [innerImageSrc, setInnerImageSrc] = useState(null);
  const [showCaptionBox, setShowCaptionBox] = useState(false);
  const [captionText, setCaptionText] = useState("Double Click");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("28");
  const [mobileFrame, setMobileFrame] = useState(googlepixel4);
  const [activeFrameId, setActiveFrameId] = useState(1);
  const [screenArea, setScreenArea] = useState({
    // width: 225,
    // height: 400,
    width: size.width,
    height: size.height,
    top: 10,
    left: 0,
  });
  const [currentFrameConfig, setCurrentFrameConfig] = useState({
    screenAreaOffsets: { top: 0.01, left: 0.005, right: 0.00, bottom: 0.00 },
    adjustmentStep: { width: 10, height: 20 },
  });
  const [mobileFrames, setMobileFrames] =useState([
    { id: 1, position: { x: 100, y: 100 } },
  ])

  // Refs defined within the component
  const containerRef = useRef(null);
  const frameRef = useRef({});

    // Handle touch events
  const handleTouchStart = (e) => {
    if (!selected) handleSelect(e);
    
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
    setResizing(false);
    setRotating(false);
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  // Event Handlers (moved from MockupSection)
  const handleSelect = (e, frameId) => {
    e.stopPropagation();
    setSelected(true);
    onSelect(index); // Notify parent which mockup is active
    setActiveFrameId(frameId);
  };

  const handleDeselect = () => {
    setSelected(false);
    setDragging(false);
    setResizing(false);
    setRotating(false);
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
    setResizing(false);
    setRotating(false);
    const elementRect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - elementRect.left,
      y: e.clientY - elementRect.top,
    });
  };

  const handleRotationStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRotating(true);
    setDragging(false);
    setResizing(false);
    const rect = frameRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setDragOffset({
      initialRotation: rotation,
      initialAngle,
      centerX,
      centerY,
    });
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    setDragging(false);
    setRotating(false);
    const rect = frameRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = (e) => {
        setInnerImageSrc(e.target.result);
        const aspectRatio = img.width / img.height;
        const frameRect = frameRef.current.getBoundingClientRect();
        let effectiveWidth = screenArea.width;
        let effectiveHeight = screenArea.height;
        if (rotation % 180 !== 0) {
          effectiveWidth = screenArea.height;
          effectiveHeight = screenArea.width;
        }
        const screenAspectRatio = effectiveWidth / effectiveHeight;
        let newWidth, newHeight;
        if (aspectRatio > screenAspectRatio) {
          newWidth = effectiveWidth;
          newHeight = effectiveWidth / aspectRatio;
        } else {
          newHeight = effectiveHeight;
          newWidth = effectiveHeight * aspectRatio;
        }
        setInnerImageSrc(img.src);
        setSize({ width: newWidth, height: newHeight });
      };
    }
  };

  //Handle caption
  const handleCaptionChange = (newCaption) => setCaptionText(newCaption);

  // Mouse and Touch Event Effects 
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (dragging && !resizing && !rotating) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;
        setPosition({ x: newX, y: newY });
      } else if (rotating && selected && !dragging && !resizing) {
        const rect = frameRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        const rotationDelta = angle - dragOffset.initialAngle;
        setRotation(dragOffset.initialRotation + rotationDelta);
      } else if (resizing && selected && !dragging && !rotating) {
        const imageRect = frameRef.current.getBoundingClientRect();
        const dx = e.clientX - imageRect.left;
        const ratio = size.height / size.width;
        const newWidth = Math.max(100, dx);
        const newHeight = newWidth * ratio;
        setSize({ width: newWidth, height: newHeight });
        const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
        setScreenArea({
          width: newWidth - newWidth * (left + right),
          height: newHeight - newHeight * (top + bottom),
          top: newHeight * top,
          left: newWidth * left,
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setDragging(false);
      setRotating(false);
      setResizing(false);
    };

    if (dragging || rotating || resizing) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragging, rotating, resizing, selected, dragOffset, size, currentFrameConfig]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    handleImageSelect,
    toggleCaption: () => {
      setShowCaptionBox((prev) => !prev);
    },
    setMobileFrame,
    setFontColor,
    setFontFamily,
    setFontSize,
    setCaptionText,
    addFrame: () => {
      const newFrame = {
        id: Date.now(),
        position: { x: 80 + mobileFrames.length * 50, y: 100 },
        size: { width: 225, height: 450 },
        mobileFrame: googlepixel4
      };
      setMobileFrames(prev => [...prev, newFrame]);
    },
    removeActiveFrame: () => {
      setMobileFrames(prev => prev.filter(f => f.id !== activeFrameId));
    },
    getActiveFrame: () => mobileFrames.find(f => f.id === activeFrameId)
  }));

  useEffect(() => {
    const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;

    const screenW = size.width  * (1 - left - right);
    const screenH = size.height * (1 - top  - bottom);
    const screenT = size.height * top;
    const screenL = size.width  * left;

    setScreenArea({
      width:  screenW,
      height: screenH,
      top:    screenT,
      left:   screenL
    });
  }, [ size, currentFrameConfig ]);

  return (
    <MockupContainer
      containerRef={containerRef}
      frameRef={frameRef}
      rotation={rotation}
      selected={selected}
      innerImageSrc={innerImageSrc}
      background={background}
      showCaptionBox={showCaptionBox}
      setShowCaptionBox={setShowCaptionBox}
      captionText={captionText}
      fontColor={fontColor}
      fontFamily={fontFamily}
      fontSize={fontSize}
      screenArea={screenArea}
      size={size}
      mobileFrame={mobileFrame}
      // mobileFrames={mobileFrames}
      handleSelect={handleSelect}
      handleDeselect={handleDeselect}
      handleDragStart={handleDragStart}
      handleTouchStart={handleTouchStart}
      handleRotationStart={handleRotationStart}
      handleResizeStart={handleResizeStart}
      handleCaptionChange={handleCaptionChange}
      position={position}
      onDownload={onDownload}
    />
  );
});

export default MockupInstance;

