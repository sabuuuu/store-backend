import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../config.js"
import {User} from '../models/userModel.js'

export const requireAuth = async(req, res, next) => {
    //verify authentication
    const { authorization }= req.headers 

    if(!authorization){
        return res.status(401).json({error: 'Authorization required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, JWT_SECRET)

        req.user = await User.findOne({_id}).select('_id')

        next()
    }catch(error){
        console.log(error)
        return res.status(401).json({error: 'request is not authorized'})
    }
}