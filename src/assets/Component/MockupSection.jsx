import { useState, useRef, useEffect, act } from "react";
import '../Style/mockupSection.css';
import { InnerImage } from "./ScreenShot";
import { CaptionBox } from "./CaptionBox";
import domtoimage from 'dom-to-image';
import ColorPicker from "react-best-gradient-color-picker";
import CaptionControls from "./CaptionControls";
import { FrameSelector } from "./FrameSelector";
import googlepixel4 from '../Pictures/googlepixel4.png'

export const MockupSection = ({ background, setBackground, activeControl, setActiveControl}) => {
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState({ width: 255, height: 480 });
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
  
  const containerRef = useRef(null); 

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
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleRotationStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRotating(true);
    setDragging(false);
    setResizing(false);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    setDragging(false);
    setRotating(false);
  };

  const handleImageSelect = (e) =>{
    const file = e.target.files[0];
    if(file){
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () =>{
        const aspectRatio = img.width / img.height;
        const newWidth = 300;
        const newHeight = newWidth / aspectRatio;

        setInnerImageSrc(img.src);
        setSize({width: newWidth, height: newHeight});
      }
    }
  }

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

  // Define the screen area dimensions based on the phone mockup
  const screenArea = {
    width: size.width, 
    height: size.height, 
    top: 0, 
    left: 0,
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (dragging && !resizing && !rotating) { // Ensure only dragging is active
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;
        setPosition({ x: newX, y: newY });
      } else if (rotating && selected && !dragging && !resizing) { // Ensure only rotating is active
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        setRotation(angle);
      } else if (resizing && selected && !dragging && !rotating) { // Ensure only resizing is active
        const imageRect = document.querySelector('.image-container').getBoundingClientRect();
        const dx = e.clientX - imageRect.left;
        const dy = e.clientY - imageRect.top;
        const ratio = size.height / size.width;
        const newWidth = Math.max(100, dx);
        const newHeight = newWidth * ratio;
        setSize({ width: newWidth, height: newHeight });
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
  
    // Use dom-to-image to capture the screenshot
    domtoimage.toPng(container)
      .then((dataUrl) => {
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
                onFrameSelect={(frame) => {
                  setMobileFrame(frame);
                }}
                // onSizeChange={(newSize) => setSize(newSize)}
                // className="external-selector"
              />
            </div>
          )}

        </div>

      </div>
      <div
        ref={containerRef}
        className="mockup-container"
        style={{ background: background }}
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
          className="image-container"
          style={{
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
        >
          {innerImageSrc && (
            <InnerImage
              src={innerImageSrc}
              parentSize={size}
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
              userSelect: "none",
              display: "block",
              position: "relative",
              zIndex: 3,
            }}
            draggable={false}
          />
          {selected && (
            <>
              <div
                className="rotation-handle"
                onMouseDown={handleRotationStart}
              />
              <div
                className="resize-handle"
                onMouseDown={handleResizeStart}
              />
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

