// PostMessage监听
window.addEventListener("message", function receiveMessage(evt) {
    var data = evt.data;
    console.log('game-listen-message:', data);
    !!data ? typeof evt.data === 'string' ? JSON.parse(data) : data : {};
    window.game = data
}, false);