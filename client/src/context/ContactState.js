import React, { useReducer, createContext } from 'react';
import axios from 'axios';

export const ContactContext = createContext();

export const contactReducer = (state, action) => {
  switch (action.type) {
    case 'GET_CONTACTS':
      return {
        ...state,
        contacts: action.payload,
        loading: false
      };
    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [action.payload, ...state.contacts],
        loading: false
      };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact._id === action.payload._id ? action.payload : contact
        ),
        loading: false
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(
          contact => contact._id !== action.payload
        ),
        loading: false
      };
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload
      };
    case 'CLEAR_CURRENT':
      return {
        ...state,
        current: null
      };
    case 'FILTER_CONTACTS':
      return {
        ...state,
        filtered: state.contacts.filter(contact => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return contact.name.match(regex) || contact.email.match(regex);
        })
      };
    case 'CLEAR_FILTER':
      return {
        ...state,
        filtered: null
      };
    case 'CONTACT_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'CLEAR_CONTACTS':
      return {
        ...state,
        contacts: null,
        filtered: null,
        error: null,
        current: null
      };
    default:
      return state;
  }
};

export const ContactState = props => {
  const initialState = {
    contacts: null,
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Get Contacts

  const getContacts = async contact => {
    try {
      const res = await axios.get('/api/contacts');

      dispatch({
        type: 'GET_CONTACTS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'CONTACT_ERROR',
        payload: err.response.msg
      });
    }
  };

  // Add Contact

  const addContact = async contact => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/contacts', contact, config);

      dispatch({
        type: 'ADD_CONTACT',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'CONTACT_ERROR',
        payload: err.response.msg
      });
    }
  };

  // Delete contact
  const deleteContact = async id => {
    try {
      await axios.delete(`/api/contacts/${id}`);

      dispatch({ type: 'DELETE_CONTACT', payload: id });
    } catch (err) {
      dispatch({
        type: 'CONTACT_ERROR',
        payload: err.response.msg
      });
    }
  };

  // Update Contact
  const updateContact = async contact => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `/api/contacts/${contact._id}`,
        contact,
        config
      );

      dispatch({ type: 'UPDATE_CONTACT', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'CONTACT_ERROR',
        payload: err.response.msg
      });
    }
  };

  // Clear Contacts
  const clearContacts = () => {
    dispatch({ type: 'CLEAR_CONTACTS' });
  };

  // Set Current Contact
  const setCurrent = contact => {
    dispatch({ type: 'SET_CURRENT', payload: contact });
  };

  // Clear Current Contact
  const clearCurrent = () => {
    dispatch({ type: 'CLEAR_CURRENT' });
  };

  // Filter Contacts
  const filterContacts = text => {
    dispatch({ type: 'FILTER_CONTACTS', payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: 'CLEAR_FILTER' });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        deleteContact,
        clearContacts,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
        getContacts
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};
