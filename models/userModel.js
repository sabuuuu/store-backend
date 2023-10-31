import mongoose from "mongoose";
import bcrypt from "bcrypt";
import  validator  from "validator";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    picture : {
        type : String,
        required : false,
        default : "anonymous-avatar-icon-25.jpg"
    }    
})

//static signup method
userSchema.statics.signup = async function (email, password ) {

    //validation
    if(!email ){
        throw Error('Email is required')
    }
    if(!password ){
        throw Error('Password is required')
    }

    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough')
    }

    const exists = await this.findOne({email})
    if(exists){
        throw Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    
    const user = await this.create({email, password : hash , picture});
    return user;
}

//static login method
userSchema.statics.login = async function (email, password) {
    //validation
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})
    if(!user){
        throw Error('incorrect email')
    }

    const match = await bcrypt.compare(password, user.password); 
    if(!match){
        throw Error('incorrect password')
    }

    return user
}


export const User = mongoose.model('User', userSchema);