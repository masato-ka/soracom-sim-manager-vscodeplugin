/**
[BillManager]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
const vscode = require('vscode');

class BillManager{

    constructor(context, client){
        this.context = context;
        this.client = client;
    }

    getBillWithDateUI(){
        vscode.window.showInputBox({placeHolder:"Input date yyyyMM"}).then(result=>{
            return this.client.getBillingWithDate(result);
        }).then(result=>{
            vscode.window.showInformationMessage("["+result['yearMonth']+"]:"+result['amount']+"yen");
        });
    }

    getLatestBill(){
        this.client.getBillingLatest().then(result=>{
            vscode.window.showInformationMessage(result['amount']+"yen");
        })
    }
}

exports.BillManager = BillManager;
