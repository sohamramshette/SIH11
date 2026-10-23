import { useContext } from 'react';
import { DemoStateContext } from '../context/DemoStateContext';

/**
 * Custom hook to access unified shared demo state across all SIH roles.
 */
export const useDemoState = () => {
  const context = useContext(DemoStateContext);
  if (!context) {
    throw new Error('useDemoState must be used within a DemoStateProvider');
  }
  return context;
};

export default useDemoState;
