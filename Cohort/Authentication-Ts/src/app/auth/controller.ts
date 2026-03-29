import { Request, Response } from "express";
import { loginPayloadModel, signupPayloadModel } from "./models.js";
import db from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import crypto from "crypto";

class AuthenticationController {
  public async handleSignup(req: Request, res: Response) {
    const signupData = await signupPayloadModel.safeParseAsync(req.body);
    if (signupData.error) {
      return res.status(400).json({
        message: "Invalid signup data",
        errors: signupData.error,
      });
    }

    const { firstname, lastname, email, password } = signupData.data;

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const salt = crypto.randomBytes(32).toString("hex");
    const hashedPassword = crypto
      .createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const [{ id }] = await db
      .insert(usersTable)
      .values({
        firstName: firstname,
        lastName: lastname,
        email,
        password: hashedPassword,
        salt,
      })
      .returning({ id: usersTable.id });

    return res.status(201).json({
      message: "User created successfully",
      data: { id },
    });
  }

  public async handleLogin(req: Request, res: Response) {
    const validate = await loginPayloadModel.safeParseAsync(req.body);

    if (validate.error) {
      return res.status(400).json({
        message: "Invalid login data",
        errors: validate.error,
      });
    }

    const { email, password } = validate.data;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(404).json({
        message: `User with email ${email} not found`,
      });
    }

    const salt = user.salt;
    const hashedPassword = crypto
      .createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //TODO: Generate and return JWT token here

    return res.status(200).json({
      message: "Login successful",
      data: { id: user.id },
    });
  }
}

export default AuthenticationController;
