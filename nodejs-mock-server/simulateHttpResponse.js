/**
 * Created by houyf on 2016/11/22.
 */
var express = require('express') //����ģ��
var app = express() //ʵ����
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
var settings = require('./settings')

//var map = {"1":{id:1,name:"test1"},"2":{id:2,name:"test2"}} //����һ��������Դ��keyΪ�ַ�����ȫ��ģ��java MAP<T,E>������˭����ôȥд��hash����

app.get('/rest',function(req, res){ //Restful Get����,��������������Դ
    res.set({'Content-Type':'text/json','Encodeing':'utf8'});
    if(settings.responseStatusCode == '200'){
        res.send(settings.responseBody);
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})
//ת���˻�����
function sendaccount(pth,reqbody,user){
    var ippath = settings.acctip + pth;
    var request = require('sync-request');
    var rep = request('POST', ippath, {
        json:reqbody
    });
    var user = JSON.parse(rep.getBody('utf8'));
    return user;
}

//����
app.post('/balance/lockBalance', function(req, res){ //Restful Post����,����һ����һ��Դ
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('lockAmount') == '2.01' ){
                res.send({"result": false,"actualAmount": req.param('lockAmount'),"message": 'Insufficient Balance'}) //id һ�������ݿ����
             //res.sendStatus(settings.responseStatusCode1);
    		}else if(req.param('userId') == '123123'){
    		    res.send({"result": true,"actualAmount": req.param('lockAmount'),"message": null}) //id һ�������ݿ����
    		}else{
                var user = sendaccount('/balance/lockBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }
})
//�ⶳ
app.post('/balance/unlockBalance2', function(req, res){ //Restful Post����,����һ����һ��Դ
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('confirmAmount') == '0.01'){
              //res.send({"result": false,"actualAmount": 0,"message": "Insufficient LockAmount"}) //id һ�������ݿ����
             res.sendStatus(settings.responseStatusCode1);
    		}else if(req.param('userId') == '123123'){
    			 res.send({"result": true,"message": null}) //id һ�������ݿ����
    		}else{
                var user = sendaccount('/balance/unlockBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }    
})
//��𶳽�
app.post('/balance/inAndLockBalance', function(req, res){ //Restful Post����,����һ����һ��Դ
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('amount') == '2.03'){
                res.send({"result": "false","message": "duplicate requestId submit"}) //id һ�������ݿ����
             //res.sendStatus(settings.responseStatusCode1);
    		}else if(req.param('userId') == '123123'){
                res.send({"result": "true","message": "inAndLockBalance success!"}) //id һ�������ݿ����
    		}else{
                var user = sendaccount('/balance/inAndLockBalance',reqbody);
                res.send(user);
            }
    }else{
        res.sendStatus(settings.responseStatusCode);
    }    
})
//�ⶳ����
app.post('/balance/unLockAndOutBalance', function(req, res){ //Restful Post����,����һ����һ��Դ
    res.set({'Content-Type':'application/json','Encodeing':'utf8'});
    console.log(req.body);
    var reqbody = req.body;
    if(settings.responseStatusCode == '200'){
    	if(req.param('amount') == '0.01'){
             // res.send({"result": "false","message": "user amount not enough"}) //id һ�������ݿ����
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
app.listen(settings.port); //����8888�˿ڣ�û�취���ܲ�������tomcat��8080�ɣ�
