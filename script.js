const peer = new Peer(undefined, {
    config: { 'iceServers': [{ urls: 'stun:stun.l.google.com:19302' }] }
});

let localStream;
let currentCall;
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

// 1. Khởi động Cam/Mic
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;
});

peer.on('open', id => document.getElementById('my-id').innerText = id);

// 2. Xử lý cuộc gọi đến
peer.on('call', call => {
    currentCall = call;
    call.answer(localStream);
    call.on('stream', rs => remoteVideo.srcObject = rs);
});

// 3. Nút Gọi
document.getElementById('btn-call').addEventListener('click', () => {
    const id = document.getElementById('peer-id-input').value;
    if (id) {
        currentCall = peer.call(id, localStream);
        currentCall.on('stream', rs => remoteVideo.srcObject = rs);
    }
});

// 4. Tắt/Mở Mic & Video
document.getElementById('toggle-mic').addEventListener('click', function() {
    const enabled = localStream.getAudioTracks()[0].enabled;
    localStream.getAudioTracks()[0].enabled = !enabled;
    this.innerHTML = `<i data-lucide="${!enabled ? 'mic' : 'mic-off'}"></i>`;
    lucide.createIcons();
});

document.getElementById('toggle-video').addEventListener('click', function() {
    const enabled = localStream.getVideoTracks()[0].enabled;
    localStream.getVideoTracks()[0].enabled = !enabled;
    this.innerHTML = `<i data-lucide="${!enabled ? 'video' : 'video-off'}"></i>`;
    lucide.createIcons();
});

// 5. Kết thúc cuộc gọi
document.getElementById('btn-hangup').addEventListener('click', () => {
    if (currentCall) {
        currentCall.close();
        remoteVideo.srcObject = null;
        alert("Cuộc gọi đã kết thúc");
    }
});