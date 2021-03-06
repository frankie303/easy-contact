import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthContext } from '../../context/AuthState';

type PrivateRouteProps = {
  path: RouteProps['path'];
  component: React.ElementType;
  exact: boolean;
};

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
