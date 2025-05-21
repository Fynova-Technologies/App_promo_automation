// import React, { useState, useRef } from "react";
// import MockupControls from "./MockupControls";
// import MockupInstance from './MockupInstance';
// import { ControlPanel } from "./ControlPanel";
// import domtoimage from "dom-to-image";
// import "../Style/mockupSection.css";

// const MockupSection = () => {
//   const [activeMockupIndex, setActiveMockupIndex] = useState(0); 
//   const [showCaptionControls, setShowCaptionControls] = useState(false);
//   const [showFrameSelector, setShowFrameSelector] = useState(false);
//   const [captionBoxShown, setCaptionBoxShown] = useState([false, false]); 
//   const [backgrounds, setBackgrounds] = useState([
//     'linear-gradient(90deg, rgb(225, 255, 119) 0%, rgba(255,255,255,1) 100%)',
//     'linear-gradient(90deg, rgb(255, 156, 156) 0%, rgba(255,255,255,1) 100%)'
//   ]);
//   const [activeControl, setActiveControl] = useState(null);
//   const mockupRefs = [useRef(null), useRef(null)]; // Refs for each MockupInstance
//   const containerRef = useRef(null); // For the outer container
  

//   const handleDownload = async (index) => {
//     const mockupNode = mockupRefs[index]?.current?.getContainer();
//     if (!mockupNode) {
//       console.error(`Mockup ${index + 1} not found`);
//       return;
//     }

//      await Promise.all(
//     Array.from(mockupNode.querySelectorAll("img"))
//       .map(img => img.complete ? Promise.resolve() 
//       : new Promise((resolve) => img.onload = resolve))
//   );
    
//     // Temporarily adjust styles to ensure complete capture
//     const originalStyle = mockupNode.style.cssText;
    
//     // Compute document scroll position
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
//     const options = {
//       scrollX: 0,
//       scrollY: -scrollTop, // Correct for page scroll
//       useCORS: true,
//       scale: 2,
//       // height: mockupNode.offsetHeight, // Explicitly set height
//       // width: mockupNode.offsetWidth,   // Explicitly set width
//       style: {
//         transform: 'none', // Remove any transforms temporarily
//         margin: 0,         // Remove margins
//         padding: 0         // Remove padding
//       },
      
//     };
    
//     domtoimage.toPng(mockupNode, options)
//       .then((dataUrl) => {
//         // Restore original styling
//         mockupNode.style.cssText = originalStyle;
        
//         const link = document.createElement("a");
//         link.href = dataUrl;
//         link.download = `mockup-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       })
//       .catch((err) => {
//         // Restore original styling on error too
//         mockupNode.style.cssText = originalStyle;
//         console.error(`Download Error of ${index + 1}:`, err);
//       });
//   };

// // const handleDownload = async (mockupNode) => {
// //   try {
// //     // Function to calculate the size needed to include all children
// //     const calculateRequiredSize = (node) => {
// //       const rect = node.getBoundingClientRect();
// //       let maxRight = rect.right;
// //       let maxBottom = rect.bottom;
      
// //       // Check all child elements to find the maximum extent
// //       const children = node.querySelectorAll('*');
// //       children.forEach(child => {
// //         const childRect = child.getBoundingClientRect();
// //         if (childRect.right > maxRight) maxRight = childRect.right;
// //         if (childRect.bottom > maxBottom) maxBottom = childRect.bottom;
// //       });
      
// //       return {
// //         width: maxRight - rect.left,
// //         height: maxBottom - rect.top,
// //       };
// //     };

// //     // Get the required size to encompass all elements
// //     const { width, height } = calculateRequiredSize(mockupNode);

// //     // Store original dimensions
// //     const originalWidth = mockupNode.style.width;
// //     const originalHeight = mockupNode.style.height;

// //     // Temporarily set the container size to include all children
// //     mockupNode.style.width = `${width}px`;
// //     mockupNode.style.height = `${height}px`;

// //     // Capture the image using dom-to-image (adjust library as needed)
// //     const dataUrl = await domtoimage.toPng(mockupNode); // No width/height options here

