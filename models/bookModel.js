import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishYear: {
        type: Number,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Currently Reading", "Want to Read", "Finished"],
        default: "Currently Reading"
    },
    picture: {
        type: String,
        required: false,
        default: "https://img.freepik.com/free-vector/vector-blank-book-cover-isolated-white_1284-41904.jpg?size=626&ext=jpg&ga=GA1.1.1837886741.1694282915&semt=ais"
    }
},{timestamps: true})

export const Book = mongoose.model("Book", bookSchema)