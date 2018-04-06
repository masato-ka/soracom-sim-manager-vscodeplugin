/**
[SimManager]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

"use strict";

const vscode = require('vscode');

class SimManager{

    constructor(context,client){
        this.outputChannel = vscode.window.createOutputChannel("SoracomSimManager");
        this.context = context;
        this.client = client;
    }

    simDetailsUI(soracomAirSim){
        this._commandHandler(soracomAirSim, "Get sim info", "_requestSimDetails");     
    }

    changeSimSpeedUI(soracomAirSim){
        this._commandHandler(soracomAirSim, "Change sim speed", "_requestChangeSpeed");
    }

    changeSimNickNameUI(soracomAirSim){
        this._commandHandler(soracomAirSim, "Change sim name",'_requestChangeSimNickName');
    }
    
    addNewTagsUI(soracomAirSim){
        this._commandHandler(soracomAirSim, "Add new tags",'_requestAddNewTags');
    }

    deleteTagsUI(soracomAirSim){
        this._commandHandler(soracomAirSim, "Delete tags", "_requestDeleteTag");
    }

    getSoracomAirStats(soracomAirSim){
        this._commandHandler(soracomAirSim, "SIM Stats", "_requestSoracomAirStats");
    }

    getSoracomBeamStats(soracomAirSim){
        this._commandHandler(soracomAirSim, "Beam Stats", "_requestSoracomBeamStats");
    }

    _commandHandler(soracomAirSim, commandHeader, requestFunctionName){
        this._getImsi(soracomAirSim).then(result=>{
            return this[requestFunctionName](result);
        }).then(result=>{
            this.showResultToOutput("[SORACOM SIM Manager]["+commandHeader+"]:", result);
        }).catch(error=>{
            vscode.window.showErrorMessage(error);
        })
    }

    _getImsi(soracomAirSim){
        return new Promise((resolve,reject)=>{
            if(!soracomAirSim){
                this.client.getSimList().then(result=>{
                    return this.formatSimList(result);
                }).then(result=>{
                    return vscode.window.showQuickPick(result,{placeHolder:"Select SIM"})
                }).then(result=>{
                    var imsi = result.split(":")[0];                    
                    if(imsi===""){
                        return reject(new Error('Not found IMSI number.'));
                    }
                    resolve(imsi)
                })
            }else{
                try{
                    var imsi = soracomAirSim['imsi'];
                    if(imsi===""){
                        return reject(new Error('Not found IMSI number.'));
                    }
                    resolve(imsi);
                }catch(e){
                    return resolve(new Error('Not found IMSI number.'));
                }
            }
        })
    }

    _requestSimDetails(imsi){
        return new Promise((resolve,reject)=>{
            this.client.getSimDetails(imsi)
            .then(result=>{
                resolve(result);
            }).catch(error=>{
                return reject(error['message']);
            })
        })
    }

    _requestChangeSpeed(imsi){
        return new Promise((resolve,reject)=>{
                        vscode.window.showQuickPick(["s1.minimum","s1.slow","s1.standard","s1.fast"],
                            {placeHolder: "Select new SIM speed"}).then(result=>{
                                this.client.updateSimSpeed(imsi,result)
                                .then(result=>{
                                    resolve(result);
                                }).catch(error=>{
                                    return reject(error['message']);
                                })
                        })    
                    });
       
    }

    _requestChangeSimNickName(imsi){
        return new Promise((resolve,reject)=>{
            vscode.window.showInputBox({placeHolder:"Input SIM name"}).then(result=>{
                this.client.updateSimName(imsi,result).then(result=>{
                    resolve(result);
                }).catch(error=>{
                    return reject(error['message']);
                })
            })
        })
    }

    _requestAddNewTags(imsi){
        return new Promise((resolve,reject)=>{
            vscode.window.showInputBox({placeHolder:"Input tags example:[{\"tagName\":\"name\",\"tagValue\":\"value\"},...]"})
            .then(result=>{
                this.client.addNewTags(imsi,JSON.parse(result)).then(result=>{
                    resolve(result);
                }).catch(error=>{
                    return reject(error['message']);
                })
            });
        })
    }

    _requestDeleteTag(imsi){
        return new Promise((resolve,reject)=>{
            vscode.window.showInputBox({placeHolder:"Input tags key for delete."}).then(result=>{
                this.client.deleteTag(imsi, result).then(result=>{
                    resolve(result);
                }).catch(error=>{
                    return reject(error['message']);
                })
            })
        });
    }

    _requestSoracomAirStats(imsi){
        return new Promise((resolve,reject)=>{
            vscode.window.showInputBox(
                {placeHolder:"Input query {from:yyyy-MM-ddTHH:mm:ss,to:yyyy-MM-ddTHH:mm:ss,period:minutes}"})
                    .then(result=>{
                        try{
                            var query = JSON.parse(result);
                            return this.client.getStatsAirSubscriber(imsi,query)
                                .catch(error=>{
                                    console.log('error');
                                    return reject(error['message']);
                                });
                        }catch(SyntaxError){
                            return reject(new Error("Failed parse query: " + result))
                        }
                    }).then(result=>{
                        resolve(result);
                    })
        })
    }

    _requestSoracomBeamStats(imsi){
        return new Promise((resolve,reject)=>{
            vscode.window.showInputBox(
                {placeHolder:"Input query {from:yyyy-MM-ddTHH:mm:ss,to:yyyy-MM-ddTHH:mm:ss,period:minutes}"})
                    .then(result=>{
                        try{
                            var query = JSON.parse(result);
                            return this.client.getStatsBeamSubscriber(imsi,query)
                                .catch(error=>{
                                    console.log('error');
                                    reject(error['message']);
                                });
                        }catch(SyntaxError){
                            return reject(new Error("Failed parse query: " + result))
                        }
                    }).then(result=>{
                        resolve(result);
                    })
        })
    }

    formatSimList(sims){
        return new Promise(resolve=>{
            const chooseList =[];
            sims.forEach(item=>{    
                chooseList.push(item['imsi']+':'+item['tags']['name']);
            });
            resolve(chooseList);
        })
    }

    showResultToOutput(header, body){
        this.outputChannel.appendLine(header);
        this.outputChannel.append(JSON.stringify(body));
        this.outputChannel.show(true);
    }

}

exports.SimManager = SimManager;