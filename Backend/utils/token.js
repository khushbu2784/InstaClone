import crypto from "crypto";

export const getResetToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const expire = Date.now() + 10 * 60 * 1000; // 10 mins
  return { token, hash, expire };
};
