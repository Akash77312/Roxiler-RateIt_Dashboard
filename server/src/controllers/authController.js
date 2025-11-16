import { findUserByEmail, createUser } from "../models/userModel.js";



export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    //console.log("USER FROM DB:", user); 

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const storeId = user.store_id ?? null;

    // to check user id and type and store id
    // console.log("FINAL LOGIN RESPONSE:", {
    //   id: user.id,
    //   role: user.role,
    //   storeId,
    // }); 

    delete user.password;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      storeId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}





export async function signup(req, res) {
  try {
    const { name, email, address, password } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "User exists" });
    const newUser = await createUser({ name, email, address, password });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
