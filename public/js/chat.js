const socket=io()
const $messages=document.querySelector('#messages')
const messagetemplate=document.querySelector('#messagetemplate').innerHTML
const locationtemplate=document.querySelector('#loc-url').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML


const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    const $newmessage=$messages.lastElementChild
    const newmessagestyles=getComputedStyle($newmessage)
    const newmessagemargin=parseInt(newmessagestyles.marginBottom)
    const newmessageheight=$newmessage.offsetHeight+newmessagemargin
   // console.log(newmessageheight)
    const visibleheight=$messages.offsetHeight
    const containerheight=$messages.scrollHeight
    const scrolloffset=$messages.scrollTop+visibleheight
    if(containerheight-newmessageheight<=scrolloffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}


socket.on('message',(count)=>{
    console.log(count.text);
    const html=Mustache.render(messagetemplate,{
        username:count.username,
        count:count.text,
        createdAT:moment(count.createdAT).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('sidebar',({users,room})=>{
   // console.log(room,users)
    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#side-bar').innerHTML=html

})

socket.on('locationurl',(url)=>{
    console.log(url)
const html2=Mustache.render(locationtemplate,{
    username:url.username,
    url,
    createdAT:moment(url.createdAT).format('h:mm a')
})
$messages.insertAdjacentHTML('beforeend',html2)
})

 document.querySelector('#form').addEventListener('submit',(e)=>{
     // console.log('clicked')
     // socket.emit('increment')
     e.preventDefault()
     document.querySelector('button').setAttribute('disabled','disabled')
     let msg=document.querySelector("#msg").value
    // console.log(msg)
     socket.emit('mess',msg,(err)=>{
         document.querySelector('button').removeAttribute('disabled')
        document.querySelector("#msg").value=''
        document.querySelector("#msg").focus()

         if(err){
             return console.log(err)
         }
         console.log('the message was delivered')
     })
  
    
   })



 document.querySelector('#location').addEventListener('click',()=>{




     if(!navigator.geolocation){
         return alert('your browser doesnt upport navigator')
     }


     document.querySelector('#location').setAttribute('disabled','disabled')


     navigator.geolocation.getCurrentPosition((position)=>{

         console.log(position)
        const loc=[position.coords.latitude,position.coords.longitude]
        socket.emit('geolocation',loc,()=>{
            document.querySelector('#location').removeAttribute('disabled')

            console.log('location shared')
        })
     })

 })


socket.emit('join',{username,room},(error)=>{
   if(error){
       alert(error)
       location.href='/'
   }
})


