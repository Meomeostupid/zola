// 1. Khởi tạo Peer (Sẽ tự động kết nối đến Server trung gian của PeerJS để lấy ID)
const peer = new Peer(undefined, {
    config: {
        'iceServers': [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    }
});

let localStream;
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

// 2. Xin quyền Camera và Micro
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
    })
    .catch(err => alert("Lỗi truy cập Camera/Mic: " + err));

// 3. Hiển thị ID của mình khi Peer đã sẵn sàng
peer.on('open', (id) => {
    document.getElementById('my-id').innerText = id;
});

// 4. LẮNG NGHE CUỘC GỌI ĐẾN
peer.on('call', (call) => {
    // Khi có người gọi, mình đồng ý và gửi kèm stream của mình
    call.answer(localStream);
    
    // Nhận stream của họ và hiển thị
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });
});

// 5. THỰC HIỆN CUỘC GỌI ĐI
document.getElementById('btn-call').addEventListener('click', () => {
    const remoteId = document.getElementById('peer-id-input').value;
    
    if (!remoteId) return alert("Vui lòng nhập ID người nhận!");

    const call = peer.call(remoteId, localStream);
    
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });
});