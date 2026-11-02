#!/usr/bin/env node
/**
 * Script para generar hash de contraseña seguro
 * Uso: node scripts/hash-password.js
 */

const crypto = require('crypto');

const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
  return `${salt.toString('hex')}:${PBKDF2_ITERATIONS}:${hash.toString('hex')}`;
}

if (require.main === module) {
  const password = process.argv[2];
  if (!password) {
    console.error('Uso: node scripts/hash-password.js <contraseña>');
    console.error('Ejemplo: node scripts/hash-password.js "mi-contraseña-segura"');
    process.exit(1);
  }
  console.log(hashPassword(password));
}