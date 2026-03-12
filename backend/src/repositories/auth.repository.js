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
    AND u.password = SHA2(?,256)`;

  const result = await ExecuteQuery(query, [username, password]);

  return result[0];
};

