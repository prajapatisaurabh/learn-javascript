import { Request, Response } from "express";
import { signupPayloadModel } from "./models.js";
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
}

export default AuthenticationController;
