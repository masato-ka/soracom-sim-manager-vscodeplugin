"user strict";
const _soracom = require("soracom");

class SoracomApiClient{

    constructor(authKeyId, authKey){
        this.authKeyId = authKeyId;
        this.authKey =authKey;
        this.soracom = new _soracom();
        this.authenticated = false;
    }

    _authentication(_authKeyId, _authKey){
        return new Promise(resolve=>{
            this.soracom.post("/auth",{authKeyId:_authKeyId, authKey:_authKey},function(err,req,body){
                resolve(body);
            });
        })
    }

    authentication(_authKeyId, _authKey){
        return new Promise(resolve=>{
            if(this.authenticated){
                console.log("Already authentication.")
                resolve(true);
            }else{
            this._authentication(_authKeyId, _authKey).then(result=>{
                console.log("Get authentication info");
                this.soracom.defaults({
                    apiKey: result['apiKey'],
                    token: result['token'],
                    operatorId: result['operatorId']
                })
                this.authenticated=true;
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

    getSimDetails(imsi){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/subscribers/" + imsi, function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    updateSimSpeed(imsi,speed){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("/subscribers/" + imsi + '/update_speed_class', {speedClass:speed},function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    deleteSimSession(imsi){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("/subscribers/"+ imsi +"/delete_session", function(err,req,body){
                    resolve(body);
                })
            })
        });
    }

    updateSimName(imsi,simName){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.put("/subscribers/"+imsi+"/tags",[{tagName:"name", tagValue:simName}],function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    addNewTags(imsi,tags){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.put("/subscribers/"+imsi+"/tags",tags,function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    deleteTag(imsi,tagName){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/subscribers/"+imsi+"/tags/"+tagName,function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    updateGrop(imsi, groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("subscribers/"+imsi+"/set_group", {groupId:groupId},function(err,req,body){
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

    deleteGroup(groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/groups"+groupId, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    getGroupDetails(groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/groups/"+groupId, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    updateGroupConfiguration(groupId, namespace, config){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.put("/groups/"+groupId+"/configuration/"+namespace,config,function(err,req,body){
                    resolve(body)
                })
            })
        })
    }

    delteGroupConfiguration(groupId, namespace, name){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/groups/"+groupId+"/configuration/"+namespace+"/"+name,function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    getSubscriberDependsOnGroup(groupId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/groups/"+groupId+"/subscribers",function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    updateGroupTags(groupId,tags){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.put("/groups/"+groupId+"/tags",tags, function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    deleteGroupTag(groupId, tagName){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId,this.authKey).then(result=>{
                this.soracom.delete("/groups/"+groupId+"/tags/"+tagName, function(err,req,body){
                    resolve(body);
                })
            })
        })
    }

    /**Credential */

    getCredentials(){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/credentials",function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    deleteCredential(credentialId){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.delete("/credentials/"+credentialId,function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    createNewCredential(credentialId, _description, serviceType, credential){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.post("/credentials/"+credentialId, {credentials:credential,
                                                                description:_description,
                                                                type:serviceType}, function(err,req,body){
                    resolve(body);
                });
            });
        });
    }

    updateCredential(credentialId, _description, serviceType, credential){
        return new Promise(resolve=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.put("/credentials/"+credentialId, {credentials:credential,
                                                                description:_description,
                                                                type:serviceType}, function(err,req,body){
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
            var from = Date.parse(query['from']).toString().slice(0,-3);
            var to = Date.parse(query['to']).toString().slice(0,-3);
            var period = query['period'];
            if(!(period in {'month':'','day':'','minutes':''})){
                reject(new Error("Invalid query. 'period' should be month, day, minutes."));return;
            }  
            var apiUri = "/stats/air/subscribers/" + imsi + 
                "/?from=" + from + "&to=" + to + "&period=" + period;
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get(apiUri,function(err,req,body){
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
            var from = Date.parse(query['from']).toString().slice(0,-3);
            var to = Date.parse(query['to']).toString().slice(0,-3);
            var period = query['period'];
            if(!(period in {'month':'','day':'','minutes':''})){
                reject(new Error("Invalid query. 'period' should be month, day, minutes."));return;
            }  
            var apiUri = "/stats/beam/subscribers/" + 
            imsi +"/?from="
            +from+"&to="+to+"&period="+period;
        
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get(apiUri,function(err,req,body){
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

    getBillingWithDate(yearMonth){
        return new Promise((resolve, reject)=>{
            this.authentication(this.authKeyId, this.authKey).then(result=>{
                this.soracom.get("/bills/"+yearMonth, function(err,req,body){
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
