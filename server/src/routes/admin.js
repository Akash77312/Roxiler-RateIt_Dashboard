import express from "express";
import {
  getAdminStats,
  getAllUsers,
  getAllStores,
  createUserAdmin,
  createStoreAdmin,
  getUserDetails
} from "../controllers/adminController.js";

const router = express.Router();

// STATS
router.get("/stats", getAdminStats);

// USERS
router.get("/users", getAllUsers);
router.post("/users", createUserAdmin);
router.get("/users/:userId", getUserDetails);

// STORES
router.get("/stores", getAllStores);
router.post("/stores", createStoreAdmin);

export default router;
