// ===================================================================
// GERENCIADOR DE ESTADO E PERSISTÊNCIA LOCAL (LOCALSTORAGE)
// ===================================================================

const STORAGE_KEY = 'autosafe_student_state_v1';

class StorageManager {
  constructor() {
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      student: {
        name: '',
        classGroup: '',
        registeredAt: null
      },
      currentStage: 0, // 0 = Registro, 1 = Etapa 1, 2 = Etapa 2, 3 = Etapa 3, 4 = Concluído
      unlockedStages: [], // Bloqueado até o aluno se cadastrar
      scores: {
        stage1: 0,
        stage2: 0,
        stage3: 0,
        total: 0
      },
      stage1: {
        currentScenario: 'ccm',
        foundHazards: [], // IDs dos perigos encontrados
        answers: {} // { hazardId: { chosenNorma, chosenSolution, isCorrect } }
      },
      stage2: {
        lotoCompleted: false,
        ergoCompleted: false,
        energyCompleted: false
      },
      stage3: {
        installedComponents: [],
        budgetSpent: 0,
        retrofitApproved: false
      }
    };
  }

  isRegistered() {
    return Boolean(
      this.state &&
      this.state.student &&
      this.state.student.name &&
      this.state.student.name.trim().length > 0
    );
  }

  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Proteção contra dados legados sem cadastro: se não houver aluno registrado, bloqueia etapas
        if (!parsed.student || !parsed.student.name || !parsed.student.name.trim()) {
          parsed.unlockedStages = [];
          parsed.currentStage = 0;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return this.getDefaultState();
  }

  save() {
    try {
      this.state.scores.total = (this.state.scores.stage1 || 0) + 
                                (this.state.scores.stage2 || 0) + 
                                (this.state.scores.stage3 || 0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error saving state:', e);
    }
  }

  setStudent(name, classGroup) {
    this.state.student.name = name.trim();
    this.state.student.classGroup = classGroup.trim();
    this.state.student.registeredAt = new Date().toISOString();
    this.state.currentStage = 1;
    if (!this.state.unlockedStages.includes(1)) {
      this.state.unlockedStages.push(1);
    }
    this.save();
  }

  unlockStage(stageNumber) {
    if (!this.state.unlockedStages.includes(stageNumber)) {
      this.state.unlockedStages.push(stageNumber);
    }
    this.save();
  }

  addScore(stageKey, points) {
    this.state.scores[stageKey] = (this.state.scores[stageKey] || 0) + points;
    this.save();
  }

  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.getDefaultState();
  }
}

window.gameStorage = new StorageManager();
