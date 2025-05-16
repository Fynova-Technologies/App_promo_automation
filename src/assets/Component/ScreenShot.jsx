import { useRef, useEffect, useState } from "react";
import '../Style/screenShot.css';

export const InnerImage = ({ src, screenArea, caption, adjustmentStep }) => {
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
          // width = screenArea.width + adjustmentStep.width;
          // height = width / imgAspectRatio + adjustmentStep.height;
          width = screenArea.width;
          height = width / imgAspectRatio;
        } else {
          // Image is taller than screen area - constrain by height
          // height = screenArea.height + adjustmentStep.height;
          // width = height * imgAspectRatio + adjustmentStep.width;
          height = screenArea.height;
          width = height * imgAspectRatio;
        }
        
        setImageDimensions({ width, height });
      };
      img.src = src;
    }
  }, [src, screenArea]);
  
  return (
    <div
      className="inner-image-wrapper"
      style={{
        position: 'absolute',
        top: `${screenArea.top}px`,
        left: `${screenArea.left}px`,
        width: `${screenArea.width}px`,
        height: `${screenArea.height - 11}px`,
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
      >
        {src && (
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
        )}
      </div>
    </div>
  );
};