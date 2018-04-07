/**
[SoracomApiClient]

Copyright (c) [2018] [Masato Kawamura]

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

"user strict";
const _soracom = require("soracom");

class SoracomApiClient{

    constructor(authKeyId, authKey){
        this.authKeyId = authKeyId;
        this.authKey =authKey;
        this.apiKey = "";
        this.token = "";
        this.soracom = new _soracom();
        this.authenticated = false;
        this.expireDate = new Date(new Date().getTime()); 
    }

    _atob(str) { 
        //See http://phiary.me/node-js-btoa-atob/
        return new Buffer(str, 'base64').toString('binary');
    }

    _decodeJWT(jwt){
        const jwtBody = jwt.split(".")[1];
        const decodeStr = this._atob(jwtBody.replace(/\-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodeStr)
    }

    _getExpDate(jwt){
        const jwtBodyObject = this._decodeJWT(jwt);
        return new Date(jwtBodyObject['exp']* 1000);
    }

    _authentication(_authKeyId, _authKey){
        return new Promise(resolve=>{
            this.soracom.post("/auth",{authKeyId:_authKeyId, authKey:_authKey},function(err,req,body){
                resolve(body);
            });
        })
    }
    //The interim solution for problem  that about soracom library take over previous request body. 
    //Create new instance of soracom library with each request.
    authentication(_authKeyId, _authKey){
        var self = this;
        this.soracom = new _soracom();
        return new Promise((resolve)=>{
            var now = new Date( new Date().getTime()); 
            if(self.authenticated && (self.expireDate.getTime() > now.getTime())){
                console.log("Already authentication.")
                this.soracom.defaults({apiKey:self.apiKey, token:self.token})
                resolve(true);
            }else{
                self._authentication(_authKeyId, _authKey).then(result=>{
                    console.log("Get authentication info");
                    self.apiKey = result['apiKey'];
                    self.token = result['token'];
                    self.soracom.defaults({
                        apiKey: self.apiKey,
                        token: self.token,
                        operatorId: result['operatorId']
                    })
                    self.expireDate = self._getExpDate(result['token']);
                    self.authenticated=true;
                    resolve(true);
                });
            }
        });
    }

    getSimList(){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId,this.authKey).then(result=>{
                this.soracom.get("/subscribers",function(err, req, body){
                    resolve(body);
                })
            })
        });
    }

    getSimDetails(_imsi){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/subscribers/:imsi", {imsi:_imsi},function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    updateSimSpeed(_imsi,speed){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("/subscribers/:imsi/update_speed_class", {imsi:_imsi, speedClass:speed},
                    function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    deleteSimSession(_imsi){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("/subscribers/:imsi/delete_session", function(err,req,body){
                    resolve(body);
                })
            })
        });
    }

    updateSimName(_imsi,simName){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.defaults({ imsi: _imsi });
                this.soracom.put("/subscribers/:imsi/tags",[{tagName:"name", tagValue:simName}],
                    function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    addNewTags(_imsi,tags){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.defaults({ imsi: _imsi });
                this.soracom.put("/subscribers/:imsi/tags",tags,function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    deleteTag(_imsi,_tagName){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/subscribers/:imsi/tags/:tagName",{imsi:_imsi, tagName:_tagName},
                    function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    updateGropToSIM(_imsi, _groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("subscribers/:imsi/set_group", {imsi:_imsi, groupId:_groupId},function(err,req,body){
                    resolve(body);
                })
            })
        })
    }
    
    /*Group API */
    getGroups(){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/groups", function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    createNewGroup(groupName){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("/groups",{tags:{name:groupName}}, function(err,req,body){
                    resolve(body)
                });
            });
        });
    }

    deleteGroup(_groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/groups/:groupId", {groupId:_groupId}, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    getGroupDetails(_groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/groups/:groupId", {groupId:_groupId}, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    updateGroupConfiguration(_groupId, _namespace, config){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                config['groupId']=_groupId;
                config['namespace']=_namespace;
                this.soracom.put("/groups/:groupId/configuration/:namespace",config,function(err,req,body){
                    resolve(body)
                })
            })
        })
    }

    delteGroupConfiguration(_groupId, _namespace, _name){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/groups/:groupId/configuration/:namespace/:name", 
                    {groupId:_groupId, namespace:_namespace, name:_name},function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    getSubscriberDependsOnGroup(_groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/groups/:groupId/subscribers", {groupId:_groupId},function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    updateGroupTags(_groupId,tags){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                tags['groupId'] = _groupId;
                this.soracom.put("/groups/:groupId/tags",tags, function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    deleteGroupTag(_groupId, _tagName){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId,this.authKey).then(result=>{
                this.soracom.delete("/groups/:groupId/tags/:tagName", {groupId:_groupId, tagName:_tagName}, 
                    function(err,req,body){
                        resolve(body);
                })
            })
        })
    }

    /**Credential */

    getCredentials(){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/credentials", function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    deleteCredential(_credentialId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/credentials/:credentialId", {credentialId:_credentialId}, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    createNewCredential(_credentialId, _description, _serviceType, _credential){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("/credentials/:credentialId", {credentialId:_credentialId,
                                                                credentials:_credential,
                                                                description:_description,
                                                                type:_serviceType}, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    updateCredential(_credentialId, _description, _serviceType, _credential){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.put("/credentials/:credentialId", {credentialId:_credentialId,
                                                                credentials:_credential,
                                                                description:_description,
                                                                type:_serviceType}, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }


    /* Stats API*/
    getStatsAirSubscriber(imsi,query){
        
        return new Promise((resolve,reject)=>{
            if(!('from' in query)){
                reject(new Error("Invalid query. 'from' is must property."));
                return;
            }

            if(!('to' in query)){
                reject(new Error("Invalid query. 'to' is must property."));
                return;
            }

            if(!('period' in query)){
                reject(new Error("Invalid query. 'period' is must property."));
                return;
            }
            query['from'] = Date.parse(query['from']).toString().slice(0,-3);
            query['to'] = Date.parse(query['to']).toString().slice(0,-3);
            if(!(query['period'] in {'month':'','day':'','minutes':''})){
                reject(new Error("Invalid query. 'period' should be month, day, minutes."));return;
            }
            query['imsi'] = imsi;
            var apiUri = "/stats/air/subscribers/:imsi" 
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get(apiUri, query, function(err,req,body){
                    if(err){
                        reject(new Error(err['message']));
                        return;
                    }
                    resolve(body);
                })
            })
        })
    }

    getStatsBeamSubscriber(imsi, query){
        return new Promise((resolve,reject)=>{
            if(!('from' in query)){
                reject(new Error("Invalid query. 'from' is must property."));
                return;
            }

            if(!('to' in query)){
                reject(new Error("Invalid query. 'to' is must property."));
                return;
            }

            if(!('period' in query)){
                reject(new Error("Invalid query. 'period' is must property."));
                return;
            }
            query['from'] = Date.parse(query['from']).toString().slice(0,-3);
            query['to'] = Date.parse(query['to']).toString().slice(0,-3);
            if(!(query['period'] in {'month':'','day':'','minutes':''})){
                reject(new Error("Invalid query. 'period' should be month, day, minutes."));return;
            }  
            query['imsi'] = imsi;
            var apiUri = "/stats/beam/subscribers/:imsi";
            
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get(apiUri,query,function(err,req,body){
                    if(err){
                        reject(new Error(err['message']));
                        return;
                    }
                    resolve(body);
                })
            })
        })
    }

    /**Billing API */

    getBillingWithDate(_yearMonth){
        return new Promise((resolve, reject)=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/bills/:yearMonth", {yearMonth:_yearMonth}, function(err,req,body){
                    if(err){
                        reject(new Error(err['message']));
                        return
                    }
                    resolve(body);
                });
            });
        });
    }

    getBillingLatest(){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/bills/latest", function(err,req,body){
                    resolve(body);
                });
            });
        });
    }


}

exports.SoracomApiClient = SoracomApiClient;
/*

*/
