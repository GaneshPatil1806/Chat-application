const generateMessage =(text)=>{
    return {
        text:text,
        createdAt: new Date().getTime()
    }
}

const generateUrl =(text)=>{
    return {
        url:text,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,generateUrl
}