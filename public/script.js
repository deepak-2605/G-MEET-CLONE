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
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
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
let text = jQuery("input");
jQuery(document).ready(function($){
    
    jQuery('html').keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {
          socket.emit('message', text.val());
          console.log(text.val());
          text.val('')
        }
      });
})
socket.on('createMessage',message=>{
    jQuery('ul').append(`<li class="message"><b>user</b><br>${message}</li>`);
    scrollToBottom();
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
// var jQuery=$.noConflict();
  
//  console.log('hello');
// jQuery( document ).ready(function( $ ) {
//   // Code that uses jQuery's $ can follow here.
//   console.log('hello');
// });
// // when press enter send message

// jQuery('html').keydown(function (e) {
//   if (e.which == 13 && text.val().length !== 0) {
//     socket.emit('message', text.val());
//     text.val('')
//   }
// });
// jQuery(document).ready(function($){
//      jQuery('#username').on('keyup paste',username_check);
//     console.log('hello');
//  });
 
 
//  function username_check(){ 
//      setTimeout( function() {
//          var username = jQuery('#username').val();
//          console.log(username);
//      },100);
//      if(username == "" || username.length <= 0){
//        alert("error");
//      }
//  }
const scrollToBottom=()=>{
    let d=jQuery('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
// Mute our Video

const muteUnmute=()=>{
    let enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        console.log('setMuted');
        setUnmuteButton();
    }
    else{
        console.log('setUnmuted');
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
const setMuteButton=()=>{
    // console.log('setMuted');
    const html=`
    <i class="fas fa-microphone"></i>
                    <span>Mute</span>
    `;
    console.log(html);
    document.querySelector('.main__mute_button').innerHTML=html;
}
const setUnmuteButton=()=>{
    const html=`
    <i class="fas fa-microphone-lines-slash"></i>
                    <span>Unmute</span>
    `
    console.log(html);
    document.querySelector('.main__mute_button').innerHTML=html;
}
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
