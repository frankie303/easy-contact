import React, { useReducer, createContext } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

interface UserRegistrationModel extends LoadedUserModel {
  password: string;
}

interface UserLoginModel {
  email: string;
  password: string;
}

interface LoadedUserModel {
  name: string;
  email: string;
}

interface AuthStateModel {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: LoadedUserModel;
  error: string;
}

interface AuthContextProps {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: LoadedUserModel;
  error: string;
  register: (data: UserRegistrationModel) => Promise<void>;
  clearErrors: () => void;
  loadUser: () => Promise<void>;
  login: (data: UserLoginModel) => Promise<void>;
  logout: () => void;
}

type Token = {
  token: string;
};

type AuthAction =
  | { type: 'USER_LOADED'; payload: LoadedUserModel }
  | { type: 'REGISTER_SUCCESS'; payload: Token }
  | { type: 'LOGIN_SUCCESS'; payload: Token }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERRORS' };

export const AuthContext = createContext({} as AuthContextProps);

export const authReducer = (state: AuthStateModel, action: AuthAction) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: '',
        isAuthenticated: false,
        loading: false,
        user: { name: '', email: '' },
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: '',
        isAuthenticated: false,
        loading: false,
        user: { name: '', email: '' },
        error: ''
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: ''
      };
    default:
      return state;
  }
};

export const AuthState = ({ children }: React.PropsWithChildren<{}>) => {
  const initialState: AuthStateModel = {
    token: localStorage.getItem('token')!,
    isAuthenticated: false,
    loading: true,
    user: { name: '', email: '' },
    error: ''
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');

      const { name, email } = res.data;
      dispatch({
        type: 'USER_LOADED',
        payload: { name, email }
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.response.data.msg });
    }
  };

  // Register User
  const register = async (formData: UserRegistrationModel) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/users', formData, config);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response.data.msg
      });
    }
  };
  // Login User
  const login = async (formData: UserLoginModel) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/auth', formData, config);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response.data.msg
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: 'LOGOUT' });

  // Clear Errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  const contextPropsValues: AuthContextProps = {
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    user: state.user,
    error: state.error,
    register,
    loadUser,
    login,
    logout,
    clearErrors
  };

  return (
    <AuthContext.Provider value={contextPropsValues}>
      {children}
    </AuthContext.Provider>
  );
};
