import React, { useEffect } from 'react';
import { triggerAlert } from '../../utils/notification';
import { playAlertSound } from '../../services/alertService';

const AlertSystem = ({ alertLocation, isTriggered, onReset }) => {
  useEffect(() => {
    if (isTriggered && alertLocation) {
      triggerAlert('Route Alert', 'You are approaching your alert location!');
      playAlertSound();
      
      // Auto-reset after 5 minutes
      const timer = setTimeout(() => {
        onReset();
      }, 300000);
      
      return () => clearTimeout(timer);
    }
  }, [isTriggered, alertLocation, onReset]);

  return null;
};

export default AlertSystem;