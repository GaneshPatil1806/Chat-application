const generateMessage =(username,text)=>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateUrl =(username,text)=>{
    return {
        username,
        url:text,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,generateUrl
}