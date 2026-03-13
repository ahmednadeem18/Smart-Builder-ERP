import * as service from "../services/auth.services.js";

export const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await service.LoginUser(username, password);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const ChangePassword = async (req, res) => {
  try {

    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const result = await service.ChangePassword(userId, oldPassword, newPassword);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};