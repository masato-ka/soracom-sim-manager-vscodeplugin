/**
[SimGroup]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

const vscode = require("vscode");

class SimGroup extends vscode.TreeItem{
    constructor(imsi, name, group, plan, speedClass, status) {
        super("["+name+"]:"+imsi);
        this.imsi = imsi;
        this.name = name;
        this.group = group;
        this.plan = plan;
        this.speedClass = speedClass;
        this.status = status;
        this.contextValue = "sim";
    }

}

exports.SimGroup =SimGroup; 