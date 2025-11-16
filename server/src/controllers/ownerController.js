import db from "../config/db.js";

export async function getOwnerDashboard(req, res) {
  try {
    const ownerId = req.params.ownerId;

    // 1️⃣ Get all stores owned by this owner
    const [stores] = await db.query(
      "SELECT id, name FROM stores WHERE owner_id = ?",
      [ownerId]
    );

    if (stores.length === 0) {
      return res.json({ stores: [] });
    }

    // 2️⃣ For each store, fetch avg rating + raters
    const storeData = [];

    for (const store of stores) {
      const [avgRows] = await db.query(
        "SELECT AVG(rating_value) AS averageRating FROM ratings WHERE store_id = ?",
        [store.id]
      );

      const avgRating = Number(avgRows[0].averageRating ?? 0);

      const [raters] = await db.query(
        `SELECT u.name AS userName, r.rating_value AS ratingValue
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.store_id = ?`,
        [store.id]
      );

      storeData.push({
        storeId: store.id,
        storeName: store.name,
        averageRating: avgRating,
        raters,
      });
    }

    res.json({ stores: storeData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}