// //     // Restore original dimensions
// //     mockupNode.style.width = originalWidth;
// //     mockupNode.style.height = originalHeight;

// //     // Trigger the download
// //     const link = document.createElement('a');
// //     link.download = 'mockup.png';
// //     link.href = dataUrl;
// //     link.click();
// //   } catch (error) {
// //     console.error('Error during download:', error);
// //   }
// // };

//   // Trigger downloads for both mockups
//   const handleDownloadAll = () => {
//     mockupRefs.forEach((_, idx) => handleDownload(idx));
//   };

//   const handleCaptionDeleted = () => {
//     // Clear both the visibility state AND reset the caption text
//     const activeRef = mockupRefs[activeMockupIndex].current;

//     if (activeRef && activeRef.clearCaptionBox) {
//       activeRef.clearCaptionBox();
//     }
//   };

//   const handleToggleCaption = () => {
//     const activeRef = mockupRefs[activeMockupIndex].current;
//     if (!captionBoxShown[activeMockupIndex]) {
//       activeRef.toggleCaption(); // This shows the caption box in the child
//       setCaptionBoxShown(prev => {
//       const updated = [...prev];
//       updated[activeMockupIndex] = true;
//       return updated;
//       });
//     }
        
//     // 2) Toggle our controls panel open/closed
//     setShowCaptionControls(prev => !prev);
        
//     // 3) Mark the “caption” control as active (or deactivate if already open)
//     setActiveControl(prev =>
//       prev === "captionControls" ? null : "captionControls"
//     );
//   }


//   // Handle image selection for the active mockup
//   const handleImageSelect = (e) => {
//     if (mockupRefs[activeMockupIndex]?.current?.handleImageSelect) {
//       mockupRefs[activeMockupIndex].current.handleImageSelect(e);
//     }
//   };  
  
//   return (
//     <div className="mockup-section-wrapper">
//       <div className="header">
//         <h1>MOCKUP AUTOMATION</h1>
//         <button className="download-button" onClick={handleDownloadAll}>
//           Download All
//         </button>
//       </div>

//       <MockupControls
//         showCaptionControls={showCaptionControls}
//         toggleCaption= {handleToggleCaption}
//         toggleColorPicker={() =>{
//           setActiveControl(activeControl === "colorPicker" ? null : "colorPicker")
//         }}
//         toggleFrame={() => {
//           setShowFrameSelector(!showFrameSelector);
//           setActiveControl(showFrameSelector ? null : "frameSelector");
//         }}
//         showFrameSelector={showFrameSelector}
//         activeMockupIndex={activeMockupIndex}
//         handleImageSelect={handleImageSelect}
//       />

//       <ControlPanel
//         activeControl={activeControl}
//         setActiveControl={setActiveControl}
//         showCaptionControls={showCaptionControls}
//         setShowCaptionBox={(value) => {
//         if (mockupRefs[activeMockupIndex]?.current?.setShowCaptionBox) {
//           mockupRefs[activeMockupIndex].current.setShowCaptionBox(value);
//           }
//         }}
//         showCaptionBox={mockupRefs[activeMockupIndex].current?.showCaptionBox}
//         showFrameSelector={showFrameSelector}
//         background={backgrounds[activeMockupIndex]}
//         setBackground={(newBackground) => {
//           setBackgrounds((prev) => {
//             const newBackgrounds = [...prev];
//             newBackgrounds[activeMockupIndex] = newBackground;
//             return newBackgrounds;
//           });
//         }}
//         fontColor={mockupRefs[activeMockupIndex].current?.fontColor}
//         setFontColor={(color) =>
//           mockupRefs[activeMockupIndex].current.setFontColor(color)
//         }
//         fontFamily={mockupRefs[activeMockupIndex].current?.fontFamily}
//         setFontFamily={(family) =>
//           mockupRefs[activeMockupIndex].current.setFontFamily(family)
//         }
//         fontSize={mockupRefs[activeMockupIndex].current?.fontSize}
//         setFontSize={(size) =>
//           mockupRefs[activeMockupIndex].current.setFontSize(size)
//         }
//         mobileFrame={mockupRefs[activeMockupIndex].current?.mobileFrame}
//         setMobileFrame={(frame) =>
//           mockupRefs[activeMockupIndex].current.setMobileFrame(frame)
//         }
//         setCurrentFrameConfig={(config) =>
//           mockupRefs[activeMockupIndex].current.setCurrentFrameConfig(config)
//         }
//         handleCaptionDeleted={handleCaptionDeleted}
//       />

