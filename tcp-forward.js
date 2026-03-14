const net = require('net');

const LISTEN_HOST = '0.0.0.0';
const LISTEN_PORT = 17890;
const TARGET_HOST = '127.0.0.1';
const TARGET_PORT = 7890;

const server = net.createServer((clientSocket) => {
  const targetSocket = net.connect(TARGET_PORT, TARGET_HOST);

  clientSocket.pipe(targetSocket);
  targetSocket.pipe(clientSocket);

  const closeBoth = () => {
    clientSocket.destroy();
    targetSocket.destroy();
  };

  clientSocket.on('error', closeBoth);
  targetSocket.on('error', closeBoth);
  clientSocket.on('close', () => targetSocket.end());
  targetSocket.on('close', () => clientSocket.end());
});

server.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

server.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log(`Forwarding ${LISTEN_HOST}:${LISTEN_PORT} -> ${TARGET_HOST}:${TARGET_PORT}`);
});
