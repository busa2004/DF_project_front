import React, { Component } from 'react';
import { Modal, Table, Select, Button, notification } from 'antd';
import './RankModal.css';

const Option  = Select.Option;

class RankModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '순위',
        dataIndex: 'rank',
        key: 'rank',
        width: '20%'
      }, {
        title: '사번',
        dataIndex: 'userId',
        key: 'userId'
      }, {
        title: '사원 이름',
        dataIndex: 'userName',
        key: 'name'
      }, {
        title: '점수',
        dataIndex: 'score',
        key: 'score'
      }],
      yearList: [],
      subSelected: [],
      year: "",
      option: "",
      subOption: "",
      clear: false
    }
  }
  
  handleCancel = () => {
    this.setState({
      clear: true
    })
    this.props.modalControl(false);
  }

  onSelectYear = (selected) => {
    this.setState({
      year: selected
    })
  }

  onChange = (selected) => {
    this.setState({
      option: selected,
    })

    if(selected == '월간')      this.state.subSelected = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    else if(selected == '분기') this.state.subSelected = ['1분기', '2분기', '3분기', '4분기'];
    else if(selected == '반기') this.state.subSelected = ['상반기', '하반기'];
    else if(selected == '년')   this.state.subSelected = this.props.yearList;    
  }

  onSubChange = async (selected) => {
    await this.setState({
      subOption: selected
    })
  }

  onClick = () => {
    // validation
    if(this.state.year == "" || this.state.option == "" || this.state.subOption == "") {
      notification.success({
        message: 'Message',
        description: "검색조건을 선택해주세요"
      });
    } else {
      this.props.scoreRank(this.state.year, this.state.option, this.state.subOption);
    }
  }

  render() {
    const OPTIONS = ['월간', '분기', '반기', '년'];
    return (
      <div>
        <Modal
          title="순위"
          visible={this.props.visible}
          onCancel={this.handleCancel}
          footer={null}>

          <div>
            <label>검색조건</label>
            <Select 
              style={{ marginLeft: 10, width: "100px" }}
              defaultValue="선택"
              onChange={this.onSelectYear}
              autoClearSearchValue={this.state.clear} >
                { this.props.yearList.map((value) => <Option value={value}>{value}</Option> ) }                
            </Select>
            <Select 
              style={{ marginLeft: 10, width: "100px" }}
              defaultValue="선택"
              onChange={this.onChange} >
                { OPTIONS.map((value) => <Option value={value}>{value}</Option> ) }                
            </Select>
            <Select 
                style={{  marginLeft: 10, width: "100px" }}
                defaultValue="선택"
                onChange={this.onSubChange}>
                  {this.state.subSelected.map((value) => <Option value={value}>{value}</Option>)}
            </Select>
            <Button 
              type="primary"
              style={{marginLeft: 10, width: "50px"}}
              onClick={this.onClick}> 검색 </Button>
          </div>
          
          <br />

          <Table
            dataSource={this.props.rankList}
            columns={this.state.columns}
            />
        </Modal>
      </div>
   )
  }
}

export default RankModal;