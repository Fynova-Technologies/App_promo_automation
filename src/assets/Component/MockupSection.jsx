// import { useState, useRef, useEffect, useCallback } from "react";
// import '../Style/mockupSection.css';
// import { InnerImage } from "./ScreenShot";
// import { CaptionBox } from "./CaptionBox";
// import domtoimage from 'dom-to-image';
// import ColorPicker from "react-best-gradient-color-picker";
// import CaptionControls from "./CaptionControls";
// import { FrameSelector } from "./FrameSelector";
// import googlepixel4 from '../Pictures/googlepixel4.png';

// const debounce = (func, wait) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// export const MockupSection = ({ background, setBackground, activeControl, setActiveControl }) => {
//   const [position, setPosition] = useState({ x: 30, y: 30 });
//   const [rotation, setRotation] = useState(0);
//   const [size, setSize] = useState({ width: 225, height: 450 });
//   const [selected, setSelected] = useState(false);
//   const [resizing, setResizing] = useState(false);
//   const [rotating, setRotating] = useState(false);
//   const [dragging, setDragging] = useState(false);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [innerImageSrc, setInnerImageSrc] = useState(null);
//   const [showCaption, setShowCaption] = useState(false);
//   const [captionText, setCaptionText] = useState("Enter Caption"); 
//   const [fontColor, setFontColor] = useState("#ffffff");
//   const [fontFamily, setFontFamily] = useState("Arial");
//   const [fontSize, setFontSize] = useState("28");
//   const [mobileFrame, setMobileFrame] = useState(googlepixel4);
//   const [showFrameSelector, setShowFrameSelector] = useState(false);
//   const [screenArea, setScreenArea] = useState({
//     width: size.width,
//     height: size.height,
//     top: 0,
//     left: 0
//   });
//   const [currentFrameConfig, setCurrentFrameConfig] = useState({
//     screenAreaOffsets: {
//       top: 0.04,     
//       left: 0.045,
//       right: 0.045,
//       bottom: 0.03
//     },
//     adjustmentStep: { width: 10, height: 20 }
//   });
  
//   const containerRef = useRef(null); 
//   const frameRef = useRef(null);

//   const handleSelect = (e) => {
//     e.stopPropagation();
//     setSelected(true);
//   };

//   const handleDeselect = () => {
//     setSelected(false);
//     setDragging(false);
//     setResizing(false);
//     setRotating(false);
//   };

//   const handleDragStart = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setDragging(true);
//     setResizing(false);
//     setRotating(false);
    
//     // Use the element's bounding rect as a reference.
//     const elementRect = e.currentTarget.getBoundingClientRect();
//     setDragOffset({
//       x: e.clientX - elementRect.left,
//       y: e.clientY - elementRect.top
//     });
//   };

//   const handleRotationStart = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setRotating(true);
//     setDragging(false);
//     setResizing(false);

//     const rect = frameRef.current.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
//     const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
//     setDragOffset({
//       initialRotation: rotation,
//       initialAngle: initialAngle,
//       centerX: centerX,
//       centerY: centerY
//     });
//   };

//   const handleResizeStart = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setResizing(true);
//     setDragging(false);
//     setRotating(false);

//     const rect = frameRef.current.getBoundingClientRect();
//     setDragOffset({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top
//     });
//   };

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const img = new Image();
//       img.src = URL.createObjectURL(file);
//       img.onload = () => {
//         const aspectRatio = img.width / img.height;
//         const frameRect = frameRef.current.getBoundingClientRect();
//         const frameWidth = frameRect.width;
//         const frameHeight = frameRect.height;
//         const frameAspectRatio = frameWidth / frameHeight;
//         let newWidth, newHeight;
  
//         if (aspectRatio > frameAspectRatio) {
//           newWidth = frameWidth;
//           newHeight = frameWidth / aspectRatio;
//         } else {
//           newHeight = frameHeight;
//           newWidth = frameHeight * aspectRatio;
//         }
  
//         setInnerImageSrc(img.src);
//         setSize({ width: newWidth, height: newHeight });
//       };
//     }
//   };

//   // Update dimensions when the mobile frame changes
//   useEffect(() => {
//     if (mobileFrame && frameRef.current) {
//       const frameRect = frameRef.current.getBoundingClientRect();
//       setSize({ width: frameRect.width, height: frameRect.height });
//     }
//   }, [mobileFrame]);

