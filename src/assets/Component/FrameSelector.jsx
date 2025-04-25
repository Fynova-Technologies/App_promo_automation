import React from 'react';
import googlepixel3 from '../Pictures/googlepixel3.png';
import googlepixel4 from '../Pictures/googlepixel4.png';
import samsunggalaxys9 from '../Pictures/samsunggalaxys9.png';
import iphone11 from '../Pictures/iphone11.png'
import samsunggalaxys8 from '../Pictures/samsunggalaxys8.png'
import '../Style/frameSelector.css'

const MOBILE_FRAMES = [
  {
    id: 1,
    src: googlepixel3,
    name: 'Google Pixel 3',
    width: '30',
    defaultSize: { width: 185, height: 400 },
    screenAreaOffsets: {
      top: 0.050,  
      left: 0.043,  
      right: 0.049,  
      bottom: 0.03  
    },
    adjustmentStep: { width: 19, height: 5 } 
  },
  {
    id: 2,
    src: googlepixel4,
    name: 'Google Pixel 4',
    defaultSize: { width: 115, height: 0 },
    screenAreaOffsets: {
      top: 0.037,
      left: 0.025,
      right: 0.0300,
      bottom: 0.0
    },
    adjustmentStep: { width: 10, height: 0 } 
  },
  {
    id: 3,
    src: samsunggalaxys9,
    name: 'Samsung Galaxy S9',
    defaultSize: { width: 180, height: 400 },
    screenAreaOffsets: {
      top: 0.018,    
      left: 0.00,    
      right: 0.00,   
      bottom: 0.015  
    },
    adjustmentStep: { width: 20, height: 25 } 
  },
  {
    id: 4,
    src: iphone11,
    name: 'Iphone 11',
    defaultSize: { width: 185, height: 400 },
    screenAreaOffsets: { 
      top: 0.015,    
      left: 0.00, 
      right: 0.00, 
      bottom: 0.012 
    },
    adjustmentStep: { width: 40, height: 45 } 
  },
  {
    id: 5,
    src: samsunggalaxys8,
    name: 'Samsung galaxy s8',
    defaultSize: { width: 185, height: 400 },
    screenAreaOffsets: {
      top: 0.018,    
      left: 0.00,    
      right: 0.00,   
      bottom: 0.015  
    },
    adjustmentStep: { width: 20, height: 25 } 
  }
];

export const FrameSelector = ({ selectedFrame, onFrameSelect, onSizeChange, onAddFrame, onRemoveFrame}) => {
  const handleFrameSelect = (e) => {
    const selectedFrameSrc = e.target.value;
    const selectedFrameData = MOBILE_FRAMES.find(f => f.src === selectedFrameSrc);

    if (selectedFrameData) {
      const newSize = {
        width: selectedFrameData.defaultSize.width + selectedFrameData.adjustmentStep.width,
        height: selectedFrameData.defaultSize.height + selectedFrameData.adjustmentStep.height
      };
      // Pass the entire frame data object 
      onFrameSelect({
        image: selectedFrameData.src,
        config: {
          screenAreaOffsets: selectedFrameData.screenAreaOffsets,
          adjustmentStep: selectedFrameData.adjustmentStep

        },
        name: selectedFrameData.name
      });
      
      if (onSizeChange) {
        // onSizeChange(selectedFrameData.defaultSize);
        onSizeChange(newSize);
      }}
  };

  return (
    <div className='frame-selector-container'>
      <h3>Select Frame</h3>
      <select
        value={selectedFrame || ""}
        onChange={handleFrameSelect}
        className="device-frame-select"
      >
        {MOBILE_FRAMES.map((frame) => (
          <option key={frame.id} value={frame.src}>
            {frame.name}
          </option>
        ))}
      </select>
      <div className="add-remove-frame">
        <h3>Add Remove Frames</h3>
        <button onAddFrame={() => ref.current.addFrame()} className='add-button'>Add</button>
        <button onRemoveFrame={() => ref.current.removeActiveFrame()} onClick={onRemoveFrame} className='remove-button'>Remove</button>
      </div>
    </div>
  );
};

// Helper function to get frame configuration by source
export const getFrameConfigBySrc = (frameSrc) => {
  const frame = MOBILE_FRAMES.find(f => f.src === frameSrc);
  return frame ? frame.screenAreaOffsets : MOBILE_FRAMES[0].screenAreaOffsets;
};