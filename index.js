import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {PORT , mongoDBURL } from './config.js'



import booksRoute from './routes/booksRoute.js'
import userRoutes from './routes/user.js'

const app = express();
app.use('/images', express.static('images'));
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.use('/books', booksRoute);
app.use('/', userRoutes);


mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }) 
    }).catch((err) => {
        console.log(err);
    })