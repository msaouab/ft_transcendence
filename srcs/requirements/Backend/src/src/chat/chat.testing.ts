

// const io = require('socket.io-client');

// // take senderId and receiverId as arguments
// const senderId = process.argv[2];
// const receiverId = process.argv[3];



// socket.on('connect', () => {
//     console.log('connected');
// });

// // if there's something in stdin, send it to the server
// process.stdin.on('data', (data) => {

//     // creating a payload 
//     const payload = {
//         senderId: senderId,
//         receiverId: receiverId,
//         message: data.toString()
//     }

//     socket.emit('chatPrivately', payload);

// });
// // if the server sends a message, print it to stdout
// socket.on('chatPrivately', (data) => {
//     console.log(data.content);
// });

