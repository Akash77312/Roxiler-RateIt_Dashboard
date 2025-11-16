import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import ownerRoutes from "./routes/owner.js";
import storesRoutes from "./routes/stores.js";
import usersRoutes from "./routes/users.js";
import db from "./config/db.js";


const app = express();
app.use(cors());
app.use(express.json());

// prefix API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/users", usersRoutes);

// TODO: add other routes: /api/admin, /api/stores, /api/users, etc.
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;
