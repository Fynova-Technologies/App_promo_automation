import { useState, useRef, useEffect } from "react";
import "../Style/captionBox.css";

export const CaptionBox = ({ containerRef, caption, onCaptionChange, fontColor, fontFamily, fontSize }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 200, height: 60 });
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [showResizeHandle, setShowResizeHandle] = useState(false);
  const [hoveringBorder, setHoveringBorder] = useState(false);

  const textareaRef = useRef(null);
  const captionBoxRef = useRef(null);
  const initialPositionSet = useRef(false);
  
  // Center the caption initially
  useEffect(() => {
    if (containerRef.current && captionBoxRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = (containerRect.width - size.width) / 2;
      setPosition({ x: centerX, y: 20 });
    }
  }, [containerRef, size.width]);

  const handleSelect = (e) => {
    e.stopPropagation();
    setSelected(true);
    setShowResizeHandle(true); 

    // setClickCount(prev => prev + 1);

    // setTimeout(() => setClickCount(0), 400);

    if (e.detail === 2) {
      setIsEditing(true);
      setResizing(false);
    } else {
      setIsEditing(false);
      setResizing(false);
    }
  };

  // Show resize handle when hovering over border
  const handleMouseEnter = () => {
    if (selected) setHoveringBorder(true);
  };

  const handleMouseLeave = () => {
    setHoveringBorder(false);
  };
  
  const handleDragStart = (e) => {
    // if (isEditing) return; // Don't drag while editing
    
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
    setResizing(false);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    setDragging(false);
  };

  const handleTextChange = (e) => {
    onCaptionChange(e.target.value);
  };

  const handleEditingComplete = () => {
    setIsEditing(false);
    setClickCount(0);
  };

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
    else if(resizing && textareaRef.current){
      textareaRef.current.focus();
    }
  }, [isEditing, resizing]);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (dragging && !resizing) {
        const parentRect = containerRef.current.getBoundingClientRect();
        let newX = e.clientX - parentRect.left - dragOffset.x;
        let newY = e.clientY - parentRect.top - dragOffset.y;
        
        // Keep within container bounds
        newX = Math.max(0, Math.min(newX, parentRect.width - size.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - size.height));
        
        setPosition({ x: newX, y: newY });
      } else if (resizing && selected && !dragging) {
        const boxRect = captionBoxRef.current.getBoundingClientRect();
        const dx = e.clientX - boxRect.left;
        const dy = e.clientY - boxRect.top;
        
        // Set minimum sizes to ensure caption is always visible
        let newWidth = Math.max(100, dx);
        let newHeight = Math.max(30, dy);

        // Keep size within reasonable limits
        const parentRect = containerRef.current.getBoundingClientRect();
        newWidth = Math.min(newWidth, parentRect.width - position.x);
        newHeight = Math.min(newHeight, parentRect.height - position.y);

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleGlobalMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    const handleKeyDown = (e) => {
      if (isEditing && e.key === 'Escape') {
        setIsEditing(false);
      } else if (isEditing && e.key === 'Enter' && e.shiftKey) {
        // Allow shift+enter for new lines
        return;
      } else if (isEditing && e.key === 'Enter') {
        setIsEditing(false);
      }
    };

    if (dragging || resizing) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    if (isEditing) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dragging, resizing, selected, dragOffset, size, isEditing, position, containerRef]);

  const handleDeselect = (e) => {
    // Don't deselect if we're clicking inside the caption box
    if (captionBoxRef.current && captionBoxRef.current.contains(e.target)) {
      return;
    }
    setSelected(false);
    setClickCount(0);
    setIsEditing(false);
    setResizing(false);
    setHoveringBorder(false);
  };

  // Add handler to the container ref for deselecting
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleDeselect);
    }
    return () => {
      if (container) {
        container.removeEventListener('click', handleDeselect);
      }
    };
  }, [containerRef]);

  return (
    <div style={{position: "relative"}}> 
    <div
      ref={captionBoxRef}
      className={`caption-box-container ${selected ? 'selected' : ''}`}
      // className="caption-box-container"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: "transparent",
        zIndex: 1001,
        cursor: selected && !isEditing ? "move" : "text",
        border: selected ? "1px dashed rgba(0, 0, 0, 0.3)" : "none",
      }}
      onClick={handleSelect}
      onMouseDown={selected && !isEditing ? handleDragStart : null}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={caption}
          onChange={handleTextChange}
          onBlur={handleEditingComplete}
          className="caption-textarea"
          placeholder="Add caption"
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            resize: "none",
            textAlign: "center",
            overflow: "hidden",
            color: fontColor,
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
          }}
        />
      ) : (
        <div 
          className="caption-text"
          onClick={() => setIsEditing(true)}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            wordBreak: "break-word",
            color: fontColor,
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            textShadow: "0px 0px 4px rgba(0, 0, 0, 0.7)",
          }}
        >
          {caption}
        </div>
      )}
      
      {selected && !isEditing && (
        <div
          className="caption-resize-handle"
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            background: "rgba(255, 255, 255, 0.7)",
            border: "1px solid rgba(0, 0, 0, 0.3)",
            borderRadius: "50%",
            bottom: "-5px",
            right: "-5px",
            cursor: "nwse-resize",
            zIndex: 1002
          }}
          onMouseDown={handleResizeStart}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  
    {/* Font Style Controls (Shown when selected) */}
    
  </div>
)};

