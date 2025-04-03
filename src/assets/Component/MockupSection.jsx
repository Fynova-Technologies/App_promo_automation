import { useState, useRef, useEffect, useCallback } from "react";
import '../Style/mockupSection.css';
import { InnerImage } from "./ScreenShot";
import { CaptionBox } from "./CaptionBox";
import domtoimage from 'dom-to-image';
import ColorPicker from "react-best-gradient-color-picker";
import CaptionControls from "./CaptionControls";
import { FrameSelector } from "./FrameSelector";
import googlepixel4 from '../Pictures/googlepixel4.png'

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const MockupSection = ({ background, setBackground, activeControl, setActiveControl}) => {
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState({ width: 225, height: 450 });
  const [selected, setSelected] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [innerImageSrc, setInnerImageSrc] = useState(null);
  const [showCaption, setShowCaption] = useState(false);
  const [captionText, setCaptionText] = useState("Enter Caption"); 
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("28");
  const [mobileFrame, setMobileFrame] = useState(googlepixel4);
  const [showFrameSelector, setShowFrameSelector] = useState(false);
  const [screenArea, setScreenArea] = useState({
    width: size.width,
    height: size.height,
    top: 0,
    left: 0
  });
  const [currentFrameConfig, setCurrentFrameConfig] = useState({
    screenAreaOffsets: {
      top: 0.04,     
      left: 0.045,
      right: 0.045,
      bottom: 0.03
    },
    adjustmentStep: { width: 10, height: 20 }
  });
  
  const containerRef = useRef(null); 
  const frameRef = useRef(null);

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
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = e.currentTarget.getBoundingClientRect();
    
    // Calculate offset relative to the element, not just absolute coordinates
    setDragOffset({
      x: e.clientX - elementRect.left,
      y: e.clientY - elementRect.top
    });
  };

  const handleRotationStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRotating(true);
    setDragging(false);
    setResizing(false);

    // Store the initial rotation and mouse position
  const rect = e.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  
  // Store the starting angle relative to current rotation
  setDragOffset({
    initialRotation: rotation,
    initialAngle: initialAngle
  });
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    setDragging(false);
    setRotating(false);

  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        
        // Get frame dimensions
        const frameRect = frameRef.current.getBoundingClientRect();
        const frameWidth = frameRect.width;
        const frameHeight = frameRect.height;
        const frameAspectRatio = frameWidth / frameHeight;
        
        let newWidth, newHeight;
  
        // Fit image based on aspect ratio
        if (aspectRatio > frameAspectRatio) {
          // Image is wider
          newWidth = frameWidth;
          newHeight = frameWidth / aspectRatio;
        } else {
          // Image is taller
          newHeight = frameHeight;
          newWidth = frameHeight * aspectRatio;
        }
  
        setInnerImageSrc(img.src);
        setSize({ width: newWidth, height: newHeight });
      };
    }
  };

  // Update dimensions when frame changes
  useEffect(() => {
    if (mobileFrame && frameRef.current) {
      const frameRect = frameRef.current.getBoundingClientRect();
      setSize({ width: frameRect.width, height: frameRect.height });
    }
  }, [mobileFrame]);

