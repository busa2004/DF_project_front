import React, { Component } from 'react';
import { Table, Button } from 'antd';
import LoadingIndicator from '../common/LoadingIndicator';
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';
import '../ListAndSearchUi/ScrollList.css';
import EmpButton from './EmpButton';

class EmpList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '사번',
        dataIndex: 'user.id',
        key: 'user_id'
      }, {
        title: '사원 이름',
        dataIndex: 'user.name',
        key: 'name'
      }, {
        title: '업무 시작일',
        dataIndex: 'startDate',
        key: 'start_date'
      }, {
        title: '업무 마감일',
        dataIndex: 'endDate',
        key: 'end_date',
        isCompleted: []
      }],
      userTasks: this.props.userTasks, // 업무를 가진 사원리스트
    }
  }

  evalModal = (userTask) => { 
    // console.log(userTask); // 평가할 사원 업무 // userTasks랑 다름
    this.props.evalModal(userTask);
  }

  getButtonName = (childButtonName) => {
    this.props.getButtonName(childButtonName);
  }
  
  componentWillMount() {
    this.setState({
      columns: this.state.columns.concat({
        title: '평가',
        dataIndex: 'evalId',
        key: 'evalId',
        render: (text, record) => {
          return <EmpButton
                    evalModal={this.evalModal}
                    evalButtonVisible={this.props.evalButtonVisible}
                    record={record}
                    getButtonName={this.getButtonName}
                  />
        }
      })
    });
  }
  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }

    if (this.state.notFound) {
      return <NotFound />;
    }

    if (this.state.serverError) {
      return <ServerError />;
    }
    return (
      <div>
        <Table
          columns={this.state.columns}
          dataSource={this.state.userTasks} />
      </div>
    );
  }
}

export default EmpList;