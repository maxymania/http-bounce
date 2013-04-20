
// stackoverflow http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function pipestream(req,resp){
	resp.writeHead(200,{
		"Content-Type":"application/octet-stream",
		"Content-Length":req.headers["content-length"]
	});
	//resp.on('drain',function(){req.resume();});
	req.on('data',function(data){
		//req.pause();
		resp.write(data);
	});
	req.on('end',function(){
		resp.end();
	});
	req.resume();
}
function senderror(resp){
	resp.writeHead(404);
	resp.end('not found');
}
function sendEmptyCb(resp){
	return function(){
		resp.writeHead(201);
		resp.end();
	};
}


function createBounce(basis){
	var regex = new RegExp('^'+escapeRegExp(basis)+'\\/(\\w+)');
	var bounces = {};
	function bounce(req,resp){
		var d = req.url.match(regex);
		if(!d)return senderror(resp);
		var id = d[1];
		switch(req.method){
		case 'GET':
			if(bounces[id]){
				if(bounces[id].dest)return senderror(resp);
				bounces[id].dest=resp;
				pipestream(bounces[id].src,bounces[id].dest);
				delete bounces[id];
			}else{
				bounces[id]={dest:resp,src:null};
				setTimeout(function(){
					if(!bounces[id]) return;
					if(bounces[id].src) return;
					senderror(bounces[id].dest);
					delete bounces[id];
				},6000);
			}
			break;
		case 'PUT':
			req.on('end',sendEmptyCb(resp));
			if(bounces[id]){
				if(bounces[id].src)return req.resume();
				bounces[id].src=req;
				pipestream(bounces[id].src,bounces[id].dest);
				delete bounces[id];
			}else{
				req.pause();
				bounces[id]={dest:null,src:req};
				setTimeout(function(){
					if(!bounces[id]) return;
					if(bounces[id].dest) return;
					bounces[id].src.resume();
					delete bounces[id];
				},6000);
			}
			break;
		default:senderror(resp);
		}
	}
	return bounce;
}

module.exports.createBounce = createBounce;
