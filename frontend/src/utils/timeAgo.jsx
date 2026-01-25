export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " year" + (num > 1 ? "s" : "") + " ago";
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " month" + (num > 1 ? "s" : "") + " ago";
  }

  interval = seconds / 86400
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " day" + (num > 1 ? "s" : "") + " ago";
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " hour" + (num > 1 ? "s" : "") + " ago";
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    const num = Math.floor(interval);
    return num + " min" + (num > 1 ? "s" : "") + " ago";
  }
  
  return "just now";
};