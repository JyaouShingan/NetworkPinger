var io = require('socket.io')(8080);
var fs = require('fs');

var records = {};

io.on('connection', function(socket) {
	console.log('New connection');
	var pinger;
	var fileStream;

	//Register
	socket.on('startping', function(device) {
		console.log('Start ping ' + device);
		records[device] = {};
		fileStream = fs.createWriteStream("devices/"+device.trim()+".txt");
		fileStream.once('open', function(){
			pinger = setInterval(function() {
				console.log('Send Ping request');
				var id = (new Date()).getTime();
				console.log(id);
				records[device][id] = -1;
				socket.emit('ping', id);
			}, 5000);
		});
	});

	socket.on('stopping', function(device) {
		clearInterval(pinger);
		fileStream.end();
	});

	socket.on('pong', function(device, id) {
		console.log('Received id: ' + id);
		console.log('Got Ping response');
		var ping = (new Date).getTime() - id;
		records[device][parseInt(id)] = ping;
		console.log('Ping: ' + ping);
		var timeString = new Date(id).toLocaleString();
		fileStream.write(timeString + ': ' + ping + 'ms\n');
	});

	socket.on('disconnect', function(){
		console.log('Disconnected');
	});

	//Monitor
	socket.on('request_list', function(){
		var list = records.keys();
		socket.emit('device_list', list);
	});
});
