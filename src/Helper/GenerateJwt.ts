import Jwt from "jsonwebtoken";

const generteJwt = (id: string) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "10d",
  });
};

export default generteJwt;
