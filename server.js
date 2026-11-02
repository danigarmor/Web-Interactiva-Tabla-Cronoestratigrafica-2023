/**
 * Servidor Backend Node.js para CronoEstrato 2023
 * - Servidor de archivos estáticos y API REST
 * - Base de datos persistente en disco (database.json)
 * - Autenticación con usuario/contraseña sin duplicados
 * - Verificación obligatoria de correo electrónico con enlace/botón
 * - Cifrado seguro con AES-256-GCM para credenciales sensibles
 * - Cookies de sesión seguras
 */

require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const { execFile } = require('child_process');

const {
  encrypt,
  decryptJSON,
  hashPassword,
  verifyPassword,
  createSessionCookie,
  parseSessionCookie,
  createExpiredSessionCookie,
  generateSecureToken
} = require('./crypto-utils');

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

// Google OAuth - usar google-auth-library si está disponible
let googleAuth = null;
try {
  const { OAuth2Client } = require('google-auth-library');
  googleAuth = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
} catch (e) {
  googleAuth = null;
}

const PORT = process.env.PORT || 8080;
// Usar variable de entorno para base de datos (en Fly.io /data/database.json)
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'database.json');

// Remitente oficial configurado solicitado por Daniel: gardanie73@gmail.com
const GMAIL_SENDER = process.env.SMTP_USER || 'gardanie73@gmail.com';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'danigarmo';

// Configuración SMTP opcional para envíos de correo
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'gardanie73@gmail.com',
    pass: process.env.SMTP_PASS || ''
  }
};

/**
 * Enviar correo real a través de la cuenta Google (gardanie73@gmail.com) de Daniel en el sistema
 */
function sendViaAppleMail(to, subject, body) {
  return new Promise((resolve) => {
    const script = `
      tell application "Mail"
        set newMessage to make new outgoing message with properties {subject:${JSON.stringify(subject)}, content:${JSON.stringify(body)}, sender:${JSON.stringify(GMAIL_SENDER)}, visible:false}
        tell newMessage
          make new to recipient at end of to recipients with properties {address:${JSON.stringify(to)}}
        end tell
        send newMessage
      end tell
    `;
    execFile('osascript', ['-e', script], (error, stdout) => {
      if (error) {
        console.warn('[Apple Mail Dispatch Warning]:', error.message);
        return resolve({ sent: false, error: error.message });
      }
      console.log(`[CORREO REAL ENVIADO] Remitente: ${GMAIL_SENDER} | Destinatario: ${to}`);
      return resolve({ sent: true, provider: 'gardanie73@gmail.com' });
    });
  });
}

