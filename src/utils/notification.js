export const triggerAlert = (title, message) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/logo192.png'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, {
            body: message,
            icon: '/logo192.png'
          });
        }
      });
    }
    
    // Fallback to browser alert
    if (Notification.permission !== 'granted') {
      alert(`${title}: ${message}`);
    }
  };