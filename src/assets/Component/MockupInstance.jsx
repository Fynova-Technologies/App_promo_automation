import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import MockupContainer from "./MockupContainer";
import RenderSplitFrame from "./RenderSplitFrame";
import googlepixel4 from '../Pictures/googlepixel4.png';
import domtoimage from "dom-to-image";

const MockupInstance = forwardRef(({ index, onSelect, background, onDownload, isActive,canvasCount}, ref) => {
  const [position, setPosition] = useState(index === 0 ? { x: 90, y: 100 } : { x: 500, y: 100 });
  const [size, setSize] = useState({ width: 225, height: 450 });
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(null);
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
  const [canvasSize, setCanvasSize] = useState({width: 380, height: 692});
  const [screenArea, setScreenArea] = useState({
    width: size.width,
    height: size.width,
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
  const [originalCanvas, setOriginalCanvas] = useState(index);
  const gap = 8;

  // Refs defined within the component
  const mockupContainerRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const renderSplitFrameRef = useRef(null);

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
    onSelect(index); // Notify parent which mockup is activ
    setActiveFrameId(frameId);
  };

  const handleDeselect = () => {
    setSelected(false);
    setDragging(false);
    setResizing(false);
    setRotating(false);
  };

  // const handleDragStart = (e) => {
  //     handleSelect(e);
  //   e.stopPropagation();
  //   e.preventDefault();
  //   setSelected(true);
  //   onSelect(index);
  //   const startX = e.clientX;
  //   const startY = e.clientY;
  //   const initialPositionX = position.x;
  //   const initialPositionY = position.y;

  //   // Track whether dragging crosses canvas boundaries
  //   let crossedCanvas = false;
  //   let lastCanvasIndex = index;

  //   const handleMouseMove = (e) => {
  //     const deltaX = e.clientX - startX;
  //     const deltaY = e.clientY - startY;
  //     setPosition({
  //       x: initialPositionX + deltaX,
  //       y: initialPositionY + deltaY,
  //     });
  //   };

  //   const handleMouseUp = () => {
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('mouseup', handleMouseUp);
  //   };

  //   document.addEventListener('mousemove', handleMouseMove);
  //   document.addEventListener('mouseup', handleMouseUp);
  // };

    const handleDragStart = (e) => {
    handleSelect(e);
    e.stopPropagation();
    e.preventDefault();
    setSelected(true);
    onSelect(index);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPositionX = position.x;
    const initialPositionY = position.y;
    
    // Track whether dragging crosses canvas boundaries
    let crossedCanvas = false;
    let lastCanvasIndex = index;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newPosition = {
        x: initialPositionX + deltaX,
        y: initialPositionY + deltaY,
      };
      
      // Calculate which canvas the element is currently over
      const canvasWidth = canvasSize.width;
      const totalWidth = canvasCount * canvasWidth + (canvasCount - 1) * gap;
      
      // Determine current canvas based on position
      let currentCanvas = 0;
      if (newPosition.x > canvasWidth + gap/2) {
        currentCanvas = 1;
      }
      
      // Check if we've crossed canvas boundaries
      if (currentCanvas !== lastCanvasIndex) {
        crossedCanvas = true;
        lastCanvasIndex = currentCanvas;
        
        // Update data attribute on the frame element
        if (frameRef.current) {
          frameRef.current.setAttribute('data-original-canvas', originalCanvas.toString());
          
          // Add class to identify elements that have been moved between canvases
          frameRef.current.classList.add('canvas-crossed');
        }
      }
      
      setPosition(newPosition);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // If we crossed canvas boundaries, update the originalCanvas
      if (crossedCanvas) {
        setOriginalCanvas(lastCanvasIndex);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
        console.log('Image loaded, src:', img.src);
        setInnerImageSrc(img.src);
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
        console.log('innerImageSrc set to:', img.src);
        setSize({ width: newWidth, height: newHeight });
      };
    }
  };


  //Handle caption
  const handleCaptionChange = (newCaption) => setCaptionText(newCaption);

  // Mouse and Touch Event Effects 
  // useEffect(() => {
  //   const handleGlobalMouseMove = (e) => {
  //     if (dragging && !resizing && !rotating) {
  //       const containerRect = containerRef.current.getBoundingClientRect();
  //       const newX = e.clientX - containerRect.left - dragOffset.x;
  //       const newY = e.clientY - containerRect.top - dragOffset.y;
  //       setPosition({ x: newX, y: newY });

  //     } else if (rotating && selected && !dragging && !resizing) {
  //       const rect = frameRef.current.getBoundingClientRect();
  //       const centerX = rect.left + rect.width / 2;
  //       const centerY = rect.top + rect.height / 2;
  //       const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  //       const rotationDelta = angle - dragOffset.initialAngle;
  //       setRotation(dragOffset.initialRotation + rotationDelta);
  //     } else if (resizing && selected && !dragging && !rotating) {
  //       const imageRect = frameRef.current.getBoundingClientRect();
  //       const dx = e.clientX - imageRect.left;
  //       const ratio = size.height / size.width;
  //       const newWidth = Math.max(100, dx);
  //       const newHeight = newWidth * ratio;
  //       setSize({ width: newWidth, height: newHeight });
  //       const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
  //       setScreenArea({
  //         width: newWidth - newWidth * (left + right),
  //         height: newHeight - newHeight * (top + bottom),
  //         top: newHeight * top,
  //         left: newWidth * left,
  //       });
  //     }
  //   };

  //   const handleGlobalMouseUp = () => {
  //     setDragging(false);
  //     setRotating(false);
  //     setResizing(false);
  //   };

  //   if (dragging || rotating || resizing) {
  //     window.addEventListener("mousemove", handleGlobalMouseMove);
  //     window.addEventListener("mouseup", handleGlobalMouseUp);
  //   }

  //   return () => {
  //     window.removeEventListener("mousemove", handleGlobalMouseMove);
  //     window.removeEventListener("mouseup", handleGlobalMouseUp);
  //   };
  // }, [dragging, rotating, resizing, selected, dragOffset, size, currentFrameConfig]);

  // Mouse and Touch Event Effects 
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (dragging && !resizing && !rotating) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;
        
        // Track if we've moved to another canvas
        const canvasWidth = canvasSize.width;
        const currentCanvas = newX > canvasWidth + gap/2 ? 1 : 0;
        
        // Mark element as moved between canvases if applicable
        if (currentCanvas !== index && frameRef.current) {
          frameRef.current.setAttribute('data-moved-to-canvas', currentCanvas.toString());
          frameRef.current.setAttribute('data-original-canvas', originalCanvas.toString());
        }
        
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
  }, [dragging, rotating, resizing, selected, dragOffset, size, currentFrameConfig, canvasSize, gap, index, originalCanvas]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getImageState: () => ({
      position,
      size,
      rotation,
      mobileFrame,
      originalCanvas
    }),
    getContainer: () => containerRef.current,
    // getContainer: () => wrapperRef.current,
    getRenderSplitFrame: () => renderSplitFrameRef.current.getRenderSplitFrame(),
    handleImageSelect,
    toggleCaption: () => {
      setShowCaptionBox((prev) => !prev);
    },
    // setShowCaptionBox: (value) => (value),
    clearCaptionBox: () => {
      setShowCaptionBox(false);
      setCaptionText("");
    },
    setMobileFrame,
    setFontColor,
    setFontFamily,
    setFontSize,
    setCaptionText,
    setCaptionText: (text) => setCaptionText(text),
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
    getActiveFrame: () => mobileFrames.find(f => f.id === activeFrameId),
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

  const handleContainerClick = (e) => {
    // Only activate if clicking directly on container background
    if (e.target === containerRef.current) {
      setSelected(true);
      onSelect(index);
    }
  };

  return (
    <div 
      ref={containerRef} 
      style={{position: 'relative', display: 'inline-block', border: isActive ? '3px solid #2196f3' : 'none', }}
      onMouseDown={handleContainerClick}
      data-canvas-index={index}
    >
      <MockupContainer
        ref={mockupContainerRef}
        containerRef={containerRef}
        frameRef={frameRef}
        rotation={rotation}
        selected={selected}
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
        handleSelect={handleSelect}
        handleDeselect={handleDeselect}
        handleDragStart={handleDragStart}
        handleTouchStart={handleTouchStart}
        handleRotationStart={handleRotationStart}
        handleResizeStart={handleResizeStart}
        handleCaptionChange={handleCaptionChange}
        position={position}
        onDownload={onDownload}
        canvasSize={canvasSize}
      />
      
      <RenderSplitFrame
        ref={mockupContainerRef}
        index={index}
        position={position}
        size={size}
        rotation={rotation}
        selected={selected}
        canvasSize={canvasSize}
        innerImageSrc={innerImageSrc}
        mobileFrame={mobileFrame}
        screenArea={screenArea}
        gap={gap}
        frameRef={frameRef}
        handleDragStart={handleDragStart}
        handleTouchStart={handleTouchStart}
        handleRotationStart={handleRotationStart}
        handleResizeStart={handleResizeStart}
        showCaptionBox={showCaptionBox}
        fontColor={fontColor}
        fontFamily={fontFamily}
        fontSize={fontSize}
        onDeselect={handleDeselect}
        onSelectFrame={handleSelect}
      />
    </div>
  );
});

export default MockupInstance;
