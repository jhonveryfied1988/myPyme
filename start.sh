#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Obtener el directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}=== MyPyme - Sistema de Gestión ===${NC}"
echo -e "${BLUE}Iniciando servicios...${NC}"

# Función para verificar si un comando está disponible
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 no está instalado${NC}"
        exit 1
    fi
}

# Verificar comandos necesarios
echo -e "${BLUE}Verificando requisitos...${NC}"
check_command "node"
check_command "npm"
check_command "lsof"

# Función para verificar versión de Node.js
check_node_version() {
    local version=$(node -v | cut -d'v' -f2)
    local major=$(echo $version | cut -d'.' -f1)
    if [ $major -lt 14 ]; then
        echo -e "${RED}Error: Se requiere Node.js v14 o superior. Versión actual: $version${NC}"
        exit 1
    fi
}

# Verificar versión de Node.js
check_node_version

# Función para matar procesos
kill_node_processes() {
    echo -e "${YELLOW}Limpiando procesos anteriores...${NC}"
    
    # Matar procesos por puerto
    for port in 5173 4000; do
        pid=$(lsof -t -i:$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            echo -e "${BLUE}Liberando puerto $port (PID: $pid)${NC}"
            kill -9 $pid 2>/dev/null
        fi
    done
    
    # Matar todos los procesos de node relacionados con el proyecto
    for pid in $(ps aux | grep "node" | grep "$SCRIPT_DIR" | awk '{print $2}'); do
        echo -e "${BLUE}Terminando proceso Node.js (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null
    done
    
    sleep 2
}

# Función para verificar puerto
check_port() {
    nc -z localhost $1 2>/dev/null
    return $?
}

# Función para esperar que un puerto esté disponible
wait_for_port() {
    local port=$1
    local service=$2
    local counter=0
    local max_attempts=30
    
    echo -e "${YELLOW}Esperando que $service esté disponible...${NC}"
    while ! check_port $port && [ $counter -lt $max_attempts ]; do
        sleep 1
        ((counter++))
    done
    
    if [ $counter -eq $max_attempts ]; then
        echo -e "${RED}Error: $service no pudo iniciarse en el puerto $port${NC}"
        cleanup
        exit 1
    fi
    
    echo -e "${GREEN}$service está listo en puerto $port${NC}"
}

# Función para verificar dependencias npm
check_npm_dependencies() {
    local dir=$1
    if [ ! -f "$dir/package.json" ]; then
        echo -e "${RED}Error: No se encuentra package.json en $dir${NC}"
        exit 1
    fi
}

# Matar procesos existentes
kill_node_processes

# Verificar y instalar dependencias del frontend
echo -e "${BLUE}Configurando frontend...${NC}"
cd "$SCRIPT_DIR/frontend"
check_npm_dependencies "."
npm install

# Verificar y instalar dependencias del backend
echo -e "${BLUE}Configurando backend...${NC}"
cd "$SCRIPT_DIR/backend"
check_npm_dependencies "."
npm install

# Iniciar backend
echo -e "${GREEN}Iniciando backend...${NC}"
npm start &
BACKEND_PID=$!

# Esperar a que el backend esté disponible
wait_for_port 4000 "Backend"

# Iniciar frontend
echo -e "${GREEN}Iniciando frontend...${NC}"
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

# Esperar a que el frontend esté disponible
wait_for_port 5173 "Frontend"

echo -e "\n${BLUE}=== Servicios iniciados correctamente ===${NC}"
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "Backend:  ${GREEN}http://localhost:4000${NC}"
echo -e "\n${YELLOW}Credenciales de acceso:${NC}"
echo -e "Admin:    ${GREEN}admin@inventario.com / 1234${NC}"
echo -e "Vendedor: ${GREEN}laura@inventario.com / 5678${NC}"
echo -e "\n${BLUE}Presiona Ctrl+C para detener todos los servicios${NC}"

# Función para limpieza
cleanup() {
    echo -e "\n${YELLOW}Deteniendo servicios...${NC}"
    kill_node_processes
    echo -e "${GREEN}Servicios detenidos correctamente${NC}"
    exit 0
}

# Registrar la función cleanup para señales de interrupción
trap cleanup SIGINT SIGTERM

# Monitorear procesos silenciosamente
while true; do
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo -e "${RED}Backend caído. Reiniciando...${NC}"
        cd "$SCRIPT_DIR/backend"
        npm start &
        BACKEND_PID=$!
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo -e "${RED}Frontend caído. Reiniciando...${NC}"
        cd "$SCRIPT_DIR/frontend"
        npm run dev &
        FRONTEND_PID=$!
    fi
    
    sleep 5
done 