

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