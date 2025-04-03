export function fitImageToScreen(imageSrc, screenRef) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const screenRect = screenRef.current.getBoundingClientRect(); // Get inner screen dimensions
            const screenAspectRatio = screenRect.width / screenRect.height;
            const imageAspectRatio = img.width / img.height;

            let newWidth, newHeight;

            // Fit image to inner screen area based on aspect ratio
            if (imageAspectRatio > screenAspectRatio) {
                newWidth = screenRect.width;
                newHeight = screenRect.width / imageAspectRatio;
            } else {
                newHeight = screenRect.height;
                newWidth = screenRect.height * imageAspectRatio;
            }

            resolve({
                src: img.src,
                width: newWidth,
                height: newHeight
            });
        };

        img.onerror = (err) => reject(err);
    });
}
