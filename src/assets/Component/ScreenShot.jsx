import { useRef, useEffect, useState } from "react";
import '../Style/screenShot.css';

export const InnerImage = ({ src, parentSize, parentRotation, screenArea, caption, adjustmentStep }) => {
  const innerImageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Calculate image dimensions whenever source or screen area changes
  useEffect(() => {
    if (src && screenArea && screenArea.width > 0 && screenArea.height > 0) {
      const img = new Image();
      img.onload = () => {
        const imgAspectRatio = img.width / img.height;
        const screenAspectRatio = screenArea.width / screenArea.height;
        
        let width, height;
        
        if (imgAspectRatio > screenAspectRatio) {
          // Image is wider than screen area - constrain by width
          width = screenArea.width + adjustmentStep.width;
          height = width / imgAspectRatio + adjustmentStep.height;
        } else {
          // Image is taller than screen area - constrain by height
          height = screenArea.height + adjustmentStep.height;
          width = height * imgAspectRatio + adjustmentStep.width;
        }
        
        setImageDimensions({ width, height });
      };
      img.src = src;
    }
  }, [src, screenArea, adjustmentStep]);
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("Dropped image:", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div
      className="inner-image-wrapper"
      style={{
        position: 'absolute',
        top: `${screenArea.top}px`,
        left: `${screenArea.left}px`,
        width: `${screenArea.width}px`,
        height: `${screenArea.height}px`,
        overflow: 'hidden',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        ref={innerImageRef}
        className="inner-image-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {src ? (
          <>
            <img
              src={src}
              alt="inner-image"
              className="inner-image"
              draggable={false}
              style={{
                width: imageDimensions.width > 0 ? `${imageDimensions.width}px` : '100%',
                height: imageDimensions.height > 0 ? `${imageDimensions.height}px` : '100%',
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
            {caption && <div className="image-caption">{caption}</div>}
          </>
        ) : (
          <div
            className="image-upload-area"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '4px'
            }}
          >
            <p>Drag and drop an image here</p>
          </div>
        )}
      </div>
    </div>
  );
};