//   useEffect(() => {
//     if (frameRef.current && mobileFrame) {
//       const frameRect = frameRef.current.getBoundingClientRect();
//       const frameWidth = frameRect.width;
//       const frameHeight = frameRect.height;
//       const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
      
//       const updatedScreenArea = {
//         width: frameWidth - (frameWidth * (left + right)),
//         height: frameHeight - (frameHeight * (top + bottom)),
//         top: frameHeight * top,
//         left: frameWidth * left
//       };
      
//       setScreenArea(updatedScreenArea);
//     }
//   }, [size, currentFrameConfig, mobileFrame]);

//   const toggleColorPicker = () => {
//     setActiveControl(activeControl === 'colorPicker' ? null : 'colorPicker');
//   };

//   const toggleCaption = () => {
//     setShowCaption(!showCaption);
//     setActiveControl(showCaption ? null : 'captionControls');
//   };

//   const toggleFrame = () => {
//     setShowFrameSelector(!showFrameSelector);
//     setActiveControl(showFrameSelector ? null : 'frameSelector');
//   };

//   const handleCaptionChange = (newCaption) => {
//     setCaptionText(newCaption);
//   };

//   useEffect(() => {
//     const handleGlobalMouseMove = (e) => {
//       if (dragging && !resizing && !rotating) {
//         // For a relatively positioned element, determine new offsets from its parent's location.
//         const containerRect = containerRef.current.getBoundingClientRect();
//         const newX = e.clientX - containerRect.left - dragOffset.x;
//         const newY = e.clientY - containerRect.top - dragOffset.y;
//         setPosition({ x: newX, y: newY });
//       } else if (rotating && selected && !dragging && !resizing) {
//         const rect = frameRef.current.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;
//         const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
//         const rotationDelta = angle - dragOffset.initialAngle;
//         setRotation(dragOffset.initialRotation + rotationDelta);
//       } else if (resizing && selected && !dragging && !rotating) {
//         const imageRect = frameRef.current.getBoundingClientRect();
//         const dx = e.clientX - imageRect.left;
//         const ratio = size.height / size.width;
//         const newWidth = Math.max(100, dx);
//         const newHeight = newWidth * ratio;
//         setSize({ width: newWidth, height: newHeight });
//         if (frameRef.current) {
//           const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
//           setScreenArea({
//             width: newWidth - (newWidth * (left + right)),
//             height: newHeight - (newHeight * (top + bottom)),
//             top: newHeight * top,
//             left: newWidth * left
//           });
//         }
//       }
//     };

//     const handleGlobalMouseUp = () => {
//       setDragging(false);
//       setRotating(false);
//       setResizing(false);
//     };

//     if (dragging || rotating || resizing) {
//       window.addEventListener('mousemove', handleGlobalMouseMove);
//       window.addEventListener('mouseup', handleGlobalMouseUp);
//     }

//     return () => {
//       window.removeEventListener('mousemove', handleGlobalMouseMove);
//       window.removeEventListener('mouseup', handleGlobalMouseUp);
//     };
//   }, [dragging, rotating, resizing, selected, dragOffset, size]);

//   const handleDownload = () => {
//     const container = containerRef.current;
//     if (!container) {
//       console.error("Container not found!");
//       return;
//     }
  
//     const originalMockupWidth = container.style.width;
//     const originalMockupHeight = container.style.height;
  
//     const FIXED_MOCKUP_WIDTH = 480;
//     const FIXED_MOCKUP_HEIGHT = 842;
//     container.style.width = `${FIXED_MOCKUP_WIDTH}px`;
//     container.style.height = `${FIXED_MOCKUP_HEIGHT}px`;
//     const options = {
//       width: FIXED_MOCKUP_WIDTH,
//       height: FIXED_MOCKUP_HEIGHT,
//       scrollX: 0,
//       scrollY: -window.scrollY,
//       useCORS: true,
//       scale: 2, 
//     };
  
