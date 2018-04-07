/**
[GroupManager]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

"use strict";

const vscode = require('vscode');
const SimGroup = require('../model/SimGroup');

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

    getGroupDetails(simGroup){
        this._commandHandler(simGroup,"Get group details", "_requestGroupDetails");    
    }

    createGroup(){
        var simGroup = new SimGroup.SimGroup("12345678", 'dummyGroup');//This is dummy group for Not show select GroupUI.
        this._commandHandler(simGroup,"Create group list", "_requestCreateGroup");
    }

    deleteGroup(simGroup){
        this._commandHandler(simGroup, "Delete group", "_requestDeleteGroup");
    }

    updateGroupTags(simGroup){
        this._commandHandler(simGroup, "Update group tags", "_requestGroupTags");
    }

    deleteGroupTags(simGroup){
        this._commandHandler(simGroup, "Delete group tags","_requestDeleteGroupTag");
    }

    showResultToOutput(header, body){
        this.outputChannel.appendLine(header);
        this.outputChannel.append(JSON.stringify(body));
        this.outputChannel.show(true);
    }

    _commandHandler(_simGroup, commandHeader, requestFunctionName){
        this._getGroupId(_simGroup).then(result=>{
            return this[requestFunctionName](result);
        }).then(result=>{
            this.showResultToOutput("[SORACOM SIM Manager]["+commandHeader+"]:", result);
        }).catch(error=>{
            console.log(error);
            if(!error){
                vscode.window.showErrorMessage("Faild requester message");                
            }else{
                vscode.window.showErrorMessage(error);
            }
        })
    }

    _getGroupId(_simGroup){
        return new Promise((resolve,reject)=>{
            if(!_simGroup){
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
                    if(!groupId || groupId === ''){return reject(new Error("Not found Group ID"))}
                    resolve(groupId);
                }).catch(error=>{
                    reject(error['message']);
                });
            }else{
                try{
                    var simGroupId = _simGroup['groupId'];
                    if(!simGroupId){
                        return reject(new Error("Not found Group ID"));
                     }
                     resolve(simGroupId);
                }catch(e){
                    return reject(new Error("Not found Group ID"))
                }
            }
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

    _requestCreateGroup(){
        return new Promise((resolve,reject)=>{
            vscode.window.showInputBox({placeHolder:"Input group name."}).then(result=>{
                this.client.createNewGroup(result).then(result=>{
                    resolve(result);
                }).catch(error=>{
                    reject(error['message']);
                });
            });
        });
    }

    _requestDeleteGroup(groupId){
        return new Promise((resolve, reject)=>{
            this.client.deleteGroup(groupId).then(result=>{
                resolve(result);
            }).catch(error=>{
                reject(error['message']);
            })
        })
    }

    _requestGroupTags(groupId){
        return new Promise((resolve, reject)=>{
            vscode.window.showInputBox({placeHolder:"Input tag[{\"tagName\":\"name\", \"tagValue\":\"value\"},.....]"})
                .then(result=>{
                    var tags = JSON.parse(result);
                    this.client.updateGroupTags(groupId, tags).then(result=>{
                        resolve(result);
                    }).catch(error=>{
                        reject(error["message"]);
                    })
                })
        })
    }

    _requestDeleteGroupTag(groupId){
        return new Promise((resolve, reject)=>{
            vscode.window.showInputBox({placeHolder:"input delte tag name."}).then(result=>{
                this.client.deleteGroupTag(groupId, result).then(result=>{
                    resolve(result);
                }).catch(error=>{
                    reject(error["message"]);
                })
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