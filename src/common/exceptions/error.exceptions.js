export const ApplicationExceptions = ({
    message = "error" ,
    options = {
        cause:{status:400}
    }
} ={}) => {
    throw new Error(message , options);
}

export const ConflictExceptions = (message = "conflict" , issues ={} ) =>{
    return ApplicationExceptions({
        message ,
        options:{
            cause:{status:409, issues}
        }
    })
}

export const NotfoundExceptions = (message = "Notfound" , issues ={} ) =>{
    return ApplicationExceptions({
        message ,
        options:{
            cause:{status:404, ...issues}
        }
    })
}

export const BadExceptions = (message = "Bad Request Excaption" , issues ={} ) =>{
    return ApplicationExceptions({
        message ,
        options:{
            cause:{status:400, ...issues}
        }
    })
}

export const UnauthorizedExceptions = (message = "Unauthorized" , issues ={} ) =>{
    return ApplicationExceptions({
        message ,
        options:{
            cause:{status:401, ...issues}
        }
    })
}

export const ForbiddenExceptions = (message = "Forbidden" , issues ={} ) =>{
    return ApplicationExceptions({
        message ,
        options:{
            cause:{status:403, ...issues}
        }
    })
}