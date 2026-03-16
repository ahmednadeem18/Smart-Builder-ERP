import * as repo from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const hashPassword = (password) => {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
};

export const LoginUser = async (username, password) => {

  const hashedPass = hashPassword(password);

  const user = await repo.GetUserForLogin(username, hashedPass);

  if (!user) {
    const error = new Error("Invalid username or password");
    error.status = 400;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return { user, token };
};
// export const LoginUser = async (username, password) => {
//   let user;

//   // --- 🚀 BYPASS START ---
//   if (username === 'iman_material') {
//       // Hum manual user object bana rahe hain jo DB se milna tha
//       user = { id: 10, username: 'iman_material', role: 7 }; 
//   } else {
//       // Normal flow for everyone else
//       user = await repo.GetUserForLogin(username, password);
//   }
//   // --- BYPASS END ---

//   if (!user) {
//     const error = new Error("Invalid username or password");
//     error.status = 400;
//     throw error;
//   }

//   const token = jwt.sign(
//     { id: user.id, username: user.username, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "2h" }
//   );

//   return { user, token };
// };
export const ChangePassword = async (userId, oldPassword, newPassword) => {

  if (!passwordRegex.test(newPassword)) {
    const error = new Error(
      "Password must be 8+ chars with uppercase, lowercase, number and special character"
    );
    error.status = 400;
    throw error;
  }

  const hashedOldPassword = hashPassword(oldPassword);
  const hashedNewPassword = hashPassword(newPassword);

  const result = await repo.ChangePassword(userId, hashedOldPassword, hashedNewPassword);

  if (result.affectedRows === 0) {
    const error = new Error("Old password incorrect");
    error.status = 400;
    throw error;
  }

  return { message: "Password updated successfully" };
};