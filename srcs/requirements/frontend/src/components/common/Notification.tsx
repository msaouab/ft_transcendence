import React, { useState, useEffect } from 'react';
import styled, { keyframes, CSSObject } from 'styled-components';

interface NotificationProps {
  message: string;
  type: string;
  delay: number;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NotificationContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
`;

const getNotificationBoxStyles = (type: string): CSSObject => ({
  backgroundColor: `var(--color-${type}-500)`,
  color: 'white',
  padding: '8px',
  borderRadius: '4px',
  animation: `${fadeIn} 0.3s ease-out forwards`,
});

const NotificationBox = styled.div<NotificationProps>`
  ${(props) => getNotificationBoxStyles(props.type)}
`;

const Notification: React.FC<NotificationProps> = ({ message, type, delay }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  if (!visible) {
    return null;
  }

  return (
    <NotificationContainer>
        <span>{message}</span>
    </NotificationContainer>
  );
};

export default Notification;
