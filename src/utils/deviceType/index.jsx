import React, { useState, useEffect } from 'react';

export function useType() {
  const [type, setType] = useState('desktop');

  const getType = () => {
    if (window?.innerWidth) {
      let mq = window.innerWidth <= 768;
      if (mq == true) {
        setType('mobile');
      } else {
        setType('desktop');
      }
    }
  };

  useEffect(() => {
    getType();
    window.addEventListener('resize', getType);
    window.addEventListener('orientationchange', getType);

    return () => {
      window.removeEventListener('resize', getType);
      window.removeEventListener('orientationchange', getType);
    };
  }, []);

  return type;
}
