# 🌍 CronoEstrato 2023 - Juegos de la Tabla Cronoestratigráfica

> **Creado por Daniel Garcia Morueco**  
> Aplicación interactiva adaptada para **ordenador / escritorio** y **móvil / iPhone** para aprender y dominar la **Tabla Cronoestratigráfica Internacional (versión oficial ICS 2023/09)** de la *Comisión Internacional de Estratigrafía (IUGS)*.

---

## ✨ Características Principales

1. **💻 & 📱 Diseño Híbrido Responsivo (Ordenador + iPhone)**:
   - **En Ordenador:** Disposición panorámica moderna, menús superiores integrados en cabecera, vista en rejilla de períodos (2-3 columnas), juegos con tarjetas ampliadas y ventanas modales centradas como diálogos.
   - **En iPhone / Móvil:** Barra inferior táctil estilo iOS (*Human Interface Guidelines*), soporte para zonas seguras (*Safe Area* de notch / Dynamic Island), efectos *glassmorphism* y controles para uso con una sola mano.

2. **🔐 Sistema de Autenticación 100% Manual & Guardado de Progreso**:
   - **Registro y Acceso Manual:** Nombre, nombre de usuario único, correo y contraseña. (Sin proveedores externos como Google).
   - **Confirmación por Correo Obligatoria:** Al registrarse, se envía/genera un token único con enlace y botón oficial de activación. No se puede iniciar sesión hasta verificar.
   - **Modo Invitado (Aviso):** Si no se inicia sesión, el progreso (puntos, rachas, medallas) **no se guarda**; únicamente se persiste en la cuenta creada.
   - **Sesión persistente:** Cada usuario conserva su propio récord y rango geológico en su perfil.

3. **🛡️ Sistema de Cookies y Privacidad (GDPR)**:
   - Banner de cookies con aceptación explícita
   - Opciones para configurar preferencias
   - Cumplimiento de normativas de privacidad

4. **🛡️ Cifrado y Seguridad Avanzada**:
   - **Cifrado AES-256-GCM:** Datos sensibles encriptados con autenticación
   - **Hashing PBKDF2:** Contraseñas con 100,000 iteraciones
   - **Cookies de sesión seguras:** HTTPOnly, Secure (producción), SameSite=Lax
   - **Tokens criptográficos:** 64 caracteres hex generados aleatoriamente

5. **🎮 7 Modos de Juego Interactivos para Estudio y Memorización**:
   - **🧩 1. Orden Cronológico:** Ordena los estratos temporales mediante controles táctiles. Incluye 5 niveles de dificultad.
   - **⚡ 2. Trivia Estratigráfica:** Desafío contrarreloj con preguntas sobre extinciones masivas.
   - **🎯 3. Adivina el Millón (Ma):** Control deslizante interactivo para estimar la antigüedad.
   - **🃏 4. Fósiles y Estratos (Memoria):** Tablero de 16 cartas táctiles volteables.
   - **🕵️ ♂️ 5. El Intruso del Estrato:** 10 retos de deducción crítica.
   - **🧱 6. Columna Estratigráfica (Principio de Steno):** Constructor visual interactivo.
   - **🎴 7. Flashcards Geológicas 3D:** Tarjetas interactivas con giro 3D.

6. **💡 Mnemotécnicas Geológicas en Español**:
   - Reglas célebres para memorizar períodos (como *«Celia Ordena Su Dormitorio Con Pasión»* para el Paleozoico).

7. **🏆 Sistema de Progresión y Logros**:
   - Rango dinámico (desde *Geólogo Aprendiz* hasta *Catedrático Estratígrafo*).
   - Puntuación, rachas de aciertos y medallas coleccionables guardadas automáticamente.

8. **🔊 Efectos Sonoros Sintetizados**:
   - Generados en tiempo real mediante **Web Audio API** (sin descargas ni dependencias pesadas).

---

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js >= 18.0.0
- npm

### Pasos de instalación
```bash
# Clonar el repositorio
git clone https://github.com/danigarmor/Web-Interactiva-Tabla-Cronoestratigráfica-2023.git
cd Web-Interactiva-Tabla-Cronoestratigráfica-2023

# Instalar dependencias
npm install

# Crear archivo .env basado en .env.example
cp .env.example .env
# Editar .env con tus valores reales
```

### Configuración de Variables de Entorno

1. **Para desarrollo local:**
   ```
   PORT=8000
   ```

2. **Para producción (necesario SMTP real):**
   - Configura una App Password de Gmail o servidor SMTP
   - Genera una clave de encriptación: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Genera el hash de la contraseña admin: `npm run hash-password your-admin-password`

### Seguridad

⚠️ **Importante:** El archivo `.env` y `database.json` NO deben ser versionados. Ya están incluidos en `.gitignore`.

- Las credenciales SMTP se encriptan automáticamente almacenándolas en variables de entorno
- Las contraseñas se almacenan como hashes PBKDF2, nunca en texto plano
- Las cookies de sesión son HTTPOnly, Secure (en producción) y SameSite=Lax

### Ejecutar en Desarrollo
```bash
npm start
# Visita http://localhost:8000
```

---

## 📁 Estructura del Proyecto

```
PruebaAntigravity/
├── server.js              # Backend Node.js con API REST
├── app.js                 # Lógica frontend, juegos y autenticación
├── data.js                # Datos geológicos de la Tabla ICS 2023
├── styles.css             # Estilos CSS responsive
├── crypto-utils.js        # Utilidades de cifrado (AES-256-GCM)
├── index.html             # Página principal
├── verify.html            # Página de verificación de correo
├── package.json           # Dependencias
├── .env.example           # Plantilla de variables de entorno
├── .gitignore             # Archivos a excluir del repositorio
└── README.md              # Este archivo
```

---

## 🔐 Seguridad Implementada

1. **Cifrado AES-256-GCM** - Datos sensibles encriptados con autenticación
2. **Hashing PBKDF2** - Contraseñas con 100,000 iteraciones
3. **Cookies de sesión seguras** - HTTPOnly, Secure (producción), SameSite=Lax
4. **Tokens de verificación únicos** - 64 caracteres hex generados criptográficamente
5. **Protección CSRF** - Tokens únicos por sesión
6. **Validación de entrada** - Sanitización de datos de usuario

---

## 🎯 Uso

**Como estudiante de geología:**
1. Regístrate con tu correo
2. Verifica tu cuenta (revisa spam si no llega)
3. Explora la tabla cronoestratigráfica interactiva
4. Juega a los desafíos para memorizar períodos y fósiles
5. Gana medallas y sigue tu progreso

**Como administrador:**
1. Inicia sesión con credenciales de admin
2. Accede a la pestaña "Ayudas de los usuarios"
3. Revisa y gestiona sugerencias de la comunidad

---

## 📄 Licencia

MIT License - Ver archivo LICENSE

---

## 👤 Autor

**Daniel Garcia Morueco** (@danigarmor)