/**
[SimTreeDataProvider]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

var vscode = require('vscode')
var _SoracomAirSim = require('./model/SoracomAirSim')
var SimManagerCommand = require('./commands/SimManager.js')
var path = require("path");
class SimTreeDataProvider{

    constructor(context,apiClient){
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.simManagerCommand = new SimManagerCommand.SimManager(context);
        this.apiClient = apiClient;
    }

    refresh(element){
        this._onDidChangeTreeData.fire(element);
    }

    getTreeItem(element){
        return element;
    }

    getChildren(element){
        if(!element){
       
            return new Promise(resolve=>{
                var resultList =[];
                this.apiClient.getSimList().then(result=>{
                    result.forEach(item => {
                        resultList.push(new _SoracomAirSim.SoracomAirSim(
                            item['imsi'], item['tags']['name'], 
                            item['groupId'], item['plan'], 
                            item['speedClass'], item['status'], this._getConnectionStatusIconPath(item)));
                    });
                    resolve(resultList);
                })
             });
        }else{
            
        }
    }

    getDefaultTreeItems() {
        const items= [];
        items.push(this.createCommandItem("label-sample", "command-sample"))
    }

    getErrorMessageTreeItems(item, error) {
        const items = [];
        items.push(new vscode.TreeItem(`Failed to list ${item}`));
        items.push(new vscode.TreeItem(`Error: ${error}`));
        return items;
    }
    createCommandItem(label, command) {
        const commandItem = new vscode.TreeItem(label);
        commandItem.command = {
            command,
            title: "",
        };
        return commandItem;
    }

    _getConnectionStatusIconPath(sim){
        if(sim['sessionStatus']['online']){
            return this.context.asAbsolutePath(path.join("resources", `sim-status-connection.svg`));
        }else{
            return this.context.asAbsolutePath(path.join("resources", `sim-status-disconnection.svg`));
        }
    }
}

exports.SimTreeDataProvider = SimTreeDataProvider;