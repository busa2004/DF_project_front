import React, { Component } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { Input } from 'antd';

class ModalInput extends Component {
  constructor(props) {
    super(props) ;
    this.state = {
      record: this.props.record,
      score : this.props.score,
    }
  }
  
  componentWillMount() {
    if(this.state.score.length == 0) {
      this.setState({
        score: ""
      })
    } else if(this.state.score.length != 0) {
      this.state.score.map((item) => {
        if(this.state.record.itemNo == item.evalItem.itemNo) {
          this.setState({
            score: item.score
          });
        }
      });
    }
    
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
      <Input
        name={this.state.record.itemNo}
        placeholder={this.state.score}
        // defaultValue={this.state.score}
        style={{ cursor:'default' }}
        onChange={event => this.props.handleInputChange(event,this.state.record)}
        />
    )
  }
}

export default ModalInput;