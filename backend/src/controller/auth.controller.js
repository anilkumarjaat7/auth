import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function registerUser(req, res) {


  const {username,email,phone,password} = req.body;

  const isAlreadyRegistered = await userModel.findOne({$or: [{email},{username}]});

  if(isAlreadyRegistered){
    return res.status(400).json({
      message: "Username and email are already registered"
    });
  }
//   console.log("User registration data:", { username, email, phone, password });

// const hashedPassword = await bcrypt.hash(password, 10);

const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

const user =await userModel.create({username,email,phone,password:hashedPassword});
          
    res.status(201).json({
        message: "User registered successfully",
        user:{
            username:user.username,
            email:user.email,
            phone:user.phone,
        }
    });
}

export async function loginUser(req, res) {
    const {email,password} = req.body;

   const user = await userModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message: "Invalid email or password"
        }); }

            const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

          const isPasswordValid = hashedPassword === user.password;

          if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid email or password"
            });
          }

      const accesstoken = jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"1h"});


          res.status(200).json({
            message: "Login successful",
            user:{
                username:user.username,
                email:user.email,
                phone:user.phone,
            },
            token : accesstoken
          });
        }




export async function getMe(req, res) {
      const token = req.headers.authorization?.split(" ")[ 1 ];

        if(!token){
            return res.status(401).json({
                message: "Authorization token is missing"
            });
        }
     const decoded = jwt.verify(token, config.JWT_SECRET);
     const user =await userModel.findById(decoded.id);

 if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

     res.status(200).json({
        username:user.username,
        email:user.email,
        phone:user.phone
        });


}







