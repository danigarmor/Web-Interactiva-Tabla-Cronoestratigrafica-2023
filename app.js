/**
 * APLICACIÓN CRO-ESTRATO 2023
 * Lógica completa, juegos interactivos, motor de sonido Web Audio y persistencia
 */

// ==========================================================================
// 1. MOTOR DE AUDIO SINTÉTICO (Web Audio API - Cero dependencias externas)
// ==========================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('crono_sound_enabled') !== 'false';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('crono_sound_enabled', this.enabled);
    return this.enabled;
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde Do Mayor brillante (C5, E5, G5, C6)
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + (idx * 0.06);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }

  playFlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
}

const sounds = new SoundEngine();


// ==========================================================================
// 2. GESTOR DE AUTENTICACIÓN, SESIONES Y CREDENCIALES
// ==========================================================================
const AuthManager = {
  currentUser: null, // { username, name, email, provider, isAdmin, avatar }

  init() {
    const session = localStorage.getItem('crono_active_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
      } catch (e) {
        this.currentUser = null;
      }
    }
    this.updateUI();
  },

  login(userObj) {
    this.currentUser = userObj;
    localStorage.setItem('crono_active_session', JSON.stringify(this.currentUser));
    
    // Cargar progreso del usuario
    State.loadForUser(this.currentUser.username);
    this.updateUI();
    sounds.playSuccess();
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('crono_active_session');
    // En modo invitado, el progreso vuelve al estado limpio de sesión
    State.resetToGuest();
    this.updateUI();
    sounds.playPop();

    // Si estaba en la pestaña de admin, volver a Explorar
    const activeAdminView = document.getElementById('view-admin');
    if (activeAdminView && activeAdminView.classList.contains('active')) {
      const exploreBtn = document.querySelector('[data-tab="explore"]');
      if (exploreBtn) exploreBtn.click();
    }
  },

  isAdmin() {
    return this.currentUser && this.currentUser.username === 'danigarmo' && this.currentUser.isAdmin;
  },

  updateUI() {
    const authBtnIcon = document.getElementById('auth-btn-icon');
    const authBtnLabel = document.getElementById('auth-btn-label');
    const authBtn = document.getElementById('btn-auth-trigger');
    const guestBanner = document.getElementById('guest-alert-banner');
    const adminNavBtn = document.getElementById('nav-item-admin');
    const mobileAdminTab = document.getElementById('mobile-tab-admin');
    const feedbackSenderName = document.getElementById('feedback-sender-name');
    const feedbackSenderAvatar = document.getElementById('feedback-sender-avatar');

    if (this.currentUser) {
      // Ocultar banner de invitado (porque ya está autenticado)
      if (guestBanner) guestBanner.style.display = 'none';

      if (authBtn) {
        authBtn.classList.add('logged-in');
        if (this.isAdmin()) {
          authBtn.classList.add('is-admin');
          authBtnIcon.textContent = '👑';
          authBtnLabel.textContent = 'Equipo (Admin)';
        } else {
          authBtn.classList.remove('is-admin');
          authBtnIcon.textContent = this.currentUser.avatar || '👤';
          authBtnLabel.textContent = this.currentUser.name ? this.currentUser.name.split(' ')[0] : this.currentUser.username;
        }
      }

      // Si es el usuario administrador (danigarmo), activar pestaña "Ayudas de los usuarios"
      if (this.isAdmin()) {
        if (adminNavBtn) adminNavBtn.style.display = 'flex';
        if (mobileAdminTab) mobileAdminTab.style.display = 'flex';
        FeedbackManager.updateAdminBadge();
      } else {
        if (adminNavBtn) adminNavBtn.style.display = 'none';
        if (mobileAdminTab) mobileAdminTab.style.display = 'none';
      }

      // Actualizar remitente en modal de feedback
      if (feedbackSenderName) {
        feedbackSenderName.innerHTML = `${this.currentUser.name} <span style="font-weight:normal; opacity:0.8;">(@${this.currentUser.username}) · ${this.currentUser.provider === 'google' ? 'Google' : 'Cuenta'}</span>`;
      }
      if (feedbackSenderAvatar) feedbackSenderAvatar.textContent = this.currentUser.avatar || '👤';

    } else {
      // Modo Invitado: mostrar aviso de que el progreso NO se guardará
      if (guestBanner) guestBanner.style.display = 'flex';

      if (authBtn) {
        authBtn.classList.remove('logged-in', 'is-admin');
        authBtnIcon.textContent = '👤';
        authBtnLabel.textContent = 'Entrar';
      }
      if (adminNavBtn) adminNavBtn.style.display = 'none';
      if (mobileAdminTab) mobileAdminTab.style.display = 'none';

      if (feedbackSenderName) {
        feedbackSenderName.textContent = 'Usuario Invitado (Inicia sesión para que el equipo vea tu nombre)';
      }
      if (feedbackSenderAvatar) feedbackSenderAvatar.textContent = '👤';
    }
  }
};


// ==========================================================================
// 3. GESTOR DE FEEDBACK Y PANEL DE "AYUDAS DE LOS USUARIOS"
// ==========================================================================
const FeedbackManager = {
  feedbacks: [],

  async init() {
    await this.loadFromServer();
  },

  async loadFromServer() {
    try {
      const resp = await fetch('/api/feedback');
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.feedbacks)) {
        this.feedbacks = data.feedbacks;
      } else {
        this.feedbacks = [...INITIAL_FEEDBACK_ITEMS];
      }
    } catch (e) {
      const saved = localStorage.getItem('crono_feedback_list');
      this.feedbacks = saved ? JSON.parse(saved) : [...INITIAL_FEEDBACK_ITEMS];
    }
    this.updateAdminBadge();
    if (AuthManager.isAdmin()) {
      this.renderAdminView();
    }
  },

  async add(item) {
    this.feedbacks.unshift(item);
    this.updateAdminBadge();
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      await this.loadFromServer();
    } catch (e) {
      localStorage.setItem('crono_feedback_list', JSON.stringify(this.feedbacks));
    }
  },

  async delete(id) {
    if (confirm('¿Eliminar este mensaje de ayuda?')) {
      sounds.playPop();
      try {
        await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
        await this.loadFromServer();
      } catch (e) {
        this.feedbacks = this.feedbacks.filter(f => f.id !== id);
        this.renderAdminView();
      }
    }
  },

  async toggleStatus(id) {
    sounds.playPop();
    try {
      await fetch(`/api/feedback/${id}`, { method: 'PATCH' });
      await this.loadFromServer();
    } catch (e) {
      const fb = this.feedbacks.find(f => f.id === id);
      if (fb) {
        fb.status = fb.status === 'nuevo' ? 'revisado' : 'nuevo';
        this.renderAdminView();
      }
    }
  },

  updateAdminBadge() {
    const badgeEl = document.getElementById('admin-badge-count');
    const newCount = this.feedbacks.filter(f => f.status === 'nuevo').length;
    if (badgeEl) {
      badgeEl.textContent = newCount;
      badgeEl.style.display = newCount > 0 ? 'inline-block' : 'none';
    }
  },

  renderAdminView(filter = 'all') {
    const container = document.getElementById('admin-feedback-container');
    const statTotal = document.getElementById('admin-stat-total');
    const statNew = document.getElementById('admin-stat-new');

    if (!container) return;

    if (statTotal) statTotal.textContent = this.feedbacks.length;
    const newCount = this.feedbacks.filter(f => f.status === 'nuevo').length;
    if (statNew) statNew.textContent = newCount;

    let filtered = this.feedbacks;
    if (filter === 'nuevo') filtered = this.feedbacks.filter(f => f.status === 'nuevo');
    else if (filter === 'revisado') filtered = this.feedbacks.filter(f => f.status === 'revisado');
    else if (filter === 'geologia') filtered = this.feedbacks.filter(f => f.category.toLowerCase().includes('geol'));
    else if (filter === 'ui') filtered = this.feedbacks.filter(f => f.category.toLowerCase().includes('interfaz') || f.category.toLowerCase().includes('ui') || f.category.toLowerCase().includes('diseño'));

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
          <p style="font-size:2rem; margin-bottom:8px;">📬</p>
          <p>No hay mensajes en este filtro.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(fb => {
      const card = document.createElement('div');
      card.className = `admin-card ${fb.status === 'nuevo' ? 'is-new' : 'is-reviewed'}`;

      let providerIcon = '👤';
      if (fb.provider === 'google') providerIcon = '🌐';
      else if (fb.provider === 'admin') providerIcon = '👑';

      card.innerHTML = `
        <div class="admin-card-header">
          <div class="admin-user-info">
            <div class="admin-user-avatar">${providerIcon}</div>
            <div class="admin-user-meta">
              <strong>${fb.user}</strong>
              <span>${fb.email ? fb.email : 'Sin correo'} · ${fb.provider === 'google' ? 'Cuenta Google' : (fb.provider === 'admin' ? 'Administrador' : 'Usuario')}</span>
            </div>
          </div>
          <span class="admin-date-tag">📅 ${fb.date}</span>
        </div>

        <div class="admin-card-badges">
          <span class="category-tag-pill">${fb.category}</span>
          <span class="ai-validation-tag">🛡️ IA Score: ${fb.score}% Relevante</span>
          ${(fb.tags || []).map(t => `<span class="badge-tag" style="background:rgba(255,255,255,0.08);">${t}</span>`).join('')}
          <span class="badge-tag" style="background:${fb.status === 'nuevo' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}; color:${fb.status === 'nuevo' ? '#FDE68A' : '#A7F3D0'};">
            ${fb.status === 'nuevo' ? '● Pendiente' : '✓ Revisado'}
          </span>
        </div>

        <div class="admin-msg-text">
          "${fb.text}"
        </div>

        <div class="admin-card-actions">
          <button class="btn-admin-action btn-mark-done" data-id="${fb.id}">
            ${fb.status === 'nuevo' ? '✓ Marcar como Revisado' : '↩ Reabrir'}
          </button>
          <button class="btn-admin-action btn-del" data-id="${fb.id}">
            🗑️ Eliminar
          </button>
        </div>
      `;

      card.querySelector('.btn-mark-done').addEventListener('click', () => {
        FeedbackManager.toggleStatus(fb.id);
      });
      card.querySelector('.btn-del').addEventListener('click', () => {
        FeedbackManager.delete(fb.id);
      });

      container.appendChild(card);
    });
  }
};


