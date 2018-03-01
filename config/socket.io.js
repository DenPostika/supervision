import SocketIO from 'socket.io';

const io = new SocketIO();
io.listen(process.env.PORT || 3000);

export default io;
