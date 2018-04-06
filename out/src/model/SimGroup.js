/**
[SimGroup]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

const vscode = require("vscode");

class SimGroup extends vscode.TreeItem{
    constructor(groupId, name) {
        super(name);
        this.groupId = groupId;
        this.name = name;
        this.contextValue = "group";
    }

}

exports.SimGroup =SimGroup; 