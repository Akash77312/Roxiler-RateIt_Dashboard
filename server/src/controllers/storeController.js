import {
  getStoresForUserList,
  addRating,
} from "../models/storeModel.js";

export async function getAllStoresForUser(req, res) {
  res.json(await getStoresForUserList());
}

export async function submitRating(req, res) {
  try {
    const { userId, rating } = req.body;
    const { storeId } = req.params;

    await addRating(userId, storeId, rating);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
