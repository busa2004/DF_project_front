import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import { Menu, Icon } from 'antd';
import './SiderMenu.css';

const SubMenu = Menu.SubMenu;

class Sider extends React.Component {
  // submenu keys of first level
  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

  state = {
    openKeys: ['sub1'],
  };

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  render() {
    return (
      <Menu
        className="Main-menu"
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 'auto' }}
      >
        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>업무</span></span>}>
          <Menu.Item key="1"><Link to="/Option1">업무리스트</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/Option2">보고서등록</Link>np</Menu.Item>
          <Menu.Item key="3"><Link to="/Option3">보고서관리</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>관리자</span></span>}>
          <Menu.Item key="4"><Link to="/Option4">업무보고현황</Link></Menu.Item>
          <Menu.Item key="5"><Link to="/Option5">결제관리</Link></Menu.Item>
          <Menu.Item key="6"><Link to="/Option6">업무리스트</Link></Menu.Item>
          <Menu.Item key="7"><Link to="/Option7">업무등록</Link></Menu.Item>
          <Menu.Item key="8"><Link to="/Option8">업무부여</Link></Menu.Item>
          <SubMenu key="sub3" title="평가">
            <Menu.Item key="9"><Link to="/Eval">평가하기</Link></Menu.Item>
            <Menu.Item key="10"><Link to="/EvalRank">평가순위</Link></Menu.Item>
            <Menu.Item key="11"><Link to="/ManageEvalItem">평가항목관리</Link></Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
          <Menu.Item key="11">Option 9</Menu.Item>
          <Menu.Item key="12">Option 10</Menu.Item>
          <Menu.Item key="13">Option 11</Menu.Item>
          <Menu.Item key="14">Option 12</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

class SiderMenu extends Component {
    render() {
        return (
            <Sider />
        );
    }
}

export default withRouter(SiderMenu);