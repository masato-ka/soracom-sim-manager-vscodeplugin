"use strict";

const vscode = require('vscode');

class SimManager{

    constructor(context,client){
        this.outputChannel = vscode.window.createOutputChannel("SoracomSimManager");
        this.context = context;
        this.client = client;
    }


    chooseSimList(sims){
        return new Promise(resolve=>{
            const chooseList =[];
            sims.forEach(item=>{    
                chooseList.push(item['imsi']+':'+item['tags']['name']);
            });
            resolve(chooseList);
        })
    }

    changeSpeed(imsi, list, description){
        return new Promise(resolve=>{
                        vscode.window.showQuickPick(list,{placeHolder: description}).then(result=>{
                            return this.client.updateSimSpeed(imsi,result);
                        }).then(result=>{resolve(result)})            
                    });
       
    }

    showResultToOutput(header, body){
        this.outputChannel.appendLine(header);
        this.outputChannel.append(JSON.stringify(body));
        this.outputChannel.show(true);
    }

    simDetailsUI(soracomAirSim){
                
        if(!soracomAirSim){
            this.client.getSimList().then(result=>{
                return this.chooseSimList(result);
            }).then(result=>{
                return vscode.window.showQuickPick(result, {placeHolder:"Select SIM"});
            }).then(result=>{
                const imsi = result.split(":")[0];
                return this.client.getSimDetails(imsi);
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][GET SIM Info]:", result);
            });
        }else{
            this.client.getSimDetails(soracomAirSim['imsi']).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][GET SIM Info]:", result);
                console.log(result);
            })
        }
    }

    changeSimSpeedUI(soracomAirSim){
        if(!soracomAirSim){
            this.client.getSimList().then(result=>{
                return this.chooseSimList(result);
            }).then(result=>{
                return vscode.window.showQuickPick(result, {placeHolder:"Select SIM"});
            }).then(result=>{
                var imsi = result.split(":")[0];
                return this.changeSpeed(imsi,["s1.minimum","s1.slow","s1.standard","s1.fast"], "Select new SIM speed");
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][CHANGE SIM Speed]:", result);
            })
        }else{
            this.changeSpeed(soracomAirSim['imsi']).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][CHANGE SIM Speed]:", result);
            })
        }
    }

    changeSimNickNameUI(soracomAirSim){
        if(!soracomAirSim){
            this.client.getSimList().then(result=>{
                return this.chooseSimList(result);
            }).then(result=>{
                return vscode.window.showQuickPick(result,{placeHolder:"Select SIM"})
            }).then(result=>{
                var imsi = result.split(":")[0];
                return new Promise(resolve=>{
                    vscode.window.showInputBox({placeHolder:"Input SIM name"}).then(result=>{
                        this.client.updateSimName(imsi,result).then(result=>{
                            resolve(result);
                        });
                    })
                })
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][CHANGE SIM NAME]:",result);
            });
        }else{
            vscode.window.showInputBox({placeHolder:"Input SIM name"}).then(result=>{
                return this.client.updateSimName(soracomAirSim['imsi'],result);
            }).then(result=>{                
                this.showResultToOutput("[SORACOM SIM Manager][CHANGE SIM NAME]:",result);
            })
        }
    }

    addNewTagsUI(soracomAirSim){
        if(!soracomAirSim){
            this.client.getSimList().then(result=>{
                return this.chooseSimList(result);
            }).then(result=>{
                return vscode.window.showQuickPick(result,{placeHolder:"Select SIM"})                
            }).then(result=>{
                var imsi = result.split(":")[0];
                return new Promise(resolve=>{
                    vscode.window.showInputBox({placeHolder:"Input tags example:[{\"tagName\":\"name\",\"tagValue\":\"value\"}]"})
                    .then(result=>{
                        this.client.addNewTags(imsi,JSON.parse(result)).then(result=>{
                            resolve(result);
                        });
                    });
                })
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][ADD TAGS]:", result);
            })
        }else{
            var imsi = soracomAirSim['imsi'];
            vscode.window.showInputBox({placeHolder:"Input tags example:[{\"tagName\":\"name\",\"tagValue\":\"value\"}]"})
            .then(result=>{
                return this.client.addNewTags(imsi,JSON.parse(result));
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][ADD TAGS]:", result);
            })
        }
    }

    deleteTagsUI(soracomAirSim){
        if(!soracomAirSim){
            this.client.getSimList().then(result=>{
                return this.chooseSimList(result)
            }).then(result=>{
                return vscode.window.showQuickPick(result,{placeHolder:"Select SIM"})                
            }).then(result=>{
                var imsi = result.split(":")[0];
                return new Promise(resolve=>{
                    vscode.window.showInputBox({placeHolder:"Input tags key for delete."}).then(result=>{
                        this.client.deleteTag(imsi, result).then(result=>{
                            resolve(result);
                        })
                    })
                });
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][DELETE TAGS]:",result);
            })
        }else{
            var imsi = soracomAirSim['imsi'];
            vscode.window.showInputBox({placeHolder:"Input tags key for delete."}).then(result=>{
                return this.client.deleteTag(imsi,result);
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][DELETE TAGS]:",result);
            })
        }
    }

    getSoracomAirStats(soracomAirSim){
        if(!soracomAirSim){
            this.client.getSimList().then(result=>{
                return this.chooseSimList(result);
            }).then(result=>{
                return vscode.window.showQuickPick(result,{placeHolder:"Select SIM"})
            }).then(result=>{
                var imsi = result.split(":")[0];
                return new Promise(resolve=>{
                    vscode.window.showInputBox({placeHolder:"Input query {from:yyyy-MM-ddTHH:mm:ss,to:yyyy-MM-ddTHH:mm:ss,period:minutes}"})
                        .then(result=>{
                            try{
                                var query = JSON.parse(result);
                                return this.client.getStatsAirSubscriber(imsi,query);
                            }catch(SyntaxError){
                                vscode.window.showErrorMessage("failed parse query");
                            }
                        }).then(result=>{
                            resolve(result);
                        })
                })
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][SIM Stats]", result);
            })
        }else{
            var imsi = soracomAirSim['imsi'];
            vscode.window.showInputBox({placeHolder:"Input query {from:yyyy-MM-ddTHH:mm:ss,to:yyyy-MM-ddTHH:mm:ss,period:minutes}"})
            .then(result=>{
                try{
                    var query = JSON.parse(result);
                    return this.client.getStatsAirSubscriber(imsi,query);
                }catch(SyntaxError){
                    vscode.window.showErrorMessage("failed parse query");
                }
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][SIM Stats]", result);
            })
        }
    }

    getSoracomBeamStats(soracomAirSim){
        if(!soracomAirSim){
            this.client.getSimList().then(result=>{
                return this.chooseSimList(result);
            }).then(result=>{
                return vscode.window.showQuickPick(result,{placeHolder:"Select SIM"})
            }).then(result=>{
                var imsi = result.split(":")[0];
                return new Promise(resolve=>{
                    vscode.window.showInputBox({placeHolder:"Input query {from:yyyy-MM-ddTHH:mm:ss,to:yyyy-MM-ddTHH:mm:ss,period:minutes}"})
                        .then(result=>{
                            try{
                                var query = JSON.parse(result);
                                return this.client.getStatsBeamSubscriber(imsi,query);
                            }catch(SyntaxError){
                                vscode.window.showErrorMessage("failed parse query");
                            }
                        }).then(result=>{
                            resolve(result);
                        })
                })
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][Beam Stats]", result);
            })
        }else{
            var imsi = soracomAirSim['imsi'];
            vscode.window.showInputBox({placeHolder:"Input query {from:yyyy-MM-ddTHH:mm:ss,to:yyyy-MM-ddTHH:mm:ss,period:minutes}"})
            .then(result=>{
                try{
                    var query = JSON.parse(result);
                    return this.client.getStatsBeamSubscriber(imsi,query);
                }catch(SyntaxError){
                    vscode.window.showErrorMessage("failed parse query");
                }
            }).then(result=>{
                this.showResultToOutput("[SORACOM SIM Manager][Beam Stats]", result);
            })
        }
    }


}

exports.SimManager = SimManager;