import express from 'express';
import {Book} from '../models/bookModel.js'
import { requireAuth } from '../middleware/requireAuth.js';

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

router.use(requireAuth);

//route to create a book
router.post('/', async (req, res) => {
    try{
        if(!req.body.title || !req.body.author || !req.body.publishYear || !req.body.pages || !req.body.status){
            res.status(400).send({message: 'Please provide all the required fields'});
        }
        const user_id = req.user._id;

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
            pages: req.body.pages,
            status: req.body.status,
            picture: req.body.picture,
            user_id,
        }

        const book = await Book.create(newBook);

        return res.status(201).send(book);

    }catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }    
})

//route to get all books
router.get('/', async (req, res) => {

    try{
        const user_id = req.user._id;

        const books = await Book.find({user_id});
        return res.status(200).json({
            count : books.length,
            data : books
        });
    }catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
})

//route to get a book by id
router.get('/:id', async (req, res) => {
    try{
        const  {id} = req.params;
        const book = await Book.findById(id);
        if(!book){
            res.status(404).send({message: 'Book not found'});
        }
        return res.status(200).send(book);
    }catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
})

//route to update a book by id^
router.put('/:id',upload.single('picture') ,async (req, res) => {
    try{

        if(!req.body.title || !req.body.author || !req.body.publishYear || !req.body.pages || !req.body.status){
            res.status(400).send({message: 'Please provide all the required fields'});
        }
        const  {id} = req.params;

        // Check if an image file was uploaded
        let picture = null;
        if (req.file) {
            picture = req.file.filename; // Set the uploaded image file name
        }


        // Define the fields you want to update
        const updatedFields = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
            pages: req.body.pages,
            status: req.body.status,
                };
  

        const book = await Book.findByIdAndUpdate(id, updatedFields);
        if(!book){
            res.status(404).send({message: 'Book not found'});
        }
        return res.status(200).send(book);
    }catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
})

//route to delete a book by id
router.delete('/:id', async (req, res) => {
    try{
        const  {id} = req.params;
        const book = await Book.findByIdAndDelete(id);
        if(!book){
            res.status(404).send({message: 'Book not found'});
        }
        return res.status(200).send(book);
    }catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
})

export default router;
