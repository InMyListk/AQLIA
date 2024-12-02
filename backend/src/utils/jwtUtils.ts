import jwt from 'jsonwebtoken';

const JWT_SECRET = (process.env.JWT_SECRET_KEY as string) || '5352864aqlia';

export const generateToken = (user: any) => {
  const token = jwt.sign(
    {
      username: user.username,
      password: user.password,
    },
    JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
  return token;
};