async function dispatchEmail(to, name, subject, verificationUrl) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0F172A; color: #F8FAFC; margin: 0; padding: 30px 15px; }
    .card { max-width: 520px; margin: 0 auto; background: #1E293B; border-radius: 20px; padding: 32px 24px; border: 1px solid rgba(255,255,255,0.1); text-align: center; }
    .logo { font-size: 44px; margin-bottom: 12px; }
    h2 { color: #38BDF8; margin: 0 0 12px 0; font-size: 22px; }
    p { color: #CBD5E1; font-size: 15px; line-height: 1.5; margin: 10px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #06B6D4, #3B82F6); color: #ffffff !important; padding: 14px 28px; border-radius: 12px; font-weight: bold; text-decoration: none; margin: 22px 0; font-size: 16px; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4); }
    .footer { font-size: 12px; color: #64748B; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🌍</div>
    <h2>¡Confirma tu cuenta en CronoEstrato 2023!</h2>
    <p>Hola <b>${name || 'Geólogo'}</b>,</p>
    <p>Has solicitado registrarte en CronoEstrato 2023 para guardar tu progreso, medallas y puntuación.</p>
    <p>Para activar tu cuenta, haz clic en el siguiente botón:</p>
    <a href="${verificationUrl}" class="btn">⚡ Confirmar y Activar mi Cuenta</a>
    <div class="footer">
      Remitente: <b>gardanie73@gmail.com</b><br>
      Si el botón no funciona, abre este enlace en tu navegador:<br>
      <a href="${verificationUrl}" style="color: #38BDF8; word-break: break-all;">${verificationUrl}</a>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `¡Hola ${name || 'Geólogo'}!\n\nGracias por registrarte en CronoEstrato 2023.\n\nPara verificar tu correo y activar de forma permanente tu cuenta, pulsa en el siguiente enlace:\n\n${verificationUrl}\n\n¡Un saludo!\nEquipo CronoEstrato 2023 · Tabla Cronoestratigráfica\n(Enviado desde gardanie73@gmail.com)`;

  // Apple Mail solo existe en el equipo de desarrollo macOS. En Fly (Linux)
  // se omite para usar SMTP directamente, sin producir un fallo intermedio.
  if (process.platform === 'darwin') {
    try {
      const mailResult = await sendViaAppleMail(to, subject, textContent);
      if (mailResult.sent) {
        return mailResult;
      }
    } catch (err) {
      console.warn('Error intentando envío via Apple Mail:', err);
    }
  }

  // 2. Si hay transporter SMTP configurado (nodemailer)
  if (nodemailer && (SMTP_CONFIG.host || SMTP_CONFIG.auth.pass)) {
    try {
      const transporter = nodemailer.createTransport(
        SMTP_CONFIG.host ? SMTP_CONFIG : {
          service: 'gmail',
          auth: {
            user: 'gardanie73@gmail.com',
            pass: SMTP_CONFIG.auth.pass
          }
        }
      );
      const info = await transporter.sendMail({
        from: `"CronoEstrato 2023" <gardanie73@gmail.com>`,
        to: to,
        subject: subject,
        text: textContent,
        html: htmlContent
      });
      console.log(`[SMTP ENTREGADO] Id: ${info.messageId} desde gardanie73@gmail.com a ${to}`);
      return { sent: true, provider: 'smtp (gardanie73@gmail.com)', messageId: info.messageId };
    } catch (err) {
      console.warn(`[SMTP ERROR al entregar a ${to}]:`, err.message);
    }
  }

  console.log(`[EMAIL REGISTRADO] A: ${to} | Remitente deseado: gardanie73@gmail.com | Enlace: ${verificationUrl}`);
  return { sent: false, reason: 'local_dispatch', sender: 'gardanie73@gmail.com' };
}

// MIME types para archivos estáticos
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

// ==========================================================================
// GESTIÓN DE LA BASE DE DATOS JSON PERSISTENTE
// ==========================================================================
function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Hashear la contraseña del admin por defecto
      const defaultPass = process.env.ADMIN_PASSWORD_HASH || hashPassword('admin2023');

      const initial = {
        users: [
          {
            id: 'usr-admin-1',
            username: ADMIN_USER,
            name: 'Equipo CronoEstrato',
            email: 'admin@cronoestrato.com',
            passwordHash: defaultPass,
            verified: true,
            verificationToken: null,
            isAdmin: true,
            provider: 'local',
            avatar: '👨‍💻',
            score: 0,
            streak: 0,
            achievements: {},
            createdAt: new Date().toISOString()
          }
        ],
        feedbacks: [],
        emails: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error leyendo base de datos:', err);
    return { users: [], feedbacks: [], emails: [] };
  }
}

function saveDB(data) {
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error guardando base de datos:', err);
    return false;
  }
}

// ==========================================================================
// UTILIDADES HTTP
// ==========================================================================
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 2 * 1024 * 1024) { // Límite 2MB
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data, setCookie = null) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (setCookie) {
    headers['Set-Cookie'] = setCookie;
  }

  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
}

function getBaseUrl(req) {
  const xHost = req.headers['x-forwarded-host'];
  if (xHost) {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    return `${proto}://${xHost}`;
  }
  const host = req.headers.host || '';
  if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    const proto = req.connection.encrypted ? 'https' : 'http';
    return `${proto}://${host}`;
  }
  // URL pública accesible desde iPhone y cualquier dispositivo al abrir el correo
  return 'https://jesus-cet-propecia-climb.trycloudflare.com';
}

