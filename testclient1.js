

var http = require('http');
var fs = require('fs');

var options = {
	port:8080,
	path:'/myblob',
	method:"PUT",
	headers:{
		"Content-Length":"3767110"
	}
};

var src = fs.createReadStream('myblob.bin');


var dest = http.request(options,function(res){
	res.on('data',function(){});
	res.on('end',function(){console.log("confirmed!");});
});
dest.on('drain',function(){src.resume();});
src.on('data',function(data){
	src.pause();
	dest.write(data);
});
src.on('end',function(){
	dest.end();
	console.log("done! Puh!");
});

