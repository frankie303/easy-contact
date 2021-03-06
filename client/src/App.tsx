import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import { ContactState } from './context/ContactState';
import { AuthState } from './context/AuthState';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alerts from './components/layout/Alerts';
import { AlertState } from './context/AlertState';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import Footer from './components/layout/Footer';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  return (
    <AuthState>
      <ContactState>
        <AlertState>
          <Router>
            <div>
              <div className='wrapper'>
                <Navbar />
                <div className='container'>
                  <Alerts />
                  <Switch>
                    <PrivateRoute exact={true} path='/' component={Home} />
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                  </Switch>
                </div>
              </div>
              <Footer />
            </div>
          </Router>
        </AlertState>
      </ContactState>
    </AuthState>
  );
};

export default App;
