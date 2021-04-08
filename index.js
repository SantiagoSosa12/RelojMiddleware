const { exec } = require('child_process');
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const port = 3001;

app.use(express.static(__dirname + "/views"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const wss = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    ws.send('Welcome New Client!');
    enviarHora();
});


app.post('/cambiarHora', (req, res) => {
    console.log(req.body.hora);
    console.log(req.body.minuto);
    console.log(req.body.segundo);
    var childProcess = exec('sh /home/serverone/RelojMiddleware/Shell/cambiarHora.sh ' 
    + req.body.hora + ':' + req.body.minuto + ':' + req.body.segundo);
    childProcess.stderr.on('data', data => console.error(data));
    childProcess.stdout.on('data', data => console.log(data));
    res.send('Se cambio la hora');
});

/**
 * Se recibe la hora de un servidor externo y se envia 
 * el desfase 
 */
app.post('/sincronizar', (req, res) => {
    console.log(req.body);
    console.log(req.body.Minuto);
    console.log(req.body.Segundo);
    var horaApi = req.body.Hora;
    var minApi = req.body.Minuto;
    var segApi = req.body.Segundo;
    var fecha = new Date();
    var horaA = fecha.getHours();
    var minutosA = fecha.getMinutes();
    var segA = fecha.getSeconds();
    console.log((horaApi - horaA) + ":" + (minApi - minutosA) + ":" + (segApi - segA));
    res.send((horaApi - horaA) + ":" + (minApi - minutosA) + ":" + (segApi - segA));
});

function enviarHora(ws){
    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var seg = fecha.getSeconds();
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(hora + " : " + minutos + " : " + seg);
        }
    });
    setTimeout(function(){
        enviarHora(ws);
    } , 500);
}

app.get('/', (req, res) => res.send('Hello World!'))

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});