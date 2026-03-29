import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import User from "../auth/auth.model.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.create(res, "Registration success", user);
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.create(res, "Login successfully", { user, accessToken });
};

const logout = async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "Logout Success");
};

const getMe = async (req, res) => {
  //TODO: Pending to write getMe In server
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User Profile", user);
};

export { register, login, logout, getMe };
