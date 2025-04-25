import React, { useState, useRef } from "react";
import MockupControls from "./MockupControls";
import MockupInstance from './MockupInstance';
import { ControlPanel } from "./ControlPanel";
import domtoimage from "dom-to-image";
import "../Style/mockupSection.css";

// Utility function for debouncing
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
  const [backgrounds, setBackgrounds] = useState([
    'linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)',
    'linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)' 
  ]);
  const [activeControl, setActiveControl] = useState(null);

  const mockupRefs = [useRef(null), useRef(null)]; // Refs for each MockupInstance
  const containerRef = useRef(null); // For the outer container

  const handleDownload = (index) => {
    const mockupNode = mockupRefs[index].current?.getContainer();
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

  // const handleResetAll = () => {
  //   mockupRefs.forEach(ref => ref.current?.resetMockupState());
  // };

  return (
    <div className="mockup-section-wrapper">
      <div className="header">
        <h1>MOCKUP AUTOMATION</h1>
        <button className="download-button" onClick={handleDownloadAll}>
          Download All
        </button>
        {/* <button className="reset-button" onClick={handleResetAll}>
            Reset All
        </button> */}
      </div>

      <MockupControls
        showCaptionControls={showCaptionControls}
         toggleCaption={() => {
           // 1) Tell the active child to toggle its caption box
           const activeRef = mockupRefs[activeMockupIndex].current;
           activeRef.toggleCaption();
        
           // 2) Toggle our controls panel open/closed
           setShowCaptionControls(prev => !prev);
        
           // 3) Mark the “caption” control as active (or deactivate if already open)
           setActiveControl(prev =>
             prev === "captionControls" ? null : "captionControls"
           );
          }}
        toggleColorPicker={() =>
          setActiveControl(activeControl === "colorPicker" ? null : "colorPicker")
        }
        toggleFrame={() => {
          setShowFrameSelector(!showFrameSelector);
          setActiveControl(showFrameSelector ? null : "frameSelector");
        }}
        handleImageSelect={(e) =>
          mockupRefs[activeMockupIndex].current.handleImageSelect(e)
        }
        showFrameSelector={showFrameSelector}
      />

      <ControlPanel
        activeControl={activeControl}
        showCaptionControls={showCaptionControls}
        setShowCaptionBox={(value) =>
          mockupRefs[activeMockupIndex].current.setShowCaptionBox(value)
        }
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
        onAddFrame={() => mockupRefs[activeIndex].current.addFrame()}
        onRemoveFrame={() => mockupRefs[activeIndex].current.removeActiveFrame()}
      />

      <div
        ref={containerRef}
        className="mockup-container-wrapper"
      >
        {backgrounds.map((bg, idx) => (
         <div className="single-mockup-wrapper" key={idx}>
           <MockupInstance
             ref={mockupRefs[idx]}
             index={idx}
             onSelect={setActiveMockupIndex}
             background={bg}
           />

           <button
             className="single-download-button"
             onClick={() => handleDownload(idx)}
           >
             Download
           </button>

         </div>
       ))}
      </div>
    </div>
  );
}

export default MockupSection;

