import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";
import { verifyAccessToken } from "../../common/utils/jtw.utils.js";

const authenticate = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw ApiError.unauthorized("Not Authenicated");
  }
  const decode = verifyAccessToken(token);
  const user = await User.findById(decode.id);

  if (!user) {
    throw ApiError.unauthorized("user no longer exits");
  }
  req.user = {
    id: user._id,
    role: user.name,
    name: user.name,
    email: user.email,
  };

  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        "You do not have permission to performe  this action",
      );
    }
    next();
  };
};

export { authenticate, authorize };
