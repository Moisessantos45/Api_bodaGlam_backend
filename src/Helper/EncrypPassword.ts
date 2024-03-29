import bcrypt from "bcrypt";

const encrypPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const comparePassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

export { encrypPassword, comparePassword };