//     domtoimage.toPng(container, options)
//       .then((dataUrl) => {
//         container.style.width = originalMockupWidth;
//         container.style.height = originalMockupHeight;
//         const link = document.createElement("a");
//         link.href = dataUrl;
//         link.download = "mockup.png";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       })
//       .catch((err) => {
//         console.error("Download Error:", err);
//       });
//   };

//   // Touch event handling
//   const handleTouchStart = (e) => {
//     if (!selected) handleSelect(e);
    
//     e.stopPropagation();
//     e.preventDefault();
//     setDragging(true);
//     setResizing(false);
//     setRotating(false);
    
//     const touch = e.touches[0];
//     const rect = e.currentTarget.getBoundingClientRect();
//     setDragOffset({
//       x: touch.clientX - rect.left,
//       y: touch.clientY - rect.top
//     });
//   };

//   useEffect(() => {
//     const handleTouchMove = (e) => {
//       if (dragging && !resizing && !rotating) {
//         const touch = e.touches[0];
//         const containerRect = containerRef.current.getBoundingClientRect();
//         const newX = touch.clientX - containerRect.left - dragOffset.x;
//         const newY = touch.clientY - containerRect.top - dragOffset.y;
//         setPosition({ x: newX, y: newY });
//       }
//     };
  
//     const handleTouchEnd = () => {
//       setDragging(false);
//       setResizing(false);
//       setRotating(false);
//     };
  
//     if (dragging || rotating || resizing) {
//       window.addEventListener('touchmove', handleTouchMove);
//       window.addEventListener('touchend', handleTouchEnd);
//     }
//     return () => {
//       window.removeEventListener('touchmove', handleTouchMove);
//       window.removeEventListener('touchend', handleTouchEnd);
//     };
//   }, [dragging, rotating, resizing, dragOffset, size]);

//   const handleWindowResize = useCallback(debounce(() => {
//     if (selected && frameRef.current) {
//       const containerRect = containerRef.current.getBoundingClientRect();
//       const imageRect = frameRef.current.getBoundingClientRect();
//       const newX = imageRect.left - containerRect.left;
//       const newY = imageRect.top - containerRect.top;
//       setPosition({ x: newX, y: newY });
//       const frameRect = frameRef.current.getBoundingClientRect();
//       setSize({ width: frameRect.width, height: frameRect.height });
//       const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
//       const updatedScreenArea = {
//         width: frameRect.width - frameRect.width * (left + right),
//         height: frameRect.height - frameRect.height * (top + bottom),
//         top: frameRect.height * top,
//         left: frameRect.width * left,
//       };
//       setScreenArea(updatedScreenArea);
//       setDragging(false);
//       setResizing(false);
//       setRotating(false);
//       setSelected(false);
//       setTimeout(() => setSelected(true), 0);
//       setDragOffset({ x: 0, y: 0 });
//     }
//   }, 100), [selected, currentFrameConfig]);

//   useEffect(() => {
//     window.addEventListener('resize', handleWindowResize);
//     return () => window.removeEventListener('resize', handleWindowResize);
//   }, [handleWindowResize]);
  
