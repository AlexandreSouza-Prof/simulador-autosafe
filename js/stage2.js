// ===================================================================
// ETAPA 2: PROCEDIMENTOS TÉCNICOS OPERACIONAIS DE CAMPO (NÍVEL AVANÇADO)
// ===================================================================

class Stage2Controller {
  constructor() {
    this.currentSubgame = 'loto';
    this.lotoSelectedSteps = [];
    this.lotoAttempts = 0;
    this.ergoValues = { benchHeight: 75, reachDistance: 60, lux: 200, nioshWeight: 25 };
    this.lotoAuditResult = null;
    this.initEnergyData();
  }

  init() {
    this.renderSubgameNavigation();
    this.renderCurrentSubgame();
    this.updateProgressUI();
  }

  setSubgame(subId) {
    this.currentSubgame = subId;
    this.renderSubgameNavigation();
    this.renderCurrentSubgame();
    if (window.soundFx) window.soundFx.click();
  }

  renderSubgameNavigation() {
    const navContainer = document.getElementById('stage2-subnav');
    if (!navContainer) return;

    const subgames = [
      { id: 'loto', title: '1. Bloqueio e Etiquetagem (LOTO - NR-10)', icon: '🔒' },
      { id: 'ergo', title: '2. Posto Biomecânico RULA & NIOSH (NR-17)', icon: '🧍' },
      { id: 'energy', title: '3. Auditoria Energética & Resíduos NBR 10004', icon: '⚡' }
    ];

    const state = window.gameStorage.state.stage2;

    navContainer.innerHTML = subgames.map(sub => {
      const activeClass = this.currentSubgame === sub.id ? 'active' : '';
      let isDone = false;
      if (sub.id === 'loto') isDone = state.lotoCompleted;
      if (sub.id === 'ergo') isDone = state.ergoCompleted;
      if (sub.id === 'energy') isDone = state.energyCompleted;

      return `
        <div class="procedure-tab-card ${activeClass} ${isDone ? 'completed' : ''}" onclick="stage2.setSubgame('${sub.id}')" id="subnav-${sub.id}">
          <span style="font-size: 1.25rem;">${sub.icon}</span>
          <div>
            <div style="font-weight: 700; font-size: 0.85rem;">${sub.title}</div>
            <div style="font-size: 0.7rem; color: ${isDone ? 'var(--safety-green)' : 'var(--text-dim)'}; font-family: monospace;">
              ${isDone ? '✓ CONCLUÍDO' : 'PENDENTE'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderCurrentSubgame() {
    const container = document.getElementById('stage2-minigame-content');
    if (!container) return;

    if (this.currentSubgame === 'loto') {
      this.renderLotoSubgame(container);
    } else if (this.currentSubgame === 'ergo') {
      this.renderErgoSubgame(container);
    } else {
      this.renderEnergySubgame(container);
    }
  }

  // =================================================================
  // SUBGAME 1: PROCEDIMENTO LOTO COM EXCELENTE JOGABILIDADE E AUDITORIA
  // =================================================================
  renderLotoSubgame(container) {
    const isCompleted = window.gameStorage.state.stage2.lotoCompleted;

    // BANCO DE PROCEDIMENTOS: 6 CORRETOS + 4 NÃO-CONFORMIDADES (SEM TERMO ARMADILHA)
    this.lotoAllCards = [
      { 
        id: 'c1', 
        isCompliant: true, 
        correctPos: 1, 
        text: 'Notificar previamente operadores e equipes envolvidas sobre a paralisação e intervenção técnica.' 
      },
      { 
        id: 'c2', 
        isCompliant: true, 
        correctPos: 2, 
        text: 'Executar a parada normal do equipamento acionando o botão de parada da IHM/painel de comando.' 
      },
      { 
        id: 'c3', 
        isCompliant: true, 
        correctPos: 3, 
        text: 'Isolar e seccionar todas as fontes de energia primária (chave seccionadora geral do painel).' 
      },
      { 
        id: 'c4', 
        isCompliant: true, 
        correctPos: 4, 
        text: 'Verificar a ausência comprovada de tensão (Tensão Zero) utilizando voltímetro/detector aferido e testado.' 
      },
      { 
        id: 'c5', 
        isCompliant: true, 
        correctPos: 5, 
        text: 'Instalar garra de bloqueio multifuro (haste) e cadeado de segurança pessoal com chave exclusiva.' 
      },
      { 
        id: 'c6', 
        isCompliant: true, 
        correctPos: 6, 
        text: 'Fixar etiqueta indelével de bloqueio LOTO contendo identificação, data, turno e motivo da parada.' 
      },
      
      // PROCEDIMENTOS NÃO-CONFORMES (ESCRITOS DE FORMA REALISTA)
      { 
        id: 'd1', 
        isCompliant: false, 
        text: 'Verificar a ausência de potencial elétrico observando as lâmpadas piloto ou indicadores luminosos do frontal do painel.', 
        auditFeedback: 'Desvio de Conformidade (NR-10 item 10.5.1): Lâmpadas sinaleiras podem queimar ou soltar conexões. A verificação de tensão zero DEVE ser executada com instrumento testado antes e depois da medição.' 
      },
      { 
        id: 'd2', 
        isCompliant: false, 
        text: 'Fixar fita zebrada amarela e preta na manopla do disjuntor para sinalizar o impedimento de manobra.', 
        auditFeedback: 'Desvio de Conformidade (NR-10 item 10.5.1): Fita plástica é mero sinalizador de advertência, não impedimento físico de acionamento mecânico. Apenas cadeado com garra atende a exigência de bloqueio.' 
      },
      { 
        id: 'd3', 
        isCompliant: false, 
        text: 'Disponibilizar a chave reserva do cadeado no suporte do painel para o encarregado do próximo turno poder reenergizar.', 
        auditFeedback: 'Desvio de Conformidade (NR-10): A chave do dispositivo de bloqueio é pessoal e intransferível, permanecendo em posse exclusiva de quem está realizando o trabalho para evitar religamento com pessoas no painel.' 
      },
      { 
        id: 'd4', 
        isCompliant: false, 
        text: 'Designar um operador para permanecer de vigia em frente à chave seccionadora durante o período da intervenção.', 
        auditFeedback: 'Desvio de Conformidade (NR-10): O bloqueio humano (vigia) não é aceito pelas normas de segurança como substituto do travamento mecânico físico por cadeado.' 
      }
    ];

    if (!this.shuffledLotoCards) {
      this.shuffledLotoCards = [...this.lotoAllCards].sort(() => Math.random() - 0.5);
    }

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700;">
              🔒 Procedimento de Bloqueio e Desenergização de Segurança (LOTO - NR-10)
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              Analise tecnicamente as ações disponíveis. Selecione e ordene <strong>os 6 passos normativos corretos</strong>. Utilize os botões [▲ / ▼] para organizar a ordem de execução da sua equipe.
            </p>
          </div>
          <div style="background: rgba(6, 182, 212, 0.15); border: 1px solid var(--tech-cyan); padding: 0.4rem 0.8rem; border-radius: 8px; font-family: monospace; font-size: 0.8rem; color: var(--tech-cyan);">
            Auditorias Realizadas: <span id="loto-attempt-count">${this.lotoAttempts}</span>
          </div>
        </div>
      </div>

      <div class="loto-grid">
        <div class="loto-steps-pool">
          <h4 style="font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--tech-cyan);">Ações Disponíveis no Catálogo de Campo:</h4>
          <div id="loto-pool-container" style="max-height: 400px; overflow-y: auto; padding-right: 0.3rem;">
            ${this.shuffledLotoCards.map(item => `
              <div class="loto-draggable-item" onclick="stage2.addLotoStep('${item.id}')" id="loto-item-${item.id}">
                <span style="font-size: 1.1rem; color: var(--tech-cyan);">➕</span>
                <span style="font-size: 0.8rem; line-height: 1.35; flex: 1;">${item.text}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="loto-sequence-slots">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h4 style="font-size: 0.9rem; color: var(--warning-amber);">Sequência Submetida à Auditoria (${this.lotoSelectedSteps.length} / 6):</h4>
            <button onclick="stage2.resetLotoSteps()" style="background: none; border: 1px solid var(--border-subtle); color: var(--text-dim); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">
              Limpar Lista
            </button>
          </div>
          
          <div id="loto-selected-container" style="min-height: 280px; display: flex; flex-direction: column; gap: 0.5rem;">
            <!-- Renderizado dinamicamente -->
          </div>

          <button class="btn-primary" style="margin-top: 1rem;" onclick="stage2.validateLotoSequence()" id="btn-validate-loto" ${isCompleted ? 'disabled' : ''}>
            ${isCompleted ? '✓ Procedimento LOTO Homologado (+300 pts)' : 'Submeter Procedimento à Auditoria Técnica'}
          </button>
          
          <div id="loto-feedback" style="margin-top: 0.75rem;"></div>
        </div>
      </div>
    `;

    this.renderLotoSelectedList();
  }

  addLotoStep(cardId) {
    if (this.lotoSelectedSteps.includes(cardId)) return;
    if (this.lotoSelectedSteps.length >= 6) {
      alert('A sequência regulamentar LOTO requer exatamente 6 passos. Reorganize ou substitua os itens existentes.');
      return;
    }
    this.lotoSelectedSteps.push(cardId);
    this.lotoAuditResult = null;
    this.renderLotoSelectedList();
    if (window.soundFx) window.soundFx.click();
  }

  moveLotoStep(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= this.lotoSelectedSteps.length) return;
    
    const temp = this.lotoSelectedSteps[index];
    this.lotoSelectedSteps[index] = this.lotoSelectedSteps[targetIdx];
    this.lotoSelectedSteps[targetIdx] = temp;
    
    this.lotoAuditResult = null;
    this.renderLotoSelectedList();
    if (window.soundFx) window.soundFx.click();
  }

  removeLotoStep(index) {
    this.lotoSelectedSteps.splice(index, 1);
    this.lotoAuditResult = null;
    this.renderLotoSelectedList();
    if (window.soundFx) window.soundFx.click();
  }

  resetLotoSteps() {
    this.lotoSelectedSteps = [];
    this.lotoAuditResult = null;
    this.renderLotoSelectedList();
    const fb = document.getElementById('loto-feedback');
    if (fb) fb.innerHTML = '';
  }

  renderLotoSelectedList() {
    const container = document.getElementById('loto-selected-container');
    if (!container) return;

    if (this.lotoSelectedSteps.length === 0) {
      container.innerHTML = `
        <div style="border: 2px dashed rgba(255,255,255,0.12); border-radius: 8px; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-dim); font-size: 0.85rem; text-align: center; padding: 1rem;">
          <span>Clique nas ações à esquerda para incluir na sua rotina de trabalho.</span>
          <span style="font-size: 0.75rem; margin-top: 0.5rem; color: var(--tech-cyan);">Use os botões [▲ / ▼] para ordenar as etapas da intervenção.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = this.lotoSelectedSteps.map((id, index) => {
      const card = this.lotoAllCards.find(c => c.id === id);
      
      // Se já passou por auditoria, destaca conformidade técnica de cada item
      let auditStatusBadge = '';
      let borderStyle = 'border: 1px solid var(--border-bright);';

      if (this.lotoAuditResult) {
        if (!card.isCompliant) {
          borderStyle = 'border: 1px solid var(--hazard-red); background: rgba(239,68,68,0.12);';
          auditStatusBadge = '<span style="font-size: 0.7rem; color: var(--hazard-red); font-weight: bold; margin-left: 0.4rem;">[NÃO-CONFORME]</span>';
        } else if (card.correctPos !== index + 1) {
          borderStyle = 'border: 1px solid var(--warning-amber); background: rgba(245,158,11,0.12);';
          auditStatusBadge = '<span style="font-size: 0.7rem; color: var(--warning-amber); font-weight: bold; margin-left: 0.4rem;">[ORDEM INCORRETA]</span>';
        } else {
          borderStyle = 'border: 1px solid var(--safety-green); background: rgba(16,185,129,0.12);';
          auditStatusBadge = '<span style="font-size: 0.7rem; color: var(--safety-green); font-weight: bold; margin-left: 0.4rem;">[CONFORME]</span>';
        }
      }

      return `
        <div style="background: rgba(15, 23, 42, 0.9); ${borderStyle} padding: 0.55rem 0.75rem; border-radius: 8px; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-family: monospace; font-weight: bold; color: var(--tech-cyan);">${index + 1}º</span>
          <div style="flex: 1; line-height: 1.3;">
            <span>${card.text}</span>
            ${auditStatusBadge}
          </div>
          <div style="display: flex; align-items: center; gap: 0.2rem;">
            <button onclick="stage2.moveLotoStep(${index}, -1)" style="background: rgba(255,255,255,0.08); border: none; color: #FFF; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;" title="Mover para cima" ${index === 0 ? 'disabled style="opacity: 0.3;"' : ''}>▲</button>
            <button onclick="stage2.moveLotoStep(${index}, 1)" style="background: rgba(255,255,255,0.08); border: none; color: #FFF; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;" title="Mover para baixo" ${index === this.lotoSelectedSteps.length - 1 ? 'disabled style="opacity: 0.3;"' : ''}>▼</button>
            <button onclick="stage2.removeLotoStep(${index})" style="background: none; border: none; color: var(--hazard-red); cursor: pointer; font-size: 0.9rem; padding: 0.2rem;" title="Remover">✕</button>
          </div>
        </div>
      `;
    }).join('');
  }

  validateLotoSequence() {
    this.lotoAttempts++;
    const countEl = document.getElementById('loto-attempt-count');
    if (countEl) countEl.textContent = this.lotoAttempts;

    const fb = document.getElementById('loto-feedback');

    if (this.lotoSelectedSteps.length !== 6) {
      if (window.soundFx) window.soundFx.error();
      fb.innerHTML = `
        <div class="feedback-banner error" style="display: block;">
          <strong>Sequência Incompleta!</strong> A norma regulamentadora exige exatamente 6 etapas mandatórias para desenergização de segurança.
        </div>
      `;
      return;
    }

    const selectedCards = this.lotoSelectedSteps.map(id => this.lotoAllCards.find(c => c.id === id));
    this.lotoAuditResult = { verified: true };
    this.renderLotoSelectedList();

    // 1. Verifica itens não-conformes
    const nonCompliant = selectedCards.filter(c => !c.isCompliant);
    if (nonCompliant.length > 0) {
      if (window.soundFx) window.soundFx.error();
      const feedbackItems = nonCompliant.map(c => `• ${c.auditFeedback}`).join('<br>');
      fb.innerHTML = `
        <div class="feedback-banner error" style="display: block;">
          <strong>PARECER DE NÃO-CONFORMIDADE TÉCNICA (NR-10):</strong><br>
          Foram identificadas práticas não autorizadas na sequência operacional:<br><br>
          ${feedbackItems}<br><br>
          <em>Remova os itens assinalados em vermelho e selecione alternativas conformes.</em>
        </div>
      `;
      return;
    }

    // 2. Verifica ordem cronológica das 6 etapas válidas
    const isChronologicallyCorrect = selectedCards.every((card, idx) => card.correctPos === idx + 1);

    if (isChronologicallyCorrect) {
      if (window.soundFx) window.soundFx.success();
      const points = Math.max(150, 300 - (this.lotoAttempts - 1) * 30);
      fb.innerHTML = `
        <div class="feedback-banner success" style="display: block;">
          <strong>PROCEDIMENTO LOTO HOMOLOGADO COM EXCELÊNCIA (+${points} pontos)!</strong><br>
          A sequência normativa (Notificar ➔ Parar Operacional ➔ Seccionar Força ➔ Testar Tensão Zero ➔ Bloquear com Cadeado ➔ Etiquetar) foi validada pela auditoria de segurança da planta.
        </div>
      `;
      window.gameStorage.state.stage2.lotoCompleted = true;
      window.gameStorage.addScore('stage2', points);
      this.updateProgressUI();
      this.renderSubgameNavigation();

      const btn = document.getElementById('btn-validate-loto');
      if (btn) btn.disabled = true;
    } else {
      if (window.soundFx) window.soundFx.error();

      let orderNotes = [];
      const posSeccionamento = selectedCards.findIndex(c => c.id === 'c3');
      const posTeste = selectedCards.findIndex(c => c.id === 'c4');
      const posBloqueio = selectedCards.findIndex(c => c.id === 'c5');

      if (posTeste < posSeccionamento) {
        orderNotes.push('A verificação de ausência de tensão foi tentada antes da abertura da chave seccionadora.');
      }
      if (posBloqueio < posTeste) {
        orderNotes.push('A instalação física do cadeado foi posicionada antes da comprovação técnica de tensão zero.');
      }
      if (orderNotes.length === 0) {
        orderNotes.push('A ordem lógica entre notificação, parada normal e consignação de segurança contém inversões.');
      }

      fb.innerHTML = `
        <div class="feedback-banner error" style="display: block;">
          <strong>DESVIO NA CRONOLOGIA OPERACIONAL:</strong><br>
          ${orderNotes.join('<br>')}<br><br>
          <em>Utilize os botões [▲ / ▼] para ajustar a posição dos passos assinalados em amarelo.</em>
        </div>
      `;
    }
  }

  // =================================================================
  // SUBGAME 2: POSTO BIOMECÂNICO RULA + EQUAÇÃO NIOSH
  // =================================================================
  renderErgoSubgame(container) {
    const isCompleted = window.gameStorage.state.stage2.ergoCompleted;

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700;">
          🧍 Análise Ergonômica do Posto: Linha Neutra, RULA e Limite NIOSH (NR-17)
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          A NR-17 exige adaptar o trabalho às características psicofisiológicas do operador. Avalie o <strong>Limite de Peso Recomendado (LPR)</strong> da Equação NIOSH e ajuste a bancada e esteira.
        </p>
      </div>

      <div class="ergo-simulator-grid">
        <div class="ergo-sliders-card">
          <!-- Desafio NIOSH -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-bright); border-radius: 10px; padding: 1rem; margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-weight: 700; font-size: 0.85rem; color: var(--tech-cyan);">Desafio NIOSH: Limite de Carga Manual</span>
              <span style="font-family: monospace; font-size: 0.75rem; color: var(--warning-amber);">Constante de Carga: 23 kg</span>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              Em levantamentos repetitivos com distância horizontal H=45cm e assimetria de tronco de 45°, qual o Limite de Peso Recomendado (LPR) seguro para evitar hérnias de disco em L4-L5?
            </p>
            <div style="display: flex; gap: 0.5rem;">
              <button class="quiz-option-btn" style="flex: 1; padding: 0.5rem;" onclick="stage2.selectNioshWeight(12)" id="niosh-btn-12">
                <strong>12 kg</strong> (Fórmula Reduzida)
              </button>
              <button class="quiz-option-btn" style="flex: 1; padding: 0.5rem;" onclick="stage2.selectNioshWeight(23)" id="niosh-btn-23">
                <strong>23 kg</strong> (Sem Fatores)
              </button>
              <button class="quiz-option-btn" style="flex: 1; padding: 0.5rem;" onclick="stage2.selectNioshWeight(35)" id="niosh-btn-35">
                <strong>35 kg</strong> (Inseguro)
              </button>
            </div>
          </div>

          <!-- Sliders Biomecânicos -->
          <div class="slider-group">
            <label>
              <span>Altura da Bancada Motorizada</span>
              <span id="lbl-bench" style="font-family: monospace; color: var(--tech-cyan);">75 cm</span>
            </label>
            <input type="range" min="70" max="130" value="${this.ergoValues.benchHeight}" class="slider-input" id="slider-bench" oninput="stage2.onErgoInput()">
            <span style="font-size: 0.7rem; color: var(--text-dim);">Requisito: Altura dos cotovelos (± 98 a 104 cm) para eliminar curvatura de coluna</span>
          </div>

          <div class="slider-group">
            <label>
              <span>Distância Horizontal de Alcance (Esteira ➔ Operador)</span>
              <span id="lbl-reach" style="font-family: monospace; color: var(--tech-cyan);">60 cm</span>
            </label>
            <input type="range" min="15" max="80" value="${this.ergoValues.reachDistance}" class="slider-input" id="slider-reach" oninput="stage2.onErgoInput()">
            <span style="font-size: 0.7rem; color: var(--text-dim);">Requisito: Zona de alcance ótimo (25 a 35 cm) para evitar abdução de ombro</span>
          </div>

          <div class="slider-group">
            <label>
              <span>Iluminância no Posto de Inspeção</span>
              <span id="lbl-lux" style="font-family: monospace; color: var(--tech-cyan);">200 Lux</span>
            </label>
            <input type="range" min="100" max="1200" value="${this.ergoValues.lux}" class="slider-input" id="slider-lux" oninput="stage2.onErgoInput()">
            <span style="font-size: 0.7rem; color: var(--text-dim);">Requisito NBR ISO/CIE 8995-1 / NR-17: 500 a 750 Lux</span>
          </div>

          <button class="btn-primary" style="margin-top: 1rem;" onclick="stage2.confirmErgoSettings()" id="btn-confirm-ergo">
            Submeter Avaliação Ergonômica (AET)
          </button>
          <div id="ergo-feedback" style="margin-top: 0.5rem;"></div>
        </div>

        <div class="rula-meter-box" style="padding: 1rem; justify-content: flex-start;">
          <!-- SIMULADOR BIOMECÂNICO INTERATIVO DO POSTO (SVG DINÂMICO) -->
          <div id="ergo-canvas-wrap" style="width: 100%; border-radius: 10px; overflow: hidden; background: #060A14; border: 1px solid rgba(56, 189, 248, 0.25); position: relative; margin-bottom: 0.75rem; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
            <!-- Renderizado dinamicamente por updateErgoSimulation() -->
          </div>

          <!-- MÉTRICAS RULA & BIOMECÂNICA (CORES NEUTRAS DE ENGENHARIA) -->
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem;">
            <div style="text-align: left;">
              <div style="font-size: 0.7rem; text-transform: uppercase; font-family: monospace; color: var(--text-muted);">
                Escore RULA (Rapid Upper Limb Assessment)
              </div>
              <div id="rula-score-desc" style="font-weight: 700; font-size: 0.85rem; color: var(--text-main); margin-top: 0.2rem;">
                Escore RULA Calculado: Nível 7
              </div>
            </div>
            <div class="rula-score-display neutral" id="rula-score-num" style="font-size: 2.85rem; margin: 0; min-width: 60px; text-align: right;">7</div>
          </div>
          
          <div style="width: 100%; font-size: 0.75rem; color: var(--text-dim); line-height: 1.35; text-align: left; margin-top: 0.4rem; padding: 0.4rem 0.6rem; background: rgba(15, 23, 42, 0.6); border-radius: 6px;" id="rula-feedback-tip">
            Ajuste os controles conforme os requisitos técnicos e clique em "Submeter Avaliação Ergonômica".
          </div>
        </div>
      </div>
    `;

    this.onErgoInput();
  }

  selectNioshWeight(weight) {
    this.ergoValues.nioshWeight = weight;
    [12, 23, 35].forEach(w => {
      const btn = document.getElementById(`niosh-btn-${w}`);
      if (btn) btn.classList.toggle('selected', w === weight);
    });
    this.updateErgoSimulation();
    if (window.soundFx) window.soundFx.click();
  }

  onErgoInput() {
    const sBench = document.getElementById('slider-bench');
    const sReach = document.getElementById('slider-reach');
    const sLux = document.getElementById('slider-lux');

    if (!sBench || !sReach || !sLux) return;

    this.ergoValues.benchHeight = parseInt(sBench.value);
    this.ergoValues.reachDistance = parseInt(sReach.value);
    this.ergoValues.lux = parseInt(sLux.value);

    document.getElementById('lbl-bench').textContent = `${this.ergoValues.benchHeight} cm`;
    document.getElementById('lbl-reach').textContent = `${this.ergoValues.reachDistance} cm`;
    document.getElementById('lbl-lux').textContent = `${this.ergoValues.lux} Lux`;

    // CÁLCULO CIENTÍFICO RULA: Avalia exclusivamente Postura Musculoesquelética
    let score = 1;

    // Altura da bancada (comprometimento de tronco, ombros e cervical)
    if (this.ergoValues.benchHeight < 90 || this.ergoValues.benchHeight > 115) score += 3;
    else if (this.ergoValues.benchHeight < 96 || this.ergoValues.benchHeight > 106) score += 1;

    // Alcance horizontal (abdução e extensão de braço/antebraço)
    if (this.ergoValues.reachDistance > 55) score += 3;
    else if (this.ergoValues.reachDistance > 38) score += 2;
    else if (this.ergoValues.reachDistance < 22) score += 1;

    score = Math.min(7, Math.max(1, score));

    const numEl = document.getElementById('rula-score-num');
    const descEl = document.getElementById('rula-score-desc');
    const tipEl = document.getElementById('rula-feedback-tip');

    if (numEl) {
      numEl.textContent = score;
      numEl.className = 'rula-score-display neutral';
    }

    if (descEl) {
      descEl.textContent = `Escore RULA Calculado: Nível ${score}`;
      descEl.style.color = 'var(--text-main)';
    }

    if (tipEl) {
      tipEl.textContent = 'Ajuste os controles conforme os requisitos técnicos e clique em "Submeter Avaliação Ergonômica".';
    }

    // Atualiza a simulação gráfica biomecânica com estilo técnico neutro
    this.updateErgoSimulation();
  }

  updateErgoSimulation() {
    const wrap = document.getElementById('ergo-canvas-wrap');
    if (!wrap) return;

    const benchHeight = this.ergoValues.benchHeight; // 70 a 130 cm
    const reachDistance = this.ergoValues.reachDistance; // 15 a 80 cm
    const lux = this.ergoValues.lux; // 100 a 1200 Lux
    const nWeight = this.ergoValues.nioshWeight || 23;

    // --- 1. ILUMINAÇÃO (LUX) ---
    // Cone de luz com intensidade proporcional real, sem spoilers de cores
    const lightOpacity = Math.min(0.7, Math.max(0.12, lux / 1400));
    const ambientDarkness = Math.max(0, 0.7 - (lux / 1300));
    const glareEffect = lux > 900;

    // --- 2. ALTURA DA BANCADA (BENCH HEIGHT) ---
    const groundY = 270;
    // Mapeamento: 70cm -> y: 232 | 100cm (ideal) -> y: 178 | 130cm -> y: 124
    const tableY = groundY - ((benchHeight - 50) * 1.8);

    // --- 3. DISTÂNCIA HORIZONTAL (REACH DISTANCE) ---
    // Operador fixo com pés em x: 125
    // Alcance: 15cm -> x: 210 | 30cm (ideal) -> x: 247 | 60cm -> x: 320 | 80cm -> x: 368
    const boxX = 175 + (reachDistance * 2.4);
    const boxWidth = 42;
    const boxHeight = 30;
    const boxY = tableY - boxHeight;

    // --- 4. BIOMECÂNICA DO OPERADOR (CINEMÁTICA REAL) ---
    const trunkBendHeight = Math.max(0, 98 - benchHeight) * 0.75; // curvatura se mesa baixa
    const trunkBendReach = Math.max(0, reachDistance - 38) * 0.45;  // inclinação se alcance longe
    const totalForwardTilt = trunkBendHeight + trunkBendReach;

    const shoulderX = 125 + totalForwardTilt;
    const shoulderY = 135 + (trunkBendHeight * 0.4);

    const headX = shoulderX + 4;
    const headY = shoulderY - 26;

    const handX = boxX;
    const handY = boxY + (boxHeight / 2);

    const highTableLift = Math.max(0, benchHeight - 104) * 0.6;
    let elbowX = (shoulderX + handX) / 2 + 5;
    let elbowY = Math.max(shoulderY + 10, ((shoulderY + handY) / 2) + 20 - highTableLift);

    if (reachDistance > 55) {
      elbowX = (shoulderX + handX) * 0.52;
      elbowY = (shoulderY + handY) * 0.5;
    }

    // Cores neutras técnicas de engenharia (sem spoilers vermelho/laranja/verde)
    const techBlue = '#0284C7';
    const techCyan = '#38BDF8';
    const skinTone = '#FDBA74';

    wrap.innerHTML = `
      <svg viewBox="0 0 500 300" style="width: 100%; height: 310px; display: block;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lightConeGradNeutral" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="${lightOpacity * 1.4}" />
            <stop offset="65%" stop-color="#E2E8F0" stop-opacity="${lightOpacity * 0.75}" />
            <stop offset="100%" stop-color="#94A3B8" stop-opacity="0.02" />
          </linearGradient>

          <filter id="lampGlowNeutral" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- FUNDO: GRADE MILIMETRADA TÉCNICA -->
        <rect width="500" height="300" fill="#070D18" />
        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4 4" />
        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4 4" />
        <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4 4" />
        <line x1="0" y1="200" x2="500" y2="200" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4 4" />

        <!-- CONE DE LUZ DINÂMICO (LUX) -->
        <polygon points="250,22 450,270 50,270" fill="url(#lightConeGradNeutral)" />

        ${glareEffect ? `
          <circle cx="250" cy="35" r="55" fill="rgba(255,255,255,0.22)" filter="url(#lampGlowNeutral)" />
          <polygon points="0,0 500,0 500,300 0,300" fill="rgba(255,255,255,0.15)" />
        ` : ''}

        <!-- PISO INDUSTRIAL -->
        <line x1="0" y1="${groundY}" x2="500" y2="${groundY}" stroke="#334155" stroke-width="4" />
        <rect x="80" y="${groundY}" width="400" height="5" fill="#EAB308" />

        <!-- RÉGUA ERGONÔMICA VERTICAL (REFERÊNCIA TÉCNICA) -->
        <g opacity="0.65">
          <line x1="475" y1="100" x2="475" y2="${groundY}" stroke="#64748B" stroke-width="1.5" />
          <line x1="468" y1="124" x2="475" y2="124" stroke="#64748B" stroke-width="1.5" />
          <text x="464" y="127" font-size="7.5" font-family="monospace" fill="#94A3B8" text-anchor="end">130cm</text>
          
          <line x1="462" y1="178" x2="475" y2="178" stroke="#38BDF8" stroke-width="2" />
          <text x="458" y="181" font-size="8" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="end">100cm (Cotovelo)</text>

          <line x1="468" y1="232" x2="475" y2="232" stroke="#64748B" stroke-width="1.5" />
          <text x="464" y="235" font-size="7.5" font-family="monospace" fill="#94A3B8" text-anchor="end">70cm</text>
        </g>

        <!-- LUMINÁRIA INDUSTRIAL NO TETO -->
        <g id="overhead-lamp">
          <line x1="250" y1="0" x2="250" y2="14" stroke="#64748B" stroke-width="2.5" />
          <path d="M 220,22 L 280,22 L 265,14 L 235,14 Z" fill="#475569" stroke="#0F172A" stroke-width="1.5" />
          <ellipse cx="250" cy="22" rx="22" ry="5.5" fill="#F8FAFC" filter="url(#lampGlowNeutral)" />
        </g>

        <!-- BANCADA MOTORIZADA COM PISTÃO (SOBE / DESCE) -->
        <g id="workstation-bench">
          <!-- Base Fixa no Piso -->
          <rect x="290" y="${groundY - 14}" width="80" height="14" rx="2" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
          <!-- Cilindro Telescópico Externo -->
          <rect x="315" y="${Math.min(groundY - 14, tableY + 42)}" width="30" height="${groundY - 14 - Math.min(groundY - 14, tableY + 42)}" fill="#334155" stroke="#0F172A" stroke-width="1.5" />
          <!-- Haste Cromada Hidráulica -->
          <rect x="322" y="${tableY + 12}" width="16" height="${Math.max(0, (groundY - 14) - (tableY + 12))}" fill="#94A3B8" stroke="#0F172A" stroke-width="1.5" />

          <!-- Tampo da Mesa -->
          <rect x="195" y="${tableY}" width="250" height="13" rx="3" fill="#0284C7" stroke="#0F172A" stroke-width="2" />
          <rect x="200" y="${tableY + 2}" width="240" height="3" fill="#38BDF8" opacity="0.6" />

          <!-- Display Digital de Altura da Bancada -->
          <rect x="385" y="${tableY + 1}" width="46" height="11" rx="2" fill="#0F172A" />
          <text x="408" y="${tableY + 9}" font-size="7.5" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">${benchHeight} cm</text>
        </g>

        <!-- CAIXA DESLIZANTE NA BANCADA (DISTÂNCIA DE ALCANCE) -->
        <g id="payload-box">
          <!-- Guia de Rolagem -->
          <line x1="195" y1="${tableY}" x2="445" y2="${tableY}" stroke="#0F172A" stroke-width="2.5" stroke-dasharray="6 3" />

          <!-- Caixa de Carga -->
          <rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="3" fill="#D97706" stroke="#0F172A" stroke-width="2" />
          <line x1="${boxX + 21}" y1="${boxY}" x2="${boxX + 21}" y2="${boxY + boxHeight}" stroke="#FDE68A" stroke-width="4.5" />
          <text x="${boxX + 21}" y="${boxY + 18}" font-size="9" font-family="monospace" font-weight="bold" fill="#0F172A" text-anchor="middle">${nWeight} kg</text>

          <!-- Cota Horizontal de Alcance (Cor Técnica Neutra) -->
          <line x1="195" y1="${tableY + 22}" x2="${boxX}" y2="${tableY + 22}" stroke="${techCyan}" stroke-width="1.8" stroke-dasharray="3 3" />
          <circle cx="195" cy="${tableY + 22}" r="2.5" fill="${techCyan}" />
          <circle cx="${boxX}" cy="${tableY + 22}" r="2.5" fill="${techCyan}" />
          <text x="${(195 + boxX) / 2}" y="${tableY + 34}" font-size="8" font-family="monospace" font-weight="bold" fill="${techCyan}" text-anchor="middle">Alcance: ${reachDistance} cm</text>
        </g>

        <!-- OPERADOR BIOMECÂNICO (CORES NEUTRAS DE ENGENHARIA) -->
        <g id="worker-avatar">
          <!-- Pernas e Calçados -->
          <line x1="118" y1="${groundY}" x2="118" y2="198" stroke="#1E293B" stroke-width="11" stroke-linecap="round" />
          <line x1="132" y1="${groundY}" x2="132" y2="198" stroke="#334155" stroke-width="11" stroke-linecap="round" />
          <rect x="110" y="${groundY - 6}" width="22" height="7" rx="2" fill="#0F172A" />
          <rect x="124" y="${groundY - 6}" width="24" height="7" rx="2" fill="#0F172A" />

          <!-- Quadril -->
          <ellipse cx="125" cy="196" rx="13" ry="9" fill="#334155" stroke="#0F172A" stroke-width="1.5" />

          <!-- Ponto de Referência Anatômico L4-L5 (Cor Neutra) -->
          <circle cx="125" cy="193" r="6" fill="${techCyan}" stroke="#0F172A" stroke-width="1.5" />
          <text x="102" y="196" font-size="7" font-family="monospace" fill="#94A3B8" text-anchor="end">L4-L5</text>

          <!-- Tronco / Coluna Vertebral (Curvatura Física Real sem Troca de Cor) -->
          <path d="M 125,193 Q ${(125 + shoulderX) / 2 + (totalForwardTilt * 0.4)},${(193 + shoulderY) / 2} ${shoulderX},${shoulderY}" fill="none" stroke="${techBlue}" stroke-width="15" stroke-linecap="round" />
          <line x1="125" y1="193" x2="${shoulderX}" y2="${shoulderY}" stroke="#0369A1" stroke-width="10" stroke-linecap="round" />

          <!-- Pescoço e Cabeça com Capacete -->
          <line x1="${shoulderX}" y1="${shoulderY}" x2="${headX}" y2="${headY}" stroke="${skinTone}" stroke-width="7" stroke-linecap="round" />
          <circle cx="${headX}" cy="${headY}" r="11" fill="${skinTone}" stroke="#0F172A" stroke-width="1.5" />
          <path d="M ${headX - 12},${headY - 2} C ${headX - 12},${headY - 16} ${headX + 14},${headY - 16} ${headX + 14},${headY - 2} Z" fill="#EAB308" stroke="#0F172A" stroke-width="1.8" />
          <circle cx="${headX + 6}" cy="${headY}" r="1.8" fill="#0F172A" />

          <!-- Braço (Ombro ➔ Cotovelo) -->
          <line x1="${shoulderX}" y1="${shoulderY}" x2="${elbowX}" y2="${elbowY}" stroke="${techBlue}" stroke-width="7.5" stroke-linecap="round" />
          <circle cx="${elbowX}" cy="${elbowY}" r="4.5" fill="${skinTone}" stroke="#0F172A" stroke-width="1.5" />

          <!-- Antebraço (Cotovelo ➔ Mão) -->
          <line x1="${elbowX}" y1="${elbowY}" x2="${handX + 5}" y2="${handY}" stroke="${skinTone}" stroke-width="6.5" stroke-linecap="round" />
          <ellipse cx="${handX + 5}" cy="${handY}" rx="5.5" ry="4.5" fill="${skinTone}" stroke="#0F172A" stroke-width="1.2" />
        </g>

        <!-- HUD TOPO: TELEMETRIA TÉCNICA NEUTRA (SEM SPOILERS) -->
        <g id="hud-status-banner">
          <rect x="8" y="7" width="235" height="20" rx="3" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1" />
          <text x="16" y="20" font-size="7.5" font-family="monospace" fill="${techCyan}">📐 TELEMETRIA: H=${benchHeight}cm | ALCANCE=${reachDistance}cm</text>

          <rect x="255" y="7" width="235" height="20" rx="3" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1" />
          <text x="263" y="20" font-size="7.5" font-family="monospace" fill="${techCyan}">💡 SENSOR FOTOMÉTRICO: ${lux} LUX</text>
        </g>

        <!-- MÁSCARA DE PENUMBRA REAL SE LUX FOR BAIXO -->
        ${ambientDarkness > 0.08 ? `
          <rect width="500" height="300" fill="rgba(3, 7, 18, ${ambientDarkness})" pointer-events="none" />
        ` : ''}
      </svg>
    `;
  }

  confirmErgoSettings() {
    const sBench = this.ergoValues.benchHeight;
    const sReach = this.ergoValues.reachDistance;
    const sLux = this.ergoValues.lux;
    const nWeight = this.ergoValues.nioshWeight;
    const fb = document.getElementById('ergo-feedback');

    // Validação técnica rigorosa de cada parâmetro
    const isBenchOk = (sBench >= 96 && sBench <= 106);
    const isReachOk = (sReach >= 24 && sReach <= 36);
    const isLuxOk = (sLux >= 500 && sLux <= 750);
    const isNioshCorrect = (nWeight === 12);

    const isAllCompliant = isBenchOk && isReachOk && isLuxOk && isNioshCorrect;

    if (!isAllCompliant) {
      if (window.soundFx) window.soundFx.error();

      const deviations = [];
      if (!isNioshCorrect) {
        deviations.push(`• <strong>Desafio NIOSH:</strong> A carga de ${nWeight || 23} kg está incorreta. Com distância horizontal H=45cm e assimetria, os multiplicadores reduzem a constante de 23 kg para o Limite de Peso Recomendado (LPR) de <strong>12 kg</strong>.`);
      }
      if (!isBenchOk) {
        deviations.push(`• <strong>Altura da Bancada (${sBench} cm):</strong> Não atende à altura neutra de cotovelo (98 a 104 cm). Força a coluna em flexão lombar ou provoca elevação estática dos ombros.`);
      }
      if (!isReachOk) {
        deviations.push(`• <strong>Distância de Alcance (${sReach} cm):</strong> Fora da zona ótima (25 a 35 cm). Gera abdução excessiva de ombro e momento de alavanca prejudicial na lombar L4-L5.`);
      }
      if (!isLuxOk) {
        deviations.push(`• <strong>Iluminância no Posto (${sLux} Lux):</strong> Não atende à NR-17 e NBR ISO/CIE 8995-1 (exige 500 a 750 Lux para bancadas de trabalho e inspeção de peças).`);
      }

      fb.innerHTML = `
        <div class="feedback-banner error" style="display: block;">
          <strong>PARECER DA AUDITORIA ERGONÔMICA (AET):</strong><br>
          Foram constatadas não-conformidades técnicas no posto:<br><br>
          ${deviations.join('<br>')}<br><br>
          <em>Corrija os parâmetros assinalados acima e submeta novamente a AET.</em>
        </div>
      `;
      return;
    }

    // Posto 100% Homologado
    if (window.soundFx) window.soundFx.success();
    const alreadyDone = window.gameStorage.state.stage2.ergoCompleted;
    if (!alreadyDone) {
      window.gameStorage.state.stage2.ergoCompleted = true;
      window.gameStorage.addScore('stage2', 400);
      this.updateProgressUI();
      this.renderSubgameNavigation();
    }

    fb.innerHTML = `
      <div class="feedback-banner success" style="display: block;">
        <strong>POSTO ERGONÔMICO HOMOLOGADO COM EXCELÊNCIA (+400 pontos)!</strong><br>
        Todos os critérios técnicos foram validados pela AET:<br>
        • Coluna e membros superiores em Linha Neutra (Escore RULA Nível 1);<br>
        • Zona de alcance ótimo atendida (25 a 35 cm);<br>
        • Iluminância conforme NBR ISO/CIE 8995-1 (500 a 750 Lux);<br>
        • Limite de Peso Recomendado (LPR) NIOSH calculado corretamente (12 kg).
      </div>
    `;
  }

  // =================================================================
  // SUBGAME 3: AUDITORIA ENERGÉTICA E GESTÃO DE RESÍDUOS (ISO 50001 / NBR 10004)
  // =================================================================
  initEnergyData() {
    this.energyActiveTab = 'leaks'; // 'leaks' | 'motor' | 'waste'
    this.energyBudget = 40000;
    this.energyTargetKwh = 0.30;
    this.energyBaselineKwh = 0.42;

    this.energyLeaks = [
      {
        id: 'trap',
        name: 'Purgador de Condensado da Linha Tronco',
        tag: 'PNT-TRP-02',
        type: 'leak',
        diameter: '5 mm',
        pressure: '6 bar',
        wastedPowerKw: 8.5,
        annualCostBrl: 22300,
        repairCost: 4200,
        kwhReduction: 0.065,
        repaired: false,
        scanned: false,
        dbLevel: 91,
        desc: 'Válvula mecânica purgadora travada aberta por incrustação. Despeja vazamento severo de ar comprimido (8,5 kW contínuos dissipados na atmosfera).'
      },
      {
        id: 'cylinder',
        name: 'Conexão Flexível do Cilindro Pneumático 01',
        tag: 'PNT-CYL-01',
        type: 'leak',
        diameter: '3 mm',
        pressure: '6 bar',
        wastedPowerKw: 3.2,
        annualCostBrl: 8400,
        repairCost: 2500,
        kwhReduction: 0.045,
        repaired: false,
        scanned: false,
        dbLevel: 78,
        desc: 'Engate rápido de alimentação com anel O-ring cisalhado sob 6 bar. Sibilo ultrassônico intenso e contínuo com perda de 3,2 kW.'
      },
      {
        id: 'flange',
        name: 'Flange do Pulmão de Distribuição',
        tag: 'PNT-FLG-04',
        type: 'leak',
        diameter: '1 mm',
        pressure: '6 bar',
        wastedPowerKw: 0.35,
        annualCostBrl: 920,
        repairCost: 800,
        kwhReduction: 0.008,
        repaired: false,
        scanned: false,
        dbLevel: 52,
        desc: 'Microfissura na junta de vedação da flange. Inaudível ao ouvido comum no ruído da fábrica, revelada com clareza no sensor ultrassônico.'
      },
      {
        id: 'manifold',
        name: 'Bloco Manifold de Válvulas Solenoides',
        tag: 'PNT-MNF-01',
        type: 'ok',
        scanned: false,
        dbLevel: 28,
        desc: 'Conexões estanques e carretéis sem vazamento. Nível basal de ruído (28 dB) dentro da normalidade operacional.'
      },
      {
        id: 'dryer',
        name: 'Secador Frigorífico e Filtro Coalescente',
        tag: 'PNT-DRY-01',
        type: 'ok',
        scanned: false,
        dbLevel: 31,
        desc: 'Tubulação estanque, trocador térmico calibrado e ponto de orvalho de 3 °C plenamente assegurado.'
      }
    ];

    this.activeScannedLeak = null;
    this.selectedMotor = 'IE2'; // 'IE2' | 'IE3' | 'IE4'
    this.selectedDrive = 'DIRETA'; // 'DIRETA' | 'SOFT' | 'INVERSOR'

    this.energyWasteItems = [
      {
        id: 'oleo',
        name: 'Óleo mineral lubrificante usado de caixas redutoras',
        hint: 'Óleo térmico oxidado com hidrocarbonetos e partículas metálicas.',
        correctClass: 'I',
        correctDest: 'rerrefino',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Resíduo Perigoso (Classe I). A Resolução CONAMA 362/2005 torna o Rerrefino compulsório por preservar recursos e evitar poluição das águas.'
      },
      {
        id: 'estopa',
        name: 'Estopas e panos embebidos em solvente e graxas',
        hint: 'Materiais absorventes com risco inflamável e resíduos tóxicos.',
        correctClass: 'I',
        correctDest: 'coprocessamento',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Resíduo Perigoso (Classe I - inflamável). Destinação ótima para Coprocessamento em fornos de cimento ou incineração controlada.'
      },
      {
        id: 'bateria',
        name: 'Baterias seladas VRLA (Chumbo-Ácido) de Nobreak',
        hint: 'Eletrodos de chumbo metálico e eletrólito ácido sulfúrico.',
        correctClass: 'I',
        correctDest: 'logistica_reversa',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Resíduo Perigoso (Classe I). Resolução CONAMA 401/2008 obriga a Logística Reversa com retorno compulsório ao fabricante/importador.'
      },
      {
        id: 'lampada',
        name: 'Lâmpadas fluorescentes tubulares queimadas da iluminação',
        hint: 'Tubos de descarga a vapor contendo mercúrio metálico e fósforo.',
        correctClass: 'I',
        correctDest: 'descontaminacao',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Resíduo Perigoso (Classe I). Exige Descontaminação Térmica especializada com quebra a vácuo e recuperação do mercúrio.'
      },
      {
        id: 'placa_eletr',
        name: 'Placas eletrônicas sucateadas de inversores e CLPs (REEE)',
        hint: 'Laminados com solda estanho, componentes semicondutores e trilhas.',
        correctClass: 'IIA',
        correctDest: 'reciclagem_eletr',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Classe II A (Não Inerte - potencial de lixiviação). Destinação: Reciclagem especializada de eletroeletrônicos para refino de metais nobres.'
      },
      {
        id: 'cobre',
        name: 'Sucata limpa de condutores de cobre e perfis de alumínio',
        hint: 'Cabos elétricos decapados sem óleos ou isolações poliméricas.',
        correctClass: 'IIB',
        correctDest: 'siderurgia',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Classe II B (Inerte - não se decompõe nem contamina o solo). Destinação: Fusão siderúrgica com 100% de reaproveitamento de matéria-prima.'
      },
      {
        id: 'papelao',
        name: 'Embalagens secundárias limpas de papelão dos novos motores',
        hint: 'Papelão ondulado sem contato com óleos ou graxas.',
        correctClass: 'IIA',
        correctDest: 'reciclagem_papel',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Classe II A (Não Inerte - biodegradável e combustível). Destinação: Coleta seletiva industrial para reciclagem de papel e papelão.'
      },
      {
        id: 'filtro_ar',
        name: 'Elementos filtrantes particulados de ar industrial (secos)',
        hint: 'Filtros saturados apenas com poeira inerte do galpão de usinagem.',
        correctClass: 'IIA',
        correctDest: 'aterro_classe2',
        selectedClass: '',
        selectedDest: '',
        explanation: 'Classe II A (Não Inerte). Fibras saturadas sem viabilidade de reciclagem devem ser encaminhadas para Aterro Industrial Classe II licenciado.'
      }
    ];

    this.energyAuditReport = null;
    this.energyFixedLeaks = false;
    this.energyUpgradedMotor = false;
    this.energySelectedWasteClass = null;
  }

  getDestLabel(destKey) {
    const map = {
      'rerrefino': 'Rerrefino (Resolução CONAMA 362)',
      'coprocessamento': 'Coprocessamento em Forno de Clínquer',
      'logistica_reversa': 'Logística Reversa (Resolução CONAMA 401)',
      'descontaminacao': 'Descontaminação Térmica Especializada',
      'reciclagem_eletr': 'Reciclagem de Eletroeletrônicos (REEE)',
      'siderurgia': 'Siderurgia / Fundição de Metais',
      'reciclagem_papel': 'Reciclagem de Papel e Papelão',
      'aterro_classe2': 'Aterro Industrial Classe II Licenciado'
    };
    return map[destKey] || destKey;
  }

  calculateEnergyMetrics() {
    let spent = 0;
    let kwhReduction = 0;
    let annualSavingsBrl = 0;

    // Vazamentos reparados
    this.energyLeaks.forEach(l => {
      if (l.type === 'leak' && l.repaired) {
        spent += l.repairCost;
        kwhReduction += l.kwhReduction;
        annualSavingsBrl += l.annualCostBrl;
      }
    });

    // Motores
    const motorData = {
      'IE2': { cost: 0, kwhRed: 0, rend: '89.0%' },
      'IE3': { cost: 6500, kwhRed: 0.022, rend: '93.0%' },
      'IE4': { cost: 11000, kwhRed: 0.042, rend: '95.8%' }
    };
    const m = motorData[this.selectedMotor] || motorData['IE2'];
    spent += m.cost;
    kwhReduction += m.kwhRed;

    // Acionamentos
    const driveData = {
      'DIRETA': { cost: 0, kwhRed: 0 },
      'SOFT': { cost: 4000, kwhRed: 0.008 },
      'INVERSOR': { cost: 9500, kwhRed: 0.035 }
    };
    const d = driveData[this.selectedDrive] || driveData['DIRETA'];
    spent += d.cost;
    kwhReduction += d.kwhRed;

    // Economia anual adicional do retrofit eletromecânico (baseada em 120.000 peças/ano x R$ 0,72/kWh)
    const electricKwhSavedAnnual = (m.kwhRed + d.kwhRed) * 120000;
    const electricSavingsBrlAnnual = electricKwhSavedAnnual * 0.72;
    annualSavingsBrl += electricSavingsBrlAnnual;

    const currentKwhPerUnit = Math.max(0.20, Number((this.energyBaselineKwh - kwhReduction).toFixed(3)));
    const budgetRemaining = this.energyBudget - spent;

    // Fator de emissão da rede elétrica brasileira (MCTI / SIN): 0,085 kg CO2/kWh
    const totalKwhSavedAnnual = (annualSavingsBrl / 0.72);
    const co2AvoidedKg = totalKwhSavedAnnual * 0.085;
    const co2AvoidedTons = (co2AvoidedKg / 1000).toFixed(2);

    const paybackYears = spent > 0 && annualSavingsBrl > 0 ? (spent / annualSavingsBrl).toFixed(1) : '0';
    const paybackMonths = spent > 0 && annualSavingsBrl > 0 ? Math.round((spent / annualSavingsBrl) * 12) : 0;

    // Compatibilidade com flags legadas
    const trapDone = this.energyLeaks.find(l => l.id === 'trap')?.repaired;
    const cylDone = this.energyLeaks.find(l => l.id === 'cylinder')?.repaired;
    this.energyFixedLeaks = Boolean(trapDone && cylDone);
    this.energyUpgradedMotor = Boolean(this.selectedMotor === 'IE4' && this.selectedDrive === 'INVERSOR');
    const oleoItem = this.energyWasteItems.find(w => w.id === 'oleo');
    this.energySelectedWasteClass = oleoItem ? oleoItem.selectedClass : null;

    return {
      spent,
      budgetRemaining,
      currentKwhPerUnit,
      kwhReduction,
      annualSavingsBrl: Math.round(annualSavingsBrl),
      co2AvoidedKg: Math.round(co2AvoidedKg),
      co2AvoidedTons,
      paybackYears,
      paybackMonths
    };
  }

  setEnergyTab(tab) {
    this.energyActiveTab = tab;
    if (window.soundFx) window.soundFx.click();
    this.renderEnergySubgame(document.getElementById('stage2-minigame-content'));
  }

  scanLeak(leakId) {
    const leak = this.energyLeaks.find(l => l.id === leakId);
    if (!leak) return;

    leak.scanned = true;
    this.activeScannedLeak = leak;

    if (window.soundFx) {
      if (leak.type === 'leak' && !leak.repaired) {
        const gain = leak.dbLevel > 80 ? 0.12 : leak.dbLevel > 60 ? 0.08 : 0.04;
        window.soundFx.playAirHiss(0.35, gain);
      } else {
        window.soundFx.click();
      }
    }
    this.renderEnergySubgame(document.getElementById('stage2-minigame-content'));
  }

  toggleRepairLeak(leakId) {
    const leak = this.energyLeaks.find(l => l.id === leakId);
    if (!leak || leak.type !== 'leak') return;

    leak.repaired = !leak.repaired;
    if (window.soundFx) {
      if (leak.repaired) window.soundFx.success();
      else window.soundFx.click();
    }
    this.renderEnergySubgame(document.getElementById('stage2-minigame-content'));
  }

  selectMotorChoice(motorKey) {
    this.selectedMotor = motorKey;
    if (window.soundFx) window.soundFx.click();
    this.renderEnergySubgame(document.getElementById('stage2-minigame-content'));
  }

  selectDriveChoice(driveKey) {
    this.selectedDrive = driveKey;
    if (window.soundFx) window.soundFx.click();
    this.renderEnergySubgame(document.getElementById('stage2-minigame-content'));
  }

  setWasteClass(id, val) {
    const item = this.energyWasteItems.find(w => w.id === id);
    if (item) item.selectedClass = val;
    this.renderEnergyTelemetryPanel();
  }

  setWasteDest(id, val) {
    const item = this.energyWasteItems.find(w => w.id === id);
    if (item) item.selectedDest = val;
    this.renderEnergyTelemetryPanel();
  }

  renderEnergySubgame(container) {
    if (!container) return;
    const isCompleted = window.gameStorage.state.stage2.energyCompleted;
    const m = this.calculateEnergyMetrics();

    container.innerHTML = `
      <!-- Banner com Metas da Missão Técnica -->
      <div class="energy-mission-banner">
        <div class="energy-mission-info">
          <h3>
            <span>⚡</span> Missão Técnica: Auditoria Energética & Gestão de Resíduos (ISO 50001 / NBR 10004)
          </h3>
          <p>
            A fábrica precisa reduzir o indicador de consumo de <strong>0,420 para no máximo 0,300 kWh/peça</strong> com orçamento teto de <strong>R$ 40.000,00</strong>. Investigue a rede de ar, especifique o motor e realize a triagem dos resíduos industriais.
          </p>
        </div>
        <div class="energy-mission-kpis">
          <div class="energy-kpi-chip">
            <span class="kpi-label">Orçamento Total</span>
            <span class="kpi-val" style="color: var(--warning-amber);">R$ 40.000</span>
          </div>
          <div class="energy-kpi-chip">
            <span class="kpi-label">Meta Consumo</span>
            <span class="kpi-val" style="color: var(--safety-green);">≤ 0,300 kWh/pç</span>
          </div>
        </div>
      </div>

      <!-- Layout em Grid: Missões à Esquerda e Telemetria à Direita -->
      <div class="energy-subgame-grid">
        <div>
          <!-- Abas de Navegação Interna -->
          <div class="energy-section-tabs">
            <button class="energy-sec-tab ${this.energyActiveTab === 'leaks' ? 'active' : ''}" onclick="stage2.setEnergyTab('leaks')">
              🔍 1. Caça aos Vazamentos (Ultrassom)
            </button>
            <button class="energy-sec-tab ${this.energyActiveTab === 'motor' ? 'active' : ''}" onclick="stage2.setEnergyTab('motor')">
              ⚙️ 2. Retrofit Motor & Acionamento
            </button>
            <button class="energy-sec-tab ${this.energyActiveTab === 'waste' ? 'active' : ''}" onclick="stage2.setEnergyTab('waste')">
              ♻️ 3. Triagem Resíduos (NBR 10004)
            </button>
          </div>

          <!-- Conteúdo da Aba Ativa -->
          <div id="energy-tab-content">
            ${this.renderActiveTabHTML(m)}
          </div>
        </div>

        <!-- Painel Lateral de Telemetria Neutra SCADA -->
        <div class="telemetry-scada-panel" id="energy-telemetry-panel">
          ${this.getTelemetryPanelHTML(m, isCompleted)}
        </div>
      </div>
    `;
  }

  renderActiveTabHTML(m) {
    if (this.energyActiveTab === 'leaks') {
      return this.renderLeaksTabHTML();
    } else if (this.energyActiveTab === 'motor') {
      return this.renderMotorTabHTML();
    } else {
      return this.renderWasteTabHTML();
    }
  }

  renderLeaksTabHTML() {
    const curLeak = this.activeScannedLeak;
    const curDb = curLeak ? (curLeak.type === 'leak' && !curLeak.repaired ? curLeak.dbLevel : 28) : '--';
    const dbClass = curDb > 80 ? 'danger' : curDb > 50 ? 'warning' : '';

    return `
      <!-- Esquema da Planta Pneumática -->
      <div class="pneumatic-plant-view">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--tech-cyan); text-transform: uppercase;">
            PLANT-SCADA // Malha de Ar Comprimido (Linha Principal 6.0 bar)
          </span>
          <span style="font-size: 0.75rem; color: var(--text-dim);">
            Clique em "Escanear" em cada ponto para aproximar o detector
          </span>
        </div>

        <!-- Diagrama SVG da Linha Pneumática -->
        <svg class="plant-schematic-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Linhas de Tubulação Tronco -->
          <path d="M 60 100 L 170 100 L 170 140 L 300 140 L 300 80 L 440 80 L 440 120 L 540 120" stroke="rgba(6, 182, 212, 0.4)" stroke-width="6" stroke-linecap="round"/>
          <path d="M 60 100 L 170 100 L 170 140 L 300 140 L 300 80 L 440 80 L 440 120 L 540 120" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" stroke-dasharray="8 6"/>

          <!-- Compressor Parafuso (Início) -->
          <rect x="20" y="70" width="45" height="60" rx="6" fill="#1e293b" stroke="var(--border-subtle)" stroke-width="2"/>
          <text x="42" y="105" fill="var(--text-main)" font-size="9" font-family="monospace" text-anchor="middle">COMP</text>

          <!-- Pulmão / Reservatório Vertical -->
          <rect x="145" y="45" width="50" height="90" rx="14" fill="#0f172a" stroke="rgba(6, 182, 212, 0.5)" stroke-width="2"/>
          <text x="170" y="85" fill="var(--tech-cyan)" font-size="8" font-family="monospace" text-anchor="middle">PULMÃO</text>
          <text x="170" y="98" fill="var(--text-dim)" font-size="7" font-family="monospace" text-anchor="middle">1000 L</text>

          <!-- Purgador de Linha Tronco -->
          <circle cx="235" cy="140" r="14" fill="#1e293b" stroke="${this.energyLeaks.find(l => l.id === 'trap')?.repaired ? 'var(--safety-green)' : 'var(--warning-amber)'}" stroke-width="2"/>
          <text x="235" y="143" fill="#fff" font-size="7" font-family="monospace" text-anchor="middle">PURG</text>

          <!-- Secador de Ar Frigorífico -->
          <rect x="280" y="60" width="40" height="50" rx="5" fill="#1e293b" stroke="var(--border-subtle)" stroke-width="1.5"/>
          <text x="300" y="88" fill="var(--text-muted)" font-size="7" font-family="monospace" text-anchor="middle">SEC</text>

          <!-- Bloco Manifold -->
          <rect x="420" y="65" width="40" height="45" rx="4" fill="#1e293b" stroke="var(--border-subtle)" stroke-width="1.5"/>
          <text x="440" y="90" fill="var(--text-muted)" font-size="7" font-family="monospace" text-anchor="middle">MNF</text>

          <!-- Cilindro Atuador -->
          <rect x="520" y="105" width="60" height="30" rx="4" fill="#0f172a" stroke="${this.energyLeaks.find(l => l.id === 'cylinder')?.repaired ? 'var(--safety-green)' : 'rgba(239, 68, 68, 0.6)'}" stroke-width="2"/>
          <line x1="565" y1="120" x2="595" y2="120" stroke="var(--tech-cyan)" stroke-width="4" stroke-linecap="round"/>
          <text x="548" y="123" fill="#fff" font-size="7" font-family="monospace" text-anchor="middle">CYL-01</text>

          <!-- Marcadores dos Pontos Inspecionados -->
          <!-- Purgador (trap) -->
          <circle cx="235" cy="140" r="22" stroke="${this.activeScannedLeak?.id === 'trap' ? 'var(--tech-cyan)' : 'transparent'}" stroke-width="2" stroke-dasharray="4 4"/>
          <!-- Flange pulmão (flange) -->
          <circle cx="170" cy="130" r="16" stroke="${this.activeScannedLeak?.id === 'flange' ? 'var(--tech-cyan)' : 'transparent'}" stroke-width="2" stroke-dasharray="4 4"/>
          <!-- Cilindro (cylinder) -->
          <circle cx="530" cy="120" r="18" stroke="${this.activeScannedLeak?.id === 'cylinder' ? 'var(--tech-cyan)' : 'transparent'}" stroke-width="2" stroke-dasharray="4 4"/>
        </svg>
      </div>

      <!-- Estação do Detector Ultrassônico Digital -->
      <div class="detector-station">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim); font-family: var(--font-mono); margin-bottom: 0.2rem;">
            Aparelho Detector Ultrassônico (40.0 kHz Heteródino)
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            ${curLeak ? (curLeak.scanned ? `Foco ativo: <strong>${curLeak.name}</strong> (${curLeak.tag})` : 'Aponte a sonda do detector') : 'Clique em "Escanear Ponto" na lista abaixo para ouvir e medir o sinal'}
          </div>
        </div>
        <div class="detector-digital-meter">
          <div style="text-align: right;">
            <div style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">LEITURA RMS</div>
            <div style="font-size: 0.7rem; color: var(--tech-cyan); font-family: var(--font-mono);">40 kHz AUDIO</div>
          </div>
          <div class="db-display ${dbClass}" id="meter-db-value">
            ${curDb !== '--' ? curDb + ' dB' : '-- dB'}
          </div>
        </div>
      </div>

