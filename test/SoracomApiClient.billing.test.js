
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
        
        console.log("suitesetup");
    })

    suiteTeardown(()=>{
        console.log("suiteTherdown")
    })

    test("getBillingLatest", (done)=>{
        target.getBillingLatest().then(result=>{
            assert.equal(true,'lastEvaluatedTime' in result);
            assert.equal(true,'amount' in result);
            done();
        }).catch(done,done);
    })

    test("Normal_getBillingWithDate", (done)=>{
        var yearManth = '201802'
        target.getBillingWithDate(yearManth).then(result =>{
            assert.equal(true, 'yearMonth' in result);
            assert.equal(true, 'amount' in result);
            done();
        }).catch(done,done);
    })

    test("Abnormal_InvalidDate_getBillingWithDate", ()=>{
        var abnormalYearManth = '000000'
        return target.getBillingWithDate(abnormalYearManth).then(result=>{
            assert.equal("Fail",result);
        }).catch((error)=>{
            assert.equal("Error: Invalid year month format. format:yyyyMM value:000000",error)
        });
    })

    test("Abnormal_FeatureDate_getBillingWithDate", ()=>{
        var abnormalYearManth = '205010'
        return target.getBillingWithDate(abnormalYearManth).then(result=>{
            assert.equal("Fail",result);
            
        }).catch((error)=>{
            assert.equal("Error: Bill not found.",error)
        });
    })

    teardown(()=>{
        console.log("therdown");
    })

});