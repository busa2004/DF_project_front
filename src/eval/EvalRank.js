import React, { Component } from 'react';
import { Card, Button, Input, Icon, Table, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { getTask, getByTask, searchYear, quarterNHalfRank, monthNYearRank, isExistUserInEval } from '../util/APIUtils';
import LoadingIndicator from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import RankModal from './RankModal';

class EvalRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '업무 번호',
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id')
      }, {
        title: '업무 제목',
        dataIndex: 'title',
        key: 'title',
        ...this.getColumnSearchProps('title')
      }, {
        title: '업무 내용',
        dataIndex: 'content',
        key: 'content',
        ...this.getColumnSearchProps('content')
      }],
      visible: false,
      evalDatas: null,
      userList: null,
      rankList: null,
      yearList: [],
      tmpResponse: [],
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  componentWillMount() { 
    this.setState({
      columns: this.state.columns.concat({
        title: '평가순위',
        dataIndex: 'rank',
        key: 'rank',
        render: (text, record) => {
          let getUserList = () => {
            this.getUserList(record);
          }
          return <Button onClick={getUserList}>순위 보기</Button>
        }
      })
    });  
    this.load();
    this.searchYear();
  }

  getUserList = async (record) => {  
    const taskId = record.id;
    await getByTask(taskId)
      .then(response => {
        this.setState({
          userList: response
        })
      })
      .catch(error => {
        console.log(error);
      });

    // this.getUserRank();    
    this.modalControl(true);
  }

  load = () => {
    this.setState({
      isLoading: true,
    });
    getTask()
      .then(response => {
        // console.log(response);
        this.setState({
          evalDatas: response,
          isLoading: false
        });
      }).catch(error => {
        if (error.status === 404) {
          this.setState({
            notFound: true,
            isLoading: false
          });
        } else {
          this.setState({
            serverError: true,
            isLoading: false
          });
        }
      });
  }

  // DB에 년도 검색
  searchYear = async () => {
    await searchYear()
      .then(response => {
        this.setState({
          yearList: response
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  
  modalControl = (v) => {
    this.setState({
      visible: v,
      rankList: null
    })
  }

  
  scoreRank = async (childYear, option, subOption) => {
    console.log(childYear +","+ option +","+ subOption);

    // 검색할 사원 list setting
    let tmpTaskId = {
      taskId: new Array(),
    }
    this.state.userList.map( (item) => {
      tmpTaskId.taskId.push(item.id)
    });

    let existUserTask = [];
    // 평가순위를 매길때 업무를 가진 사원리스트에서 평가가 된 사원인지 확인
    await isExistUserInEval(tmpTaskId.taskId)
      .then(response => {
        // console.log(response);
        existUserTask = response;
      })
      .catch(error => {
        console.log(error);
      })

    // 검색 조건에 따른 condition param setting
    // 검색 조건 : 월간
    if(option == '월간') {
      // validation
      if(subOption >= 1 && subOption <= 12 ) {
        // subOption이 1~12인 경우..
        if(subOption < 10) {
          subOption = '0'+subOption; // query를 위해서
        }
        const tmpCondition = childYear + '-' + subOption; // ex) '2019-05'
        const param = {
          taskIds: existUserTask, // 업무를 수행한 사원들 중 평가를 받은 userTask
          condition: tmpCondition // 검색 조건
        }  
        // console.log(param);
        await monthNYearRank(param)
          .then( response => {        
            this.setState({
              tmpResponse: response
            });          
          })
          .catch( error => {
            console.log(error);
          });
      } else {
        notification.error({
          message: 'Message',
          description: "잘못된 선택입니다."
        });
      }      
    }
    // 검색 조건 : 분기 
    else if(option == '분기') {
      // validation
      if(subOption == '1분기' || subOption == '2분기' || subOption == '3분기' || subOption == '4분기') {
        
        // 분기별 시작날짜 종료날짜 setting
        let sDate = "";
        let eDate = "";
        if(subOption == '1분기') {
          sDate = childYear + "-01-01";
          eDate = childYear + "-03-31";       
        } else if(subOption == '2분기') {
          sDate = childYear + "-04-01";
          eDate = childYear + "-06-30";
        } else if(subOption == '3분기') {
          sDate = childYear + "-07-01";
          eDate = childYear + "-09-30";
        } else if(subOption == '4분기') {
          sDate = childYear + "-10-01";
          eDate = childYear + "-12-31";
        } 
        const param = {
          taskIds: existUserTask, // 업무를 수행한 사원들 중 평가를 받은 userTask
          startDate: sDate,
          endDate: eDate
        }
        await quarterNHalfRank(param)
          .then(response => {      
            this.setState({
              tmpResponse: response
            }); 
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // validation
        notification.error({ // 옆에 표시 띄우기
          message: 'Message',
          description: "잘못된 선택입니다."
        });
      }      
    } 
    // 검색 조건 : 반기
    else if(option == '반기') { 
      // validation     
      if(subOption == '상반기' || subOption == '하반기') {
        // 분기별 시작날짜 종료날짜 setting
        let sDate = "";
        let eDate = "";
        if(subOption == "상반기") {        
          sDate = childYear + "-01-01";
          eDate = childYear + "-06-30";  
        } else if(subOption == "하반기") {
          sDate = childYear + "-07-01";
          eDate = childYear + "-12-31";  
        }
        const param = {
          taskIds: existUserTask, // 업무를 수행한 사원들 중 평가를 받은 userTask
          startDate: sDate,
          endDate: eDate
        }
        await quarterNHalfRank(param)
          .then(response => {       
            this.setState({
              tmpResponse: response
            }); 
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        notification.error({ // 옆에 표시 띄우기
          message: 'Message',
          description: "잘못된 선택입니다."
        });
      }      
    } 
    // 검색 조건 : 년
    else if(option == '년') {
      if(this.state.yearList.includes(subOption)) {
        // db에 있는 yearList에 subOption이 있으면.. -> true
        const param = {
          taskIds: existUserTask, // 업무를 수행한 사원들 중 평가를 받은 userTask
          condition: subOption // 검색 조건
        }
        await monthNYearRank(param)
          .then(response => {      
            this.setState({
              tmpResponse: response
            }); 
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // validation
        notification.error({ // 옆에 표시 띄우기
          message: 'Message',
          description: "잘못된 선택입니다."
        });
      }       
    }

    // Table dataSourse setting
    let list = new Array();
    let rankCount = 1;

    this.state.tmpResponse.map( (item) => {
      this.state.userList.map( (userListItem) => {
        if(item.userTaskId == userListItem.id) {
          const rank = {};
          if(item.score != 'NaN') {
            rank.rank = rankCount;
            rank.taskId = userListItem.id;
            rank.userId = userListItem.user.id;
            rank.userName = userListItem.user.name;
            rank.score= (item.score).toFixed(2);
            rankCount++;
          }               
          list.push(rank);
          // console.log(list);
        }
      });
    });
    
    this.setState({
      rankList: list,
      isLoading: false
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
        <Card title="평가 순위">
          <Table
            dataSource={this.state.evalDatas}
            columns={this.state.columns} />
          <RankModal
            rankList={this.state.rankList}
            visible={this.state.visible}
            modalControl={this.modalControl}
            scoreRank={this.scoreRank}
            yearList={this.state.yearList} />
        </Card>
      </div>
    )
  }
}

export default EvalRank;