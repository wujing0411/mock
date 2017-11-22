/**
 * Created by wujing on 2017/11/21.
 */
var express = require('express') //加载express模块
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
var sign = require('./sign')//引入其他模块

app.get('/sign/query', function(req, res){  //Restful Get方法,查找一个单一资源
	res.set({'Content-Type':'text/json','Encodeing':'utf8'});
	var show = req.param('show');//获取请求参数
	console.log('show : ' + show);
	if (show == '1') {
		res.send(sendSignQuery());
	} else if (show == '2') {
		res.send(sign.responseBody);
	} else {
		res.send({
			'show':'error !!!'
		});
	}
	console.log('访问成功！');
})

function sendSignQuery() {
	var ipPath = sign.acctIp + sign.path;
	console.log(ipPath);
	var request = require('sync-request');
	var rep = request('GET', ipPath);
	var query = JSON.parse(rep.getBody('utf8'));
	return query;
}

app.listen(sign.port);//监听端口