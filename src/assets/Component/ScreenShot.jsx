import { useRef } from "react";
import '../Style/screenShot.css'

export const InnerImage = ({ src, parentSize, parentRotation, screenArea, caption }) => {
  const innerImageRef = useRef(null);

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
        // top: `${screenArea.top}px`,
        // left: `${screenArea.left}px`,
        transform: `translate(${screenArea.left}px, ${screenArea.top}px)`,
        width: `${screenArea.width}px`,
        height: `${screenArea.height}px`,
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
              style={{
                // width: `${screenArea.width}px`,
                // height: `${screenArea.height}px`,
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
              draggable={false}
            />
            {caption && <div className="image-caption">{caption}</div>}
          </>
        ) : (
          <div 
            className="image-upload-area"
            style={{
              // width: `${screenArea.width}px`,
              // height: `${screenArea.height}px`,
              width: `${Math.max(screenArea.width, 200)}px`, 
              height: `${Math.max(screenArea.height, 300)}px`,
            }}
          >
            <p>Drag and drop an image here</p>
          </div>
        )}
      </div>
    </div>
  );
};