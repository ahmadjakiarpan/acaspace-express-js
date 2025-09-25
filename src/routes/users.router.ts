import { Router } from "express";
import { registerUser, deleteUser, getUserById, getUsers, loginUser, updateUser } from "../controllers/users.controller"; 

const router = Router()

router.get("/", getUsers)
router.get("/:id", getUserById)
router.post("/register", registerUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)
router.post("/login", loginUser)
export default router