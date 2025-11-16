import db from "../config/db.js";

export async function countStores() {
  const [rows] = await db.query("SELECT COUNT(*) AS total FROM stores");
  return rows[0].total;
}

export async function getStoresList() {
  const [rows] = await db.query(
    `SELECT s.id, s.name, s.address,
      (SELECT AVG(rating_value) FROM ratings WHERE store_id = s.id) AS rating
     FROM stores s`
  );
  return rows;
}

export async function getStoreById(id) {
  const [rows] = await db.query(
    `SELECT s.*, 
     (SELECT AVG(rating_value) FROM ratings WHERE store_id = ?) AS avgRating
     FROM stores s WHERE s.id = ?`,
    [id, id]
  );
  return rows[0];
}

export async function getStoreRaters(storeId) {
  const [rows] = await db.query(
    `SELECT u.name AS userName, r.rating_value AS ratingValue
     FROM ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.store_id = ?`,
    [storeId]
  );
  return rows;
}

export async function getStoresForUserList() {
  const [rows] = await db.query(
    `SELECT s.id, s.name, s.address,
      (SELECT AVG(rating_value) FROM ratings WHERE store_id = s.id) AS overallRating
     FROM stores s`
  );
  return rows;
}

export async function addRating(userId, storeId, ratingValue) {
  await db.query(
    "DELETE FROM ratings WHERE user_id = ? AND store_id = ?",
    [userId, storeId]
  );

  await db.query(
    "INSERT INTO ratings (user_id, store_id, rating_value) VALUES (?, ?, ?)",
    [userId, storeId, ratingValue]
  );
}
