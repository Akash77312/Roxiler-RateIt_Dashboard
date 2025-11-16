import express from "express";
import { updatePassword } from "../controllers/userController.js";

const router = express.Router();

router.put("/:userId/password", updatePassword);

export default router;
