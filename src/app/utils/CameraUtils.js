// // Camera Utilities for Card Detection

// // Initialize camera with proper settings
// export const initializeCamera = async (videoRef) => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ 
//       video: { 
//         width: 1280, 
//         height: 720,
//         facingMode: 'environment'
//       } 
//     });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
//     return stream;
//   } catch (error) {
//     console.error('Camera initialization failed:', error);
//     throw new Error('Camera access is required for card detection');
//   }
// };

// // Capture frame from video element
// export const captureFrame = (videoRef, canvasRef) => {
//   if (!videoRef.current || !canvasRef.current) return null;
  
//   const video = videoRef.current;
//   const canvas = canvasRef.current;
//   const ctx = canvas.getContext('2d');
  
//   canvas.width = video.videoWidth || 640;
//   canvas.height = video.videoHeight || 480;
  
//   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       if (blob) {
//         console.log(`Frame captured: ${blob.size} bytes, type: ${blob.type}`);
//         resolve(blob);
//       } else {
//         console.error('Failed to create blob from canvas');
//         resolve(null);
//       }
//     }, 'image/jpeg', 0.9);
//   });
// };

// // Cleanup camera stream
// export const cleanupCamera = (videoRef) => {
//   if (videoRef.current?.srcObject) {
//     const tracks = videoRef.current.srcObject.getTracks();
//     tracks.forEach(track => track.stop());
//   }
// };










// Camera Utilities for Card Detection

// Initialize camera with optimized settings
export const initializeCamera = async (videoRef) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },    // Request lower resolution for performance
        height: { ideal: 480 },
        facingMode: 'environment'
      } 
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return stream;
  } catch (error) {
    console.error('Camera initialization failed:', error);
    throw new Error('Camera access is required for card detection');
  }
};


export const saveBlob = (blob, filename = 'frame.jpg') => {
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up memory
  URL.revokeObjectURL(url);
};


// Capture a frame from the video element
export const captureFrame = (videoRef, canvasRef, save = false) => {
  if (!videoRef.current || !canvasRef.current) return null;
  
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  // Target resolution (scale down for Android performance)
  const targetWidth = 640;
  const targetHeight = 480;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw scaled frame onto canvas
  ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

  // Export as compressed JPEG blob
  return new Promise((resolve) => { 
    canvas.toBlob(
      (blob) => {
        if (blob) {
          console.log(`Frame captured: ${blob.size} bytes, type: ${blob.type}`);

           // If save mode is enabled, save to disk for debugging
          if (save) {
            saveBlob(blob, `frame-${Date.now()}.jpg`);
          }

          resolve(blob);
        } else {
          console.error('Failed to create blob from canvas');
          resolve(null);
        }
      },
      'image/jpeg',
      1.0 // lower quality = smaller/faster
    );
  });
};

// Cleanup camera stream
export const cleanupCamera = (videoRef) => {
  try {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  } catch (error) {
    console.error('Error cleaning up camera:', error);
  }
};