// ==========================================================================
// 4. GESTOR DE ESTADO, PUNTUACIÓN Y LOGROS (AISLADO POR USUARIO)
// ==========================================================================
const State = {
  score: 0,
  streak: 0,
  achievements: {
    first_look: false,
    order_master: false,
    trivia_streak: false,
    guesser_bullseye: false,
    memory_won: false,
    precambric_scholar: false,
    intruder_detective: false,
    steno_builder: false,
    flashcard_scholar: false
  },

  loadForUser(username) {
    const key = `crono_user_data_${username}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.score = data.score || 0;
        this.streak = data.streak || 0;
        this.achievements = { ...this.achievements, ...(data.achievements || {}) };
      } catch (e) {}
    } else {
      this.save();
    }
    this.updateHUD();
    renderAchievements();
  },

  resetToGuest() {
    this.score = 0;
    this.streak = 0;
    Object.keys(this.achievements).forEach(k => this.achievements[k] = false);
    this.updateHUD();
    renderAchievements();
  },

  save() {
    // REQUISITO ESTRICTO:
    // Si NO se inicia sesión, el progreso NO se guarda; solo se persiste en la cuenta creada.
    if (AuthManager.currentUser) {
      const payload = {
        username: AuthManager.currentUser.username,
        score: this.score,
        streak: this.streak,
        achievements: this.achievements
      };
      localStorage.setItem(`crono_user_data_${AuthManager.currentUser.username}`, JSON.stringify(payload));

      // Guardar también en la base de datos persistente (database.json)
      fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
    this.updateHUD();
  },

  addScore(pts) {
    this.score += pts;
    this.save();
  },

  incrementStreak() {
    this.streak += 1;
    if (this.streak >= 5 && !this.achievements.trivia_streak) {
      this.unlockAchievement('trivia_streak');
    }
    this.save();
  },

  resetStreak() {
    this.streak = 0;
    this.save();
  },

  unlockAchievement(id) {
    if (!this.achievements[id]) {
      this.achievements[id] = true;
      this.save();
      sounds.playSuccess();
      renderAchievements();
    }
  },

  getRank() {
    if (this.score >= 1000) return 'Catedrático Estratígrafo 🎓';
    if (this.score >= 600) return 'Maestro del Fanerozoico 🏆';
    if (this.score >= 350) return 'Estratígrafo de Campo ⛏️';
    if (this.score >= 120) return 'Buscador de Fósiles 🔍';
    return 'Geólogo Aprendiz 🌱';
  },

  updateHUD() {
    const scoreEl = document.getElementById('player-score');
    const streakEl = document.getElementById('player-streak');
    const rankEl = document.getElementById('player-rank');
    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = `🔥 ${this.streak}`;
    if (rankEl) rankEl.textContent = this.getRank();
  },

  resetAll() {
    if (AuthManager.currentUser) {
      const key = `crono_user_data_${AuthManager.currentUser.username}`;
      localStorage.removeItem(key);
    }
    this.score = 0;
    this.streak = 0;
    Object.keys(this.achievements).forEach(k => this.achievements[k] = false);
    this.save();
    renderAchievements();
  }
};


// ==========================================================================
// 5. INICIALIZACIÓN GENERAL Y NAVEGACIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();
  FeedbackManager.init();
  
  if (AuthManager.currentUser) {
    State.loadForUser(AuthManager.currentUser.username);
  } else {
    State.resetToGuest();
  }

  initSoundButton();
  initTabNavigation();
  initExplorer();
  initMnemonics();
  initAchievements();
  initModals();
  initGamesHub();
  initAuthUI();
  initFeedbackUI();
  initAdminFilters();
});

function initSoundButton() {
  const btn = document.getElementById('btn-sound-toggle');
  const icon = btn.querySelector('.sound-icon');
  icon.textContent = sounds.enabled ? '🔊' : '🔇';

  btn.addEventListener('click', () => {
    const isNowOn = sounds.toggle();
    icon.textContent = isNowOn ? '🔊' : '🔇';
    if (isNowOn) sounds.playPop();
  });
}

function resetGamesHub() {
  const activeContainer = document.getElementById('active-game-container');
  const selectorGrid = document.querySelector('.game-selector-grid');
  const screens = document.querySelectorAll('.game-screen');
  if (activeContainer && selectorGrid) {
    activeContainer.style.display = 'none';
    selectorGrid.style.display = '';
    if (screens) screens.forEach(s => s.style.display = 'none');
  }
}

function resetExplorer() {
  const detailModal = document.getElementById('detail-modal');
  if (detailModal) detailModal.style.display = 'none';
}

function initTabNavigation() {
  const mobileButtons = document.querySelectorAll('.tabbar-item');
  const desktopButtons = document.querySelectorAll('.desktop-nav-item');
  const tabViews = document.querySelectorAll('.tab-view');
  const brandLogo = document.getElementById('header-brand-logo');

  function switchTab(targetTab) {
    // Si intenta entrar a admin sin serlo, solicitar autenticación
    if (targetTab === 'admin') {
      if (!AuthManager.isAdmin()) {
        sounds.playError();
        openAuthModal('admin');
        return;
      }
      FeedbackManager.renderAdminView();
    }

    sounds.playPop();
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(8);

    // Si se selecciona o se vuelve a pulsar el apartado: volver al inicio de su sección
    if (targetTab === 'games') {
      resetGamesHub();
    } else if (targetTab === 'explore') {
      resetExplorer();
    }

    // Actualizar botones móviles
    mobileButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetTab);
    });

    // Actualizar botones de escritorio
    desktopButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetTab);
    });

    // Actualizar vista activa
    tabViews.forEach(v => {
      v.classList.toggle('active', v.id === `view-${targetTab}`);
    });

    // Scroll arriba suave tanto en contenedor principal de scroll como en ventana
    const mainEl = document.getElementById('main-content');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  mobileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  desktopButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Si se da en el logo o título superior, volver a la página principal de explorar
  if (brandLogo) {
    brandLogo.addEventListener('click', () => {
      switchTab('explore');
    });
  }
}


// ==========================================================================
// 4. EXPLORADOR INTERACTIVO ICS 2023
// ==========================================================================
function initExplorer() {
  const container = document.getElementById('chrono-tree-container');
  const searchInput = document.getElementById('explorer-search');
  const clearBtn = document.getElementById('btn-clear-search');
  const filterChips = document.querySelectorAll('#eon-filter-chips .chip');

  let activeEonFilter = 'all';
  let searchTerm = '';

  function renderTree() {
    container.innerHTML = '';

    CHRONO_DATA.eons.forEach((eon, eonIdx) => {
      // Filtrado por eón
      if (activeEonFilter !== 'all' && eon.id !== activeEonFilter) return;

      const isPhanerozoic = eon.id === 'phanerozoic';
      let matchesSearch = false;

      if (!searchTerm) {
        matchesSearch = true;
      } else {
        const q = searchTerm.toLowerCase();
        if (eon.nombre.toLowerCase().includes(q) || eon.descripcion.toLowerCase().includes(q)) {
          matchesSearch = true;
        }
      }

      // Tarjeta de Eón
      const eonCard = document.createElement('div');
      eonCard.className = `eon-card ${isPhanerozoic && !searchTerm ? 'expanded' : ''}`;
      if (searchTerm) eonCard.classList.add('expanded');

      // Cabecera del Eón
      const header = document.createElement('div');
      header.className = 'eon-card-header';
      header.style.borderLeftColor = eon.color;
      header.innerHTML = `
        <div class="eon-title-wrap">
          <h3 style="color: ${eon.color};">Eón ${eon.nombre}</h3>
          <div class="eon-range">${eon.rango}</div>
        </div>
        <span class="eon-arrow">›</span>
      `;

      header.addEventListener('click', () => {
        sounds.playPop();
        eonCard.classList.toggle('expanded');
        if (eon.id !== 'phanerozoic') {
          State.unlockAchievement('precambric_scholar');
        }
      });

      // Contenido del Eón
      const content = document.createElement('div');
      content.className = 'eon-content';

      // Descripción del eón
      const eonDesc = document.createElement('p');
      eonDesc.style.fontSize = '0.8rem';
      eonDesc.style.color = 'var(--text-secondary)';
      eonDesc.style.margin = '10px 0 6px 0';
      eonDesc.textContent = eon.descripcion;
      content.appendChild(eonDesc);

      // Renderizar Eras
      if (eon.eras && eon.eras.length > 0) {
        eon.eras.forEach(era => {
          const eraGroup = document.createElement('div');
          eraGroup.className = 'era-group';

          const eraHeader = document.createElement('div');
          eraHeader.className = 'era-header';
          eraHeader.style.backgroundColor = era.color;
          eraHeader.style.color = era.textColor || '#000';
          eraHeader.innerHTML = `
            <span>Era ${era.nombre}</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem;">${era.rango}</span>
          `;
          eraGroup.appendChild(eraHeader);

          // Lista de períodos
          const periodList = document.createElement('div');
          periodList.className = 'period-list';

          if (era.periodos && era.periodos.length > 0) {
            era.periodos.forEach(p => {
              // Comprobación de búsqueda
              if (searchTerm) {
                const q = searchTerm.toLowerCase();
                const matched = p.nombre.toLowerCase().includes(q) ||
                  (p.fosiles && p.fosiles.toLowerCase().includes(q)) ||
                  (p.hitos && p.hitos.toLowerCase().includes(q)) ||
                  (p.epocas && p.epocas.some(ep => ep.toLowerCase().includes(q)));
                if (!matched) return;
              }

              const item = document.createElement('div');
              item.className = 'period-item';
              item.style.backgroundColor = p.color;
              item.style.color = p.textColor || '#000';

              const numEpocas = p.subdivisiones ? p.subdivisiones.length : (p.epocas ? p.epocas.length : 0);
              const badgeText = numEpocas > 0 
                ? `<u>${numEpocas} ${numEpocas === 1 ? 'época' : 'épocas'}</u>` 
                : '<u>Período oficial</u>';

              item.innerHTML = `
                <div class="period-left">
                  <span class="period-name">${p.nombre}</span>
                  <span class="period-badge-era">${badgeText}</span>
                </div>
                <div class="period-right">
                  <span class="period-age">${p.rango}</span>
                </div>
              `;

              item.addEventListener('click', () => {
                sounds.playPop();
                openPeriodModal(p, era, eon);
              });

              periodList.appendChild(item);
            });
          }

          if (periodList.children.length > 0 || !searchTerm) {
            eraGroup.appendChild(periodList);
            content.appendChild(eraGroup);
          }
        });
      }

      eonCard.appendChild(header);
      eonCard.appendChild(content);

      if (content.children.length > 1 || matchesSearch) {
        container.appendChild(eonCard);
      }
    });

    if (container.children.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
          <p style="font-size:2rem; margin-bottom:8px;">🔍</p>
          <p>No se encontraron estratos con "<b>${searchTerm}</b>".</p>
          <p style="font-size:0.8rem; margin-top:4px;">Prueba con 'Trilobites', 'Cámbrico', 'Jurásico' o 'Holoceno'.</p>
        </div>
      `;
    }
  }

  // Eventos de Búsqueda
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    clearBtn.style.display = searchTerm ? 'block' : 'none';
    renderTree();
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchTerm = '';
    clearBtn.style.display = 'none';
    renderTree();
  });

  // Filtros de Eón
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sounds.playPop();
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeEonFilter = chip.getAttribute('data-filter');
      renderTree();
    });
  });

  renderTree();
}

