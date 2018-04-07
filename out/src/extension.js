/**
[extension]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

"use strict";

const vscode = require('vscode');
const _simTreeDataProvider = require('./SimTreeDataProvider');
const SimManagerCommand = require('./commands/SimManager');
const GroupManagerCommand = require('./commands/GroupManager');
const BillManagerCommand = require('./commands/BillManager');
const SoracomApiClient = require("./infrastructure/SoracomApiClient");

function activate(context) {
    console.log('Congratulations, your extension "soracom-sim-manager-vscode" is now active!');

    const settings = vscode.workspace.getConfiguration("soracom-sim-manager");
    const client = new SoracomApiClient.SoracomApiClient(settings['sam-auth-key'], settings['sam-auth-secret-key']);
    const simTreeDataProvider = new _simTreeDataProvider.SimTreeDataProvider(context, client);
    const simManagerCommand = new SimManagerCommand.SimManager(context, client);
    const groupManagerCommand = new GroupManagerCommand.GroupManager(context, client);
    const billManagerCommand = new BillManagerCommand.BillManager(context, client);

    context.subscriptions.push(vscode.window.registerTreeDataProvider("soracomSimManager", simTreeDataProvider));
    context.subscriptions.push(vscode.commands.registerCommand("soracom.sim.refresh", (element) => {
        simTreeDataProvider.refresh(element);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.details', function(currentSim){
        simManagerCommand.simDetailsUI(currentSim);  
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.change.speed', function(currentSim){
        simManagerCommand.changeSimSpeedUI(currentSim);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.change.name', function(currentSim){
        simManagerCommand.changeSimNickNameUI(currentSim);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.add.tags', function(currentSim){
        simManagerCommand.addNewTagsUI(currentSim);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.delete.tag',function(currentSim){
        simManagerCommand.deleteTagsUI(currentSim);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.stats.air', function(currentSim){
        simManagerCommand.getSoracomAirStats(currentSim);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.stats.beam', function(currentSim){
        simManagerCommand.getSoracomAirStats(currentSim);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.group.list', function(){
        groupManagerCommand.getGroupList();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.gorup.details', function(simGroup){
        groupManagerCommand.getGroupDetails(simGroup);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.gorup.create', function(){
        groupManagerCommand.createGroup();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.gorup.delete', function(simGroup){
        groupManagerCommand.deleteGroup(simGroup);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.gorup.tags.update', function(simGroup){
        groupManagerCommand.updateGroupTags(simGroup);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.bill', function(){
        billManagerCommand.getBillWithDateUI();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('soracom.sim.bill-latest', function(){
        billManagerCommand.getLatestBill();
    }));
    
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;