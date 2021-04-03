
function conectarAServidor() {
    var socket = new WebSocket("ws://192.168.0.16:3000","echo-protocol");

    //Abro la coneccion
    socket.addEventListener('open', function (event) {
        console.log('Connected to WS Server');
        document.getElementById('Reloj').innerHTML = "Conectado al servidor";
    });
    
    // Espero mensajes
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        document.getElementById('Reloj').innerHTML = "" + event.data;
    });
}
