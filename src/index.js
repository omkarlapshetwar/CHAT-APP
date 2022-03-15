const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {dmessage}=require('./utils/message')
const {adduser,removeuser,getusersinroom,getuser}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.port || 3000

const publicpath=path.join(__dirname,'../public')

app.use(express.static(publicpath))
let message='welcome home';

io.on('connection',(socket)=>{
    console.log('new websocket connection')
  


   socket.on('join',({username,room},callback)=>{
       const {error,chat}=adduser({id:socket.id,username,room})
       //console.log(user)
       if(error){
           return callback(error)
       }
       socket.join(chat.room)
       socket.emit('message',dmessage('admin','welcome!'))
       socket.broadcast.to(chat.room).emit('message',dmessage('Admin',`${chat.username} has joined`))
       callback()
       io.to(chat.room).emit('sidebar',{
          room:chat.room,
          users: getusersinroom(chat.room),

       })


   })





    socket.on('mess',(msg,callback)=>{

        const chat2=getuser(socket.id)


        const filter=new Filter()
        if(filter.isProfane(msg)){
           return callback('profanity is not allowed')
        }
    //    count++;
  //  console.log(chat2)
       io.to(chat2.room).emit('message',dmessage(chat2.username,msg))
       callback()

    })
    socket.on('geolocation',(loc,callback)=>{


        const chat4=getuser(socket.id)

        io.to(chat4.room).emit('locationurl',{
            username:chat4.username,
            url:`https://google.com/maps?q=${loc[0]},${loc[1]}`,
            createdAT:new Date().getTime()
        })
        callback()
    })

    socket.on('disconnect',()=>{
       const chat3 = removeuser(socket.id)
      // console.log(user)
       if(chat3){
        io.to(chat3.room).emit('message',dmessage('Admin',`${chat3.username} has left`))
        
        io.to(chat3.room).emit('sidebar',{
            room:chat3.room,
            users: getusersinroom(chat3.room),
    
         })
       }
      
      
    })

})



server.listen(port,()=>{
    console.log(`the server is up on port ${port}`)
})