import mongoose from "mongoose"
import {User} from "../models/userModel.js"
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config.js"

const createToken = (_id) => {
    return jwt.sign({_id}, JWT_SECRET, {expiresIn: '1d'})
}

//login user
export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.login(email, password);

        //create token
        const token = createToken(user._id);

        res.status(200).json({
            email , token
        })
    }catch(error){
        res.status(400).json({
            error : error.message
        })
    }
}

//sign up user
export const signupUser = async (req, res) => {

    const {email, password, name , surname, picture} = req.body;

    try{
        const user = await User.signup(email, password ,name, surname , picture);

        //create token
        const token = createToken(user._id);

        res.status(200).json({
            name, surname, picture, email , token
        })
    }catch(error){
        res.status(400).json({
            error : error.message
        })
    }
}

//get user by id
export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      // Use Mongoose to find the user by their email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // If the user is found, send all user information
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

// Update user with profile picture
// export const updateUser = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const { name, surname } = req.body;

//     // Check if a file was uploaded
//     if (req.file) {
//       console.log('Uploaded file:', req.file); // Log the uploaded file for debugging
//       const picture = req.file.filename; // Get the filename of the uploaded image
//       await User.findOneAndUpdate({ email }, { name, surname, picture });
//     } else {
//       await User.findOneAndUpdate({ email }, { name, surname });
//     }

//     // Fetch and send the updated user information
//     const updatedUser = await User.findOne({ email });

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     console.log('Updated user:', updatedUser); // Log the updated user for debugging

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('Error:', error); // Log any errors for debugging
//     res.status(500).json({ error: error.message });
//   }
// };

// Update user with profile picture
export const updateUser = async (req, res) => {
  try {
    if (!req.body.name || !req.body.surname) {
      res.status(400).send({ message: "Please provide all the required fields" });
    }

    const { email } = req.params;

    // Check if an image file was uploaded
    let picture = null;
    if (req.file) {
      picture = req.file.filename; // Set the uploaded image file name
    }

    // Define the fields you want to update
    const updatedFields = {
      name: req.body.name,
      surname: req.body.surname,
      picture: picture || null, // Use the uploaded image file name, or null if no image was uploaded
    };

    // Use Mongoose to find the user by their email and update their profile
    const user = await User.findOneAndUpdate({ email }, updatedFields, {
      new: true, // Return the updated user document
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the user is found and updated successfully, send the updated user information
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};