//       <div
//         ref={containerRef}
//         className="mockup-container-wrapper"
//         style={{position: "relative"}}
//       >
//         {backgrounds.map((bg, idx) => (
//         <>
//          <div  className="single-mockup-wrapper" key={idx}>
//            <MockupInstance
//              ref={mockupRefs[idx]}
//              index={idx}
//              onSelect={setActiveMockupIndex}
//              background={bg}
//              isActive={activeMockupIndex ===  idx}
//              canvasCount={backgrounds.length}
//            />
//            <button
//              className="single-download-button"
//              onClick={() => handleDownload(idx)}
//            >
//              Download
//            </button>
//          </div>
//          <div className="gap-container"></div>
//         </>
//        ))}
//     </div>
//     </div>
//   );
// }

// export default MockupSection;


import React, { useState, useRef } from "react";
import MockupControls from "./MockupControls";
import MockupInstance from "./MockupInstance";
import { ControlPanel } from "./ControlPanel";
import domtoimage from "dom-to-image";
import "../Style/mockupSection.css";

const MockupSection = () => {
  const [activeMockupIndex, setActiveMockupIndex] = useState(0);
  const [showCaptionControls, setShowCaptionControls] = useState(false);
  const [showFrameSelector, setShowFrameSelector] = useState(false);
  const [captionBoxShown, setCaptionBoxShown] = useState([false, false]);
  const [backgrounds, setBackgrounds] = useState([
    "linear-gradient(90deg, rgb(225, 255, 119) 0%, rgba(255,255,255,1) 100%)",
    "linear-gradient(90deg, rgb(255, 156, 156) 0%, rgba(255,255,255,1) 100%)",
  ]);
  const [activeControl, setActiveControl] = useState(null);
  const mockupRefs = [useRef(null), useRef(null)];
  const containerRef = useRef(null);

  const handleDownload = async (index) => {
    const mockupNode = mockupRefs[index]?.current?.getContainer();
    if (!mockupNode) {
      console.error(`Mockup ${index + 1} not found`);
      return;
    }

    await Promise.all(
      Array.from(mockupNode.querySelectorAll("img")).map((img) =>
        img.complete ? Promise.resolve() : new Promise((resolve) => (img.onload = resolve))
      )
    );

    const targetRect = mockupNode.getBoundingClientRect();
    const allFrames = document.querySelectorAll(".absolute");

    const overlappingElements = Array.from(allFrames).filter((element) => {
      const elementRect = element.getBoundingClientRect();
      return !(
        elementRect.right < targetRect.left ||
        elementRect.left > targetRect.right ||
        elementRect.bottom < targetRect.top ||
        elementRect.top > targetRect.bottom
      );
    });

    const clones = overlappingElements.map((element) => {
      const elementRect = element.getBoundingClientRect();
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = `${elementRect.left - targetRect.left}px`;
      clone.style.top = `${elementRect.top - targetRect.top}px`;
      clone.style.width = `${elementRect.width}px`;
      clone.style.height = `${elementRect.height}px`;
      clone.style.zIndex = "1000";
      mockupNode.appendChild(clone);
      return clone;
    });

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const options = {
      scrollX: 0,
      scrollY: -scrollTop,
      useCORS: true,
      scale: 2,
      height: mockupNode.offsetHeight,
      width: mockupNode.offsetWidth,
      style: {
        transform: "none",
        margin: 0,
        padding: 0,
      },
    };

    try {
      const dataUrl = await domtoimage.toPng(mockupNode, options);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `mockup-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Download Error of ${index + 1}:`, err);
    } finally {
      clones.forEach((clone) => mockupNode.removeChild(clone));
    }
  };

  const handleDownloadAll = () => {
    mockupRefs.forEach((_, idx) => handleDownload(idx));
  };

  const handleCaptionDeleted = () => {
    const activeRef = mockupRefs[activeMockupIndex].current;
    if (activeRef && activeRef.clearCaptionBox) {
      activeRef.clearCaptionBox();
    }
  };

  const handleToggleCaption = () => {
    const activeRef = mockupRefs[activeMockupIndex].current;
    if (!captionBoxShown[activeMockupIndex]) {
      activeRef.toggleCaption();
      setCaptionBoxShown((prev) => {
        const updated = [...prev];
        updated[activeMockupIndex] = true;
        return updated;
      });
    }
    setShowCaptionControls((prev) => !prev);
    setActiveControl((prev) => (prev === "captionControls" ? null : "captionControls"));
  };

  const handleImageSelect = (e) => {
    if (mockupRefs[activeMockupIndex]?.current?.handleImageSelect) {
      mockupRefs[activeMockupIndex].current.handleImageSelect(e);
    }
  };

  return (
    <div className="mockup-section-wrapper">
      <div className="header">
        <h1>MOCKUP AUTOMATION</h1>
        <button className="download-button" onClick={handleDownloadAll}>
          Download All
        </button>
      </div>

      <MockupControls
        showCaptionControls={showCaptionControls}
        toggleCaption={handleToggleCaption}
        toggleColorPicker={() => {
          setActiveControl(activeControl === "colorPicker" ? null : "colorPicker");
        }}
        toggleFrame={() => {
          setShowFrameSelector(!showFrameSelector);
          setActiveControl(showFrameSelector ? null : "frameSelector");
        }}
        showFrameSelector={showFrameSelector}
        activeMockupIndex={activeMockupIndex}
        handleImageSelect={handleImageSelect}
      />

      <ControlPanel
        activeControl={activeControl}
        setActiveControl={setActiveControl}
        showCaptionControls={showCaptionControls}
        setShowCaptionBox={(value) => {
          if (mockupRefs[activeMockupIndex]?.current?.setShowCaptionBox) {
            mockupRefs[activeMockupIndex].current.setShowCaptionBox(value);
          }
        }}
        showCaptionBox={mockupRefs[activeMockupIndex].current?.showCaptionBox}
        showFrameSelector={showFrameSelector}
        background={backgrounds[activeMockupIndex]}
        setBackground={(newBackground) => {
          setBackgrounds((prev) => {
            const newBackgrounds = [...prev];
            newBackgrounds[activeMockupIndex] = newBackground;
            return newBackgrounds;
          });
        }}
        fontColor={mockupRefs[activeMockupIndex].current?.fontColor}
        setFontColor={(color) => mockupRefs[activeMockupIndex].current.setFontColor(color)}
        fontFamily={mockupRefs[activeMockupIndex].current?.fontFamily}
        setFontFamily={(family) => mockupRefs[activeMockupIndex].current.setFontFamily(family)}
        fontSize={mockupRefs[activeMockupIndex].current?.fontSize}
        setFontSize={(size) => mockupRefs[activeMockupIndex].current.setFontSize(size)}
        mobileFrame={mockupRefs[activeMockupIndex].current?.mobileFrame}
        setMobileFrame={(frame) => mockupRefs[activeMockupIndex].current.setMobileFrame(frame)}
        setCurrentFrameConfig={(config) =>
          mockupRefs[activeMockupIndex].current.setCurrentFrameConfig(config)
        }
        handleCaptionDeleted={handleCaptionDeleted}
      />

      <div ref={containerRef} className="mockup-container-wrapper" style={{ position: "relative" }}>
        {backgrounds.map((bg, idx) => (
          <>
            <div className="single-mockup-wrapper" key={idx}>
              <MockupInstance
                ref={mockupRefs[idx]}
                index={idx}
                onSelect={setActiveMockupIndex}
                background={bg}
                isActive={activeMockupIndex === idx}
                canvasCount={backgrounds.length}
              />
              <button className="single-download-button" onClick={() => handleDownload(idx)}>
                Download
              </button>
            </div>
            <div className="gap-container"></div>
          </>
        ))}
      </div>
    </div>
  );
};

export default MockupSection;