useEffect(() => {
  if (frameRef.current && mobileFrame) {
    // Get frame dimensions
    const frameRect = frameRef.current.getBoundingClientRect();
    const frameWidth = frameRect.width;
    const frameHeight = frameRect.height;
    
    // Use current frame config to calculate screen area
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

  const toggleColorPicker = () => {
    setActiveControl(activeControl === 'colorPicker' ? null : 'colorPicker');
  };

  const toggleCaption = () => {
    setShowCaption(!showCaption);
    setActiveControl(showCaption ? null : 'captionControls');
  };

  const toggleFrame = () =>{
    // Toggle frame selector visibility
    setShowFrameSelector(!showFrameSelector);
    setActiveControl(showFrameSelector ? null : 'frameSelector');
  }

  const handleCaptionChange = (newCaption) => {
    setCaptionText(newCaption);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (dragging && !resizing && !rotating) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;
        setPosition({ x: newX, y: newY });
      } else if (rotating && selected && !dragging && !resizing) {
        const rect = document.querySelector('.image-container').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        const rotationDelta = angle - dragOffset.initialAngle;
        setRotation(dragOffset.initialRotation + rotationDelta);
      } else if (resizing && selected && !dragging && !rotating) {
        const imageRect = document.querySelector('.image-container').getBoundingClientRect();
        const dx = e.clientX - imageRect.left;
        const dy = e.clientY - imageRect.top;
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
  }, [dragging, rotating, resizing, selected, dragOffset, size]);


  const handleDownload = () => {
    const container = containerRef.current;
  
    if (!container) {
      console.error("Container not found!");
      return;
    }
  
    // Save current styles
    const mockupContainer = container;
    const innerImage = container.querySelector(".inner-image");
  
    const originalMockupWidth = mockupContainer.style.width;
    const originalMockupHeight = mockupContainer.style.height;
    const originalInnerImageWidth = innerImage.style.width;
    const originalInnerImageHeight = innerImage.style.height;
  
    // Set fixed sizes for downloading
    const FIXED_MOCKUP_WIDTH = 540;
    const FIXED_MOCKUP_HEIGHT = 1024;
    const FIXED_IMAGE_WIDTH = 423;   
    const FIXED_IMAGE_HEIGHT = 858;   
  
    mockupContainer.style.width = `${FIXED_MOCKUP_WIDTH}px`;
    mockupContainer.style.height = `${FIXED_MOCKUP_HEIGHT}px`;
    innerImage.style.width = `${FIXED_IMAGE_WIDTH}px`;
    innerImage.style.height = `${FIXED_IMAGE_HEIGHT}px`;
  
    // Capture screenshot with fixed dimensions
    const options = {
      width: FIXED_MOCKUP_WIDTH,
      height: FIXED_MOCKUP_HEIGHT,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
      scale: 2, // Increase for better quality
    };
  
    domtoimage.toPng(container, options)
      .then((dataUrl) => {
        // Restore original sizes after capturing
        mockupContainer.style.width = originalMockupWidth;
        mockupContainer.style.height = originalMockupHeight;
        innerImage.style.width = originalInnerImageWidth;
        innerImage.style.height = originalInnerImageHeight;
  
        // Trigger download
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

  // Add these handlers to the image-container div
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

  // Add touch event listeners
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
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  }
  
  return () => {
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };
}, [dragging, rotating, resizing, dragOffset, size]);

const handleWindowResize = useCallback(debounce(() => {
  if (selected) {
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = document.querySelector('.image-container').getBoundingClientRect();

    const newX = imageRect.left - containerRect.left;
    const newY = imageRect.top - containerRect.top;
    setPosition({ x: newX, y: newY });

    setDragging(false);
    setResizing(true);
    setRotating(true);

    setSelected(false);
    setTimeout(() => setSelected(true), 0);
  }
}, 100), [selected]);

useEffect(() => {
  window.addEventListener('resize', handleWindowResize);
  return () => window.removeEventListener('resize', handleWindowResize);
}, [handleWindowResize]);
  

  return (
    <div className="mockup-section-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "20px" }}>
        <div className="header">
          <h1>MOUCKUP AUTOMATION</h1>
          <button 
            className="download-button"
            onClick={handleDownload}  
            >
            Download
          </button>
        </div>

      <div className="mockup-controls">
        <label  className="select-image-button">
          Choose Inner Image
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif, image/svg+xml"
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
        </label>
        
        <button
          onClick={toggleCaption}
          className="caption-button"
          style={{ background: showCaption ? "#f44336" : "#2196F3" }}
        >
          {showCaption ? "Hide Caption" : "Show Caption"}
        </button>

        <button
          onClick={toggleColorPicker}
          className="bg-button"
        >
          Change Bg
        </button>

        <button
          onClick={toggleFrame}
          className="frame-button"
          style={{ background: showFrameSelector ? "#f44336" : "#2196F3" }}
        >
          {showFrameSelector ? "Close Device" : "Device"}
        </button>

        <div className="controls-panel">
          {activeControl=== "colorPicker"&& (
            <div className="color-picker">
              <ColorPicker
                value={background}
                onChange={setBackground}
                hideColorTypeBtns={false}
              />
            </div>
           )}   
        
            { activeControl === "captionControls" && showCaption && (
              <div className="caption-controls">
                <CaptionControls 
                  fontColor={fontColor}
                  setFontColor={setFontColor}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                />
              </div>
            )}

          {activeControl === "frameSelector" && showFrameSelector && (
            <div className="external-frame-selector">
              <FrameSelector
                selectedFrame={mobileFrame}
                onFrameSelect={(frameData) => {
                  // setMobileFrame(frame);
                  setMobileFrame(frameData.image);
                  setCurrentFrameConfig(frameData.config);
                }}
                onSizeChange={(newSize) => setSize(newSize)}
              />
            </div>
          )}

        </div>

      </div>
      <div
        ref={containerRef}
        className="mockup-container"
        style={{ background: background, position: "relative" }}
        onClick={handleDeselect}
      >
        
        {showCaption && (
          <CaptionBox 
            containerRef={containerRef} 
            caption={captionText}
            onCaptionChange={handleCaptionChange}
            fontColor={fontColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        )}
        
        <div
          ref={frameRef}
          className="image-container"
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
            userSelect: "none",
            cursor: selected ? "move" : "pointer",
            zIndex: selected ? 1000 : 1,
          }}
          onClick={handleSelect}
          onMouseDown={selected ? handleDragStart : null}
          onTouchStart={handleTouchStart}
          >
          {innerImageSrc && (
            <InnerImage
              src={innerImageSrc}
              // parentSize={size}
              parentRotation={rotation}
              screenArea={screenArea}
              adjustmentStep={currentFrameConfig.adjustmentStep}
            />
          )}
          <img
            src={mobileFrame}
            alt="image"
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              userSelect: "none",
              display: "block",
              position: "relative",
              zIndex: 3,
              objectFit: "contain",
            }}
            draggable={false}
          />
          {selected && (
            <>
              <div className="rotation-handle" onMouseDown={handleRotationStart} />
              <div className="resize-handle" onMouseDown={handleResizeStart} />
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

