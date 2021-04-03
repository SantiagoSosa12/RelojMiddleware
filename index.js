const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server:server });
const port = 3000

app.use(express.static(__dirname + "/views"));

wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    ws.send('Bienvenido!!');
    enviarHora();
});

function enviarHora(){
    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var seg = fecha.getSeconds();
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(hora + " : " + minutos + " : " + seg);
        }
    });
    var upd = setTimeout('enviarHora()' , 500);
}



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

