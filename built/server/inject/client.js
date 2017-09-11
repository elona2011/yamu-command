let ws = new WebSocket('ws://localhost:19009');
ws.addEventListener('message', function (e) {
    if (e.data === 'reload')
        location.reload();
});
