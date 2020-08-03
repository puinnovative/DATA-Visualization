import React, { Component } from "react";
import { Tabs } from 'antd';
import Gdp from './Gdp/index.jsx'
import Cars from './Cars/index.jsx'
import Temp from './Temp/index.jsx'
import Map from './Map/index.jsx'
import Line from './Line/index.jsx'

const { TabPane } = Tabs;

class D3 extends Component {
  constructor() {
    super();
    this.state = {
      id: "d3"
    }
  }
  
  render() {
    return (
        <Tabs defaultActiveKey="1" >
            <TabPane tab="GDP排名" key="1">
              <Gdp/>
            </TabPane>
            <TabPane tab="散点图" key="2">
              <Cars/>
            </TabPane>
            <TabPane tab="面积图" key="3">
              <Temp />
            </TabPane>
            <TabPane tab="地图" key="4">
              <Map /><Line />
            </TabPane>
            <TabPane tab="折线图" key="5">
              <Line />
            </TabPane>
      </Tabs>
    )
  }
}

export default D3;