      <!-- Lista de Pontos da Linha para Investigação -->
      <div class="leak-points-list">
        ${this.energyLeaks.map(leak => {
          const isLeak = leak.type === 'leak';
          const isRepaired = isLeak && leak.repaired;
          const isScanned = leak.scanned;

          return `
            <div class="leak-point-card ${isRepaired ? 'repaired' : ''}" style="${this.activeScannedLeak?.id === leak.id ? 'border-color: var(--tech-cyan);' : ''}">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--tech-cyan); background: rgba(6, 182, 212, 0.1); padding: 0.1rem 0.4rem; border-radius: 4px;">
                    ${leak.tag}
                  </span>
                  <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">
                    ${leak.name}
                  </span>
                  ${isScanned ? (
                    isLeak ? (
                      isRepaired ? '<span style="font-size: 0.7rem; color: var(--safety-green); font-family: var(--font-mono);">✓ REPARADO (ESTANQUE)</span>' :
                      '<span style="font-size: 0.7rem; color: var(--hazard-red); font-family: var(--font-mono);">⚠️ VAZAMENTO DETECTADO</span>'
                    ) : '<span style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">✓ NORMAL (ESTANQUE)</span>'
                  ) : '<span style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">NÃO ESCANEADO</span>'}
                </div>

                <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">
                  ${isScanned ? leak.desc : 'Ponto de pressão pressurizado a 6.0 bar. Aproxime a sonda ultrassônica para avaliar estanqueidade.'}
                </p>

                ${isScanned && isLeak ? `
                  <div style="display: flex; gap: 0.75rem; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); flex-wrap: wrap;">
                    <span>Orifício eq.: <strong style="color: var(--text-main);">${leak.diameter}</strong></span>
                    <span>Potência dissipada: <strong style="color: var(--hazard-red);">${leak.wastedPowerKw} kW</strong></span>
                    <span>Custo do desperdício: <strong style="color: var(--warning-amber);">R$ ${leak.annualCostBrl.toLocaleString('pt-BR')}/ano</strong></span>
                    <span>Redução projetada: <strong style="color: var(--safety-green); font-weight: 700;">-${leak.kwhReduction.toFixed(3)} kWh/pç</strong></span>
                  </div>
                ` : ''}
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.4rem; min-width: 140px; text-align: right;">
                <button class="btn-secondary" style="padding: 0.45rem 0.75rem; font-size: 0.75rem;" onclick="stage2.scanLeak('${leak.id}')">
                  🔍 Escanear com Ultrassom
                </button>
                ${isScanned && isLeak ? `
                  <button class="${isRepaired ? 'btn-secondary' : 'btn-primary'}" style="padding: 0.45rem 0.75rem; font-size: 0.75rem;" onclick="stage2.toggleRepairLeak('${leak.id}')">
                    ${isRepaired ? 'Desfazer Reparo' : `Vedar (R$ ${leak.repairCost.toLocaleString('pt-BR')})`}
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderMotorTabHTML() {
    return `
      <div class="retrofit-options-grid">
        <!-- Modernização do Motor Elétrico -->
        <div class="retrofit-box">
          <h4>
            <span>⚡</span> 1. Especificação de Eficiência do Motor Elétrico (Linha de Transporte)
          </h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.85rem;">
            O motor atual é um modelo <strong>IE2 Standard (89,0% de rendimento)</strong> com perdas térmicas elevadas. Escolha a tecnologia de substituição ponderando o custo do motor e a meta de consumo:
          </p>

          <div class="choice-pill-group">
            <button class="choice-pill-btn ${this.selectedMotor === 'IE2' ? 'selected' : ''}" onclick="stage2.selectMotorChoice('IE2')">
              <span class="pill-title">Manter IE2 Standard</span>
              <span class="pill-sub">Rendimento: 89,0%<br>Redução: 0,000 kWh/pç</span>
              <span class="pill-cost">R$ 0,00</span>
            </button>
            <button class="choice-pill-btn ${this.selectedMotor === 'IE3' ? 'selected' : ''}" onclick="stage2.selectMotorChoice('IE3')">
              <span class="pill-title">Motor IE3 Premium</span>
              <span class="pill-sub">Rendimento: 93,0%<br>Redução: -0,022 kWh/pç</span>
              <span class="pill-cost">R$ 6.500,00</span>
            </button>
            <button class="choice-pill-btn ${this.selectedMotor === 'IE4' ? 'selected' : ''}" onclick="stage2.selectMotorChoice('IE4')">
              <span class="pill-title">Motor IE4 Super Premium</span>
              <span class="pill-sub">Rendimento: 95,8%<br>Redução: -0,042 kWh/pç</span>
              <span class="pill-cost">R$ 11.000,00</span>
            </button>
          </div>
        </div>

        <!-- Sistema de Partida e Acionamento -->
        <div class="retrofit-box">
          <h4>
            <span>🎛️</span> 2. Tecnologia de Acionamento e Modulação de Velocidade
          </h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.85rem;">
            Avalie o perfil de torque da linha (esteira industrial com carga intermitente de 60% e períodos de espera entre lotes):
          </p>

          <div class="choice-pill-group">
            <button class="choice-pill-btn ${this.selectedDrive === 'DIRETA' ? 'selected' : ''}" onclick="stage2.selectDriveChoice('DIRETA')">
              <span class="pill-title">Partida Direta (Contator)</span>
              <span class="pill-sub">Velocidade 100% fixa<br>Sem controle de rotação</span>
              <span class="pill-cost">R$ 0,00</span>
            </button>
            <button class="choice-pill-btn ${this.selectedDrive === 'SOFT' ? 'selected' : ''}" onclick="stage2.selectDriveChoice('SOFT')">
              <span class="pill-title">Soft-Starter Digital</span>
              <span class="pill-sub">Rampa suave na partida<br>Velocidade fixa em regime</span>
              <span class="pill-cost">R$ 4.000,00</span>
            </button>
            <button class="choice-pill-btn ${this.selectedDrive === 'INVERSOR' ? 'selected' : ''}" onclick="stage2.selectDriveChoice('INVERSOR')">
              <span class="pill-title">Inversor de Frequência (VFD)</span>
              <span class="pill-sub">Controle PWM de rotação<br>Desacelera em vazio</span>
              <span class="pill-cost">R$ 9.500,00</span>
            </button>
          </div>
        </div>

        <div style="background: rgba(10, 16, 28, 0.6); border: 1px dashed var(--border-subtle); border-radius: 10px; padding: 0.85rem; font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
          💡 <strong>Critério Técnico de Engenharia:</strong> Ao contrário de bombas e ventiladores (que obedecem à Lei Cúbica de afinidade), esteiras industriais possuem característica de torque constante. O inversor traz economia ao reduzir a velocidade para 20% nos intervalos de espera entre bateladas, eliminando o consumo em vazio.
        </div>
      </div>
    `;
  }

  renderWasteTabHTML() {
    return `
      <div>
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--warning-amber); margin-bottom: 0.25rem;">
            Classificação Técnica & Destinação de Resíduos Industriais (ABNT NBR 10004 / CONAMA)
          </h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">
            A intervenção mecânica e elétrica gerou os 8 resíduos industriais abaixo. Selecione a <strong>Classe NBR 10004</strong> e a <strong>Destinação Legal</strong> adequada para homologar a conformidade ambiental:
          </p>
        </div>

        <div class="waste-list-container">
          ${this.energyWasteItems.map(item => `
            <div class="waste-card">
              <div class="waste-card-header">
                <div>
                  <div class="waste-item-name">${item.name}</div>
                  <div class="waste-item-hint">${item.hint}</div>
                </div>
              </div>

              <div class="waste-card-selectors">
                <div>
                  <label style="display: block; font-size: 0.7rem; color: var(--text-dim); margin-bottom: 0.25rem; font-family: var(--font-mono);">
                    CLASSE NBR 10004
                  </label>
                  <select class="waste-select-field" style="width: 100%;" onchange="stage2.setWasteClass('${item.id}', this.value)">
                    <option value="" ${!item.selectedClass ? 'selected' : ''}>-- Selecione a Classe --</option>
                    <option value="I" ${item.selectedClass === 'I' ? 'selected' : ''}>Classe I (Perigoso)</option>
                    <option value="IIA" ${item.selectedClass === 'IIA' ? 'selected' : ''}>Classe II A (Não Inerte)</option>
                    <option value="IIB" ${item.selectedClass === 'IIB' ? 'selected' : ''}>Classe II B (Inerte)</option>
                  </select>
                </div>

                <div>
                  <label style="display: block; font-size: 0.7rem; color: var(--text-dim); margin-bottom: 0.25rem; font-family: var(--font-mono);">
                    DESTINAÇÃO AMBIENTAL LEGAL
                  </label>
                  <select class="waste-select-field" style="width: 100%;" onchange="stage2.setWasteDest('${item.id}', this.value)">
                    <option value="" ${!item.selectedDest ? 'selected' : ''}>-- Selecione a Destinação --</option>
                    <option value="rerrefino" ${item.selectedDest === 'rerrefino' ? 'selected' : ''}>Rerrefino (CONAMA 362)</option>
                    <option value="coprocessamento" ${item.selectedDest === 'coprocessamento' ? 'selected' : ''}>Coprocessamento em Forno de Cimento</option>
                    <option value="logistica_reversa" ${item.selectedDest === 'logistica_reversa' ? 'selected' : ''}>Logística Reversa Obrigatória (CONAMA 401)</option>
                    <option value="descontaminacao" ${item.selectedDest === 'descontaminacao' ? 'selected' : ''}>Descontaminação Térmica Especializada</option>
                    <option value="reciclagem_eletr" ${item.selectedDest === 'reciclagem_eletr' ? 'selected' : ''}>Reciclagem de Eletroeletrônicos (REEE)</option>
                    <option value="siderurgia" ${item.selectedDest === 'siderurgia' ? 'selected' : ''}>Siderurgia / Fundição de Metais</option>
                    <option value="reciclagem_papel" ${item.selectedDest === 'reciclagem_papel' ? 'selected' : ''}>Reciclagem de Papel e Papelão</option>
                    <option value="aterro_classe2" ${item.selectedDest === 'aterro_classe2' ? 'selected' : ''}>Aterro Industrial Licenciado Classe II</option>
                  </select>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getTelemetryPanelHTML(m, isCompleted) {
    const budgetPct = Math.min(100, Math.round((m.spent / this.energyBudget) * 100));
    const isBudgetOver = m.budgetRemaining < 0;

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">
            TELEMETRIA TÉCNICA E BALANÇO ESG
          </h4>
          <span style="font-size: 0.7rem; color: var(--tech-cyan); font-family: var(--font-mono);">
            ONLINE SCADA
          </span>
        </div>

        <!-- Medidor Neutro de Consumo Unitário -->
        <div class="kwh-gauge-box">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-family: var(--font-mono);">
            Consumo Específico Projetado
          </div>
          <div class="kwh-main-value" id="kwh-display-val">
            ${m.currentKwhPerUnit.toFixed(3)} <span style="font-size: 1rem; color: var(--text-dim);">kWh/pç</span>
          </div>
          <div class="kwh-meta-badge">
            Linha Base: 0,420 kWh/pç | Meta: ≤ 0,300 kWh/pç
          </div>
        </div>

        <!-- Balanço de Orçamento da Missão -->
        <div style="margin: 1.25rem 0;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-family: var(--font-mono); margin-bottom: 0.35rem;">
            <span style="color: var(--text-muted);">Investimento Alocado:</span>
            <span style="font-weight: 700; color: ${isBudgetOver ? 'var(--hazard-red)' : 'var(--text-main)'};">
              R$ ${m.spent.toLocaleString('pt-BR')} / R$ 40.000
            </span>
          </div>
          <div class="budget-bar-bg">
            <div class="budget-bar-fill" style="width: ${budgetPct}%; background: ${isBudgetOver ? 'var(--hazard-red)' : 'linear-gradient(90deg, var(--tech-cyan), var(--tech-blue))'};"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-dim); margin-top: 0.25rem;">
            <span>Saldo: R$ ${m.budgetRemaining.toLocaleString('pt-BR')}</span>
            <span>${budgetPct}% do teto</span>
          </div>
        </div>

        <!-- Indicadores de Retorno Econômico e CO2 -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 0.85rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
            <span style="color: var(--text-muted);">Economia Estimada:</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--safety-green);">
              R$ ${m.annualSavingsBrl.toLocaleString('pt-BR')}/ano
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
            <span style="color: var(--text-muted);">Tempo de Retorno (Payback):</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-main);">
              ${m.paybackMonths > 0 ? `${m.paybackMonths} meses (${m.paybackYears} anos)` : '--'}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
            <span style="color: var(--text-muted);">Abatimento de CO₂ (SIN/MCTI):</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--tech-cyan);">
              ${m.co2AvoidedTons} t CO₂/ano
            </span>
          </div>
        </div>
      </div>

      <div>
        <button class="btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.9rem;" onclick="stage2.confirmEnergyAudit()" id="btn-confirm-energy" ${isCompleted ? 'disabled' : ''}>
          ${isCompleted ? '✓ Auditoria Ambiental Homologada (+300 pts)' : 'Homologar Auditoria de Sustentabilidade'}
        </button>
        <div id="energy-feedback" style="margin-top: 0.75rem;"></div>
      </div>
    `;
  }

  renderEnergyTelemetryPanel() {
    const panel = document.getElementById('energy-telemetry-panel');
    if (!panel) return;
    const isCompleted = window.gameStorage.state.stage2.energyCompleted;
    const m = this.calculateEnergyMetrics();
    panel.innerHTML = this.getTelemetryPanelHTML(m, isCompleted);
  }

  confirmEnergyAudit() {
    const metrics = this.calculateEnergyMetrics();
    const fb = document.getElementById('energy-feedback');

    const errors = [];

    // 1. Orçamento estourado
    if (metrics.budgetRemaining < 0) {
      errors.push(`• <strong>Orçamento Estourado:</strong> O investimento de R$ ${metrics.spent.toLocaleString('pt-BR')} excede o teto estipulado de R$ 40.000,00.`);
    }

    // 2. Meta de consumo unitário
    if (metrics.currentKwhPerUnit > this.energyTargetKwh) {
      errors.push(`• <strong>Meta Não Atingida:</strong> O consumo final foi de <strong>${metrics.currentKwhPerUnit.toFixed(3)} kWh/peça</strong> (meta máxima: ≤ 0,300 kWh/peça). Elimine vazamentos críticos de ar comprimido e modernize o acionamento elétrico.`);
    }

    // 3. Triagem de resíduos NBR 10004
    let unclassifiedCount = 0;
    const wasteErrors = [];

    this.energyWasteItems.forEach(w => {
      if (!w.selectedClass || !w.selectedDest) {
        unclassifiedCount++;
      } else {
        if (w.selectedClass !== w.correctClass) {
          wasteErrors.push(`• <strong>${w.name}</strong>: Classificado como Classe ${w.selectedClass}, mas é <strong>Classe ${w.correctClass}</strong> (${w.explanation})`);
        }
        if (w.selectedDest !== w.correctDest) {
          wasteErrors.push(`• <strong>${w.name}</strong>: Destinação incorreta. Exige <strong>${this.getDestLabel(w.correctDest)}</strong>.`);
        }
      }
    });

    if (unclassifiedCount > 0) {
      errors.push(`• <strong>Triagem Incompleta:</strong> Restam ${unclassifiedCount} resíduo(s) na aba de Resíduos sem classificação e destinação definidas.`);
    }

    if (wasteErrors.length > 0) {
      errors.push(`• <strong>Não-conformidades Ambientais (NBR 10004 / CONAMA):</strong><br>${wasteErrors.join('<br>')}`);
    }

    // Reprovação
    if (errors.length > 0) {
      if (window.soundFx) window.soundFx.error();
      if (fb) {
        fb.innerHTML = `
          <div class="feedback-banner error" style="display: block; text-align: left;">
            <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚠️</span> PARECER TÉCNICO: NÃO-CONFORMIDADES IDENTIFICADAS
            </div>
            <div style="font-size: 0.82rem; line-height: 1.5;">
              ${errors.map(e => `<div style="margin-bottom: 0.4rem;">${e}</div>`).join('')}
            </div>
          </div>
        `;
      }
      return;
    }

    // Aprovação com Excelência
    if (window.soundFx) window.soundFx.success();
    window.gameStorage.state.stage2.energyCompleted = true;
    window.gameStorage.addScore('stage2', 300);

    this.energyAuditReport = {
      metrics,
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };

    if (fb) {
      fb.innerHTML = `
        <div class="feedback-banner success" style="display: block; text-align: left;">
          <div style="font-weight: 800; font-size: 1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🛡️</span> DIAGNÓSTICO ESG & EFICIÊNCIA ENERGÉTICA CONCLUÍDO (+300 PTS)!
          </div>
          <div style="font-size: 0.85rem; line-height: 1.5;">
            • <strong>Energy per Unit Atingido:</strong> de 0,420 para <strong>${metrics.currentKwhPerUnit.toFixed(3)} kWh/peça</strong> (Redução de ${metrics.kwhReduction.toFixed(3)} kWh/peça);<br>
            • <strong>Economia Operacional:</strong> R$ ${metrics.annualSavingsBrl.toLocaleString('pt-BR')}/ano com Payback Simples de ${metrics.paybackMonths} meses (${metrics.paybackYears} anos);<br>
            • <strong>Pegada de Carbono (MCTI/SIN):</strong> <strong>${metrics.co2AvoidedTons} toneladas de CO₂ evitadas/ano</strong>;<br>
            • <strong>Conformidade NBR 10004 / CONAMA:</strong> 100% dos resíduos industriais classificados e destinados legalmente.
          </div>
        </div>
      `;
    }

    this.updateProgressUI();
    this.renderSubgameNavigation();
    const btn = document.getElementById('btn-confirm-energy');
    if (btn) btn.disabled = true;
  }

  updateProgressUI() {
    const s2 = window.gameStorage.state.stage2;
    const isAllDone = s2.lotoCompleted && s2.ergoCompleted && s2.energyCompleted;

    const scoreVal = document.getElementById('hud-score-value');
    if (scoreVal) scoreVal.textContent = window.gameStorage.state.scores.total;

    const btnPdf = document.getElementById('btn-pdf-stage2');
    const btnNext = document.getElementById('btn-next-stage2');

    if (btnPdf) btnPdf.disabled = !(s2.lotoCompleted || s2.ergoCompleted || s2.energyCompleted);
    if (btnNext) {
      btnNext.disabled = !isAllDone;
      if (isAllDone) {
        window.gameStorage.unlockStage(3);
      }
    }
  }

  autoSolveAll() {
    window.gameStorage.state.stage2.lotoCompleted = true;
    window.gameStorage.state.stage2.ergoCompleted = true;
    window.gameStorage.state.stage2.energyCompleted = true;
    window.gameStorage.state.scores.stage2 = 1000;
    window.gameStorage.unlockStage(3);

    // Ajusta missão energética para estado ótimo homologável
    this.energyLeaks.forEach(l => {
      l.scanned = true;
      if (l.type === 'leak') l.repaired = true;
    });
    this.selectedMotor = 'IE4';
    this.selectedDrive = 'INVERSOR';
    this.energyWasteItems.forEach(w => {
      w.selectedClass = w.correctClass;
      w.selectedDest = w.correctDest;
    });
    this.energyFixedLeaks = true;
    this.energyUpgradedMotor = true;
    this.energySelectedWasteClass = 'I';

    window.gameStorage.save();

    this.updateProgressUI();
    this.renderSubgameNavigation();
    this.renderCurrentSubgame();
    if (window.appRouter && window.appRouter.renderStagePills) {
      window.appRouter.renderStagePills();
    }
    if (window.soundFx && window.soundFx.stageComplete) window.soundFx.stageComplete();
  }

  autoSolverAll() {
    return this.autoSolveAll();
  }

  downloadPDF() {
    window.pdfGen.generateStage2PDF(window.gameStorage.state);
  }
}

window.stage2 = new Stage2Controller();
