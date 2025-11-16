import express from "express";
import { getOwnerDashboard } from "../controllers/ownerController.js";

const router = express.Router();

router.get("/:ownerId/dashboard", getOwnerDashboard);


export default router;
