

// Utility function to calculate work hours as hours and minutes
export const formatHourMins = (duration) => {
  if (duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  }
  return '0';
};


/*
// In DateTimeUtil.js
export const formatHourMins = (duration) => {
  if(duration){
    const hours = Math.floor(duration / 60);
  const minutes = Math.floor(duration % 60);
  const seconds = Math.floor((duration * 60) % 60); // Calculate remaining seconds

  // Return in the format: HH:mm:ss
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
return '';
};
*/


