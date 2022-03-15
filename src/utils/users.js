const users=[]

const adduser=({id,username,room})=>{

    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:'username and room are required'
        }
    }

  const existinguser = users.find((user)=>{

        return user.room === room && user.username===username
    })

    if(existinguser){
        return{
            error:'username already exists'
        }
    }

    const chat={id,username,room}
    users.push(chat)
    return {chat}

}


const removeuser=(id)=>{

    const findindex=users.findIndex((user)=>{
        return user.id===id
    })


   if(findindex!==-1){
       return users.splice(findindex,1)[0]
   }

}

const getuser=(id)=>{

   const user= users.find((user)=>{

        return user.id===id

    })
    if(!user){
        return undefined
    }
    return user

}

const getusersinroom=(room)=>{

    room=room.trim().toLowerCase()
   const usersinroom = users.filter((user)=>{
        return user.room===room
    })
   
    return usersinroom

}






//console.log(removeuser(20))

 module.exports={
     adduser,
     removeuser,
     getusersinroom,
     getuser,

 }