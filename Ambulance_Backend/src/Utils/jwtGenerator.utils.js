import jwt from "jsonwebtoken";

const jwtGen = (userId, phone, role) => {
  const accessToken = jwt.sign(
    {
      userId,
      phone,
      role,
    },
    process.env.Access_Token_Secret,
    { expiresIn: "15d" },
  );

  return accessToken;
};

export default jwtGen;
