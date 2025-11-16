import db from "../config/db.js";

export async function getAdminStats(req, res) {
  try {
    const [[userCount]] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [[storeCount]] = await db.query("SELECT COUNT(*) AS total FROM stores");
    const [[ratingCount]] = await db.query("SELECT COUNT(*) AS total FROM ratings");

    res.json({
      users: userCount.total,
      stores: storeCount.total,
      ratings: ratingCount.total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, address, role, store_id AS storeId FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getAllStores(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT s.*, 
      (SELECT AVG(rating_value) FROM ratings WHERE store_id = s.id) AS rating
      FROM stores s
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function createUserAdmin(req, res) {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [[existing]] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, address || "", password, role]
    );

    const [[newUser]] = await db.query(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================================
// CREATE NEW STORE (ADMIN PANEL)
// ================================
export async function createStoreAdmin(req, res) {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !address || !owner_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate owner exists and role = OWNER
    const [[owner]] = await db.query(
      "SELECT id, role FROM users WHERE id = ?",
      [owner_id]
    );

    if (!owner || owner.role !== "OWNER") {
      return res.status(400).json({ message: "Invalid store owner" });
    }

    // Create store
    const [result] = await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email || null, address, owner_id]
    );

    const storeId = result.insertId;

    // Assign store to owner in users table
    await db.query(
      "UPDATE users SET store_id = ? WHERE id = ?",
      [storeId, owner_id]
    );

    // Return new store
    const [[newStore]] = await db.query(
      "SELECT * FROM stores WHERE id = ?",
      [storeId]
    );

    res.status(201).json(newStore);

  } catch (err) {
    console.error("Error in createStoreAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
}


// ================================
// GET USER DETAILS (Admin)
// ================================
export async function getUserDetails(req, res) {
  try {
    const { userId } = req.params;

    // Fetch user info
    const [[user]] = await db.query(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [userId]
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    let ownerRating = null;

    if (user.role === "OWNER") {
      const [[store]] = await db.query(
        "SELECT id FROM stores WHERE owner_id = ?",
        [userId]
      );

      if (store) {
        const [[rating]] = await db.query(
          "SELECT AVG(rating_value) AS avgRating FROM ratings WHERE store_id = ?",
          [store.id]
        );
        ownerRating = rating.avgRating || 0;
      }
    }

    res.json({ ...user, ownerRating });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}
