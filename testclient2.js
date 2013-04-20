

var http = require('http');
var fs = require('fs');

var options = {
	port:8080,
	path:'/myblob',
	method:"GET",
};

var dest = fs.createWriteStream('myblob.dest.bin');


var req = http.request(options,function(res){
	res.on('data',function(data){
		dest.write(data);
	});
	res.on('end',function(){
		dest.end();
		console.log("i got it!");
	});
});
req.end();


