const dmessage=(username,text)=>{
    return{
        username,
        text,
        createdAT:new Date().getTime()
    }

}
const dlocation=(url)=>{

    return{
        url:url,
        createdAT:new Date().getTime()
    }
}

module.exports={
    dmessage,
    dlocation
}