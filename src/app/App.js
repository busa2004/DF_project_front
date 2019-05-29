import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';
import SiderMenu from '../common/SiderMenu';
import PollList from '../poll/PollList';
import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Option1 from '../option/Option1';
import Option2 from '../option/Option2';
import Option3 from '../option/Option3';
import Option4 from '../option/Option4';
import Option5 from '../option/Option5';
import Option6 from '../option/Option6';
import Option7 from '../option/Option7';
import Option8 from '../option/Option8';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import { Layout, notification } from 'antd';
import ManageEvalItem from '../eval/ManageEvalItem';
import Eval from '../eval/Eval';
import EvalRank from '../eval/EvalRank';
const { Sider, Content, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,       //유저아이디
      isAuthenticated: false,  //로그인여부
      isLoading: false         //로딩여부
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {        //로그인이 되어있을때
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {        //로그인이 안되어있을때
        this.setState({
          isLoading: false
        });
      });
  }

  componentWillMount() { //렌더후에
    console.log('2');
    this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'Polling App',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Polling App',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/Option1");
  }

  render() {
    if (this.state.isLoading) {
      console.log('1');
      return <LoadingIndicator />
    }
    let sider;
    if (this.state.currentUser == null) {
      sider = []
    } else {
      sider = [
        <Sider className="app-Sider" ><SiderMenu /></Sider>
      ];
    }
    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout} />


        <Content className="app-content">
          <Layout>

            {sider}

            <div className="center">
              <div className="main" >
                <Switch>
                  <Route path="/login"
                    render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                  <Route path="/signup" component={Signup}></Route>
                  <PrivateRoute authenticated={this.state.isAuthenticated} exact path="/" handleLogout={this.handleLogout}
                    component={(props) => <Option1 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>
                  <Route path="/users/:username"
                    render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}>
                  </Route>
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/poll/new" component={NewPoll} handleLogout={this.handleLogout}></PrivateRoute>
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option1" handleLogout={this.handleLogout}
                    component={(props) => <Option1 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 내가 올린 보고서 보기 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option3" handleLogout={this.handleLogout}
                    component={(props) => <Option3 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 업무보고현황 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option4" handleLogout={this.handleLogout}
                    component={(props) => <Option4 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 결제관리 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option5" handleLogout={this.handleLogout}
                    component={(props) => <Option5 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 업무 리스트 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option6" handleLogout={this.handleLogout}
                    component={(props) => <Option6 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 업무 등록 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option7" handleLogout={this.handleLogout}
                    component={(props) => <Option7 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 업무 부여 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option8" handleLogout={this.handleLogout}
                    component={(props) => <Option8 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 평가 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/Eval" handleLogout={this.handleLogout}
                    component={(props) => <Eval isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 평가 순위*/}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/EvalRank" handleLogout={this.handleLogout}
                    component={(props) => <EvalRank isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* 평가항목관리 */}
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/ManageEvalItem" handleLogout={this.handleLogout}
                    component={(props) => <ManageEvalItem isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

                  {/* <Route path="/Option1" 
                render={(props) => <Option1 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}></Route> */}
                  <Route path="/Option2" component={Option2}></Route>
                  <Route component={NotFound}></Route>
                </Switch>
              </div>
            </div>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>
            Design ©2019 Created by SungJun
          </Footer>
        </Content>


      </Layout>

    );
  }
}

export default withRouter(App);
