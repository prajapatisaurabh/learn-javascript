import { NextFunction, Request, Response } from "express";
import { verifyUserToken } from "../auth/utils/token.js";

export function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid Authorization header format",
    });
  }

  const token = authHeader.split(" ")[1]; // Assuming "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      message: "Token missing from Authorization header",
    });
  }

  try {
    const decoded = verifyUserToken(token);

    // @ts-ignore
    req.user = decoded; // Attach decoded user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export function restrictTOAuthenticatedUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //  @ts-ignore
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized. Please log in to access this resource.",
    });
  }
  next();
}
