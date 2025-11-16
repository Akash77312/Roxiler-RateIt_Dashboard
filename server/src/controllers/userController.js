import { changePassword } from "../models/userModel.js";

export async function updatePassword(req, res) {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const success = await changePassword(userId, currentPassword, newPassword);

    if (!success)
      return res.status(400).json({ message: "Incorrect current password" });

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
