// ===================================================================
// CONTROLADOR PRINCIPAL DA APLICAÇÃO E ROTEADOR (APP.JS)
// ===================================================================

class AppRouter {
  constructor() {
    this.currentView = 'welcome';
  }

  init() {
    this.setupEventListeners();
    this.syncWithStoredState();
  }

  setupEventListeners() {
    // Form de Registro do Aluno
    const regForm = document.getElementById('student-reg-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('reg-student-name');
        const classInput = document.getElementById('reg-student-class');

        if (!nameInput.value.trim() || !classInput.value.trim()) {
          alert('Por favor, informe seu nome completo e a identificação da sua turma.');
          return;
        }

        window.gameStorage.setStudent(nameInput.value, classInput.value);
        if (window.soundFx) window.soundFx.success();

        this.syncWithStoredState();
        this.showView('stage1');
      });
    }

    // Botão de Áudio Mute/Unmute
    const audioBtn = document.getElementById('btn-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundFx.toggleMute();
        audioBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }

    // Modal de Inspeção: Fechar no clique fora
    const modal = document.getElementById('hazard-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.stage1.closeInspectionModal();
        }
      });
    }
  }

  syncWithStoredState() {
    const state = window.gameStorage.state;

    // Atualiza Informações do Aluno no Cabeçalho
    const nameEl = document.getElementById('hud-student-name');
    const classEl = document.getElementById('hud-student-class');
    const scoreEl = document.getElementById('hud-score-value');

    if (state.student && state.student.name) {
      if (nameEl) nameEl.textContent = state.student.name;
      if (classEl) classEl.textContent = state.student.classGroup;
    } else {
      if (nameEl) nameEl.textContent = 'Não Registrado';
      if (classEl) classEl.textContent = '-';
    }

    if (scoreEl) {
      scoreEl.textContent = state.scores.total || 0;
    }

    // Atualiza Pílulas de Navegação
    this.updateStageNavPills();

    // Roteamento para a etapa correta
    if (!state.student.name) {
      this.showView('welcome');
    } else if (state.currentStage === 4) {
      this.showView('finish');
    } else if (state.currentStage === 3) {
      this.showView('stage3');
    } else if (state.currentStage === 2) {
      this.showView('stage2');
    } else {
      this.showView('stage1');
    }
  }

  updateStageNavPills() {
    const state = window.gameStorage.state;
    const isRegistered = window.gameStorage.isRegistered();
    const unlocked = isRegistered ? (state.unlockedStages || []) : [];

    const pills = [
      { id: 'nav-stage-1', num: 1, view: 'stage1' },
      { id: 'nav-stage-2', num: 2, view: 'stage2' },
      { id: 'nav-stage-3', num: 3, view: 'stage3' }
    ];

    pills.forEach(p => {
      const el = document.getElementById(p.id);
      if (!el) return;

      if (!isRegistered) {
        el.className = 'stage-pill locked';
        el.disabled = true;
        el.setAttribute('disabled', 'disabled');
        el.setAttribute('title', 'Preencha o cadastro do aluno para desbloquear esta etapa');
        el.onclick = null;
        return;
      }

      const isUnlocked = unlocked.includes(p.num);
      const isActive = this.currentView === p.view;
      const s1Answers = state.stage1.answers || {};
      const s1CorrectCount = Object.values(s1Answers).filter(a => a.isCorrect).length;
      const isCompleted = (p.num === 1 && s1CorrectCount >= 9) ||
                          (p.num === 2 && state.stage2.lotoCompleted && state.stage2.ergoCompleted && state.stage2.energyCompleted) ||
                          (p.num === 3 && state.stage3.retrofitApproved);

      el.className = 'stage-pill';
      if (!isUnlocked) {
        el.classList.add('locked');
        el.disabled = true;
        el.setAttribute('disabled', 'disabled');
        el.setAttribute('title', 'Complete a etapa anterior para desbloquear');
        el.onclick = null;
      } else {
        el.disabled = false;
        el.removeAttribute('disabled');
        el.removeAttribute('title');
        if (isActive) el.classList.add('active');
        else if (isCompleted) el.classList.add('completed');
        else el.classList.add('unlocked');

        el.onclick = () => this.showView(p.view);
      }
    });
  }

  showView(viewName) {
    const isRegistered = window.gameStorage.isRegistered();

    // Bloqueia qualquer navegação se o aluno ainda não preencheu o formulário inicial
    if (!isRegistered && viewName !== 'welcome') {
      alert('Atenção: É obrigatório informar seu Nome e Turma no cadastro antes de iniciar a trilha de segurança.');
      viewName = 'welcome';
    }

    this.currentView = viewName;

    // Atualiza container de telas
    const views = document.querySelectorAll('.view-section');
    views.forEach(v => v.classList.remove('active'));

    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
    }

    this.updateStageNavPills();

    // Inicializa o módulo específico correspondente
    if (viewName === 'stage1' && window.stage1) {
      window.stage1.init();
    } else if (viewName === 'stage2' && window.stage2) {
      window.stage2.init();
    } else if (viewName === 'stage3' && window.stage3) {
      window.stage3.init();
    } else if (viewName === 'finish') {
      this.renderFinishView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderFinishView() {
    const state = window.gameStorage.state;
    const nameEl = document.getElementById('finish-student-name');
    const scoreEl = document.getElementById('finish-total-score');
    const s1El = document.getElementById('finish-s1-score');
    const s2El = document.getElementById('finish-s2-score');
    const s3El = document.getElementById('finish-s3-score');

    if (nameEl) nameEl.textContent = state.student.name;
    if (scoreEl) scoreEl.textContent = `${state.scores.total || 0} PONTOS`;
    if (s1El) s1El.textContent = `${state.scores.stage1 || 0} pts`;
    if (s2El) s2El.textContent = `${state.scores.stage2 || 0} pts`;
    if (s3El) s3El.textContent = `${state.scores.stage3 || 0} pts`;
  }

  resetProgress() {
    if (confirm('Deseja realmente reiniciar todo o jogo e limpar todas as informações do aluno?')) {
      // 1. Limpa Storage local
      window.gameStorage.resetAll();

      // 2. Limpa dados em memória da Etapa 1
      if (window.stage1) {
        window.stage1.currentScenario = 'ccm';
        window.stage1.activeModalHazard = null;
        window.stage1.falsePositiveCount = 0;
      }

      // 3. Limpa dados em memória da Etapa 2
      if (window.stage2) {
        window.stage2.currentSubgame = 'loto';
        window.stage2.lotoSelectedSteps = [];
        window.stage2.lotoAttempts = 0;
        window.stage2.shuffledLotoCards = null;
        window.stage2.ergoValues = { benchHeight: 75, reachDistance: 60, lux: 200, nioshWeight: 25 };
        if (typeof window.stage2.initEnergyData === 'function') {
          window.stage2.initEnergyData();
        } else {
          window.stage2.energyFixedLeaks = false;
          window.stage2.energyUpgradedMotor = false;
          window.stage2.energySelectedWasteClass = null;
        }
      }

      // 4. Limpa dados em memória da Etapa 3
      if (window.stage3) {
        window.stage3.installed = [];
      }

      // 5. Limpa inputs do formulário de registro
      const nameInput = document.getElementById('reg-student-name');
      const classInput = document.getElementById('reg-student-class');
      if (nameInput) nameInput.value = '';
      if (classInput) classInput.value = '';

      // 6. Atualiza HUD e retorna para a tela inicial
      this.syncWithStoredState();
      this.showView('welcome');

      if (window.soundFx) window.soundFx.click();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appRouter = new AppRouter();
  window.appRouter.init();
});
