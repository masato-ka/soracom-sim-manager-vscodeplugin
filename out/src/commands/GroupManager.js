/**
[GroupManager]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

"use strict";

const vscode = require('vscode');

class GroupManager{

   constructor(context,client){
        this.outputChannel = vscode.window.createOutputChannel("SoracomSimManager");
        this.context = context;
        this.client = client;

    }

    getGroupList(){
        this.client.getGroups().then(result=>{
            const groupList = []
            result.forEach(result=>{
                groupList.push({groupId:result['groupId'],groupName:result['tags']['name']});
            })
            this.showResultToOutput("[SORACOM SIM Manager][Group list]:", groupList)
        }).catch(error=>{
            vscode.window.showErrorMessage(error);
        })
    }

    getGroupDetails(){
        this._commandHandler("Get group details", "_requestGroupDetails");    
    }

    showResultToOutput(header, body){
        this.outputChannel.appendLine(header);
        this.outputChannel.append(JSON.stringify(body));
        this.outputChannel.show(true);
    }


    _commandHandler(commandHeader, requestFunctionName){
        this._getGroupIds().then(result=>{
            return this[requestFunctionName](result);
        }).then(result=>{
            this.showResultToOutput("[SORACOM SIM Manager]["+commandHeader+"]:", result);
        }).catch(error=>{
            vscode.window.showErrorMessage(error);
        })
    }

    _getGroupIds(){
        return new Promise((resolve,reject)=>{
            this.client.getGroups().then(result=>{
                return this._formatGroupList(result);
            }).then(result=>{
                var chooseList = [];
                result.forEach(group=>{
                    chooseList.push("["+group['groupName']+"]:"+group['groupId']);
                })
                return vscode.window.showQuickPick(
                    chooseList, {placeHolder:"Choose Group"}
                )
            }).then(result=>{
                var groupId = result.split(':')[1];
                if(!groupId || groupId === ''){return reject(new Error('Need GroupId.'))}
                resolve(groupId);
            }).catch(error=>{
                reject(error['message']);
            });
        });
    }

    _requestGroupDetails(groupId){
        return new Promise((resolve, reject)=>{
            this.client.getGroupDetails(groupId).then(result=>{
                resolve(result);
            }).catch(error=>{
                reject(error['message']);
            })
        })
    }

    _formatGroupList(groupList){
        return new Promise((resolve,reject)=>{
            const formatedGroupList = []
            groupList.forEach(group=>{
                    formatedGroupList.push({groupId:group['groupId'],groupName:group['tags']['name']}); 
                })
                resolve(formatedGroupList);
        })
    }

}

exports.GroupManager = GroupManager;