
const assert = require('assert')
const SoracomApiClient = require('../out/src/infrastructure/SoracomApiClient')
const vscode = require('vscode');
suite("SoracomApiClient Test", ()=>{

    var target = undefined
    setup(()=>{
        const settings = vscode.workspace.getConfiguration("soracom-sim-manager")
        target = new SoracomApiClient.SoracomApiClient(settings['sam-auth-key'],settings['sam-auth-secret-key']);
        console.log("setup");
    })

    suiteSetup(()=>{
//        console.log("suitesetup");
    })

    suiteTeardown(()=>{
//        console.log("suiteTherdown")
    })

    /**getStatsAirSubscriber */
    test("Normal01.getStatsAirSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01T00:00:00",to:"2018-02-05T00:00:00", period:"day"};
        return target.getStatsAirSubscriber(imsi,query).then(result=>{
            assert.equal(1, result.length);
        });
    })

    test("Normal02.getStatsAirSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01",to:"2018-02-05", period:"day"};
        return target.getStatsAirSubscriber(imsi,query).then(result=>{
            assert.equal(1, result.length);
        });
    })

    test("Abnorml01.getStatsAirSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01", period:"day"}
        return target.getStatsAirSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'to' is must property.",error);
        })
    })

    test("Abnorml02.getStatsAirSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {to:"2018-02-01", period:"day"}
        return target.getStatsAirSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'from' is must property.",error);
        })
    })

    test("Abnorml03.getStatsAirSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01", to:"2018-02-03"}
        return target.getStatsAirSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'period' is must property.",error);
        })
    })

    test("Abnorml04.getStatsAirSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01", to:"2018-02-03", period:"hoge"}
        return target.getStatsAirSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'period' should be month, day, minutes.",error);
        })
    })

    test("Abnorml05.getStatsAirSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"qweyui", to:"2018-02-03", period:"day"}
        return target.getStatsAirSubscriber(imsi, query).then(result=>{
            assert("Fail test", result);
        }).catch((error)=>{
            assert("Error: Bad request parameters. from",error);
        })
    })

    /**getStatsBeamSubscriber */
    test("Normal01.getStatsBeamSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01T00:00:00",to:"2018-02-05T00:00:00", period:"day"};
        return target.getStatsBeamSubscriber(imsi,query).then(result=>{
            assert.equal(1, result.length);
        });
    })

    test("Normal02.getStatsBeamSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01",to:"2018-02-05", period:"day"};
        return target.getStatsBeamSubscriber(imsi,query).then(result=>{
            assert.equal(1, result.length);
        });
    })

    test("Abnorml01.getStatsBeamSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01", period:"day"}
        return target.getStatsBeamSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'to' is must property.",error);
        })
    })

    test("Abnorml02.getStatsBeamSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {to:"2018-02-01", period:"day"}
        return target.getStatsBeamSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'from' is must property.",error);
        })
    })

    test("Abnorml03.getStatsBeamSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01", to:"2018-02-03"}
        return target.getStatsBeamSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'period' is must property.",error);
        })
    })

    test("Abnorml03.getStatsBeamSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"2018-02-01", to:"2018-02-03", period:"hoge"}
        return target.getStatsBeamSubscriber(imsi, query).then(result=>{
            assert.equal("Fail test", result);
        }).catch((error)=>{
            assert.equal("Error: Invalid query. 'period' should be month, day, minutes.",error);
        })
    })

    test("Abnorml04.getStatsBeamSubscriber", ()=>{
        var imsi = '440103197795859';
        var query = {from:"qweyui", to:"2018-02-03", period:"day"}
        return target.getStatsBeamSubscriber(imsi, query).then(result=>{
            assert("Fail test", result);
        }).catch((error)=>{
            assert("Error: Bad request parameters. from",error);
        })
    })

    teardown(()=>{
        console.log("therdown");
    })

});