// ==========================================================================
// FUNCIÓN PARA SUBRAYAR Y DESTACAR ZONAS IMPORTANTES (EXPLORADOR)
// ==========================================================================
function highlightImportantZones(text) {
  if (!text) return '';
  let formatted = text;

  // 1. Fechas y duraciones en Ma (ej. "66.0 Ma", "538.8 Ma", "251.9 - 66.0 Ma", "2.58 Ma")
  formatted = formatted.replace(/\b(\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*Ma)\b/g, 
    '<u class="important-zone-date">$1</u>');

  // 2. Límites cronoestratigráficos y clavos dorados
  const limits = [
    'límite K-Pg', 'límite P-Tr', 'límite K-T', 'límite basal oficial',
    'GSSP de Fortune Head', 'GSSP', 'Clavo dorado', 'clavos dorados', 
    'Estratotipo de límite y sección global'
  ];
  limits.forEach(term => {
    const reg = new RegExp(`(${term})`, 'gi');
    formatted = formatted.replace(reg, '<u class="important-zone-limit">$1</u>');
  });

  // 3. Fósiles clave y taxones de referencia
  const fossils = [
    'Homo sapiens', 'Mamuts', 'Smilodon', 'Dientes de sable', 'Australopithecus',
    'Megalodón', 'Hipparion', 'Nummulites', 'Basilosaurus', 'Hyracotherium',
    'Tyrannosaurus rex', 'Triceratops', 'Rudistas', 'Belemnites', 'Archaeopteryx',
    'Braquiosaurios', 'Diplodocus', 'Ammonites perisphinctes', 'Ammonites', 'Coelophysis',
    'Ictiosaurios', 'Ceratites', 'Dimetrodon', 'Glossopteris', 'Braquiópodos',
    'Meganeura', 'Lepidodendron', 'Sigillaria', 'Fusulinas', 'Dunkleosteus',
    'Tiktaalik', 'Rhynia', 'Cooksonia', 'Euriptéridos', 'Corales tabulados',
    'Graptolitos', 'Cameroceras', 'Conodontos', 'Trilobites', 'Paradoxides',
    'Olenellus', 'Anomalocaris', 'Hallucigenia', 'Fauna de Ediacara', 'Dickinsonia',
    'Spriggina', 'Charnia', 'Bangiomorpha', 'angiospermas', 'cocolitofóridos'
  ];
  fossils.forEach(term => {
    const reg = new RegExp(`(${term})`, 'gi');
    formatted = formatted.replace(reg, '<u class="important-zone-fossil">$1</u>');
  });

  // 4. Eventos cruciales de extinción y radiaciones biológicas
  const events = [
    'extinción masiva', 'extinciones masivas', 'Explosión Cámbrica', 'Gran Mortandad',
    'Pangea', 'Rodinia', 'Gondwana', 'Laurasia', 'Chicxulub', 'Tierra Bola de Nieve',
    'Snowball Earth', 'Máximo Térmico del Paleoceno-Eoceno', 'PETM', 'huevo amniota',
    'primeros dinosaurios', 'primeros mamíferos', 'primeras aves', 'primeras plantas vasculares',
    'primeros homínidos bípedos', 'Glaciaciones sucesivas', 'Glaciación Huroniana',
    'Gran Evento de Biodiversificación del Ordovícico', 'GOBE', 'orogenia Grenville',
    'Gran Evento de Oxidación', 'GOE', 'crisis de salinidad del Messiniense'
  ];
  events.forEach(term => {
    const reg = new RegExp(`(${term})`, 'gi');
    formatted = formatted.replace(reg, '<u class="important-zone-event">$1</u>');
  });

  return formatted;
}

function openPeriodModal(p, era, eon) {
  State.unlockAchievement('first_look');
  const modal = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const catBadge = document.getElementById('modal-category-badge');
  const time = document.getElementById('modal-time-range');
  const desc = document.getElementById('modal-description');
  const subWrap = document.getElementById('modal-subdivisions-list');
  const epochsWrap = document.getElementById('modal-epochs-list');
  const fossils = document.getElementById('modal-fossils');
  const milestones = document.getElementById('modal-milestones');
  const mnemonicSection = document.getElementById('modal-mnemonic-section');
  const mnemonic = document.getElementById('modal-mnemonic');

  title.textContent = p.nombre;
  title.style.color = p.color;
  catBadge.textContent = `${eon.nombre} › ${era.nombre}`;
  time.textContent = p.rango;

  // Descripción con zonas importantes subrayadas
  const descText = p.descripcion || era.descripcion || 'Escala cronoestratigráfica oficial ratificada por la Comisión Internacional de Estratigrafía (ICS).';
  desc.innerHTML = highlightImportantZones(descText);

  // Renderizar las subdivisiones de las épocas con nombres y pisos subrayados
  if (subWrap) {
    subWrap.innerHTML = '';

    if (p.subdivisiones && p.subdivisiones.length > 0) {
      p.subdivisiones.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'epoch-subdivision-card';

        // Cabecera con nombre de época subrayado
        const headerRow = document.createElement('div');
        headerRow.className = 'epoch-header-row';
        headerRow.innerHTML = `
          <u class="epoch-title-underline">Época ${sub.epoca}</u>
          <span class="epoch-time-pill">${sub.rango}</span>
        `;
        card.appendChild(headerRow);

        // Pisos / Edades (Subdivisiones)
        if (sub.pisos && sub.pisos.length > 0) {
          const subTitle = document.createElement('div');
          subTitle.className = 'stages-subtitle';
          subTitle.textContent = 'Subdivisiones (Pisos / Edades geológicas):';
          card.appendChild(subTitle);

          const stagesGrid = document.createElement('div');
          stagesGrid.className = 'stages-grid';

          sub.pisos.forEach(piso => {
            const chip = document.createElement('div');
            chip.className = `stage-chip-item ${piso.gssp ? 'highlight-gssp' : ''}`;
            chip.innerHTML = `
              <u class="stage-name-underline">${piso.nombre}</u>
              <span class="stage-time-tag">${piso.rango}</span>
              ${piso.gssp ? '<span class="gssp-mini-badge" title="Estratotipo de límite y sección global (Clavo dorado)">📍 GSSP</span>' : ''}
            `;
            stagesGrid.appendChild(chip);
          });

          card.appendChild(stagesGrid);
        }

        subWrap.appendChild(card);
      });
    } else if (p.epocas && p.epocas.length > 0) {
      p.epocas.forEach(ep => {
        const card = document.createElement('div');
        card.className = 'epoch-subdivision-card';
        card.innerHTML = `
          <div class="epoch-header-row">
            <u class="epoch-title-underline">${ep}</u>
            <span class="epoch-time-pill">Serie Oficial</span>
          </div>
        `;
        subWrap.appendChild(card);
      });
    } else if (p.edadesDestacadas && p.edadesDestacadas.length > 0) {
      const card = document.createElement('div');
      card.className = 'epoch-subdivision-card';
      const stagesGrid = document.createElement('div');
      stagesGrid.className = 'stages-grid';
      p.edadesDestacadas.forEach(ed => {
        const chip = document.createElement('div');
        chip.className = 'stage-chip-item';
        chip.innerHTML = `<u class="stage-name-underline">${ed}</u>`;
        stagesGrid.appendChild(chip);
      });
      card.appendChild(stagesGrid);
      subWrap.appendChild(card);
    }
  }

  // Fósiles guía con zonas importantes subrayadas
  const fossilsText = p.fosiles || 'Organismos marinos característicos de este intervalo geológico.';
  fossils.innerHTML = highlightImportantZones(fossilsText);

  // Hitos geológicos y evolutivos con zonas importantes subrayadas
  const milestonesText = p.hitos || 'Estratotipo de límite y sección global (GSSP / Clavo dorado).';
  milestones.innerHTML = highlightImportantZones(milestonesText);

  // Mnemotecnia
  if (p.mnemotecnia) {
    mnemonicSection.style.display = 'block';
    mnemonic.innerHTML = highlightImportantZones(p.mnemotecnia);
  } else {
    mnemonicSection.style.display = 'none';
  }

  modal.style.display = 'flex';
}


// ==========================================================================
// 5. HUB DE JUEGOS Y CONTROLADORES
// ==========================================================================
function initGamesHub() {
  const cards = document.querySelectorAll('.game-card');
  const selectorGrid = document.querySelector('.game-selector-grid');
  const activeContainer = document.getElementById('active-game-container');
  const btnBack = document.getElementById('btn-back-to-games');
  const activeTitle = document.getElementById('active-game-title');
  const screens = document.querySelectorAll('.game-screen');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      sounds.playPop();
      const gameKey = card.getAttribute('data-game');
      selectorGrid.style.display = 'none';
      activeContainer.style.display = 'block';
      screens.forEach(s => s.style.display = 'none');

      if (gameKey === 'order') {
        activeTitle.textContent = '🧩 Orden Cronológico';
        document.getElementById('game-order-view').style.display = 'block';
        initGameOrder();
      } else if (gameKey === 'trivia') {
        activeTitle.textContent = '⚡ Trivia Estratigráfica';
        document.getElementById('game-trivia-view').style.display = 'block';
        initGameTrivia();
      } else if (gameKey === 'guesser') {
        activeTitle.textContent = '🎯 Adivina el Millón (Ma)';
        document.getElementById('game-guesser-view').style.display = 'block';
        initGameGuesser();
      } else if (gameKey === 'memory') {
        activeTitle.textContent = '🃏 Fósiles y Estratos (Memoria)';
        document.getElementById('game-memory-view').style.display = 'block';
        initGameMemory();
      } else if (gameKey === 'intruder') {
        activeTitle.textContent = '🕵️‍♂️ El Intruso del Estrato';
        document.getElementById('game-intruder-view').style.display = 'block';
        initGameIntruder();
      } else if (gameKey === 'stacker') {
        activeTitle.textContent = '🧱 Columna Estratigráfica (Steno)';
        document.getElementById('game-stacker-view').style.display = 'block';
        initGameStacker();
      } else if (gameKey === 'flashcards') {
        activeTitle.textContent = '🎴 Flashcards Geológicas 3D';
        document.getElementById('game-flashcards-view').style.display = 'block';
        initGameFlashcards();
      }
    });
  });

  btnBack.addEventListener('click', () => {
    sounds.playPop();
    activeContainer.style.display = 'none';
    selectorGrid.style.display = '';
  });
}


