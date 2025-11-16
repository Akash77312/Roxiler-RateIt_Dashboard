import db from "../config/db.js";

export async function countRatings() {
  const [rows] = await db.query("SELECT COUNT(*) AS total FROM ratings");
  return rows[0].total;
}
