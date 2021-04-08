
function conectarAServidor() {
    var socket = new WebSocket("ws://192.168.0.16:3001","echo-protocol");

    //Abro la coneccion
    socket.addEventListener('open', function (event) {
        console.log('Connected to WS Server');
        document.getElementById('Reloj').innerHTML = "Conectado al servidor";
    });
    
    // Espero mensajes
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        var fromServer = event.data + "";
        if(fromServer.length > 8){
            fromServer = fromServer.split(",");
            $(miTabla).find('tbody').append("<tr> <td> aaaa </td> </tr>");
        }else {
            document.getElementById('Reloj').innerHTML = "" + event.data;    
        }
    });
}
