import React, { Component } from "react";
import data from '../../../../assets/data/rankingGdp.json'
import * as d3 from 'd3'
var _ = require('lodash');

class Gdp extends Component {
  constructor() {
    super();
    this.state = {
      id: "d3"
    }
  }
  componentDidMount() {
    this.handleData(data)
  }
  handleData(data) {

  }
  initPaiting(timeLine) {
   
  }
  
  render() {
    return (
        <svg id="svg">
        </svg>
    )
  }
}

export default Gdp;