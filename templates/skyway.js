// require
const Peer = require('skyway-js');
//const peer = new Peer({key: 'a59303d9-eeff-43ef-a640-5c2867da0727'});

// import
//import Peer from 'skyway-js';
//const peer = new Peer({key: 'a59303d9-eeff-43ef-a640-5c2867da0727'});

let localStream;

// camera image acquisition
navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( stream => {
    // On success, the video element is set to a camera image and played back.
    const videoElm = document.getElementById('my-video');
    videoElm.srcObject = stream;
    videoElm.play();
    // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
    localStream = stream;
}).catch( error => {
    // Outputs error log in case of failure.
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
});

//Peer作成
const peer = new Peer({
key: 'a59303d9-eeff-43ef-a640-5c2867da0727',
debug: 3
});

//PeerID取得
peer.on('open', () => {
    document.getElementById('my-id').textContent = peer.id;
});

peer.on('error', err => {
    alert(err.message);
});

peer.on('close', () => {
  alert('We have lost communication.');
});

// Transmission processing
document.getElementById('make-call').onclick = () => {
  const theirID = document.getElementById('their-id').value;
  const mediaConnection = peer.call(theirID, localStream);
  setEventListener(mediaConnection);
};

// Function to set an event listener
const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    // Set a camera image to the video element and play it
    const videoElm = document.getElementById('their-video')
    videoElm.srcObject = stream;
    videoElm.play();
  });
}

// Inbound processing
peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream);
  setEventListener(mediaConnection);
});
