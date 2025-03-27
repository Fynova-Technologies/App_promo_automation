import React from 'react';
import googlepixel3 from '../Pictures/googlepixel3.png';
import googlepixel4 from '../Pictures/googlepixel4.png';
import samsunggalaxys9 from '../Pictures/samsunggalaxys9.png';
import huawei from '../Pictures/huawei.png'
import lg from '../Pictures/lg.png'
import '../Style/frameSelector.css'

const MOBILE_FRAMES = [
  {
    id: 1,
    src: googlepixel3,
    name: 'Google Pixel 3',
  },
  {
    id: 2,
    src: googlepixel4,
    name: 'Google Pixel 4',
  },
  {
    id: 3,
    src: samsunggalaxys9,
    name: 'Samsung Galaxy S9',
  },
  {
    id: 4,
    src: huawei,
    name: 'Huawei',
  },
  {
    id: 5,
    src: lg,
    name: 'Lg',
  }
];

export const FrameSelector = ({ selectedFrame, onFrameSelect }) => {
  const handleFrameSelect = (e) => {
    const selectedFrameSrc = e.target.value;
    const selectedFrameData = MOBILE_FRAMES.find(f => f.src === selectedFrameSrc);

    // Update the selected frame
    onFrameSelect(selectedFrameSrc);

    // Update size if default size is available
    // if (selectedFrameData && selectedFrameData.defaultSize && onSizeChange) {
    //   onSizeChange(selectedFrameData.defaultSize);
    // }
  };

  return (
    <div className='frame-selector-container'>
      <h3>Select Device Frame</h3>
      <select
        value={selectedFrame}
        onChange={handleFrameSelect}
        className="device-frame-select"
      >
        {MOBILE_FRAMES.map((frame) => (
          <option key={frame.id} value={frame.src}>
            {frame.name}
          </option>
        ))}
      </select>
    </div>
  );
};

