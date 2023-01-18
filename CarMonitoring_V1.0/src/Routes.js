/* eslint-disable */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  AddCarDetails,
  CarMonitoring,
  Login
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/login"
      />

      <RouteWithLayout
        component={Login}
        exact
        layout={MinimalLayout}
        path="/login"
      />

      <RouteWithLayout
        component={AddCarDetails}
        exact
        layout={MainLayout}
        path="/AddCarDetails"
      />

      <RouteWithLayout
        component={CarMonitoring}
        exact
        layout={MainLayout}
        path="/CarMonitoring"
      />
      <RouteWithLayout
        component={Login}
        exact
        layout={MinimalLayout}
        path="/Logout"
      />

      <RouteWithLayout
        component={<Redirect to="/login" />}
        exact
        layout={MainLayout}
        path="/login"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
