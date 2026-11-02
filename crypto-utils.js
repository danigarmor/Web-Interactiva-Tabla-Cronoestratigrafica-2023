/**
 * Utilidades de criptografía para CronoEstrato 2023
 * - Cifrado AES-256-GCM para datos sensibles
 * - Hashing seguro de contraseñas con PBKDF2
 * - Gestión segura de cookies de sesión
 */

const crypto = require('crypto');

// =============================================================================
// CONFIGURACIÓN DE CIFRADO
// =============================================================================
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // 96 bits para GCM
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;

// Obtener clave maestra desde variable de entorno o generar una temporal
function getMasterKey() {
  const envKey = process.env.ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) { // 32 bytes = 64 hex chars
    return Buffer.from(envKey, 'hex');
  }
  // En desarrollo, derivar de un secret consistente
  const secret = process.env.SESSION_SECRET || 'cronoestrato-2023-dev-secret-change-in-production';
  return crypto.pbkdf2Sync(secret, 'cronoestrato-salt', PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

// =============================================================================
// CIFRADO AES-256-GCM (Authenticated Encryption)
// =============================================================================

/**
 * Cifra datos sensibles (credenciales, tokens, claves API)
 * @param {string|object} data - Datos a cifrar
 * @returns {string} - Datos cifrados en formato: iv:authTag:encryptedData (hex)
 */
function encrypt(data) {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);

  const plaintext = typeof data === 'object' ? JSON.stringify(data) : String(data);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Formato: iv:authTag:encryptedData (todo en hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Descifra datos previamente cifrados con encrypt()
 * @param {string} encryptedData - Datos en formato iv:authTag:encryptedData
 * @returns {string|null} - Datos descifrados o null si falla
 */
function decrypt(encryptedData) {
  try {
    const masterKey = getMasterKey();
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      console.warn('[CRYPTO] Formato de datos cifrados inválido');
      return null;
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = Buffer.from(parts[2], 'hex');

    if (iv.length !== IV_LENGTH || authTag.length !== TAG_LENGTH) {
      console.warn('[CRYPTO] Longitud de IV o authTag inválida');
      return null;
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.warn('[CRYPTO] Error al descifrar:', err.message);
    return null;
  }
}

/**
 * Descifra y parsea JSON
 * @param {string} encryptedData
 * @returns {object|null}
 */
function decryptJSON(encryptedData) {
  const decrypted = decrypt(encryptedData);
  if (!decrypted) return null;
  try {
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

// =============================================================================
// HASHING DE CONTRASEÑAS CON PBKDF2
// =============================================================================

/**
 * Genera un hash seguro de contraseña usando PBKDF2-SHA256
 * @param {string} password - Contraseña en texto plano
 * @returns {string} - Hash en formato: salt:iterations:hash (hex)
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
  return `${salt.toString('hex')}:${PBKDF2_ITERATIONS}:${hash.toString('hex')}`;
}

/**
 * Verifica una contraseña contra su hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} storedHash - Hash almacenado (formato salt:iterations:hash)
 * @returns {boolean}
 */
function verifyPassword(password, storedHash) {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;

    const salt = Buffer.from(parts[0], 'hex');
    const iterations = parseInt(parts[1], 10);
    const hash = Buffer.from(parts[2], 'hex');

    const computedHash = crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, 'sha256');
    return crypto.timingSafeEqual(hash, computedHash);
  } catch {
    return false;
  }
}

// =============================================================================
// GESTIÓN SEGURA DE COOKIES DE SESIÓN
// =============================================================================

const SESSION_COOKIE_NAME = 'crono_session';
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,           // Inaccesible desde JavaScript (protección XSS)
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'lax',          // Protección CSRF
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  path: '/'
};

/**
 * Crea una cookie de sesión firmada
 * @param {object} sessionData - Datos de la sesión { userId, username, expiresAt }
 * @returns {string} - Cookie serializada
 */
function createSessionCookie(sessionData) {
  const payload = {
    ...sessionData,
    createdAt: Date.now(),
    // Firma HMAC para detectar manipulación
    signature: createSignature(sessionData)
  };

  const encrypted = encrypt(payload);
  return `${SESSION_COOKIE_NAME}=${encrypted}; ${serializeCookieOptions(SESSION_COOKIE_OPTIONS)}`;
}

/**
 * Parsea y valida una cookie de sesión
 * @param {string} cookieHeader - Header Cookie completo
 * @returns {object|null} - Datos de sesión válidos o null
 */
function parseSessionCookie(cookieHeader) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!sessionCookie) return null;

  const encrypted = sessionCookie.split('=')[1];
  const sessionData = decryptJSON(encrypted);

  if (!sessionData) return null;

  // Verificar firma
  const { signature, ...data } = sessionData;
  const expectedSignature = createSignature(data);

  if (signature !== expectedSignature) {
    console.warn('[SESSION] Firma de cookie inválida - posible manipulación');
    return null;
  }

  // Verificar expiración
  if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
    console.warn('[SESSION] Cookie expirada');
    return null;
  }

  return data;
}

/**
 * Crea firma HMAC-SHA256 para integridad de datos
 * @param {object} data
 * @returns {string}
 */
function createSignature(data) {
  const masterKey = getMasterKey();
  const hmac = crypto.createHmac('sha256', masterKey);
  hmac.update(JSON.stringify(data));
  return hmac.digest('hex');
}

/**
 * Serializa opciones de cookie para header Set-Cookie
 * @param {object} options
 * @returns {string}
 */
function serializeCookieOptions(options) {
  const parts = [];
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join('; ');
}

/**
 * Genera cookie de expiración (logout)
 * @returns {string}
 */
function createExpiredSessionCookie() {
  return `${SESSION_COOKIE_NAME}=; ${serializeCookieOptions({ ...SESSION_COOKIE_OPTIONS, maxAge: 0 })}`;
}

// =============================================================================
// GENERACIÓN DE TOKENS SEGUROS
// =============================================================================

/**
 * Genera token aleatorio seguro para verificación de email, reset password, etc.
 * @param {number} bytes - Bytes de entropía (default 32)
 * @returns {string}
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Genera ID único para usuarios, sesiones, etc.
 * @returns {string}
 */
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(8).toString('hex');
  return `${prefix}${prefix ? '-' : ''}${timestamp}-${random}`;
}

// =============================================================================
// EXPORTS
// =============================================================================
module.exports = {
  // Cifrado
  encrypt,
  decrypt,
  decryptJSON,

  // Passwords
  hashPassword,
  verifyPassword,

  // Sesiones/Cookies
  createSessionCookie,
  parseSessionCookie,
  createExpiredSessionCookie,
  SESSION_COOKIE_NAME,

  // Tokens
  generateSecureToken,
  generateId,

  // Config
  PBKDF2_ITERATIONS,
  ALGORITHM
};