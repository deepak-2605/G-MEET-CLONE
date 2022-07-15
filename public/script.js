// const { default: Peer } = require("peerjs");

const socket=io('/');
const videoGrid=document.getElementById('video-grid');
const myPeer = new Peer(undefined,{
    host:'/',
    port:'3001'
})
const myVideo=document.createElement('video');
myVideo.muted=true;
// We don't want to listen to our own video and hence muting our video
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
   addVideoStream(myVideo,stream);

   myPeer.on('call',call=>{
    call.answer(stream);
    const video=document.createElement('video');
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
})

   socket.on('user-connected',userId=>{
    setTimeout(connectToNewUser,1000,userId,stream);
    
})
})
socket.on('user-disconnected',userId=>{
    if(peers[userId]) peers[userId].close();
})


myPeer.on('open',id=>{
    socket.emit('join-room', ROOM_ID, id);
})
// socket.emit send an event to the server

//  socket.on('user-connected', function (userId) {
//          console.log('User connected:' + userId);
//      })
function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream);
    const video=document.createElement('video');
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
        video.remove();
    })
    peers[userId]=call;
}
function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}