import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export interface UsetTokenPayload {
  id: string;
}

export const createUserToken = (payload: UsetTokenPayload): string => {
  return sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};

export const verifyUserToken = (token: string) => {
  const payload = verify(token, process.env.JWT_SECRET!) as UsetTokenPayload;
  return payload;
};