// ==========================================================================
// 5.1 JUEGO 1: ORDEN CRONOLÓGICO (ARRASTRAR O BOTONES TÁCTILES)
// ==========================================================================
function initGameOrder() {
  const select = document.getElementById('order-level-select');
  const listEl = document.getElementById('order-items-list');
  const btnCheck = document.getElementById('btn-check-order');
  const btnReset = document.getElementById('btn-reset-order');
  const feedback = document.getElementById('order-feedback');

  // Conjuntos de datos ordenados cronológicamente (de más antiguo a más moderno)
  const LEVEL_SETS = [
    // Nivel 0: Eras Fanerozoico
    [
      { nombre: 'Paleozoico (538.8 - 251.9 Ma)', color: '#99C08D', textColor: '#111' },
      { nombre: 'Mesozoico (251.9 - 66.0 Ma)', color: '#34B2C9', textColor: '#fff' },
      { nombre: 'Cenozoico (66.0 Ma - Actual)', color: '#F2F91D', textColor: '#222' }
    ],
    // Nivel 1: Períodos del Paleozoico
    [
      { nombre: '1. Cámbrico (538.8 Ma)', color: '#7FA056', textColor: '#fff' },
      { nombre: '2. Ordovícico (485.4 Ma)', color: '#009270', textColor: '#fff' },
      { nombre: '3. Silúrico (443.8 Ma)', color: '#B3E1B6', textColor: '#111' },
      { nombre: '4. Devónico (419.2 Ma)', color: '#CB8C37', textColor: '#fff' },
      { nombre: '5. Carbonífero (358.9 Ma)', color: '#67A599', textColor: '#fff' },
      { nombre: '6. Pérmico (298.9 Ma)', color: '#F04028', textColor: '#fff' }
    ],
    // Nivel 2: Mesozoico y Cenozoico
    [
      { nombre: '1. Triásico (251.9 Ma)', color: '#812B92', textColor: '#fff' },
      { nombre: '2. Jurásico (201.4 Ma)', color: '#34B2C9', textColor: '#fff' },
      { nombre: '3. Cretácico (145.0 Ma)', color: '#7FC64E', textColor: '#111' },
      { nombre: '4. Paleógeno (66.0 Ma)', color: '#FD9A52', textColor: '#222' },
      { nombre: '5. Neógeno (23.03 Ma)', color: '#FFE619', textColor: '#222' },
      { nombre: '6. Cuaternario (2.58 Ma)', color: '#F9F97F', textColor: '#222' }
    ],
    // Nivel 3: Todos los 12 períodos del Fanerozoico
    PHANEROZOIC_PERIODS.map(p => ({
      nombre: p.nombre,
      color: p.color,
      textColor: p.textColor,
      id: p.id
    })),
    // Nivel 4: Épocas del Cenozoico
    [
      { nombre: '1. Paleoceno (66.0 Ma)', color: '#FDA75F', textColor: '#111' },
      { nombre: '2. Eoceno (56.0 Ma)', color: '#FDB77E', textColor: '#111' },
      { nombre: '3. Oligoceno (33.9 Ma)', color: '#FDC69C', textColor: '#111' },
      { nombre: '4. Mioceno (23.03 Ma)', color: '#FFE619', textColor: '#222' },
      { nombre: '5. Plioceno (5.33 Ma)', color: '#FFF275', textColor: '#222' },
      { nombre: '6. Pleistoceno (2.58 Ma)', color: '#F9F97F', textColor: '#222' },
      { nombre: '7. Holoceno (0.0117 Ma - Hoy)', color: '#FEFEE0', textColor: '#222' }
    ]
  ];

  let currentTargetList = [];
  let currentItems = [];

  function loadLevel(lvlIndex) {
    currentTargetList = [...LEVEL_SETS[lvlIndex]];
    // Mezclar aleatoriamente
    currentItems = [...currentTargetList].sort(() => Math.random() - 0.5);
    renderOrderList();
    feedback.style.display = 'none';
  }

  function renderOrderList() {
    listEl.innerHTML = '';
    currentItems.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'order-item';
      el.style.backgroundColor = item.color;
      el.style.color = item.textColor || '#fff';

      el.innerHTML = `
        <div class="order-item-left">
          <span class="order-handle">☰</span>
          <span>${item.nombre}</span>
        </div>
        <div class="order-controls">
          <button class="btn-move btn-up" data-idx="${idx}" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
          <button class="btn-move btn-down" data-idx="${idx}" ${idx === currentItems.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
        </div>
      `;

      listEl.appendChild(el);
    });

    // Control táctil subir / bajar
    listEl.querySelectorAll('.btn-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playFlip();
        const i = parseInt(e.currentTarget.getAttribute('data-idx'));
        if (i > 0) {
          const temp = currentItems[i];
          currentItems[i] = currentItems[i - 1];
          currentItems[i - 1] = temp;
          renderOrderList();
        }
      });
    });

    listEl.querySelectorAll('.btn-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playFlip();
        const i = parseInt(e.currentTarget.getAttribute('data-idx'));
        if (i < currentItems.length - 1) {
          const temp = currentItems[i];
          currentItems[i] = currentItems[i + 1];
          currentItems[i + 1] = temp;
          renderOrderList();
        }
      });
    });
  }

  select.onchange = (e) => {
    sounds.playPop();
    loadLevel(parseInt(e.target.value));
  };

  btnReset.onclick = () => {
    sounds.playPop();
    loadLevel(parseInt(select.value));
  };

  btnCheck.onclick = () => {
    let isCorrect = true;
    for (let i = 0; i < currentItems.length; i++) {
      if (currentItems[i].nombre !== currentTargetList[i].nombre) {
        isCorrect = false;
        break;
      }
    }

    feedback.style.display = 'block';
    if (isCorrect) {
      sounds.playSuccess();
      feedback.className = 'feedback-box success';
      feedback.innerHTML = `
        <b>🎉 ¡Excelente estratígrafo!</b> Has colocado la serie cronológica en el orden geológico exacto.
        <br><b>+80 Puntos sumados a tu perfil.</b>
      `;
      State.addScore(80);
      State.incrementStreak();
      State.unlockAchievement('order_master');
    } else {
      sounds.playError();
      feedback.className = 'feedback-box error';
      feedback.innerHTML = `
        <b>❌ Aún hay estratos descolocados.</b>
        Recuerda: arriba va lo <b>más antiguo</b> (base del estrato) y abajo lo <b>más reciente</b>.
        ¡Usa las flechas ▲ y ▼ para corregirlo!
      `;
      State.resetStreak();
    }
  };

  loadLevel(parseInt(select.value));
}


// ==========================================================================
// 5.2 JUEGO 2: TRIVIA ESTRATIGRÁFICA
// ==========================================================================
function initGameTrivia() {
  const pText = document.getElementById('trivia-question-text');
  const optGrid = document.getElementById('trivia-options-grid');
  const pIndex = document.getElementById('trivia-q-index');
  const timerTag = document.getElementById('trivia-timer');
  const progressFill = document.getElementById('trivia-progress-fill');
  const explCard = document.getElementById('trivia-explanation');
  const explText = document.getElementById('trivia-explanation-text');
  const btnNext = document.getElementById('btn-next-trivia');

  let shuffledQuestions = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
  let currentIndex = 0;
  let timerInterval = null;
  let timeLeft = 20;

  function loadQuestion() {
    explCard.style.display = 'none';
    optGrid.innerHTML = '';

    if (currentIndex >= shuffledQuestions.length) {
      // Fin del juego
      sounds.playSuccess();
      pText.innerHTML = `🏁 <b>¡Has completado toda la ronda de Trivia!</b><br>Gran trabajo repasando la Tabla Cronoestratigráfica 2023.`;
      pIndex.textContent = `Puntuación total: ${State.score} pts`;
      timerTag.style.display = 'none';
      progressFill.style.width = '100%';
      return;
    }

    const q = shuffledQuestions[currentIndex];
    pIndex.textContent = `Pregunta ${currentIndex + 1}/${shuffledQuestions.length}`;
    progressFill.style.width = `${((currentIndex) / shuffledQuestions.length) * 100}%`;
    pText.textContent = q.pregunta;

    // Iniciar temporizador
    clearInterval(timerInterval);
    timeLeft = 20;
    timerTag.style.display = 'inline-block';
    timerTag.textContent = `⏱ ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft--;
      timerTag.textContent = `⏱ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleAnswer(-1); // Tiempo agotado
      }
    }, 1000);

    q.opciones.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-opt-btn';
      btn.innerHTML = `<span style="opacity:0.6;">${['A', 'B', 'C', 'D'][idx]}.</span> <span>${opt}</span>`;
      btn.addEventListener('click', () => {
        clearInterval(timerInterval);
        handleAnswer(idx);
      });
      optGrid.appendChild(btn);
    });
  }

  function handleAnswer(selectedIdx) {
    const q = shuffledQuestions[currentIndex];
    const buttons = optGrid.querySelectorAll('.trivia-opt-btn');

    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correcta) {
        b.classList.add('correct');
      } else if (i === selectedIdx) {
        b.classList.add('wrong');
      }
    });

    if (selectedIdx === q.correcta) {
      sounds.playSuccess();
      const bonus = Math.max(10, timeLeft * 2);
      State.addScore(40 + bonus);
      State.incrementStreak();
      explText.innerHTML = `<b>✅ ¡Correcto! (+${40 + bonus} pts)</b><br>${q.explicacion}`;
    } else {
      sounds.playError();
      State.resetStreak();
      explText.innerHTML = `<b>❌ Respuesta incorrecta.</b><br>${q.explicacion}`;
    }

    explCard.style.display = 'block';
  }

  btnNext.onclick = () => {
    sounds.playPop();
    currentIndex++;
    loadQuestion();
  };

  loadQuestion();
}


