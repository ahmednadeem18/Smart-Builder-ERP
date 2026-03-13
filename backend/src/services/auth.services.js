import * as repo from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

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

export const ChangePassword = async (userId, oldPassword, newPassword) => {

  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Password must be 8+ chars with uppercase, lowercase, number and special character"
    );
  }

  const result = await repo.ChangePassword(userId, oldPassword, newPassword);

  if (result.affectedRows === 0) {
    throw new Error("Old password incorrect");
  }

  return { message: "Password updated successfully" };
};