const express=require('express') ;//creating express server
const app=express(); 
const server=require('http').Server(app); //creating a server to be used with socket.io
const io=require('socket.io')(server);
const {v4:uuidV4}=require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));
let a=uuidV4();
app.get('/',(req,res)=>{
    res.redirect(`/${a}`);
    // dynamic room where need to redirect
})
app.get('/whiteboard',(req,res)=>{
    res.redirect(`/whiteboard/${a}`);
})
app.get('/whiteboard/:room',(req,res)=>{
    res.render('whiteboards',{roomId:req.params.room})
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
    // The second parameter is storing id in roomsID and making it available to view
})
// io.on will run every time someone connects to our web server.socket is something that user connects to

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
         socket.join(roomId);
        //  socket.to(roomId).broadcast.emit('user-connected',userId);
        // replacing this with newer version
        io.to(roomId).emit('user-connected', userId);
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message);
        })
        socket.on('disconnect',()=>{
            io.to(roomId).emit('user-disconnected', userId);
        })
    })
})
server.listen(process.env.PORT||3000); 