// ==========================================================================
// 5.3 JUEGO 3: ESTIMADOR TEMPORAL (TIME GUESSER)
// ==========================================================================
function initGameGuesser() {
  const title = document.getElementById('guesser-item-title');
  const hint = document.getElementById('guesser-item-hint');
  const slider = document.getElementById('guesser-slider');
  const displayVal = document.getElementById('guesser-slider-val');
  const btnSubmit = document.getElementById('btn-submit-guess');
  const btnNext = document.getElementById('btn-next-guess');
  const feedback = document.getElementById('guesser-feedback');

  let shuffledItems = [...TIME_GUESSER_ITEMS].sort(() => Math.random() - 0.5);
  let currentIndex = 0;

  function loadItem() {
    feedback.style.display = 'none';
    btnSubmit.style.display = 'block';
    btnNext.style.display = 'none';
    slider.disabled = false;
    slider.value = 250;
    displayVal.textContent = '250';

    if (currentIndex >= shuffledItems.length) {
      shuffledItems = [...TIME_GUESSER_ITEMS].sort(() => Math.random() - 0.5);
      currentIndex = 0;
    }

    const cur = shuffledItems[currentIndex];
    title.textContent = cur.item;
    hint.textContent = `Pista: ${cur.pista}`;
  }

  slider.oninput = (e) => {
    displayVal.textContent = e.target.value;
  };

  btnSubmit.onclick = () => {
    sounds.playPop();
    const cur = shuffledItems[currentIndex];
    const userGuess = parseFloat(slider.value);
    const diff = Math.abs(userGuess - cur.correcto);

    slider.disabled = true;
    btnSubmit.style.display = 'none';
    btnNext.style.display = 'block';
    feedback.style.display = 'block';

    if (diff <= cur.margen * 0.4) {
      sounds.playSuccess();
      feedback.className = 'feedback-box success';
      feedback.innerHTML = `
        <b>🎯 ¡EN EL BLANCO!</b>
        La fecha exacta según la ICS 2023 es <b>${cur.correcto} Ma</b>. Tu estimación fue de <b>${userGuess} Ma</b> (error de sólo ${diff.toFixed(1)} Ma).
        <br><b>+100 Puntos.</b>
      `;
      State.addScore(100);
      State.incrementStreak();
      State.unlockAchievement('guesser_bullseye');
    } else if (diff <= cur.margen) {
      sounds.playSuccess();
      feedback.className = 'feedback-box success';
      feedback.innerHTML = `
        <b>🔥 ¡Muy cerca!</b>
        La fecha oficial es <b>${cur.correcto} Ma</b>. Tu cálculo de <b>${userGuess} Ma</b> entra dentro del margen de buena aproximación.
        <br><b>+50 Puntos.</b>
      `;
      State.addScore(50);
      State.incrementStreak();
    } else {
      sounds.playError();
      feedback.className = 'feedback-box error';
      feedback.innerHTML = `
        <b>❄️ Frío...</b>
        La fecha real según la tabla 2023 es <b>${cur.correcto} Ma</b>. Estimaste <b>${userGuess} Ma</b> (desvío de ${diff.toFixed(1)} Ma).
      `;
      State.resetStreak();
    }
  };

  btnNext.onclick = () => {
    sounds.playPop();
    currentIndex++;
    loadItem();
  };

  loadItem();
}


// ==========================================================================
// 5.4 JUEGO 4: MEMORY MATCH (FÓSILES Y ESTRATOS)
// ==========================================================================
function initGameMemory() {
  const board = document.getElementById('memory-board');
  const movesEl = document.getElementById('memory-moves');
  const pairsEl = document.getElementById('memory-pairs');
  const btnRestart = document.getElementById('btn-restart-memory');

  let cards = [];
  let flipped = [];
  let matchedCount = 0;
  let moves = 0;
  let isLocked = false;

  function setupBoard() {
    board.innerHTML = '';
    flipped = [];
    matchedCount = 0;
    moves = 0;
    isLocked = false;
    movesEl.textContent = '0';
    pairsEl.textContent = '0/8';

    // Generar cartas: por cada elemento, crear la carta de fósil y la carta de período
    const cardPairs = [];
    MEMORY_CARDS_DATA.forEach((item, idx) => {
      // Carta A: Fósil / Hito
      cardPairs.push({
        pairId: idx,
        type: 'fossil',
        text: item.nombre,
        icon: item.icon,
        color: item.color
      });
      // Carta B: Período
      cardPairs.push({
        pairId: idx,
        type: 'period',
        text: item.pareja,
        icon: '⏳',
        color: item.color
      });
    });

    cards = cardPairs.sort(() => Math.random() - 0.5);

    cards.forEach((cardData, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.setAttribute('data-idx', idx);

      cardEl.innerHTML = `
        <div class="card-face card-back">🧭</div>
        <div class="card-face card-front" style="border-color:${cardData.color};">
          <span class="card-front-icon">${cardData.icon}</span>
          <span class="card-front-text" style="color:${cardData.color};">${cardData.text}</span>
        </div>
      `;

      cardEl.addEventListener('click', () => onCardClicked(cardEl, cardData));
      board.appendChild(cardEl);
    });
  }

  function onCardClicked(cardEl, data) {
    if (isLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    sounds.playFlip();
    cardEl.classList.add('flipped');
    flipped.push({ el: cardEl, data: data });

    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = moves;
      isLocked = true;

      const [first, second] = flipped;
      if (first.data.pairId === second.data.pairId && first.data.type !== second.data.type) {
        // ¡Pareja encontrada!
        setTimeout(() => {
          sounds.playSuccess();
          first.el.classList.add('matched');
          second.el.classList.add('matched');
          matchedCount++;
          pairsEl.textContent = `${matchedCount}/8`;
          flipped = [];
          isLocked = false;

          if (matchedCount === 8) {
            State.addScore(150);
            State.unlockAchievement('memory_won');
            setTimeout(() => {
              alert(`🎉 ¡Enhorabuena! Has completado el juego de memoria estratigráfica en ${moves} movimientos.`);
            }, 300);
          }
        }, 350);
      } else {
        // Fallo
        setTimeout(() => {
          sounds.playError();
          first.el.classList.remove('flipped');
          second.el.classList.remove('flipped');
          flipped = [];
          isLocked = false;
        }, 850);
      }
    }
  }

  btnRestart.onclick = () => {
    sounds.playPop();
    setupBoard();
  };

  setupBoard();
}


// ==========================================================================
// 5.5 JUEGO 5: EL INTRUSO DEL ESTRATO
// ==========================================================================
function initGameIntruder() {
  const roundEl = document.getElementById('intruder-round-indicator');
  const themeEl = document.getElementById('intruder-theme-tag');
  const questionEl = document.getElementById('intruder-question-text');
  const gridEl = document.getElementById('intruder-options-grid');
  const feedbackEl = document.getElementById('intruder-feedback');
  const feedbackHeaderEl = document.getElementById('intruder-feedback-header');
  const explanationEl = document.getElementById('intruder-explanation-text');
  const btnNext = document.getElementById('btn-next-intruder');

  let shuffled = [...INTRUDER_CHALLENGES].sort(() => Math.random() - 0.5);
  let currentIndex = 0;

  function loadChallenge() {
    feedbackEl.style.display = 'none';
    gridEl.innerHTML = '';

    if (currentIndex >= shuffled.length) {
      sounds.playSuccess();
      themeEl.textContent = '¡CASOS RESUELTOS!';
      questionEl.innerHTML = '🏆 <b>¡Has completado todos los casos del Intruso del Estrato!</b><br>Has demostrado gran agudeza en límites y correlaciones geológicas.';
      roundEl.textContent = `Puntuación: ${State.score} pts`;
      btnNext.textContent = 'Jugar de nuevo 🔄';
      btnNext.onclick = () => {
        sounds.playPop();
        shuffled = [...INTRUDER_CHALLENGES].sort(() => Math.random() - 0.5);
        currentIndex = 0;
        loadChallenge();
      };
      feedbackEl.style.display = 'block';
      feedbackHeaderEl.textContent = '🌟 Misión Cumplida';
      explanationEl.textContent = 'Has identificado con éxito las anomalías estratigráficas de las eras y períodos geológicos.';
      return;
    }

    const current = shuffled[currentIndex];
    roundEl.textContent = `Caso ${currentIndex + 1}/${shuffled.length}`;
    themeEl.textContent = current.tema;
    questionEl.textContent = current.pregunta;

    // Mezclar opciones
    const shuffledOptions = [...current.opciones].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'intruder-opt-btn';
      btn.innerHTML = `<span>${opt.texto}</span> <span style="opacity:0.4;">🔎</span>`;

      btn.addEventListener('click', () => {
        handlePick(opt, btn, shuffledOptions, current);
      });

      gridEl.appendChild(btn);
    });

    btnNext.textContent = currentIndex === shuffled.length - 1 ? 'Finalizar Reto ›' : 'Siguiente Caso ›';
    btnNext.onclick = () => {
      sounds.playPop();
      currentIndex++;
      loadChallenge();
    };
  }

  function handlePick(selectedOpt, selectedBtn, options, current) {
    const allBtns = gridEl.querySelectorAll('.intruder-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    feedbackEl.style.display = 'block';

    if (selectedOpt.esIntruso) {
      sounds.playSuccess();
      selectedBtn.classList.add('correct-intruder');
      feedbackHeaderEl.innerHTML = '<span style="color:#6EE7B7;">🎉 ¡CORRECTO! Has descubierto al intruso.</span>';
      explanationEl.textContent = current.explicacion;
      State.addScore(100);
      State.incrementStreak();
      State.unlockAchievement('intruder_detective');
    } else {
      sounds.playError();
      selectedBtn.classList.add('wrong-pick');
      allBtns.forEach((b, i) => {
        if (options[i].esIntruso) {
          b.classList.add('correct-intruder');
        } else {
          b.classList.add('is-not-intruder');
        }
      });
      feedbackHeaderEl.innerHTML = '<span style="color:#FDA4AF;">❌ Ese elemento sí pertenece al estrato.</span>';
      explanationEl.textContent = current.explicacion;
      State.resetStreak();
    }
  }

  loadChallenge();
}


