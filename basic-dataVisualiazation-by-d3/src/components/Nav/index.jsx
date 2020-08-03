import React, { Component } from "react";
import { Menu, Switch } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Link
} from "react-router-dom";

const { SubMenu } = Menu;

class Nav extends Component {
  constructor() {
    super();
    this.state = {
        id: "nav",
        theme: 'dark',
        current: '1',
    }
    this.handleClick = this.handleClick.bind(this);
    this.changeTheme = this.changeTheme.bind(this)
  };
  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };
  changeTheme(value) {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };
  render() {
    return (
      <div>

        <Switch
          checked={this.state.theme === 'dark'}
          onChange={this.changeTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        <br />
        <br />
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          style={{ width: 256 }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[this.state.current]}
          mode="inline"
        >
            <SubMenu
            key="sub1"
            title={
              <span>
                <MailOutlined />
                <span>前端</span>
              </span>
            }
          >
            <Menu.Item key="1"><Link to="/d3">D3可视化</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/vue">VUE</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/react">REACT</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/js">JS</Link></Menu.Item>
            <Menu.Item key="5"><Link to="/html">HTML</Link></Menu.Item>
            <Menu.Item key="6"><Link to="/css">CSS</Link></Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <AppstoreOutlined />
                <span>敬请期待</span>
              </span>
            }
          >
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <SettingOutlined />
                <span>敬请期待</span>
              </span>
            }
          >
          </SubMenu>
        </Menu>

      </div>
    )
  }
}

export default Nav;