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
            this.showResultToOutput()
        }).catch(error=>{

        })
    }

    showResultToOutput(header, body){
        this.outputChannel.appendLine(header);
        this.outputChannel.append(JSON.stringify(body));
        this.outputChannel.show(true);
    }


}

exports.Groupmanager = GroupManager