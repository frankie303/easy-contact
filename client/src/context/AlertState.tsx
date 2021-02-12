import React, { useReducer, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// interface Alert {
//   msg: string;
//   type: string;
// }

// interface AlertState extends Alert {
//   id: string;
// }

interface AlertState {
  msg: string;
  type: string;
  id: string;
}

interface AlertContextProps {
  alerts: AlertState[];
  setAlert: (msg: string, type: string, timeout?: number) => void;
  // dispatch: React.Dispatch<Action>;
}

type AlertAction =
  | { type: 'SET_ALERT'; payload: AlertState }
  | { type: 'REMOVE_ALERT'; payload: string };

export const AlertContext = createContext({} as AlertContextProps);

export const alertReducer = (state: AlertState[], action: AlertAction) => {
  switch (action.type) {
    case 'SET_ALERT':
      return [...state, action.payload];
    case 'REMOVE_ALERT':
      return state.filter(alert => alert.id !== action.payload);
    default:
      return state;
  }
};

export const AlertState = ({ children }: React.PropsWithChildren<{}>) => {
  const initialState = [] as AlertState[];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg: string, type: string, timeout = 5000) => {
    const id = uuidv4();
    dispatch({
      type: 'SET_ALERT',
      payload: { msg, type, id }
    });
    setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
