import React, { Component } from 'react';
import { Input, Form, Modal, notification, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

import ItemTable from './ItemTable';
import { setEvalVersion } from '../util/APIUtils';

class VersionAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: null,
            version: {
                value: ''
            }
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // versionAdd
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleCancel = (e) => {
        // modal 초기화
        this.setState({
            visible: false,
            version: {
                value: ''
            },
            dataSource: []
        });
    }

    dataSourceCallback = (childDataSource) => {
        console.log(childDataSource);
        this.setState({
            dataSource: childDataSource
        });
    }
    handleInputChange = (e) => {
        const target = e.target;
        const inputVersion = target.name; // input 안에 name이 가리키는 값
        const inputValue = target.value;

        this.setState({
            [inputVersion]: {
                value: inputValue,
            }
        });
    }
    handleOk(event) {
        event.preventDefault();

        const versionValue = {
            version: this.state.version.value,
            dataSource: this.state.dataSource
        }
        setEvalVersion(versionValue)
            .then(response => {
                notification.success({ // 옆에 표시 띄우기
                    message: 'Message',
                    description: "Successfully saved version! Automatically refreshes now!"
                })
            }).catch(error => {
                notification.error({
                    message: 'Message',
                    description: "Failed to save version.."
                })
            });
        // ok됐을때 modal 초기화
        this.setState({
            visible: false,
            version: {
                value: ''
            },
            dataSource: []
        });

        // 리렌더링 하기
        // this.props.refresh();
    }
    render() {
        return (
            <div>
                <div style={{ textAlign: "right" }}>
                    <Button style={{ textAlign: "center", width: '100px', marginTop: 5 }} onClick={this.showModal}> 버전 추가 </Button>
                </div>
                <Modal 
                    title="버전 추가" 
                    visible={this.state.visible} 
                    onOk={this.handleOk} 
                    onCancel={this.handleCancel}>
                    <ItemTable 
                        show="modal" 
                        getDataSource={this.dataSourceCallback} />
                    <div style={{ marginTop: "10px" }}>
                        <Form>
                            <FormItem>
                                <Input
                                    size="large"
                                    name="version"
                                    placeholder="버전명을 입력해주세요."
                                    value={this.state.version.value}
                                    onChange={event => this.handleInputChange(event)}
                                />
                            </FormItem>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default VersionAdd;