import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import '../../../assets/style/style.css'

import Nav from '../../components/Nav/index.jsx'
import Vue from '../Vue/index.jsx'
import Js from '../Js/index.jsx'
import Html from '../Html/index.jsx'
import Css from '../Css/index.jsx'
import D3 from '../D3/index.jsx'
import Rt from '../React/index.jsx'

const routes = [
  { 
      path: '/vue',
      exact: false,
      component: Vue
  },
  { 
    path: '/react',
    exact: false,
    component: Rt
},
  { 
    path: '/js',
    exact: false,
    component: Js
},
{ 
  path: '/css',
  exact: false,
  component: Css
},
{ 
  path: '/d3',
  exact: false,
  component: D3
},
{ 
  path: '/html',
  exact: false,
  component: Html
},

];

class App extends Component {
  constructor() {
    super();
    this.state = {
      id: "app"
    }
  }
  render() {
    return (
      <Router>
      <Row>
          <Col span={6}>
            <Nav/>
          </Col>
          <Col span={18}>
            <Switch>
            {routes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                />
            ))}
        </Switch>
          </Col>
      </Row>
     
      </Router>
    )
  }
}

export default App;