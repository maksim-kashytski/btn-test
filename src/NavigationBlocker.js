import React from 'react';
import { useBlocker } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

const NavigationBlocker = ({ children }) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      // Блокируем навигацию назад
      return currentLocation.pathname !== nextLocation.pathname;
    }
  );

  if (blocker.state === "blocked") {
    return (
      <ConfirmDialog 
        open={true}
        onConfirm={() => blocker.proceed()}
        onCancel={() => blocker.reset()}
        title="Подтверждение навигации"
        message="Вы уверены, что хотите перейти на предыдущую страницу?"
      />
    );
  }

  return children;
};

export default NavigationBlocker; 