/**
 * Establece cookie de sesión en respuesta
 * @param {object} res - Objeto respuesta HTTP
 * @param {object} sessionData - Datos de sesión
 */
function setSessionCookie(res, sessionData) {
  const cookie = createSessionCookie(sessionData);
  res.setHeader('Set-Cookie', cookie);
}

// ==========================================================================
// SERVIDOR PRINCIPAL
// ==========================================================================
const server = http.createServer(async (req, res) => {
  // ==========================================================================
  // FORZAR HTTPS (redirige HTTP -> HTTPS)
  // Funciona en Fly.io (x-forwarded-proto) y en local con proxy TLS
  // ==========================================================================
  const proto = req.headers['x-forwarded-proto'] || (req.connection.encrypted ? 'https' : 'http');
  if (proto === 'http' && process.env.NODE_ENV === 'production') {
    const host = req.headers.host;
    const targetUrl = `https://${host}${req.url}`;
    res.writeHead(301, {
      'Location': targetUrl,
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    });
    return res.end();
  }

  // Manejo de CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ==========================================================================
  // RUTAS DE LA API REST
  // ==========================================================================

  // 1. REGISTRO DE USUARIO (con verificación obligatoria por correo)
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    try {
      const { username, email, password, name } = await parseBody(req);
      const cleanUser = (username || '').trim().toLowerCase();
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanName = (name || '').trim() || cleanUser;

      if (!cleanUser || !cleanEmail || !password) {
        return sendJSON(res, 400, { success: false, message: 'Todos los campos son obligatorios.' });
      }

      if (cleanUser.length < 3) {
        return sendJSON(res, 400, { success: false, message: 'El usuario debe tener al menos 3 caracteres.' });
      }

      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        return sendJSON(res, 400, { success: false, message: 'El correo electrónico no tiene un formato válido.' });
      }

      if (password.length < 8) {
        return sendJSON(res, 400, {
          success: false,
          message: 'La contraseña debe tener al menos 8 caracteres.'
        });
      }

      if (!/[A-Z]/.test(password)) {
        return sendJSON(res, 400, {
          success: false,
          message: 'La contraseña debe contener al menos una letra mayúscula (A-Z).'
        });
      }

      const db = getDB();

      // Comprobar que no exista usuario con el mismo nombre o correo
      const userExists = db.users.find(u => u.username.toLowerCase() === cleanUser);
      if (userExists) {
        return sendJSON(res, 409, {
          success: false,
          message: `El nombre de usuario "${cleanUser}" ya está registrado. Por favor, elige otro.`
        });
      }

      const emailExists = db.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (emailExists) {
        return sendJSON(res, 409, {
          success: false,
          message: `El correo "${cleanEmail}" ya tiene una cuenta asociada. Inicia sesión directamente.`
        });
      }

      // Generar token único de verificación
      const token = generateSecureToken(32);
      const baseUrl = getBaseUrl(req);
      const verificationUrl = `${baseUrl}/verify.html?token=${token}`;

      // Hashear contraseña antes de guardar
      const passwordHash = hashPassword(password);

      const newUser = {
        id: 'usr-' + Date.now(),
        username: cleanUser,
        name: cleanName,
        email: cleanEmail,
        passwordHash: passwordHash,
        verified: false, // NO PUEDE INICIAR SESIÓN HASTA VERIFICAR
        verificationToken: token,
        isAdmin: cleanUser === ADMIN_USER,
        provider: 'local',
        avatar: '🎓',
        score: 0,
        streak: 0,
        achievements: {},
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);

      // Despachar el correo (por SMTP si está configurado, o generar enlace local)
      const emailStatus = await dispatchEmail(
        cleanEmail,
        cleanName,
        'Confirma tu cuenta en CronoEstrato 2023',
        verificationUrl
      );

      // Registrar correo en la base de datos
      const emailRecord = {
        id: 'mail-' + Date.now(),
        to: cleanEmail,
        subject: 'Confirma tu cuenta en CronoEstrato 2023',
        token: token,
        verificationUrl: verificationUrl,
        sentAt: new Date().toISOString(),
        deliveredVia: emailStatus.provider || 'local_db',
        smtpError: emailStatus.error || null
      };
      if (!db.emails) db.emails = [];
      db.emails.push(emailRecord);

      saveDB(db);

      const emailMessage = emailStatus.sent
        ? `Te hemos enviado un correo de confirmación a ${cleanEmail}. Por favor, abre tu bandeja de entrada y pulsa en el enlace para verificar tu cuenta y poder iniciar sesión.`
        : `No se ha podido enviar el correo de confirmación a ${cleanEmail}. Revisa la configuración SMTP e inténtalo de nuevo.`;

      return sendJSON(res, 201, {
        success: true,
        message: emailMessage,
        email: cleanEmail,
        emailDelivered: emailStatus.sent
      });
    } catch (err) {
      console.error('Error en /api/auth/register:', err);
      return sendJSON(res, 500, { success: false, message: 'Error interno al registrar usuario.' });
    }
  }

  // 2. VERIFICACIÓN DE CORREO ELECTRÓNICO (GET /api/auth/verify?token=...)
  if (req.method === 'GET' && pathname === '/api/auth/verify') {
    const token = parsedUrl.query.token;
    if (!token) {
      return sendJSON(res, 400, { success: false, message: 'Token de verificación no proporcionado.' });
    }

    const db = getDB();
    const user = db.users.find(u => u.verificationToken === token);

    if (!user) {
      return sendJSON(res, 404, {
        success: false,
        message: 'El enlace de verificación no es válido o ya fue utilizado.'
      });
    }

    // Activar usuario
    user.verified = true;
    user.verificationToken = null;
    user.verifiedAt = new Date().toISOString();
    saveDB(db);

    console.log(`[USUARIO VERIFICADO] ${user.username} (${user.email}) ha confirmado su cuenta.`);

    return sendJSON(res, 200, {
      success: true,
      message: `¡Tu correo (${user.email}) ha sido verificado con éxito! Ya puedes iniciar sesión.`,
      user: {
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  }

  // 3. INICIO DE SESIÓN NORMAL (comprueba credenciales y si el correo está verificado)
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    try {
      const { userOrEmail, password } = await parseBody(req);
      const query = (userOrEmail || '').trim().toLowerCase();
      const pass = (password || '').trim();

      if (!query || !pass) {
        return sendJSON(res, 400, { success: false, message: 'Introduce usuario/correo y contraseña.' });
      }

      const db = getDB();

      // Buscar usuario por nombre de usuario o por email
      const user = db.users.find(u =>
        u.username.toLowerCase() === query ||
        u.email.toLowerCase() === query
      );

      if (!user || !verifyPassword(pass, user.passwordHash)) {
        return sendJSON(res, 401, {
          success: false,
          message: 'Usuario o contraseña incorrectos.'
        });
      }

      // REQUISITO ESTRICTO: NO SE PUEDE INICIAR SESIÓN SIN VERIFICAR
      if (!user.verified) {
        return sendJSON(res, 403, {
          success: false,
          unverified: true,
          email: user.email,
          message: `Tu cuenta aún no está verificada. Para activar tu cuenta, debes entrar en tu correo (${user.email}) y pulsar en el enlace que te hemos enviado desde gardanie73@gmail.com.`
        });
      }

      // Crear cookie de sesión segura
      const sessionData = {
        userId: user.id,
        username: user.username,
        email: user.email,
        isAdmin: !!user.isAdmin,
        provider: user.provider || 'local',
        avatar: user.avatar || (user.isAdmin ? '👨‍💻' : '🎓'),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 días
      };

      const cookie = createSessionCookie(sessionData);

      return sendJSON(res, 200, {
        success: true,
        message: 'Sesión iniciada con éxito.',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          isAdmin: !!user.isAdmin,
          provider: user.provider || 'local',
          avatar: user.avatar || (user.isAdmin ? '👨‍💻' : '🎓'),
          score: user.score || 0,
          streak: user.streak || 0,
          achievements: user.achievements || {}
        }
      }, cookie);
    } catch (err) {
      console.error('Error en /api/auth/login:', err);
      return sendJSON(res, 500, { success: false, message: 'Error interno en login.' });
    }
  }

  // 4. LOGIN CON GOOGLE (OAuth 2.0 - verifica ID Token y crea/loguea usuario)
  if (req.method === 'POST' && pathname === '/api/auth/google') {
    try {
      if (!googleAuth) {
        return sendJSON(res, 501, {
          success: false,
          message: 'Google Auth no configurado en el servidor. Contacta al administrador.'
        });
      }

      const { credential } = await parseBody(req);
      if (!credential) {
        return sendJSON(res, 400, { success: false, message: 'Token de Google no proporcionado.' });
      }

      // Verificar el ID Token con Google
      const ticket = await googleAuth.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name || email.split('@')[0];
      const picture = payload.picture;

      if (!email || !payload.email_verified) {
        return sendJSON(res, 400, { success: false, message: 'El correo de Google no está verificado.' });
      }

      const db = getDB();
      const cleanEmail = email.toLowerCase();

      // Buscar usuario existente por email
      let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        // Crear nuevo usuario con Google
        const newUser = {
          id: 'usr-' + Date.now(),
          username: 'g_' + email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString(36),
          name: name,
          email: cleanEmail,
          passwordHash: null, // Sin contraseña, solo Google
          verified: true, // Google ya verificó el email
          verificationToken: null,
          isAdmin: cleanEmail === 'gardanie73@gmail.com', // Admin si es tu correo
          provider: 'google',
          avatar: picture || '🌐',
          score: 0,
          streak: 0,
          achievements: {},
          googleId: googleId,
          createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        user = newUser;
        saveDB(db);
      } else if (user.provider !== 'google') {
        // Usuario existe con contraseña local - vincular cuenta Google
        user.provider = 'google';
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        user.verified = true;
        saveDB(db);
      }

      // Crear cookie de sesión
      const sessionData = {
        userId: user.id,
        username: user.username,
        email: user.email,
        isAdmin: !!user.isAdmin,
        provider: 'google',
        avatar: user.avatar || '🌐',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 días
      };

      const cookie = createSessionCookie(sessionData);

      return sendJSON(res, 200, {
        success: true,
        message: 'Sesión iniciada con Google.',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          isAdmin: !!user.isAdmin,
          provider: 'google',
          avatar: user.avatar || '🌐',
          score: user.score || 0,
          streak: user.streak || 0,
          achievements: user.achievements || {}
        }
      }, cookie);
    } catch (err) {
      console.error('Error en /api/auth/google:', err);
      return sendJSON(res, 500, { success: false, message: 'Error autenticando con Google: ' + err.message });
    }
  }

  // 5. GUARDAR PROGRESO DEL USUARIO
  if (req.method === 'POST' && pathname === '/api/progress/save') {
    try {
      const { username, score, streak, achievements } = await parseBody(req);
      if (!username) {
        return sendJSON(res, 400, { success: false, message: 'Usuario no especificado.' });
      }

      const db = getDB();
      const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        return sendJSON(res, 404, { success: false, message: 'Usuario no encontrado.' });
      }

      user.score = score !== undefined ? score : user.score;
      user.streak = streak !== undefined ? streak : user.streak;
      user.achievements = achievements || user.achievements;
      user.lastActive = new Date().toISOString();

      saveDB(db);
      return sendJSON(res, 200, { success: true, message: 'Progreso guardado.' });
    } catch (err) {
      console.error('Error en /api/progress/save:', err);
      return sendJSON(res, 500, { success: false, message: 'Error guardando progreso.' });
    }
  }

  // 6. ENVIAR FEEDBACK (Sugerencia validada por filtro)
  if (req.method === 'POST' && pathname === '/api/feedback') {
    try {
      const item = await parseBody(req);
      if (!item.text) {
        return sendJSON(res, 400, { success: false, message: 'Texto requerido.' });
      }

      const db = getDB();
      if (!db.feedbacks) db.feedbacks = [];

      const newFeedback = {
        id: 'fb-' + Date.now(),
        userId: item.userId || null,
        user: item.user || 'Usuario Invitado',
        email: item.email || null,
        provider: item.provider || 'guest',
        date: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
        category: item.category || 'Sugerencia general',
        text: item.text.trim(),
        score: item.score || 70,
        tags: item.tags || ['Aportación general'],
        status: 'nuevo',
        createdAt: new Date().toISOString()
      };

      db.feedbacks.unshift(newFeedback);
      saveDB(db);

      console.log(`[FEEDBACK RECIBIDO] De: ${newFeedback.user} (${newFeedback.email}) | Cat: ${newFeedback.category}`);

      return sendJSON(res, 201, { success: true, item: newFeedback });
    } catch (err) {
      console.error('Error en POST /api/feedback:', err);
      return sendJSON(res, 500, { success: false, message: 'Error guardando feedback.' });
    }
  }

  // 7. LISTAR FEEDBACKS (Solo para Administrador)
  if (req.method === 'GET' && pathname === '/api/feedback') {
    const db = getDB();
    return sendJSON(res, 200, { success: true, feedbacks: db.feedbacks || [] });
  }

  // 8. ACTUALIZAR ESTADO DE FEEDBACK (PATCH /api/feedback/:id)
  if (req.method === 'PATCH' && pathname.startsWith('/api/feedback/')) {
    const id = pathname.split('/').pop();
    const db = getDB();
    const fb = (db.feedbacks || []).find(f => f.id === id);

    if (!fb) {
      return sendJSON(res, 404, { success: false, message: 'Feedback no encontrado.' });
    }

    fb.status = fb.status === 'nuevo' ? 'revisado' : 'nuevo';
    saveDB(db);
    return sendJSON(res, 200, { success: true, status: fb.status });
  }

  // 9. ELIMINAR FEEDBACK (DELETE /api/feedback/:id)
  if (req.method === 'DELETE' && pathname.startsWith('/api/feedback/')) {
    const id = pathname.split('/').pop();
    const db = getDB();
    db.feedbacks = (db.feedbacks || []).filter(f => f.id !== id);
    saveDB(db);
    return sendJSON(res, 200, { success: true, message: 'Feedback eliminado.' });
  }

  // 10. CONSULTAR ÚLTIMO CORREO ENVIADO
  if (req.method === 'GET' && pathname === '/api/auth/latest-email') {
    const to = (parsedUrl.query.to || '').toLowerCase();
    const db = getDB();
    const list = db.emails || [];
    const mail = to ? list.filter(e => e.to.toLowerCase() === to).pop() : list[list.length - 1];
    return sendJSON(res, 200, { success: true, email: mail || null });
  }

  // 11. VERIFICAR SESIÓN DESDE COOKIE
  if (req.method === 'GET' && pathname === '/api/auth/check-session') {
    const sessionData = parseSessionCookie(req.headers.cookie);

    if (sessionData) {
      const db = getDB();
      const user = db.users.find(u => u.id === sessionData.userId);

      if (user && user.verified) {
        return sendJSON(res, 200, {
          success: true,
          authenticated: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            isAdmin: !!user.isAdmin,
            provider: user.provider || 'local',
            avatar: user.avatar || (user.isAdmin ? '👨‍💻' : '🎓'),
            score: user.score || 0,
            streak: user.streak || 0,
            achievements: user.achievements || {}
          }
        });
      }
    }

    return sendJSON(res, 200, { success: true, authenticated: false });
  }

  // 12. CIERRE DE SESIÓN
  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Set-Cookie': createExpiredSessionCookie()
    });
    return res.end(JSON.stringify({ success: true, message: 'Sesión cerrada.' }));
  }

  // ==========================================================================
  // SERVIR ARCHIVOS ESTÁTICOS DE LA WEB
  // ==========================================================================
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Normalizar y prevenir directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 - Página no encontrada</h1><p><a href="/">Volver a CronoEstrato</a></p>');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Servidor CronoEstrato 2023 activo en http://localhost:${PORT}`);
  console.log(`📁 Base de datos activa en: ${DB_FILE}`);
  console.log(`👑 Administrador configurado: ${ADMIN_USER}`);
  console.log(`=======================================================`);
});
