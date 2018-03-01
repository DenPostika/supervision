import SocketIO from 'socket.io';

const io = new SocketIO();
io.listen((process.env.PORT_SOCKET || 3000));

export default io;
