import express  from 'express';
import {
    loginUser,
    signupUser,
    getUserByEmail,
    updateUser 
} from '../controllers/userController.js'

import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';	


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
let upload = multer({ storage, fileFilter });

const router = express.Router();

//login route
router.post('/login', loginUser)


//signup route
router.post('/signup', signupUser)

//get user by id
router.get('/:email', getUserByEmail);

//update user
router.put('/:email', upload.single('picture'), updateUser);


export default router;