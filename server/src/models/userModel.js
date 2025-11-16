import db from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await db.query(
    `SELECT 
        id, 
        name, 
        email, 
        address, 
        password, 
        role, 
        store_id 
     FROM users 
     WHERE email = ?`,
    [email]
  );
  return rows[0];
}



export async function createUser({ name, email, password, address, role = "USER" }) {
  await db.query(
    "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, address, role]
  );

  return await findUserByEmail(email);
}

export async function countUsers() {
  const [rows] = await db.query("SELECT COUNT(*) AS total FROM users");
  return rows[0].total;
}

export async function getUsersList() {
  const [rows] = await db.query("SELECT id, name, email, address, role, store_id AS storeId FROM users");
  return rows;
}

export async function changePassword(id, currentPassword, newPassword) {
  const [[user]] = await db.query("SELECT password FROM users WHERE id = ?", [id]);

  if (!user || user.password !== currentPassword) return false;

  await db.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, id]);

  return true;
}
