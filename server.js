const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);

  socket.on('new user', (nickname) => {
    nickname = nickname && nickname.trim() ? nickname.trim() : 'Anonim';
    socket.nickname = nickname;
    console.log(`Nickname atandı: ${nickname}`);
  });

  socket.on('chat message', (data) => {
    if (!socket.nickname) socket.nickname = 'Anonim';

    io.emit('chat message', {
      id: data.id,
      message: data.message,
      nickname: socket.nickname,
      senderId: socket.id
    });
  });

   socket.on('delete message', (msgId) => {
    console.log('Silme isteği alındı:', msgId);
    io.emit('delete message', msgId);  // Tüm istemcilere mesaj silme talimatı gönder
  });


  socket.on('disconnect', () => {
    console.log(`${socket.nickname || 'Bir kullanıcı'} ayrıldı`);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