//   return (
//     <div className="mockup-section-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "20px" }}>
//       <div className="header">
//         <h1>MOCKUP AUTOMATION</h1>
//         <button 
//           className="download-button"
//           onClick={handleDownload}
//         >
//           Download
//         </button>
//       </div>
//       <div className="mockup-controls">
//         <label className="select-image-button">
//           Choose Inner Image
//           <input
//             type="file"
//             accept="image/jpeg, image/png, image/gif, image/svg+xml"
//             style={{ display: "none" }}
//             onChange={handleImageSelect}
//           />
//         </label>
//         <button
//           onClick={toggleCaption}
//           className="caption-button"
//           style={{ background: showCaption ? "#f44336" : "#2196F3" }}
//         >
//           {showCaption ? "Hide Caption" : "Show Caption"}
//         </button>
//         <button
//           onClick={toggleColorPicker}
//           className="bg-button"
//         >
//           Change Bg
//         </button>
//         <button
//           onClick={toggleFrame}
//           className="frame-button"
//           style={{ background: showFrameSelector ? "#f44336" : "#2196F3" }}
//         >
//           {showFrameSelector ? "Close Device" : "Device"}
//         </button>
//         <div className="controls-panel">
//           {activeControl === "colorPicker" && (
//             <div className="color-picker">
//               <ColorPicker
//                 value={background}
//                 onChange={setBackground}
//                 hideColorTypeBtns={false}
//               />
//             </div>
//           )}
//           {activeControl === "captionControls" && showCaption && (
//             <div className="caption-controls">
//               <CaptionControls 
//                 fontColor={fontColor}
//                 setFontColor={setFontColor}
//                 fontFamily={fontFamily}
//                 setFontFamily={setFontFamily}
//                 fontSize={fontSize}
//                 setFontSize={setFontSize}
//               />
//             </div>
//           )}
//           {activeControl === "frameSelector" && showFrameSelector && (
//             <div className="external-frame-selector">
//               <FrameSelector
//                 selectedFrame={mobileFrame}
//                 onFrameSelect={(frameData) => {
//                   setMobileFrame(frameData.image);
//                   setCurrentFrameConfig(frameData.config);
//                 }}
//                 onSizeChange={(newSize) => setSize(newSize)}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//       <div
//         ref={containerRef}
//         className="mockup-container"
//         // IMPORTANT: Set overflow visible so that the relative positioning element can overflow.
//         style={{ background: background, position: "relative", overflow: "visible" }}
//         onClick={handleDeselect}
//       >
//         {showCaption && (
//           <CaptionBox 
//             containerRef={containerRef} 
//             caption={captionText}
//             onCaptionChange={handleCaptionChange}
//             fontColor={fontColor}
//             fontFamily={fontFamily}
//             fontSize={fontSize}
//           />
//         )}
//         {/* 
//           The image-container is now relative.
//           It uses top and left as offsets from its normal layout.
//           The drag, rotation, and resize calculations have been adjusted accordingly.
//         */}
//         <div
//           ref={frameRef}
//           className="image-container"
//           style={{
//             position: "relative", // Changed to relative
//             top: `${position.y}px`,
//             left: `${position.x}px`,
//             transform: `rotate(${rotation}deg)`,
//             transformOrigin: "center center",
//             userSelect: "none",
//             cursor: selected ? "move" : "pointer",
//             zIndex: selected ? 1000 : 1,
//           }}
//           onClick={handleSelect}
//           onMouseDown={selected ? handleDragStart : null}
//           onTouchStart={handleTouchStart}
//         >
//           {innerImageSrc && (
//             <InnerImage
//               src={innerImageSrc}
//               parentRotation={rotation}
//               screenArea={screenArea}
//               adjustmentStep={currentFrameConfig.adjustmentStep}
//             />
//           )}
//           <img
//             src={mobileFrame}
//             alt="image"
//             style={{
//               width: `${size.width}px`,
//               height: `${size.height}px`,
//             }}
//             draggable={false}
//           />
//           {selected && (
//             <>
//               <div className="rotation-handle" onMouseDown={handleRotationStart} />
//               <div className="resize-handle" onMouseDown={handleResizeStart} />
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useRef, useEffect, useCallback } from "react";
import MockupControls from "./MockupControls";
import MockupContainer from "./MockupContainer";
import { ControlPanel } from "./ControlPanel";
import domtoimage from 'dom-to-image';
import googlepixel4 from '../Pictures/googlepixel4.png';
import '../Style/mockupSection.css';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const MockupSection = () => {
  const [position, setPosition] = useState({ x: 80, y: 100 });
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState({ width: 225, height: 450 });
  const [selected, setSelected] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [innerImageSrc, setInnerImageSrc] = useState(null);
  const [showCaptionBox, setShowCaptionBox] = useState(false);
  const [showCaptionControls, setShowCaptionControls] = useState(false);
  const [captionText, setCaptionText] = useState("Double Click");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("28");
  const [mobileFrame, setMobileFrame] = useState(googlepixel4);
  const [showFrameSelector, setShowFrameSelector] = useState(false);
  const [background, setBackground] = useState('linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)');
  const [activeControl, setActiveControl] = useState(null);
  const [currentFrameConfig, setCurrentFrameConfig] = useState({
    screenAreaOffsets: {
      top: 0.04,
      left: 0.00,
      right: 0.090,
      bottom: 0.03
    },
    adjustmentStep: { width: 10, height: 20 }
  });
  const [screenArea, setScreenArea] = useState({
    width: size.width,
    height: size.height,
    top: 0,
    left: 0
  });

  const containerRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const defaultScreenAreaOffsets = {
      top: 0.037,
      left: 0.025,
      right: 0.0300,
      bottom: 0.0
    };
    
    const defaultAdjustmentStep = { width: 0, height: 0 };
    
    // Calculate the initial screen area
    const initialScreenArea = {
      width: size.width - (size.width * (defaultScreenAreaOffsets.left + defaultScreenAreaOffsets.right)),
      height: size.height - (size.height * (defaultScreenAreaOffsets.top + defaultScreenAreaOffsets.bottom)),
      top: size.height * defaultScreenAreaOffsets.top,
      left: size.width * defaultScreenAreaOffsets.left
    };
    
    // Set the initial screen area
    setScreenArea(initialScreenArea);
    
    // Set the current frame config
    setCurrentFrameConfig({
      screenAreaOffsets: defaultScreenAreaOffsets,
      adjustmentStep: defaultAdjustmentStep
    });
  }, []);

  const handleSelect = (e) => {
    e.stopPropagation();
    setSelected(true);

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
    
    // Use the element's bounding rect as a reference.
    const elementRect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - elementRect.left,
      y: e.clientY - elementRect.top
    });
  }

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
      initialAngle: initialAngle,
      centerX: centerX,
      centerY: centerY
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
      y: e.clientY - rect.top
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const frameRect = frameRef.current.getBoundingClientRect();
        const frameWidth = frameRect.width;
        const frameHeight = frameRect.height;
        const frameAspectRatio = frameWidth / frameHeight;
        let newWidth, newHeight;
  
        if (aspectRatio > frameAspectRatio) {
          newWidth = frameWidth;
          newHeight = frameWidth / aspectRatio;
        } else {
          newHeight = frameHeight;
          newWidth = frameHeight * aspectRatio;
        }
  
        setInnerImageSrc(img.src);
        setSize({ width: newWidth, height: newHeight });
      };
    }
  };

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

  // Handle caption change
  const handleCaptionChange = (newCaption) => {
    setCaptionText(newCaption);
  };

  // Effect for global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (dragging && !resizing && !rotating) {
        // For a relatively positioned element, determine new offsets from its parent's location.
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
        if (frameRef.current) {
          const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
          setScreenArea({
            width: newWidth - (newWidth * (left + right)),
            height: newHeight - (newHeight * (top + bottom)),
            top: newHeight * top,
            left: newWidth * left
          });
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setDragging(false);
      setRotating(false);
      setResizing(false);
    };

    if (dragging || rotating || resizing) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragging, rotating, resizing, selected, dragOffset, size, currentFrameConfig]);

  // Effect for touch events
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (dragging && !resizing && !rotating) {
        const touch = e.touches[0];
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = touch.clientX - containerRect.left - dragOffset.x;
        const newY = touch.clientY - containerRect.top - dragOffset.y;
        setPosition({ x: newX, y: newY });
      }
    };
  
    const handleTouchEnd = () => {
      setDragging(false);
      setResizing(false);
      setRotating(false);
    };
  
    if (dragging || rotating || resizing) {
      window.addEventListener('touchmove', handleTouchMove, {passive: false});
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging, rotating, resizing, dragOffset]);

  // Effect for frame change
  useEffect(() => {
    if (frameRef.current && mobileFrame) {
      const frameRect = frameRef.current.getBoundingClientRect();
      const frameWidth = frameRect.width;
      const frameHeight = frameRect.height;
      const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
      
      const updatedScreenArea = {
        width: frameWidth - (frameWidth * (left + right)),
        height: frameHeight - (frameHeight * (top + bottom)),
        top: frameHeight * top,
        left: frameWidth * left
      };
      
      setScreenArea(updatedScreenArea);
    }
  }, [size, currentFrameConfig, mobileFrame]);

  // Handle window resize
  const handleWindowResize = useCallback(debounce(() => {
    if (selected && frameRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = frameRef.current.getBoundingClientRect();
      const newX = imageRect.left - containerRect.left;
      const newY = imageRect.top - containerRect.top;
      setPosition({ x: newX, y: newY });
      const frameRect = frameRef.current.getBoundingClientRect();
      setSize({ width: frameRect.width, height: frameRect.height });
      const { top, left, right, bottom } = currentFrameConfig.screenAreaOffsets;
      const updatedScreenArea = {
        width: frameRect.width - frameRect.width * (left + right),
        height: frameRect.height - frameRect.height * (top + bottom),
        top: frameRect.height * top,
        left: frameRect.width * left,
      };
      setScreenArea(updatedScreenArea);
      setDragging(false);
      setResizing(false);
      setRotating(false);
      setSelected(false);
      setTimeout(() => setSelected(true), 0);
      setDragOffset({ x: 0, y: 0 });
    }
  }, 100), [selected, currentFrameConfig]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [handleWindowResize]);

  // Download functionality
  const handleDownload = () => {
    const container = containerRef.current;
    if (!container) {
      console.error("Container not found!");
      return;
    }
  
    // const originalMockupWidth = container.style.width;
    // const originalMockupHeight = container.style.height;
  
    // const FIXED_MOCKUP_WIDTH = 480;
    // const FIXED_MOCKUP_HEIGHT = 842;
    // container.style.width = `${FIXED_MOCKUP_WIDTH}px`;
    // container.style.height = `${FIXED_MOCKUP_HEIGHT}px`;
    const options = {
      // width: FIXED_MOCKUP_WIDTH,
      // height: FIXED_MOCKUP_HEIGHT,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
      scale: 2, 
    };
  
    domtoimage.toPng(container, options)
      .then((dataUrl) => {
        // container.style.width = originalMockupWidth;
        // container.style.height = originalMockupHeight;
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "mockup.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error("Download Error:", err);
      });
  };

  return (
    <div className="mockup-section-wrapper">
      <div className="header">
        <h1>MOCKUP AUTOMATION</h1>
        <button className="download-button" onClick={handleDownload}>
          Download
        </button>
      </div>

      <MockupControls
        showCaptionControls={showCaptionControls}
        toggleCaption={() => {
          // If no caption box exists, create it; otherwise, just toggle the controls.
          if (!showCaptionBox) {
            setShowCaptionBox(true);
            setShowCaptionControls(true);
            setActiveControl(showCaptionControls ? null : 'captionControls')
            // setActiveControl("captionControls");
          }else{
            // Toggle control visibility but do not hide caption box.
            setShowCaptionControls(prev => !prev);
          }
        }}
        toggleColorPicker={() => setActiveControl(activeControl === 'colorPicker' ? null : 'colorPicker')}
        toggleFrame={() => {
          setShowFrameSelector(!showFrameSelector);
          setActiveControl(showFrameSelector ? null : 'frameSelector');}}
        handleImageSelect={handleImageSelect}
        showFrameSelector={showFrameSelector}
      />

      <ControlPanel
        activeControl={activeControl}
        showCaptionControls={showCaptionControls}
        setShowCaptionBox={setShowCaptionBox}
        showCaptionBox={showCaptionBox}
        showFrameSelector={showFrameSelector}
        background={background}
        setBackground={setBackground}
        fontColor={fontColor}
        setFontColor={setFontColor}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        mobileFrame={mobileFrame}
        setMobileFrame={setMobileFrame}
        setCurrentFrameConfig={setCurrentFrameConfig}
      />

      <div className="mockup-container-wrapper">
        <MockupContainer
          containerRef={containerRef}
          frameRef={frameRef}
          background={background}
          setBackground={setBackground}
          position={position}
          rotation={rotation}
          size={size}
          selected={selected}
          showCaptionBox={showCaptionBox}
          setShowCaptionBox={setShowCaptionBox}
          captionText={captionText}
          fontColor={fontColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          innerImageSrc={innerImageSrc}
          mobileFrame={mobileFrame}
          screenArea={screenArea}
          handleDeselect={handleDeselect}
          handleSelect={handleSelect}
          handleDragStart={handleDragStart}
          handleTouchStart={handleTouchStart}
          handleRotationStart={handleRotationStart}
          handleResizeStart={handleResizeStart}
          handleCaptionChange={handleCaptionChange}
          resizing={resizing}
          rotating={rotating}
          setDragging={setDragging}
          setDragOffset={setDragOffset}
        />
      </div>
    </div>
  );
};

export default MockupSection;