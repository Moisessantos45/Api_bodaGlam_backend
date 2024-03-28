import Jwt from "jsonwebtoken";

const generteJwt = (id: string) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, {
    encoding: "10d",
  });
};

export default generteJwt;
