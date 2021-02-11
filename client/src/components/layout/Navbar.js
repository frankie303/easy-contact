import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthState';
import { ContactContext } from '../../context/ContactState';

const Navbar = ({ title }) => {
  const authContext = useContext(AuthContext);
  const contactContext = useContext(ContactContext);

  const { isAuthenticated, logout, user } = authContext;
  const { clearContacts } = contactContext;

  const onLogout = () => {
    logout();
    clearContacts();
  };

  const authLinks = (
    <>
      <li>{user && user.name}</li>
      <li>
        <a onClick={onLogout} href='#!'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className='myButton'>
        <Link to='/register'>Sign up</Link>
      </li>
      <li className='myButton'>
        <Link to='/login'>Log in</Link>
      </li>
    </>
  );

  return (
    <div className='navbar bg-primary'>
      <Link to='/'>
        {' '}
        <h1>
          <img src='/images/address-book.png' className='address-logo'></img>{' '}
          {title}
        </h1>
      </Link>

      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired
};

Navbar.defaultProps = {
  title: 'EasyContact'
};

export default Navbar;
