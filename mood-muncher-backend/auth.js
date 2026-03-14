import jwt from 'jsonwebtoken';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const KEYVAULT_URI = process.env.KEYVAULT_URI;

let cachedJwtSecret = null;

async function getJwtSecret() {
  if (cachedJwtSecret) {
    return cachedJwtSecret;
  }

  if (process.env.JWT_SECRET) {
    cachedJwtSecret = process.env.JWT_SECRET;
    return cachedJwtSecret;
  }

  if (!KEYVAULT_URI) {
    throw new Error('Neither JWT_SECRET nor KEYVAULT_URI is set');
  }

  const credential = new DefaultAzureCredential();
  const client = new SecretClient(KEYVAULT_URI, credential);

  const secret = await client.getSecret('jwt-secret');

  if (!secret.value) {
    throw new Error('Secret "jwt-secret" is empty or missing');
  }

  cachedJwtSecret = secret.value;
  return cachedJwtSecret;
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwtSecret = await getJwtSecret();
    const payload = jwt.verify(token, jwtSecret);

    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export { getJwtSecret };
export default authMiddleware;