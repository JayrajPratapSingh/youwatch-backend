const asyncHandler = ( requestHandler) => {
(req, res, next)=>{
    Promise.
    resolve(requestHandler(req, res, next)).
    catch((err)=>{
        next(err)
    })
}
}

export {asyncHandler}






// Method Other:

// this is hirorder function and double small bracket means you are using two functions for passing higher order function argument
// Like 
// const asyncHandler = (func) => () =>{}
// const asyncHandler = (func) => async() =>{}
// 
// const asyncHandler = (func) => async(req, res, next) =>{  
// try {
//     await func(req, res, next)
    
// } catch (error) {
//     res.staus(error.code || 500).json({
//         success:false,
//         message: error.message
//     })
// }

// }