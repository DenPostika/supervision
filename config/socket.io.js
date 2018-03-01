import SocketIO from 'socket.io';

const io = new SocketIO();
io.listen(5000);

export default io;
