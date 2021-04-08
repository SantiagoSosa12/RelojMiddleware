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
    console.log(req.body.Hora);
    console.log(req.body.Minuto);
    console.log(req.body.Segundo);
    var childProcess = exec('sh /home/serverone/RelojMiddleware/Shell/cambiarHora.sh ' 
    + req.body.Hora + ':' + req.body.Minuto + ':' + req.body.Segundo);
    childProcess.stderr.on('data', data => console.error(data));
    childProcess.stdout.on('data', data => console.log(data));
    res.send('Se cambio la hora');
});

app.post('/cambiarHoraDesfase', (req, res) => {
    var fecha = new Date();
    var horaA = fecha.getHours() + parseInt(req.body.Hora);
    var minutosA = fecha.getMinutes() + parseInt(req.body.Minuto);
    var segA = fecha.getSeconds() + parseInt(req.body.Segundo);
    var childProcess = exec('sh /home/serverone/RelojMiddleware/Shell/cambiarHora.sh ' 
    + horaA + ':' + minutosA + ':' + segA);
    childProcess.stderr.on('data', data => console.error(data));
    childProcess.stdout.on('data', data => console.log(data));
    res.send('Se cambio hora con desfase');
});

/**
 * Se recibe la hora de un servidor externo y se envia 
 * el desfase 
 */
app.post('/sincronizar', (req, res) => {
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