import { Router } from "express";
import { registerUser,loginUser, getMe } from "../controller/auth.controller.js";

const router = Router();

// user registration route
router.post("/register", registerUser);

// user login route
router.post("/login", loginUser);

router.get("/getme", getMe ); 

export default router;