import express from "express";
import {
  getAllStoresForUser,
  submitRating,
} from "../controllers/storeController.js";

const router = express.Router();

router.get("/", getAllStoresForUser);
router.post("/:storeId/rating", submitRating);

export default router;
