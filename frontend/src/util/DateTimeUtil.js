
// Utility function to calculate work hours as hours and minutes
export const formatHourMins = (duration) => {
  if (duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  }
  return '';
};