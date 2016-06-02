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
			var id = (new Date()).getTime();
			console.log(id);
			records[device][id] = -1;
			socket.emit('ping', id);
		}, 5000);
	});

	socket.on('stopping', function(device) {
		clearInterval(pinger);
	});

	socket.on('pong', function(device, id) {
		console.log('Received id: ' + id);
		console.log('Got Ping response');
		records[device][parseInt(id)] = (new Date).getTime() - id;

		console.log(records);
	});

	socket.on('disconnect', function(data){
		console.log('Disconnected')
	});

	//Monitor

});