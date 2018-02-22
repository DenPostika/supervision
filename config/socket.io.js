import SocketIO from 'socket.io';

const io = new SocketIO();
io.listen(3000);

export default io;
