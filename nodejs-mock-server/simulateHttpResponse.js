/**
 * Created by houyf on 2016/11/22.
 */
var express = require('express') //加载模块
var app = express() //实例化
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
var settings = require('./settings')

//var map = {"1":{id:1,name:"test1"},"2":{id:2,name:"test2"}} //定义一个集合资源，key为字符串完全是模仿java MAP<T,E>，否则谁会这么去写个hash啊！

app.get('/rest',function(req, res){ //Restful Get方法,查找整个集合资源
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    if(settings.responseStatusCode == '200'){
        res.send(settings.responseBody);
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})
//转发账户请求
function sendaccount(pth,reqbody,user){
    var ippath = settings.acctip + pth;
    var request = require('sync-request');
    var rep = request('POST', ippath, {
        json:reqbody
    });
    var user = JSON.parse(rep.getBody('utf8'));
    return user;
}

//冻结
app.post('/balance/lockBalance', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('lockAmount') == '2.01' ){
                res.send({"result": false,"actualAmount": req.param('lockAmount'),"message": 'Insufficient Balance'}) //id 一般由数据库产生
             //res.sendStatus(settings.responseStatusCode1);
    		}else if(req.param('userId') == '123123'){
    		    res.send({"result": true,"actualAmount": req.param('lockAmount'),"message": null}) //id 一般由数据库产生
    		}else{
                var user = sendaccount('/balance/lockBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})
//解冻
app.post('/balance/unlockBalance2', function(req, res){ //Restful Post方法,创建一个单一资源
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('confirmAmount') == '0.01'){
              //res.send({"result": false,"actualAmount": 0,"message": "Insufficient LockAmount"}) //id 一般由数据库产生
             res.sendStatus(settings.responseStatusCode1);
    		}else if(req.param('userId') == '123123'){
    			 res.send({"result": true,"message": null}) //id 一般由数据库产生
    		}else{
                var user = sendaccount('/balance/unlockBalance',reqbody);
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
    	if(req.param('amount') == '2.03'){
                res.send({"result": "false","message": "duplicate requestId submit"}) //id 一般由数据库产生
             //res.sendStatus(settings.responseStatusCode1);
    		}else if(req.param('userId') == '123123'){
                res.send({"result": "true","message": "inAndLockBalance success!"}) //id 一般由数据库产生
    		}else{
                var user = sendaccount('/balance/inAndLockBalance',reqbody);
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
    	if(req.param('amount') == '0.01'){
             // res.send({"result": "false","message": "user amount not enough"}) //id 一般由数据库产生
            res.sendStatus(settings.responseStatusCode1);
    		}else if(req.param('userId') == '123123'){
                res.send({"result": "true","message": "unLockAndOutBalance success!"})
    		}else{
                var user = sendaccount('/balance/unLockAndOutBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }    
})
app.listen(settings.port); //监听8888端口，没办法，总不好抢了tomcat的8080吧！
