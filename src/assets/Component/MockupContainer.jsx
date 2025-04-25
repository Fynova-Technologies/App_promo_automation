import React, {useState} from 'react';
import { InnerImage } from "./ScreenShot";
import {CaptionBox} from "./CaptionBox";
import { forwardRef } from 'react';
import {v4 as uuidv4} from 'uuid';
import '../Style/mockupContainer.css'

const MockupContainer = forwardRef(({
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
  position,
}, ref) => {

  const [frames, setFrames] = useState([
    { id: uuidv4(), config: null, image: null, name: '' },
    { id: uuidv4(), config: null, image: null, name: '' }
  ]);
  const [activeId, setActiveId] = useState(frames[0].id);

  const activeIndex = frames.findIndex(f => f.id === activeId);
  const activeFrame = frames[activeIndex];

  const handleAddFrame = () => {
    const newFrame = { id: uuidv4(), config: null, image: null, name: '' };
    setFrames(prev => [...prev, newFrame]);
    setActiveId(newFrame.id);
  };

  const handleRemoveFrame = () => {
    if (frames.length <= 1) return; // keep at least one
    setFrames(prev => prev.filter(f => f.id !== activeId));
    setActiveId(frames[0].id);
  };

  const handleFrameSelect = (data) => {
    setFrames(prev => prev.map(f =>
      f.id === activeId ? { ...f, ...data } : f
    ));
  };

  const handleSizeChange = (size) => {
    setFrames(prev => prev.map(f =>
      f.id === activeId ? { ...f, ...size } : f
    ));
  };
  return(
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
)});

export default MockupContainer;


// import React, {
//   useState,
//   useRef,
//   useEffect,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { InnerImage } from "./ScreenShot";
// import { CaptionBox } from "./CaptionBox";
// import "../Style/mockupContainer.css";

// const MockupContainer = forwardRef(({ background, onSelectIndex }, ref) => {
//   // ——— 1) INTERNAL STATE: an array of frame-objects ———
//   const [frames, setFrames] = useState(() => [createNewFrame(), createNewFrame()]);
//   const [activeId, setActiveId] = useState(frames[0].id);

//   const containerRef = useRef(null);

//   // Factory to create a fresh frame
//   function createNewFrame() {
//     return {
//       id: uuidv4(),
//       position: { x: 80, y: 100 },
//       rotation: 0,
//       size: { width: 225, height: 450 },
//       innerImageSrc: null,
//       showCaption: false,
//       captionText: "Double Click",
//       fontColor: "#ffffff",
//       fontFamily: "Arial",
//       fontSize: "28",
//       mobileFrame: null, // will be set via FrameSelector
//       currentFrameConfig: {
//         screenAreaOffsets: { top: 0.01, left: 0.005, right: 0, bottom: 0 },
//         adjustmentStep: { width: 10, height: 20 },
//       },
//     };
//   }

//   // ——— 2) HELPER: update a single frame by id ———
//   const updateFrame = (id, patch) =>
//     setFrames(all => all.map(f => (f.id === id ? { ...f, ...patch } : f)));

//   // ——— 3) EXPOSED METHODS via ref ———
//   useImperativeHandle(ref, () => ({
//     addFrame: () => {
//       const nf = createNewFrame();
//       setFrames(f => [...f, nf]);
//       setActiveId(nf.id);
//     },
//     removeActiveFrame: () => {
//       setFrames(f => {
//         if (f.length <= 1) return f;
//         const next = f.filter(x => x.id !== activeId);
//         setActiveId(next[0].id);
//         return next;
//       });
//     },
//     getContainer: () => containerRef.current,
//     // you can add downloadAll/downloadSingle here if you like
//   }));

//   // ——— 4) PIPE UP index selection to parent (`MockupSection`) ———
//   useEffect(() => {
//     const idx = frames.findIndex(f => f.id === activeId);
//     onSelectIndex(idx);
//   }, [activeId, frames, onSelectIndex]);

