/**
 * Created by wk on 2016/11/22.
 */
var express = require('express') //加载模块
var app = express() //实例化
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
var settings = require('./settings')

app.get('/rest',function(req, res){  //Restful Get方法,查找一个单一资源
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    if(settings.responseStatusCode == '200'){
        res.send(settings.responseBody);
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})


//发送Q消息
app.post('/queues/QAChargeQueue/messages',function(req, res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    console.log(req);
    console.log("mock");
    res.sendStatus(settings.responseStatusCode1);
})



//统一转发账户系统
function sendaccount(type,pth,reqbody,user){
    if(type =='old'){
        var ippath = settings.acctip + pth;
    }else{
    var ippath = settings.newAcctIP + pth;
    }

    console.log(ippath);
    var request = require('sync-request');
    var rep = request('POST', ippath, {
        json:reqbody
    });
    var user = JSON.parse(rep.getBody('utf8'));
    return user;
}


//新账户查询
app.post('/Account/acctQuery', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户查询/Account/acctQuery")
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
        if(req.param('acctType') == 'AA' ){
            res.send({
                "accessor": "PTC",
                "requestId":  req.param('requestId'),
                "returnCode": "000000",
                "returnMsg": "SUCCESS",
                "extension": null,
                "memo": null,
                "userId": req.param('userId'),
                "acctList": null
            })
            //res.sendStatus(settings.responseStatusCode1);
        }else if(req.param('userId') == '123123'){
            res.send({
                "accessor": "PTC",
                "requestId": req.param('requestId'),
                "returnCode": "000000",
                "returnMsg": "SUCCESS",
                "extension": null,
                "memo": null,
                "userId": req.param('userId'),
                "acctList": [
                    {
                        "acctId": req.param('userId'),
                        "acctType":  req.param('acctType'),
                        "balance": 0,
                        "availableBalance": 100.50,
                        "frozenBalance": 8.88,
                        "status": null,
                        "openTime": "",
                        "activeTime": null,
                        "frozenTime": null,
                        "closeTime": null
                    }
                ]
            })
        }//else if(req.param('userId')=='1231231'){
	//	res.sendStatus(settings.responseStatusCode);
	else{
            var user = sendaccount('new','/Account/acctQuery',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})


//新账户冰结--信用账户
app.post('/CreditAccount/creditFundFrozen', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户冰结--信用账户/CreditAccount/creditFundFrozen")
    console.log(req.body);
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    console.log(dateString);
    if(settings.responseStatusCode == '200'){
        if(req.param('amount') == '1.01' ){res.send({"returnCode":"010005","returnMsg":"请求金额大于可用余额，或者当前查询的数据被修mock"})}
        else if(req.param('amount') == '1.02'){res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('acctId') == '123123'){
            res.send({
                "accessor": "PTC",
                "requestId": req.param('requestId'),
                "returnCode": "000000",
                "returnMsg": "SUCCESS",
                "acctId": req.param('acctId'),
                "amount": req.param('amount'),
                "balance": 0,
                "availableBalance": 100.55,
                "frozenBalance": 8.88,
                "frozenId": dateString
            })
        }else{
            var user = sendaccount('new','/CreditAccount/creditFundFrozen',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//新账户解冻出金--信用账户
app.post('/CreditAccount/creditFundUFAndOut', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户解冻出金--信用账户/CreditAccount/creditFundUFAndOut")
    console.log(req.body);
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    if(settings.responseStatusCode == '200'){
        if(req.param('amount') == '1.03' ){res.send({"returnCode":"010008","returnMsg":"记录已解,不能重复解冻出金mock"})}
        else if(req.param('amount') == '1.04'){res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('acctId') == '123123'){
            res.send({
                "accessor": "PTC",
                "requestId": req.param('requestId'),
                "returnCode": "000000",
                "returnMsg": "SUCCESS",
                "acctId": req.param('acctId'),
                "amount": req.param('amount'),
                "balance": 0,
                "availableBalance": 100.5,
                "frozenBalance": 8.78,
                "frozenId": dateString
            })
        }else{
            var user = sendaccount('new','/CreditAccount/creditFundUFAndOut',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//新账户解冻--信用账户
app.post('/CreditAccount/creditFundUnFrozen', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户解冻--信用账户/CreditAccount/creditFundUnFrozen")
    console.log(req.body);
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    if(settings.responseStatusCode == '200'){
        if(req.param('amount') == '1.05' ){res.send({"returnCode":"010008","returnMsg":"记录已解,不能重复解冻mock"})}
        else if(req.param('amount') == '1.06'){res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('acctId') == '123123'){
            res.send({
                "accessor": "PTC",
                "requestId": req.param('requestId'),
                "returnCode": "000000",
                "returnMsg": "SUCCESS",
                "acctId": req.param('acctId'),
                "amount": req.param('amount'),
                "balance": 0,
                "availableBalance": 100.5,
                "frozenBalance": 8.78,
                "frozenId": dateString
            })
        }else{
            var user = sendaccount('new','/CreditAccount/creditFundUnFrozen',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//新账户消费--信用账户
app.post('/CreditAccount/creditFundConsume', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户消费--信用账户/CreditAccount /creditFundConsume")
    console.log(req.body);
    console.log(req.param('amount'))
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    if(settings.responseStatusCode == '200'){
        if(req.param('amount') == '1.07' ){res.send({"returnCode":"010005","returnMsg":"请求金额大于可用余额，或者当前查询的数据被修"})}
	    else if(req.param('amount') == '1.08'){res.sendStatus(settings.responseStatusCode1);}
	    else if(req.param('toAcctId') == '123123'){res.send({"accessor":"PTC","requestId":"321321","returnCode":"000000","returnMsg":"SUCCESS","amount":1.01,"fromAcctId":"123123","fromBalance":0,"fromAvailableBalance":204.59,"fromFrozenBalance":0,"toAcctId":"123123","toBalance":0,"toAvailableBalance":955.71,"toFrozenBalance":12.86})}
         else{
                var user = sendaccount('new','/CreditAccount/creditFundConsume',reqbody);
                res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//新账户入金--信用账户
app.post('/CreditAccount/creditFundIn', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户入金--信用账户/Account/acctFundIn")
    console.log(req.body);
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    if(settings.responseStatusCode == '200'){
        if(req.param('amount') == '1.09' ){
		console.log("/Account/creditFundIn  mock");
		res.send({"returnCode":"010030","returnMsg":"更新金额失败，当前入金金额加可用金额度大于初始额度"})}
         else if(req.param('amount') == '1.10'){res.sendStatus(settings.responseStatusCode1);}
         else if(req.param('acctId') == '123123'){
            res.send({"accessor":"PTC","requestId":"195f78ae-387c-4b28-9587-6685243d1184","returnCode":"000000","returnMsg":"SUCCESS","acctId":"123123","amount":1.99,"balance":0,"availableBalance":1003,"frozenBalance":13.98})}
         else{
            var user = sendaccount('new','/CreditAccount/creditFundIn',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//新账户出金--信用账户
app.post('/CreditAccount/creditFundOut', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户出金--信用账户/CreditAccount/creditFundOut")
    console.log(req.body);
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    if(settings.responseStatusCode == '200'){
        if(req.param('amount') == '1.11' ){res.send({"returnCode":"010005","returnMsg":"请求金额大于可用余额，或者当前查询的数据被修"})}
        else if(req.param('amount') == '1.12'){res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('acctId') == '123123'){res.send({"accessor":"PTC","requestId":"195f78ae-387c-4b28-9587-6685243d1184","returnCode":"000000","returnMsg":"SUCCESS","acctId":"123123","amount":1.99,"balance":0,"availableBalance":1003,"frozenBalance":13.98})}
        else{
            var user = sendaccount('new','/CreditAccount/creditFundOut',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})



//新账户PO调额--信用账户
app.post('/user/addUserProperty', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户PO调额--信用账户/user/addUserProperty")
    console.log(req.body);
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    if(settings.responseStatusCode == '200'){
        if(req.param('repaymentAbility') == '1.03' ){
           // res.send()
           res.sendStatus(settings.responseStatusCode1);}
         else if(req.param('repaymentAbility') == '1.12'){res.sendStatus(settings.responseStatusCode2);}
         else if(req.param('repaymentAbility') == '1.13'){res.sendStatus(settings.responseStatusCode3);}
         else if(req.param('repaymentAbility') == '1.14'){res.sendStatus(settings.responseStatusCode4);}
         else if(req.param('repaymentAbility') == '1.15'){res.sendStatus(settings.responseStatusCode5);}
         else if(req.param('repaymentAbility') == '1.16'){res.sendStatus(settings.responseStatusCode6);}
         else if(req.param('repaymentAbility') == '1.17'){res.sendStatus(settings.responseStatusCode8);}
         else if(req.param('repaymentAbility') == '1.18'){res.sendStatus(settings.responseStatusCode9);}
         else if(req.param('repaymentAbility') == '1.19'){res.sendStatus(settings.responseStatusCode10);}
         else if(req.param('repaymentAbility') == '1.20'){res.sendStatus(settings.responseStatusCode11);}
         else if(req.param('repaymentAbility') == '1.21'){res.sendStatus(settings.responseStatusCode12);}
         else{
            var user = sendaccount('new','/user/addUserProperty',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//新账户额度初始化--信用账户
app.post('/CreditAccount/creditInit', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户额度初始化--信用账户/CreditAccount/creditInit")
    console.log(req.body);
    var reqbody = req.body;
    var nowDate = new Date();
    var dateString =nowDate.getFullYear()+""+nowDate.getMonth()+""+nowDate.getDate()+""+nowDate.getHours()+""+nowDate.getTime()+""+nowDate.getMilliseconds()
    if(settings.responseStatusCode == '200'){
	if(req.param('amount') == '1.13' ){res.send()}
    else if(req.param('confirmAmount') == '1.14'){res.sendStatus(settings.responseStatusCode1);}
    else if(req.param('acctId') == '123123'){
            //res.send()
	   res.sendStatus(settings.responseStatusCode1);
        }else if(req.param('userId')=='123123'){
	   res.sendStatus(settings.responseStatusCode1);
	}else{
            var user = sendaccount('new','/CreditAccount/creditInit',reqbody);
            res.send(user);
        }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//冻结
app.post('/balance/lockBalance', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('lockAmount') == '2.01' ){ res.send({"result": false,"actualAmount": req.param('lockAmount'),"message": 'Insufficient Balance'})}  //id 一般由数据库产生
        else if(req.param('lockAmount') == '2.02' ){ res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('userId') == '123123'){ res.send({"result": true,"actualAmount": req.param('lockAmount'),"message": null})}  //id 一般由数据库产生
    	else{
                var user = sendaccount('old','/balance/lockBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})

//解冻
app.post('/balance/unlockBalance', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('confirmAmount') == '2.03'){res.send({"result": false,"actualAmount": 0,"message": "Insufficient LockAmount"})}  //id 一般由数据库产生
        else if(req.param('confirmAmount') == '2.04'){ res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('userId') == '123123'){ res.send({"result": true,"message": null})}
        else{
                var user = sendaccount('old','/balance/unlockBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }    
})
//入金冻结
app.post('/balance/inAndLockBalance', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('amount') == '2.05'){res.send({"result": "false","message": "duplicate requestId submit"})}
        else if(req.param('amount') == '2.06'){res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('userId') == '123123'){ res.send({"result": "true","message": "inAndLockBalance success!"})}
    	else{
                var user = sendaccount('old','/balance/inAndLockBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }    
})
//解冻出金
app.post('/balance/unLockAndOutBalance', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('amount') == '2.07'){res.send({"result": "false","message": "user amount not enough"})}
        else if(req.param('amount') == '2.08'){res.sendStatus(settings.responseStatusCode1);}
    	else if(req.param('userId') == '123123'){res.send({"result": "true","message": "unLockAndOutBalance success!"})}
        else{
                var user = sendaccount('old','/balance/unLockAndOutBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }    
})


//PTC透传ACCT入金冻结
app.post('/Account/acctFundIf', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户入金冻结/Account/acctFundIf")
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
	if(req.param('amount') == '2.05'){console.log("/Account/acctFundIf  mock");res.send({"returnCode":"010995","returnMsg":"请求金额错误 mock"});}
        //if(req.param('amount') == '2.05'){res.send({"result": "999999","message": "FAIL"})}
	else if(req.param('amount') == '2.06'){res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('userId') == '123123'){ res.send({"result": "true","message": "inAndLockBalance success!"})}
	else{
            var user = sendaccount('new','/Account/acctFundIf',reqbody);
            res.send(user);
    	}
	}else{res.sendStatus(settings.responseStatusCode);}
})
//PTC透传ACCT解冻出金
app.post('/PTC/ptcFundUo', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户解冻出金/PTC/ptcFundUo")
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
        if(req.param('amount') == '2.07'){res.send({"result": "false","message": "user amount not enough"})}
        else if(req.param('amount') == '2.08'){res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('userId') == '123123'){res.send({"result": "true","message": "unLockAndOutBalance success!"})}
        else{
	var user = sendaccount('new','/PTC/ptcFundUo',reqbody);
        res.send(user);
	}    
}else{    res.sendStatus(settings.responseStatusCode);}
})
//PTC透传ACCT冻结
app.post('/PTC/ptcFundFrozen', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户冻结/PTC/ptcFundFrozen")
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
        if(req.param('lockAmount') == '2.01' ){ res.send({"result": false,"actualAmount": req.param('lockAmount'),"message": 'Insufficient Balance'})}  //id 一般由数据库产生
        else if(req.param('lockAmount') == '2.02' ){ res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('userId') == '123123'){ res.send({"result": true,"actualAmount": req.param('lockAmount'),"message": null})}  //id 一般由数据库产生
        else{
	var user = sendaccount('new','/PTC/ptcFundFrozen',reqbody);
        res.send(user);
	}
    }else{    res.sendStatus(settings.responseStatusCode);}
})
//PTC透传ACCT解冻
app.post('/PTC/ptcFundUnfrozen', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log("新账户解冻/PTC/ptcFundUnfrozen")
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
        if(req.param('confirmAmount') == '2.03'){res.send({"result": false,"actualAmount": 0,"message": "Insufficient LockAmount"})}  //id 一般由数据库产生
        else if(req.param('confirmAmount') == '2.04'){ res.sendStatus(settings.responseStatusCode1);}
        else if(req.param('userId') == '123123'){ res.send({"result": true,"message": null})}
        else{
	var user = sendaccount('new','/PTC/ptcFundUnfrozen',reqbody);
        res.send(user);
	}    
}else{    res.sendStatus(settings.responseStatusCode);}
})


app.listen(settings.port); //监听8888端口，没办法，总不好抢了tomcat的8080吧！
