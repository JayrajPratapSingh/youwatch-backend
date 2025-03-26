import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({
userName:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index: true,
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
},
fullName:{
    type:String,
    required:true,
    trim:true,
    index:true
},
avatar:{
    type:String, // cloudinay url
    required:true, 
},
coverImage:{
type:String,
},
watchHistroy:[
    {
        type:Schema.Types.ObjectId,
        ref:'Video'
    }
],
password:{
    type:String,
    required:[true,"Password is required"]
},
refereshToken:{
    type:String
}
},
{
    timestamps:true
})
// the first parameter is to define before what you want to do that action : before: save, updateOne, deleteOne etc there aare so many methods, and second parameter aa a call back function that what you want to do 
// do not use arrow functions because they do not have access of "this" property and we want all schema access which we have defined
// this is a time consuming process so use async function always
userSchema.pre("save", async function (next) {
// this.password = bcrypt.hash(this.password, 10)  
// to has your password first parameter is what data you want to hash and second is how many rounds you want
// next will change change password each time when any data will save so to avoid this we will
next()

if(!this.isModified("password")) return next() // if password is not modified then return next flag and isModified is available method in this
this.password = bcrypt.hash(this.password, 10)
next()
}) 


// YOU cna define your own methods using methods keyword

userSchema.menthods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) // there is compare method to comapare password that it is hashed password and input password are correct
}

// make another method to genrate token

userSchema.methods.genrateAccessToken = function (){
return jwt.sign({
    _id: this._id,
    email: this.email,
    userName: this.userName,
    fullName: this.fullName, // key is comes form payload and this.fullName is from our database
},
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
}

)
}

userSchema.methods.genrateRefereshToken =function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName, // key is comes form payload and this.fullName is from our database
    },
    process.env.REFERESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFERESH_TOKEN_EXPIRY
    }
    
    )
    }


export const User = mongoose.model('User', userSchema);