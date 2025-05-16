import React, { useState, useRef } from "react";
import MockupControls from "./MockupControls";
import MockupInstance from './MockupInstance';
import { ControlPanel } from "./ControlPanel";
import domtoimage from "dom-to-image";
import "../Style/mockupSection.css";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const MockupSection = () => {
  const [activeMockupIndex, setActiveMockupIndex] = useState(0); 
  const [showCaptionControls, setShowCaptionControls] = useState(false);
  const [showFrameSelector, setShowFrameSelector] = useState(false);
  const [captionBoxShown, setCaptionBoxShown] = useState([false, false]); 
  const [backgrounds, setBackgrounds] = useState([
    'linear-gradient(90deg, rgb(225, 255, 119) 0%, rgba(255,255,255,1) 100%)',
    'linear-gradient(90deg, rgb(255, 156, 156) 0%, rgba(255,255,255,1) 100%)'
  ]);
  const [activeControl, setActiveControl] = useState(null);
  const mockupRefs = [useRef(null), useRef(null)]; // Refs for each MockupInstance
  const containerRef = useRef(null); // For the outer container

  const handleDownload = (index) => {
    const mockupNode = mockupRefs[index]?.current?.getContainer();
    if (!mockupNode) {
      console.error(`Mockup ${index + 1} not found`);
      return;
    }
    
    // Temporarily adjust styles to ensure complete capture
    const originalStyle = mockupNode.style.cssText;
    
    // Compute document scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const options = {
      scrollX: 0,
      scrollY: -scrollTop, // Correct for page scroll
      useCORS: true,
      scale: 2,
      height: mockupNode.offsetHeight, // Explicitly set height
      width: mockupNode.offsetWidth,   // Explicitly set width
      style: {
        transform: 'none', // Remove any transforms temporarily
        margin: 0,         // Remove margins
        padding: 0         // Remove padding
      }
    };
    
    domtoimage.toPng(mockupNode, options)
      .then((dataUrl) => {
        // Restore original styling
        mockupNode.style.cssText = originalStyle;
        
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `mockup-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        // Restore original styling on error too
        mockupNode.style.cssText = originalStyle;
        console.error(`Download Error of ${index + 1}:`, err);
      });
  };

  // Trigger downloads for both mockups
  const handleDownloadAll = () => {
    mockupRefs.forEach((_, idx) => handleDownload(idx));
  };

  // const handleCaptionDeleted = () => {
  //   setCaptionBoxShown(prev => {
  //     const updated = [...prev];
  //     updated[activeMockupIndex] = false;
  //     return updated;
  //   });
  // };
    const handleCaptionDeleted = () => {
      // Clear both the visibility state AND reset the caption text
      const activeRef = mockupRefs[activeMockupIndex].current;

  
      setCaptionBoxShown(prev => {
        const updated = [...prev];
        updated[activeMockupIndex] = true;
        return updated;
      });

      setCaptionBoxShown(false);

      // Add this line to actually clear the caption text
      activeRef.setCaptionText(""); // Resets to empty string
    };

  const handleToggleCaption = () => {
    const activeRef = mockupRefs[activeMockupIndex].current;
    if (!captionBoxShown[activeMockupIndex]) {
      activeRef.toggleCaption(); // This shows the caption box in the child
      setCaptionBoxShown(prev => {
      const updated = [...prev];
      updated[activeMockupIndex] = true;
      return updated;
      });
    }
        
    // 2) Toggle our controls panel open/closed
    setShowCaptionControls(prev => !prev);
        
    // 3) Mark the “caption” control as active (or deactivate if already open)
    setActiveControl(prev =>
      prev === "captionControls" ? null : "captionControls"
    );
  }

  // Handle image selection for the active mockup
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
        toggleCaption= {handleToggleCaption}
        toggleColorPicker={() =>{
          setActiveControl(activeControl === "colorPicker" ? null : "colorPicker")
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
        // setShowCaptionBox={(value) =>
        //   mockupRefs[activeMockupIndex].current.setShowCaptionBox(value)
        // }
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
        setFontColor={(color) =>
          mockupRefs[activeMockupIndex].current.setFontColor(color)
        }
        fontFamily={mockupRefs[activeMockupIndex].current?.fontFamily}
        setFontFamily={(family) =>
          mockupRefs[activeMockupIndex].current.setFontFamily(family)
        }
        fontSize={mockupRefs[activeMockupIndex].current?.fontSize}
        setFontSize={(size) =>
          mockupRefs[activeMockupIndex].current.setFontSize(size)
        }
        mobileFrame={mockupRefs[activeMockupIndex].current?.mobileFrame}
        setMobileFrame={(frame) =>
          mockupRefs[activeMockupIndex].current.setMobileFrame(frame)
        }
        setCurrentFrameConfig={(config) =>
          mockupRefs[activeMockupIndex].current.setCurrentFrameConfig(config)
        }
        handleCaptionDeleted={handleCaptionDeleted}
      />

      <div
        ref={containerRef}
        className="mockup-container-wrapper"
        style={{position: "relative"}}
      >
        {backgrounds.map((bg, idx) => (
        <>
         <div  className="single-mockup-wrapper" key={idx}>
           <MockupInstance
             ref={mockupRefs[idx]}
             index={idx}
             onSelect={setActiveMockupIndex}
             background={bg}
             isActive={activeMockupIndex ===  idx}
           />
           <button
             className="single-download-button"
             onClick={() => handleDownload(idx)}
           >
             Download
           </button>
         </div>
         <div className="gap-container"></div>
        </>
       ))}
    </div>
    </div>
  );
}

export default MockupSection;

