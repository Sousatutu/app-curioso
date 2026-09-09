import crypto from 'crypto';

const USERNAME = process.env.AUTH_USERNAME || 'arthur';
const PASSWORD_HASH = process.env.AUTH_PASSWORD_HASH || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback_secret_for_signing_sessions_key_12345';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyCredentials(user: string, pass: string): boolean {
  if (user !== USERNAME) return false;
  return hashPassword(pass) === PASSWORD_HASH;
}

export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias
  const payload = username + ':' + expiresAt;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(payload + ':' + hmac).toString('base64');
}

export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return { valid: false };

    const [user, expiresStr, signature] = parts;
    const expiresAt = parseInt(expiresStr, 10);

    if (Date.now() > expiresAt) return { valid: false };

    const payload = user + ':' + expiresStr;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return { valid: true, username: user };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}