// ==========================================================================
// 5.6 JUEGO 6: COLUMNA ESTRATIGRÁFICA (PRINCIPIO DE SUPERPOSICIÓN DE STENO)
// ==========================================================================
function initGameStacker() {
  const levelSelect = document.getElementById('stacker-level-select');
  const descEl = document.getElementById('stacker-desc');
  const pillarEl = document.getElementById('stacker-pillar');
  const paletteEl = document.getElementById('stacker-palette');
  const btnCheck = document.getElementById('btn-check-stacker');
  const btnReset = document.getElementById('btn-reset-stacker');
  const feedbackEl = document.getElementById('stacker-feedback');

  let currentLevel = null;
  let stratumSlots = [];
  let availableStrata = [];

  function loadLevel(lvlIdx) {
    currentLevel = STRATIGRAPHIC_LEVELS[lvlIdx];
    descEl.textContent = currentLevel.descripcion;
    feedbackEl.style.display = 'none';

    const total = currentLevel.estratos.length;
    stratumSlots = new Array(total).fill(null);
    availableStrata = [...currentLevel.estratos].sort(() => Math.random() - 0.5);

    renderPillar();
    renderPalette();
  }

  function renderPillar() {
    pillarEl.innerHTML = '';
    const total = currentLevel.estratos.length;

    // Cima (arriba, ordenSteno = total) a Base (abajo, ordenSteno = 1)
    for (let slotPos = total; slotPos >= 1; slotPos--) {
      const arrayIndex = slotPos - 1;
      const placed = stratumSlots[arrayIndex];

      const slotEl = document.createElement('div');
      slotEl.className = `stacker-slot ${placed ? 'filled' : ''}`;

      if (placed) {
        slotEl.style.backgroundColor = placed.color;
        slotEl.style.color = placed.textColor || '#fff';
        slotEl.innerHTML = `
          <div class="slot-content">
            <span>${placed.posicion}: <b>${placed.nombre}</b> (${placed.inicioMa} - ${placed.finMa} Ma)</span>
            <button class="btn-remove-stratum" title="Quitar estrato">✕</button>
          </div>
        `;

        const btnRemove = slotEl.querySelector('.btn-remove-stratum');
        btnRemove.addEventListener('click', (e) => {
          e.stopPropagation();
          sounds.playPop();
          stratumSlots[arrayIndex] = null;
          renderPillar();
          renderPalette();
        });
      } else {
        slotEl.style.backgroundColor = '';
        slotEl.style.color = '';
        const levelTag = slotPos === total ? 'Cima (Más Reciente)' : (slotPos === 1 ? 'Base (Más Antiguo)' : `Nivel ${slotPos}`);
        slotEl.innerHTML = `
          <span class="slot-label">[ Ranura vacía • ${levelTag} ]</span>
          <span style="opacity:0.4; font-size:0.75rem;">Toca para colocar 📥</span>
        `;

        slotEl.addEventListener('click', () => {
          const nextAvailable = availableStrata.find(st => !stratumSlots.some(s => s && s.id === st.id));
          if (nextAvailable) {
            sounds.playFlip();
            stratumSlots[arrayIndex] = nextAvailable;
            renderPillar();
            renderPalette();
          }
        });
      }

      pillarEl.appendChild(slotEl);
    }
  }

  function renderPalette() {
    paletteEl.innerHTML = '';
    
    availableStrata.forEach(st => {
      const isUsed = stratumSlots.some(slot => slot && slot.id === st.id);
      const chip = document.createElement('div');
      chip.className = `stacker-stratum-chip ${isUsed ? 'used' : ''}`;
      chip.style.backgroundColor = st.color;
      chip.style.color = st.textColor || '#fff';

      chip.innerHTML = `
        <span>${st.nombre}</span>
        <span class="chip-ma-tag">${st.inicioMa} - ${st.finMa} Ma</span>
      `;

      if (!isUsed) {
        chip.addEventListener('click', () => {
          sounds.playFlip();
          const emptyIndex = stratumSlots.findIndex(s => s === null);
          if (emptyIndex !== -1) {
            stratumSlots[emptyIndex] = st;
            renderPillar();
            renderPalette();
          }
        });
      }

      paletteEl.appendChild(chip);
    });
  }

  btnReset.onclick = () => {
    sounds.playPop();
    loadLevel(parseInt(levelSelect.value));
  };

  levelSelect.onchange = (e) => {
    sounds.playPop();
    loadLevel(parseInt(e.target.value));
  };

  btnCheck.onclick = () => {
    const total = currentLevel.estratos.length;
    const emptyCount = stratumSlots.filter(s => s === null).length;
    feedbackEl.style.display = 'block';

    if (emptyCount > 0) {
      sounds.playError();
      feedbackEl.className = 'feedback-box error';
      feedbackEl.innerHTML = `<b>⚠️ Faltan estratos por colocar.</b> Rellena todas las ${total} ranuras de la columna antes de comprobar.`;
      return;
    }

    let isCorrect = true;
    for (let i = 0; i < total; i++) {
      if (stratumSlots[i].ordenSteno !== (i + 1)) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      sounds.playSuccess();
      feedbackEl.className = 'feedback-box success';
      feedbackEl.innerHTML = `
        <b>🎉 ¡Columna estratigráfica impecable!</b><br>
        Has aplicado a la perfección la <b>Ley de Superposición de Estratos de Nicolás Steno</b> (1669).<br>
        Los estratos más antiguos quedan en la base y los más recientes en la cima.<br>
        <b>+120 Puntos acreditados.</b>
      `;
      State.addScore(120);
      State.incrementStreak();
      State.unlockAchievement('steno_builder');
    } else {
      sounds.playError();
      feedbackEl.className = 'feedback-box error';
      feedbackEl.innerHTML = `
        <b>❌ Hay estratos fuera de lugar.</b><br>
        Revisa las fechas en millones de años (Ma): abajo del todo (base) debe ir el estrato más antiguo con mayor Ma, y arriba del todo (cima) el más reciente.
      `;
      State.resetStreak();
    }
  };

  loadLevel(parseInt(levelSelect.value));
}


// ==========================================================================
// 5.7 JUEGO 7: FLASHCARDS GEOLÓGICAS 3D (ESTUDIO ACTIVO)
// ==========================================================================
function initGameFlashcards() {
  const counterEl = document.getElementById('flashcard-counter');
  const masteredCountEl = document.getElementById('flashcard-mastered-count');
  const cardEl = document.getElementById('geological-flashcard');
  const stripEl = document.getElementById('flashcard-strip');
  const eraEl = document.getElementById('flashcard-era');
  const titleEl = document.getElementById('flashcard-title');
  const rangeEl = document.getElementById('flashcard-range');
  const durationEl = document.getElementById('flashcard-duration');
  
  const backPeriodEl = document.getElementById('flashcard-back-period');
  const fossilsEl = document.getElementById('flashcard-fossils');
  const milestonesEl = document.getElementById('flashcard-milestones');
  const mnemonicEl = document.getElementById('flashcard-mnemonic');

  const btnPrev = document.getElementById('btn-flashcard-prev');
  const btnNext = document.getElementById('btn-flashcard-next');
  const btnFlip = document.getElementById('btn-flashcard-flip');
  const btnReview = document.getElementById('btn-flashcard-review');
  const btnMaster = document.getElementById('btn-flashcard-master');

  let currentIndex = 0;
  const masteredSet = new Set();

  function renderCard() {
    cardEl.classList.remove('flipped');
    const c = FLASHCARDS_DATA[currentIndex];

    counterEl.textContent = `Tarjeta ${currentIndex + 1} / ${FLASHCARDS_DATA.length}`;
    masteredCountEl.textContent = masteredSet.size;

    // Front
    stripEl.style.backgroundColor = c.color;
    eraEl.textContent = `Era ${c.era}`;
    titleEl.textContent = c.periodo;
    titleEl.style.color = c.color;
    rangeEl.textContent = c.rango;
    durationEl.textContent = `Duración estimada: ${c.duracion}`;

    // Back
    backPeriodEl.textContent = c.periodo;
    backPeriodEl.style.color = c.color;
    fossilsEl.textContent = c.fosiles;
    milestonesEl.textContent = c.hitos;
    mnemonicEl.textContent = c.mnemotecnia;

    if (masteredSet.has(c.periodo)) {
      btnMaster.style.opacity = '0.6';
      btnMaster.textContent = '¡Ya Dominada! ✓';
    } else {
      btnMaster.style.opacity = '1';
      btnMaster.textContent = '¡Dominada! ✅';
    }
  }

  function toggleFlip() {
    sounds.playFlip();
    cardEl.classList.toggle('flipped');
  }

  cardEl.onclick = () => toggleFlip();
  btnFlip.onclick = (e) => {
    e.stopPropagation();
    toggleFlip();
  };

  btnNext.onclick = (e) => {
    e.stopPropagation();
    sounds.playPop();
    currentIndex = (currentIndex + 1) % FLASHCARDS_DATA.length;
    renderCard();
  };

  btnPrev.onclick = (e) => {
    e.stopPropagation();
    sounds.playPop();
    currentIndex = (currentIndex - 1 + FLASHCARDS_DATA.length) % FLASHCARDS_DATA.length;
    renderCard();
  };

  btnReview.onclick = (e) => {
    e.stopPropagation();
    sounds.playPop();
    currentIndex = (currentIndex + 1) % FLASHCARDS_DATA.length;
    renderCard();
  };

  btnMaster.onclick = (e) => {
    e.stopPropagation();
    const c = FLASHCARDS_DATA[currentIndex];
    if (!masteredSet.has(c.periodo)) {
      sounds.playSuccess();
      masteredSet.add(c.periodo);
      State.addScore(15);
      masteredCountEl.textContent = masteredSet.size;

      if (masteredSet.size === FLASHCARDS_DATA.length) {
        sounds.playSuccess();
        State.unlockAchievement('flashcard_scholar');
        setTimeout(() => {
          alert('🏆 ¡Increíble! Has dominado las 12 flashcards de los períodos del Fanerozoico. ¡Medalla desbloqueada!');
        }, 300);
      }
    }
    currentIndex = (currentIndex + 1) % FLASHCARDS_DATA.length;
    renderCard();
  };

  renderCard();
}


// ==========================================================================
// 6. MNEMOTÉCNICAS Y REGLAS DE MEMORIA
// ==========================================================================
function initMnemonics() {
  const container = document.getElementById('mnemonics-list');
  container.innerHTML = '';

  MNEMONICS.forEach(m => {
    const card = document.createElement('div');
    card.className = 'mnemonic-card';
    card.innerHTML = `
      <h3>${m.titulo}</h3>
      <div class="mnemonic-quote">${m.frase}</div>
      <div class="mnemonic-breakdown">${m.desglose}</div>
      <div style="font-size:0.78rem; color:var(--text-muted); margin-top:8px;">💡 ${m.tip}</div>
    `;
    container.appendChild(card);
  });
}


