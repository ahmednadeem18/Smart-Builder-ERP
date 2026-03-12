import * as repo from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";

export const LoginUser = async (username, password) => {
  const user = await repo.GetUserForLogin(username, password);
  if (!user) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return { user, token };
};