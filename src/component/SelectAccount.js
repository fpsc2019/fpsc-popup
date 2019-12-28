import React, {Component} from 'react'
import {Modal, Select} from "antd";
import Axios from "../server";
// import Pullup from "pullup-js-sdk";
import seropp from 'sero-pp'

let tmpPkr = '';
let ajax = new Axios();
const {Option} = Select;

// var pullup = new Pullup();
// pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
let host = window.location.host;

let dapp = {
    name: "HAPY",
    contractAddress: "54uf2UU9Zf1mgyR25WFpogyMfkgQRJZJKzY6Rfy3nygmjSoBXFE6R8y2RyCeCc1T6aEmaKK8W3Gu6SY8KdTq54x9",
    github: "https://github.com/fpsc2019/fpsc-popup",
    author: "fpsc2019",
    url: host+"/fpsc-popup/",
    logo: host+"/fpsc-popup/logo.png",
};

class SelectAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountOptions: [],
            accounts: [],
        }
    }


    componentDidMount() {
        let that = this;
        seropp.init(dapp, function (res) {
            if(res){
                that.getAccounts();
            }
        });

    }

    handleOk = e => {
        let that = this;
        if (tmpPkr !== '') {
            let accounts = that.state.accounts;
            for (let ac of accounts) {
                if (ac.MainPKr === tmpPkr) {
                    that.props.selectAccount(ac);
                }
            }
        }
        that.props.hiddenAccount();
    };

    handleCancel = e => {
        let that = this;
        that.props.hiddenAccount();
    };

    onChange = (v) => {
        tmpPkr = v;
    }

    formatPK(pk) {
        return pk.slice(0, 10) + "...." + pk.slice(-10)
    }

    getAccounts() {
        let that = this;
        // let res = pullup.local.accountList()
        seropp.getAccountList(function (res) {
            if (res) {
                let dataArray = res;
                let i = 0;
                let tmpArr = [];
                for (let ac of dataArray) {
                    let acName = ac.Name;
                    i++;
                    if (!acName) {
                        acName = "Account" + i;
                    }
                    tmpArr.push(<Option value={ac.MainPKr} key={i}>{acName + " " + that.formatPK(ac.PK)}</Option>)
                }
                that.setState({
                    accountOptions: tmpArr,
                    accounts: dataArray
                })
            }
        });
    };

    render() {
        return (
            <Modal
                title="Select Account"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Select showSearch
                        style={{width: '98%'}}
                        placeholder="Select an account"
                        onChange={(v) => {
                            this.onChange(v);
                        }}
                >
                    {this.state.accountOptions}
                </Select>
            </Modal>
        )
    }
}


export default SelectAccount