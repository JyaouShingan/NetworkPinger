var io = require('socket.io')(8080);

var records = {};

io.on('connection', function(socket) {
	console.log('New connection');
	var pinger;

	//Register
	socket.on('startping', function(device) {
		console.log('Start ping ' + device);
		records[device] = {};
		pinger = setInterval(function() {
			console.log('Send Ping request');
			var id = Date.now();
			records[device][id.toString()] = -1;
			socket.emit('ping', id);
		}, 5000);
	});

	socket.on('stopping', function(device) {
		clearInterval(pinger);
	});

	socket.on('pong', function(device, id){
		console.log('Got Ping response');
		records[device][id.toString()] = Date.now() - id;
	});

	socket.on('disconnect', function(data){
		console.log('Disconnected')
	});

	//Monitor

});