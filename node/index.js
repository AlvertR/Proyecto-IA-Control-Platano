//*****Proyecto de Inteligencia Atificial
//*****Ramirez Romero Alvaro
//*****Vega Ledezam Emmanuel
//*****Apoyado en el canal [Ringa Tech](https://youtube.com/c/RingaTech)
var express = require('express');
var app = express();
var spawn = require('child_process').spawn;

//Comencemos abriendo el programa
var net = spawn('../net/NetApp/bin/Debug/NetApp.exe');

net.stdout.on('data', function(data) {
	console.log("Recibi de .NET este mensaje: " + data.toString());
});

app.get('/', function(req, res) {
	console.log("Recibi una solicitud " + req.query.movimiento + ", " + req.query.bomba + ", " 
		+ req.query.arriba);
	net.stdin.write(req.query.movimiento + "," 
		+ req.query.bomba + "," + req.query.arriba
		+ "\r\n");
	res.send("Hola amigo");
});// + req.query.acelerar  + ", " + req.query.acelerar cambier para usar con mario
// + req.query.brincar  + ", " + req.query.brincar

app.use(express.static('public'));

app.listen(3000, function() {
	console.log("Se levanto el servidor");
});