//   // ——— 5) RENDER: one “frame” per entry ———
//   return (
//     <div
//       ref={containerRef}
//       className="mockup-container"
//       style={{ background }}
//       onClick={() => setActiveId(null)} // deselect-all
//     >
//       {frames.map((f) => {
//         const isActive = f.id === activeId;

//         // Placeholders: swap these for your existing handlers,
//         // but call updateFrame(activeId, {...}) instead of setX
//         const onMouseDown = isActive
//           ? (e) => { e.stopPropagation();
//             e.preventDefault();
//             // compute offset just like you did:
//             const rect = e.currentTarget.getBoundingClientRect();
//             const offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          
//             // store dragging metadata in a ref:
//             dragMeta.current = { id, offset, mode: 'drag' }; }
//           : null;
//         const onRotateMouseDown = isActive
//           ? (e) => {e.stopPropagation();
//             e.preventDefault();
//             const frameNode = frameRefs.current[id];
//             const rect = frameNode.getBoundingClientRect();
//             const center = { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
//             const initialAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180/Math.PI);
          
//             dragMeta.current = {
//               id,
//               mode: 'rotate',
//               center,
//               initialAngle,
//               startRotation: framesById(id).rotation,
//             }; }
//           : null;
//         const onResizeMouseDown = isActive
//           ? (e) => { e.stopPropagation();
//             e.preventDefault();
//             const rect = frameRefs.current[id].getBoundingClientRect();
//             const offsetX = e.clientX - rect.left;
//             dragMeta.current = { id, mode: 'resize', offsetX };}
//           : null;

//         return (
//           <div
//             key={f.id}
//             className="frame-wrapper"
//             style={{
//               position: "absolute",
//               left: f.position.x,
//               top: f.position.y,
//               width: f.size.width,
//               height: f.size.height,
//               transform: `rotate(${f.rotation}deg)`,
//               zIndex: isActive ? 1000 : 1,
//               cursor: isActive ? "move" : "pointer",
//             }}
//             onClick={(e) => {
//               e.stopPropagation();
//               setActiveId(f.id);
//             }}
//             onMouseDown={onMouseDown}
//             // also onTouchStart, etc.
//           >
//             {/* Inner screenshot */}
//             {f.innerImageSrc && (
//               <InnerImage
//                 src={f.innerImageSrc}
//                 screenArea={{
//                   top: f.size.height * f.currentFrameConfig.screenAreaOffsets.top,
//                   left: f.size.width * f.currentFrameConfig.screenAreaOffsets.left,
//                   width:
//                     f.size.width *
//                     (1 -
//                       f.currentFrameConfig.screenAreaOffsets.left -
//                       f.currentFrameConfig.screenAreaOffsets.right),
//                   height:
//                     f.size.height *
//                     (1 -
//                       f.currentFrameConfig.screenAreaOffsets.top -
//                       f.currentFrameConfig.screenAreaOffsets.bottom),
//                 }}
//               />
//             )}

//             {/* Mobile frame image */}
//             <img
//               src={f.mobileFrame}
//               alt="frame"
//               draggable={false}
//               style={{
//                 width: f.size.width,
//                 height: f.size.height,
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//               }}
//             />

//             {/* Caption box */}
//             {f.showCaption && (
//               <CaptionBox
//                 caption={f.captionText}
//                 fontColor={f.fontColor}
//                 fontFamily={f.fontFamily}
//                 fontSize={f.fontSize}
//                 onCaptionChange={(c) => updateFrame(f.id, { captionText: c })}
//                 onDelete={() => updateFrame(f.id, { showCaption: false })}
//               />
//             )}

//             {/* Rotation & resize handles */}
//             {isActive && (
//               <>
//                 <div
//                   className="rotation-handle"
//                   onMouseDown={onRotateMouseDown}
//                 />
//                 <div
//                   className="resize-handle"
//                   onMouseDown={onResizeMouseDown}
//                 />
//               </>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// });

// export default MockupContainer;
