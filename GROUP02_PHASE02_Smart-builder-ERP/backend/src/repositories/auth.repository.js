import { ExecuteQuery } from "../../utils/queryhandler.js";

export const GetUserForLogin = async (username, password) => {

  const query = `
    SELECT 
      u.id,
      u.username,
      r.name AS role
    FROM User u
    JOIN User_Role ur ON ur.user_id = u.id
    JOIN Role r ON r.id = ur.role_id
    WHERE u.username = ?
    AND u.password = ?`;

  const result = await ExecuteQuery(query, [username, password]);

  return result[0];
};

export const ChangePassword = async (userId, oldPassword, newPassword) => {

  const query = `
    UPDATE User
    SET password = ?
    WHERE id = ?
    AND password = ?
  `;

  const result = await ExecuteQuery(query, [newPassword, userId, oldPassword]);

  return result;
};