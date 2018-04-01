# soracom-sim-manager-vscode README

This is SORACOM API 3rd party integration plugin for VSCode. You can managed soracom service via API that provide soracom.


## Features


## Requirements

### 3rd party dependency library

* [SORACOM API client for Node.js](https://github.com/tatsuyaoiw/soracom)

## Extension Settings

After install this plugin, you should be  setting auth info to user setting file of VSCode.

For example:

This extension need the following settings:

 * "soracom-sim-manager.sam-auth-key": <SAM user auth key>
 * "soracom-sim-manager.sam-auth-secret-key": <SAM user auth secret key>

> Tip: In this plugin, recommend use SAM user because security reason. please see the [https://dev.soracom.io/jp/docs/sam_permission/](https://dev.soracom.io/jp/docs/sam_permission/) for create and setting SAM user.

## Known Issues

If you happen some issue please [create new issue](https://github.com/masato-ka/soracom-sim-manager-vscodeplugin/issues/new) .

## Release Notes


### 0.3.0

Initial release of basic sim management function as below.

* Get sim list
* Get detail of each sim
* Change sim name and speed
* Modify sim tags
* watch stats of each sim.
* watch bill of SORACOM.

# LICENSE

This software is released under the MIT License, see LICENSE.txt file.