// ==========================================================================
// 7. LOGROS Y MEDALLAS
// ==========================================================================
const ACHIEVEMENTS_DATA = [
  { id: 'first_look', icon: '🔍', titulo: 'Estratígrafo Curioso', desc: 'Abre cualquier ficha de período en el explorador.' },
  { id: 'order_master', icon: '🧩', titulo: 'Dominio del Tiempo', desc: 'Completa con éxito cualquier nivel de Orden Cronológico.' },
  { id: 'trivia_streak', icon: '🔥', titulo: 'Racha Imparable', desc: 'Alcanza una racha de 5 aciertos consecutivos en Trivia.' },
  { id: 'guesser_bullseye', icon: '🎯', titulo: 'Clavado en el Millón', desc: 'Acierta una fecha límite con precisión casi absoluta en Time Guesser.' },
  { id: 'memory_won', icon: '🃏', titulo: 'Memoria Fósil', desc: 'Empareja los 8 fósiles y períodos en el juego de memoria.' },
  { id: 'precambric_scholar', icon: '🌌', titulo: 'Sabio del Precámbrico', desc: 'Explora los eones profundos (Proterozoico, Arcaico o Hádico).' },
  { id: 'intruder_detective', icon: '🕵️‍♂️', titulo: 'Detective de Estratos', desc: 'Descubre al intruso geológico con deducción crítica.' },
  { id: 'steno_builder', icon: '🧱', titulo: 'Arquitecto de Steno', desc: 'Construye la columna estratigráfica según el Principio de Superposición.' },
  { id: 'flashcard_scholar', icon: '🎴', titulo: 'Memoria de Diamante', desc: 'Domina las flashcards geológicas de los períodos.' }
];

function initAchievements() {
  renderAchievements();
  const btnReset = document.getElementById('btn-reset-stats');
  btnReset.onclick = () => {
    if (confirm('¿Deseas restablecer todos tus puntos, rachas y medallas?')) {
      sounds.playPop();
      State.resetAll();
    }
  };
}

function renderAchievements() {
  const container = document.getElementById('achievements-list');
  if (!container) return;
  container.innerHTML = '';

  ACHIEVEMENTS_DATA.forEach(ach => {
    const isUnlocked = State.achievements[ach.id];
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
      <div class="achievement-icon">${ach.icon}</div>
      <div class="achievement-info">
        <h4>${ach.titulo} ${isUnlocked ? '✓' : '🔒'}</h4>
        <p>${ach.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}


// ==========================================================================
// 8. MODALES Y EVENTOS DE CIERRE
// ==========================================================================
function initModals() {
  const detailModal = document.getElementById('detail-modal');
  const infoModal = document.getElementById('info-modal');
  const authModal = document.getElementById('auth-modal');
  const feedbackModal = document.getElementById('feedback-modal');
  const profileModal = document.getElementById('user-profile-modal');

  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCloseInfo = document.getElementById('btn-close-info');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  const btnCloseFeedback = document.getElementById('btn-close-feedback');
  const btnCloseProfile = document.getElementById('btn-close-profile');
  const btnInfo = document.getElementById('btn-info');

  if (btnCloseModal) btnCloseModal.onclick = () => { sounds.playPop(); detailModal.style.display = 'none'; };
  if (btnCloseInfo) btnCloseInfo.onclick = () => { sounds.playPop(); infoModal.style.display = 'none'; };
  if (btnCloseAuth) btnCloseAuth.onclick = () => { sounds.playPop(); authModal.style.display = 'none'; };
  if (btnCloseFeedback) btnCloseFeedback.onclick = () => { sounds.playPop(); feedbackModal.style.display = 'none'; };
  if (btnCloseProfile) btnCloseProfile.onclick = () => { sounds.playPop(); profileModal.style.display = 'none'; };

  if (btnInfo) {
    btnInfo.onclick = () => {
      sounds.playPop();
      infoModal.style.display = 'flex';
    };
  }

  // Cierre al pulsar el fondo translúcido
  [detailModal, infoModal, authModal, feedbackModal, profileModal].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          sounds.playPop();
          m.style.display = 'none';
        }
      });
    }
  });
}

function updatePasswordMeter() {
  const passInput = document.getElementById('auth-input-pass');
  const fill = document.getElementById('strength-meter-fill');
  const label = document.getElementById('strength-label');
  const reqLength = document.getElementById('req-length');
  const reqUpper = document.getElementById('req-uppercase');
  const reqBonus = document.getElementById('req-bonus');

  if (!passInput || !fill || !label) return;

  const pass = passInput.value || '';
  const hasLength = pass.length >= 8;
  const hasUpper = /[A-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial = /[^A-Za-z0-9]/.test(pass);
  const hasBonus = hasNumber || hasSpecial;

  // Actualizar checklist de requisitos en tiempo real
  if (reqLength) {
    reqLength.className = hasLength ? 'req-item valid' : 'req-item invalid';
    const icon = reqLength.querySelector('.req-icon');
    if (icon) icon.textContent = hasLength ? '✓' : '✕';
  }

  if (reqUpper) {
    reqUpper.className = hasUpper ? 'req-item valid' : 'req-item invalid';
    const icon = reqUpper.querySelector('.req-icon');
    if (icon) icon.textContent = hasUpper ? '✓' : '✕';
  }

  if (reqBonus) {
    reqBonus.className = hasBonus ? 'req-item optional valid' : 'req-item optional';
    const icon = reqBonus.querySelector('.req-icon');
    if (icon) icon.textContent = hasBonus ? '✓' : '○';
  }

  // Evaluar nivel y barra
  let levelClass = 'level-weak';
  let text = 'Esperando contraseña...';
  let widthPercent = 0;

  if (pass.length === 0) {
    text = 'Introduce contraseña';
    widthPercent = 0;
    levelClass = '';
  } else if (!hasLength || !hasUpper) {
    // Faltan requisitos obligatorios
    levelClass = 'level-weak';
    text = !hasLength && !hasUpper ? 'Muy Débil' : (!hasLength ? 'Faltan 8 caracteres' : 'Falta Mayúscula');
    widthPercent = Math.min(35, Math.max(15, pass.length * 4));
  } else {
    // Cumple ambos requisitos mínimos (8+ y 1 Mayúscula)
    let extraScore = 0;
    if (pass.length >= 10) extraScore++;
    if (pass.length >= 14) extraScore++;
    if (hasNumber) extraScore++;
    if (hasSpecial) extraScore++;

    if (extraScore === 0) {
      levelClass = 'level-medium';
      text = 'Aceptable 👍';
      widthPercent = 60;
    } else if (extraScore <= 2) {
      levelClass = 'level-strong';
      text = 'Segura ✨';
      widthPercent = 85;
    } else {
      levelClass = 'level-very-strong';
      text = 'Excelente 🛡️';
      widthPercent = 100;
    }
  }

  fill.className = 'strength-fill ' + levelClass;
  fill.style.width = widthPercent + '%';

  label.className = 'strength-status ' + levelClass;
  label.textContent = text;
}

function openAuthModal(mode = 'login') {
  const authModal = document.getElementById('auth-modal');
  const tabs = document.querySelectorAll('.auth-tab');
  const nameField = document.getElementById('auth-field-name');
  const emailField = document.getElementById('auth-field-email');
  const strengthBox = document.getElementById('password-strength-container');
  const lblUser = document.getElementById('lbl-auth-user');
  const userInput = document.getElementById('auth-input-user');
  const passInput = document.getElementById('auth-input-pass');
  const btnToggleEye = document.getElementById('btn-toggle-password');
  const submitBtn = document.getElementById('btn-auth-submit');
  const errorMsg = document.getElementById('auth-error-msg');
  const successMsg = document.getElementById('auth-success-msg');

  if (errorMsg) errorMsg.style.display = 'none';
  if (successMsg) successMsg.style.display = 'none';

  // Restablecer visibilidad de contraseña
  if (passInput) passInput.type = 'password';
  if (btnToggleEye) btnToggleEye.textContent = '👁️';

  tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-mode') === mode));

  if (mode === 'register') {
    if (nameField) nameField.style.display = 'block';
    if (emailField) emailField.style.display = 'block';
    if (strengthBox) {
      strengthBox.style.display = 'block';
      updatePasswordMeter();
    }
    if (lblUser) lblUser.textContent = 'Nombre de Usuario:';
    if (userInput) userInput.placeholder = 'Nombre de usuario';
    if (submitBtn) submitBtn.textContent = 'Crear Cuenta y Recibir Correo';
  } else {
    // Modo login estándar: EXACTAMENTE IGUAL PARA TODOS (incluyendo a Daniel con danigarmo / admin2023)
    if (nameField) nameField.style.display = 'none';
    if (emailField) emailField.style.display = 'none';
    if (strengthBox) strengthBox.style.display = 'none';
    if (lblUser) lblUser.textContent = 'Usuario o Correo:';
    if (userInput) userInput.placeholder = 'Usuario o correo';
    if (submitBtn) submitBtn.textContent = 'Iniciar Sesión';
  }

  authModal.style.display = 'flex';
}

function openProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  const nameEl = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const avatarEl = document.getElementById('profile-avatar');
  const roleBadge = document.getElementById('profile-badge-role');
  const ptsEl = document.getElementById('profile-points');
  const rankEl = document.getElementById('profile-rank');
  const adminBlock = document.getElementById('profile-admin-access-block');

  const u = AuthManager.currentUser;
  if (!u) return;

  if (nameEl) nameEl.textContent = u.name || u.username;
  if (emailEl) emailEl.textContent = u.email || 'Sin correo asociado';
  if (avatarEl) avatarEl.textContent = u.avatar || '👤';
  if (ptsEl) ptsEl.textContent = State.score;
  if (rankEl) rankEl.textContent = State.getRank();

  if (roleBadge) {
    if (u.isAdmin) {
      roleBadge.textContent = '👑 Administrador';
      roleBadge.style.background = 'linear-gradient(135deg, #F59E0B, #DC2626)';
    } else if (u.provider === 'google') {
      roleBadge.textContent = '🌐 Cuenta Google';
      roleBadge.style.background = 'linear-gradient(135deg, #3B82F6, #1D4ED8)';
    } else {
      roleBadge.textContent = '🎓 Jugador Registrado';
      roleBadge.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    }
  }

  if (adminBlock) {
    adminBlock.style.display = u.isAdmin ? 'block' : 'none';
  }

  modal.style.display = 'flex';
}


