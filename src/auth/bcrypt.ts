import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);

  return await bcrypt.hash(password, salt);
}

export async function compareHash(
  password: string,
  bcryptHash: string
): Promise<boolean> {
  return await bcrypt.compare(password, bcryptHash);
}
