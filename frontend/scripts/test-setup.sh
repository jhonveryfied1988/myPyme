#!/bin/bash

# Función para verificar si un puerto está en uso
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Función para esperar que un puerto esté disponible
wait_for_port() {
    local port=$1
    local retries=30
    local wait=1
    while [ $retries -gt 0 ]; do
        if curl -s http://localhost:$port > /dev/null; then
            return 0
        fi
        retries=$((retries-1))
        sleep $wait
    done
    return 1
}

# Matar procesos existentes en los puertos
if check_port 5173; then
    echo "Puerto 5173 en uso. Terminando proceso..."
    lsof -ti :5173 | xargs kill -9
fi

if check_port 4000; then
    echo "Puerto 4000 en uso. Terminando proceso..."
    lsof -ti :4000 | xargs kill -9
fi

# Iniciar el servidor backend
echo "Iniciando servidor backend..."
cd ../backend && npm run dev &
BACKEND_PID=$!

# Iniciar el servidor frontend
echo "Iniciando servidor frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Esperar a que los servidores estén listos
echo "Esperando a que los servidores estén listos..."
if wait_for_port 5173 && wait_for_port 4000; then
    echo "¡Servidores listos!"
    echo "Frontend PID: $FRONTEND_PID"
    echo "Backend PID: $BACKEND_PID"
else
    echo "Error: Los servidores no iniciaron correctamente"
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 1
fi

# Mantener el script corriendo
wait 