// ==========================================================================
// 9. CONTROLADORES DE AUTENTICACIÓN MANUAL (CONECTADO AL BACKEND Y BD)
// ==========================================================================
function initAuthUI() {
  const btnAuthTrigger = document.getElementById('btn-auth-trigger');
  const btnGuestLogin = document.getElementById('btn-guest-login');
  const authModal = document.getElementById('auth-modal');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForm = document.getElementById('auth-form');
  const btnLogout = document.getElementById('btn-logout-action');
  const btnGotoAdmin = document.getElementById('btn-goto-admin-panel');

  let activeMode = 'login';

  // Si la URL viene tras verificar correo (?login=true&user=...)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('login') === 'true') {
    openAuthModal('login');
    const uField = document.getElementById('auth-input-user');
    if (uField && urlParams.get('user')) {
      uField.value = urlParams.get('user');
    }
    const successMsg = document.getElementById('auth-success-msg');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.innerHTML = '✅ <b>¡Correo verificado con éxito!</b> Introduce tu contraseña para iniciar sesión.';
    }
    // Limpiar parámetros de la URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Al hacer clic en el botón de entrar/perfil de la cabecera
  btnAuthTrigger.addEventListener('click', () => {
    sounds.playPop();
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(8);
    if (AuthManager.currentUser) {
      openProfileModal();
    } else {
      openAuthModal('login');
    }
  });

  // Botón del banner de invitado
  if (btnGuestLogin) {
    btnGuestLogin.addEventListener('click', () => {
      sounds.playPop();
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(8);
      openAuthModal('login');
    });
  }

  // Pestañas dentro del modal (Entrar / Crear Cuenta)
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sounds.playPop();
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(8);
      activeMode = tab.getAttribute('data-mode');
      openAuthModal(activeMode);
    });
  });

  const passInput = document.getElementById('auth-input-pass');
  const btnToggleEye = document.getElementById('btn-toggle-password');

  // Actualizar medidor de seguridad de contraseña en tiempo real al escribir
  if (passInput) {
    passInput.addEventListener('input', () => {
      if (activeMode === 'register') {
        updatePasswordMeter();
      }
    });
  }

  // Alternar mostrar / ocultar contraseña con icono de ojo
  if (btnToggleEye && passInput) {
    btnToggleEye.addEventListener('click', () => {
      sounds.playPop();
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      btnToggleEye.textContent = isPass ? '🙈' : '👁️';
    });
  }

  // Enviar formulario (Login o Registro manual conectado al backend)
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userVal = document.getElementById('auth-input-user').value.trim();
    const passVal = document.getElementById('auth-input-pass').value.trim();
    const nameVal = document.getElementById('auth-input-name') ? document.getElementById('auth-input-name').value.trim() : '';
    const emailVal = document.getElementById('auth-input-email') ? document.getElementById('auth-input-email').value.trim() : '';
    const submitBtn = document.getElementById('btn-auth-submit');
    const errorEl = document.getElementById('auth-error-msg');
    const successEl = document.getElementById('auth-success-msg');

    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';

    // 1. MODO REGISTRO MANUAL
    if (activeMode === 'register') {
      if (!userVal || !emailVal || !passVal) {
        sounds.playError();
        errorEl.style.display = 'block';
        errorEl.textContent = 'Por favor, completa usuario, correo y contraseña.';
        return;
      }

      // Validación obligatoria: mínimo 8 caracteres
      if (passVal.length < 8) {
        sounds.playError();
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(30);
        errorEl.style.display = 'block';
        errorEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        if (passInput) passInput.focus();
        return;
      }

      // Validación obligatoria: al menos una letra mayúscula
      if (!/[A-Z]/.test(passVal)) {
        sounds.playError();
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(30);
        errorEl.style.display = 'block';
        errorEl.textContent = 'La contraseña debe contener al menos una letra mayúscula (A-Z).';
        if (passInput) passInput.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando cuenta...';

      try {
        const resp = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userVal,
            email: emailVal,
            password: passVal,
            name: nameVal
          })
        });
        const data = await resp.json();

        if (!data.success) {
          sounds.playError();
          errorEl.style.display = 'block';
          errorEl.textContent = data.message || 'Error al registrar usuario.';
        } else {
          sounds.playSuccess();
          if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([15, 40, 20]);
          successEl.style.display = 'block';
          successEl.innerHTML = `
            <div class="verification-notice-card">
              <div class="icon">📬</div>
              <h3>¡Revisa tu bandeja de entrada!</h3>
              <p>Hemos enviado un correo a <b>${data.email}</b> desde <b>gardanie73@gmail.com</b>.</p>
              
              <div class="verification-info-pill">
                🔒 <b>Verificación obligatoria por correo:</b><br>
                Para poder iniciar sesión y guardar tu progreso, debes entrar en tu correo electrónico y <b>pulsar en el enlace que te acabamos de enviar</b>.<br><br>
                <i>(Si no lo ves en la bandeja principal, revisa también tu carpeta de Spam o Correo no deseado).</i>
              </div>
            </div>
          `;
          authForm.reset();
        }
      } catch (err) {
        sounds.playError();
        errorEl.style.display = 'block';
        errorEl.textContent = 'Error de conexión con el servidor.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear Cuenta y Recibir Correo';
      }

    } else {
      // 2. MODO INICIO DE SESIÓN MANUAL ESTÁNDAR
      // (Funciona exactamente igual para todos; Daniel con danigarmo / admin2023 activa panel admin)
      if (!userVal || !passVal) {
        sounds.playError();
        errorEl.style.display = 'block';
        errorEl.textContent = 'Introduce tu usuario/correo y contraseña.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Iniciando sesión...';

      try {
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userOrEmail: userVal,
            password: passVal
          })
        });
        const data = await resp.json();

        if (!data.success) {
          sounds.playError();
          errorEl.style.display = 'block';
          if (data.unverified) {
            errorEl.innerHTML = `
              <b>❌ Cuenta pendiente de verificación:</b><br>${data.message}
            `;
          } else {
            errorEl.textContent = data.message || 'Usuario o contraseña incorrectos.';
          }
        } else {
          // Sesión exitosa
          AuthManager.login(data.user);
          authModal.style.display = 'none';
          if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([10, 30, 20]);

          if (data.user.isAdmin) {
            alert('👑 ¡Bienvenido! Has iniciado sesión como Administrador. El apartado "Ayudas de los usuarios" está activo en el menú.');
            const adminNav = document.getElementById('nav-item-admin');
            if (adminNav) adminNav.click();
          }
        }
      } catch (err) {
        sounds.playError();
        errorEl.style.display = 'block';
        errorEl.textContent = 'Error de conexión con el servidor.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Sesión';
      }
    }
  });

  // Cerrar sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('¿Cerrar sesión? Volverás al modo invitado.')) {
        AuthManager.logout();
        document.getElementById('user-profile-modal').style.display = 'none';
      }
    });
  }

  // Abrir panel admin desde el perfil de Daniel
  if (btnGotoAdmin) {
    btnGotoAdmin.addEventListener('click', () => {
      document.getElementById('user-profile-modal').style.display = 'none';
      const adminNav = document.getElementById('nav-item-admin');
      if (adminNav) adminNav.click();
    });
  }
}


// ==========================================================================
// 10. CONTROLADORES DE FEEDBACK Y FILTRO INTELIGENTE DE IA
// ==========================================================================
function initFeedbackUI() {
  const btnOpenFeedback = document.getElementById('btn-open-feedback');
  const feedbackModal = document.getElementById('feedback-modal');
  const form = document.getElementById('feedback-form');
  const textArea = document.getElementById('feedback-text');
  const categorySelect = document.getElementById('feedback-category');
  const charCounter = document.getElementById('feedback-char-count');
  const alertBox = document.getElementById('feedback-validation-alert');

  if (btnOpenFeedback) {
    btnOpenFeedback.addEventListener('click', () => {
      sounds.playPop();
      if (alertBox) alertBox.style.display = 'none';
      if (textArea) textArea.value = '';
      if (charCounter) charCounter.textContent = '0 caracteres';
      AuthManager.updateUI();
      feedbackModal.style.display = 'flex';
    });
  }

  if (textArea) {
    textArea.addEventListener('input', () => {
      const len = textArea.value.length;
      charCounter.textContent = `${len} caracteres`;
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rawText = textArea.value;
      const category = categorySelect.value;

      // Ejecutar motor de análisis inteligente (definido en data.js)
      const analysis = analyzeFeedback(rawText, category);

      alertBox.style.display = 'block';

      if (!analysis.isValid) {
        sounds.playError();
        alertBox.className = 'feedback-box error';
        if (analysis.isOffensive) {
          alertBox.innerHTML = `<b>🚫 Contenido no permitido:</b><br>${analysis.reason}`;
        } else {
          alertBox.innerHTML = `<b>💡 Se requiere mayor claridad:</b><br>${analysis.reason}`;
        }
      } else {
        // Aportación aprobada por el filtro inteligente
        sounds.playSuccess();
        alertBox.className = 'feedback-box success';
        alertBox.innerHTML = `
          <b>🎉 ¡Aportación validada con éxito! (+${analysis.score}% Relevancia IA)</b><br>
          Muchas gracias. Tu sugerencia ha superado los filtros de constructividad y ha sido enviada a nuestro equipo de desarrollo.
        `;

        const u = AuthManager.currentUser;
        const newFeedbackItem = {
          userId: u ? u.id : null,
          user: u ? `${u.name} (@${u.username})` : 'Usuario Invitado (Sin sesión)',
          email: u ? u.email : 'No especificado',
          provider: u ? u.provider : 'guest',
          category: analysis.category,
          text: rawText.trim(),
          score: analysis.score,
          tags: analysis.tags
        };

        await FeedbackManager.add(newFeedbackItem);

        setTimeout(() => {
          feedbackModal.style.display = 'none';
          alertBox.style.display = 'none';
          textArea.value = '';
        }, 1800);
      }
    });
  }
}


// ==========================================================================
// 11. FILTROS DEL PANEL PRIVADO DE ADMINISTRADOR
// ==========================================================================
function initAdminFilters() {
  const chips = document.querySelectorAll('#admin-filter-chips .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      sounds.playPop();
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-admin-filter');
      FeedbackManager.renderAdminView(filter);
    });
  });
}

