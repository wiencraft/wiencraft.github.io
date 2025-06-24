const socket = io();

let nickname = '';

function join() {
  const nickInput = document.getElementById('nickname');
  const adminPassInput = document.getElementById('adminPass');

  const nick = nickInput.value.trim();
  const adminPass = adminPassInput.value.trim();

  if (!nick) {
    alert('Lütfen takma adınızı girin!');
    return;
  }

  const ADMIN_PASSWORD = 'sifre123'; 

  if (adminPass.length > 0 && adminPass !== ADMIN_PASSWORD) {
    alert('Admin şifresi yanlış!');
    return;
  }

  nickname = nick;

  socket.emit('new user', nickname);

  document.getElementById('login').style.display = 'none';
  document.getElementById('chat').style.display = 'block';
  document.getElementById('m').focus();
}

function send() {
  const input = document.getElementById('m');
  const message = input.value.trim();
  if (!message) return;

  const msgId = Date.now();

  socket.emit('chat message', {
    message: message,
    id: msgId
  });

  input.value = '';
  input.focus();
}

socket.on('chat message', (data) => {
  const messagesDiv = document.getElementById('messages');

  // Aynı id varsa önce sil
  let existing = document.getElementById(`msg-${data.id}`);
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = `msg-${data.id}`;

  const msgContent = document.createElement('span');
  msgContent.textContent = `${data.nickname}: ${data.message}`;
  el.appendChild(msgContent);

  if (data.nickname === nickname) {
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Sil';
    delBtn.style.marginLeft = '10px';

    delBtn.onclick = () => {
      console.log('Silme butonuna basıldı, id:', data.id);
      socket.emit('delete message', data.id);
    };

    el.appendChild(delBtn);
    el.style.textAlign = 'right';
    el.style.backgroundColor = '#DCF8C6';
    el.style.borderRadius = '10px';
    el.style.margin = '5px 0 5px 40%';
    el.style.padding = '5px 10px';
  } else {
    el.style.textAlign = 'left';
    el.style.backgroundColor = '#FFF';
    el.style.borderRadius = '10px';
    el.style.margin = '5px 40% 5px 0';
    el.style.padding = '5px 10px';
  }

  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('delete message', (id) => {
  console.log('Silme event alındı, id:', id);
  const msgEl = document.getElementById(`msg-${id}`);
  if (msgEl) {
    msgEl.remove();
  } else {
    console.log('Mesaj bulunamadı:', `msg-${id}`);
  }
});
