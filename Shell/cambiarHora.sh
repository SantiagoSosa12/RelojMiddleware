#!/bin/bash

# chmod +x archivo.sh para modificar permisos
# ejecute el comando: date para ver la hora
# ejecute timedatectl set-ntp false para desactivar la sincronizacion horaria automatica
# y luego date +%T -s "11:14:00" para cambiar la hora

if [ -z "$1" ]; then
    echo "No se recibio parametro"
else
    timedatectl set-ntp false
    date +%T -s "$1"
    echo "La nueva hora es: $1"
fi
