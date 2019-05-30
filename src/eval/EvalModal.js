import React, { Component } from 'react';

import LoadingIndicator from '../common/LoadingIndicator';
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';
import { Table, Modal, notification, Button } from 'antd';
import { setEvalScore, updateEvalScore } from '../util/APIUtils';
import ModalInput from './ModalInput';

class EvalModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        columns: [{
          title: '번호',
          dataIndex: 'itemNo',
          key: 'no',
          width: '20%'
        }, {
          title: '평가항목',
          dataIndex: 'content',
          key: 'content',
          width: '40%'
        }],
        isLoading: true,
        itemList: this.props.itemList,
        version: this.props.version,
        scores: this.props.scores,
        userTask: this.props.userTask,
      };
  }
  // modal
  handleOk = () => {
    // validation
    let scoreRange = false;
    this.state.scores.map( (item) => {
      if(item.score < -1 || item.score > 100) {
        scoreRange = true
      }
    });

    // validation
    if(scoreRange == true) {
      notification.success({ // 옆에 표시 띄우기
        message: 'Message',
        description: "점수 범위는 0점 ~ 100점입니다."
      });
    } else if(scoreRange == false) {
      const evalUserTask = {
        // 사번, 평가항목들, 업무번호
        scores: this.state.scores,// modal table.. itemList랑 score 다 있음
        userTask: this.props.userTask,
        userId: this.props.userTask.user.id
      }
      console.log(evalUserTask);
      if(this.props.buttonName == '수정') {
        updateEvalScore(evalUserTask)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error)
          });
      } else if(this.props.buttonName == '평가') {
        console.log(evalUserTask);
        setEvalScore(evalUserTask)
          .then(response => {
            notification.success({ // 옆에 표시 띄우기
              message: 'Message',
              description: "평가가 저장되었습니다."
            });
          })
          .catch(error => {
            console.log(error);
            notification.error({
              message: 'Message',
              description: "평가저장을 실패하였습니다."
            })
          }); 
      }
      scoreRange = false;
      this.props.modalControl(false);
      this.props.refresh(); 
    }    
  }

  handleCancel = () => {
    this.props.setNull();
    this.props.modalControl(false);
  }
  
  handleInputChange = ( event, record) => {
    const target = event.target;
    const inputValue = target.value;   

    this.props.scores.map( (item, key) => {
      if(record.itemNo == item.evalItem.itemNo) {
        this.state.scores[key].score = Number(inputValue);
      }
    });
  }
  
  componentWillMount() {
    this.setState({
      isLoading:true,
      columns: this.state.columns.concat({
          title: '점수',
          dataIndex: 'score',
          key: 'score',  
          width: '40%',        
          render: (text, record) => { // record = version에 따른 itemList            console.log(record);
            if(record.content == this.props.report.key) {
              return this.props.report.value;
            } else {
              return <ModalInput 
                      score={this.props.score}
                      record={record}
                      handleInputChange={this.handleInputChange} />
            }           
          }
      }),
      isLoading: false
    });
  }

  setVersion = (childVersion) => {
    this.setState({
      version: childVersion // version json임
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
    return(
      <div>
        <Modal 
          title="평가하기" 
          visible={this.props.visible} 
          okText={this.props.buttonName}
          onOk={this.handleOk} 
          cancelText="닫기"
          onCancel={this.handleCancel}
        > 
          <br/>
          
          <Table
            columns={this.state.columns}
            dataSource={this.state.itemList}
            pagination={false} />

          <br/>

          <h5 style={{ textAlign:"right" }}>
            보고서 점수는 자동으로 계산됩니다.
          </h5>
          <br/>
          <h5 style={{ textAlign:"right" }}>
            평가 또는 수정 시 입력하지않으면 0점 처리됩니다.
          </h5>
        </Modal>
      </div>
    );
  }
}

export default EvalModal;