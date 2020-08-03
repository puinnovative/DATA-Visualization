import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch
  } from "react-router-dom";
import App from '../views/Apps/index.jsx'



const RouteConfig = (
    <Router >
        <Route
            path='/'
            exact
            component={App}
        />
    </Router>
);

export default RouteConfig;