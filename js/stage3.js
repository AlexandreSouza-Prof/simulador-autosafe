// ===================================================================
// ETAPA 3: SAFETY BY DESIGN (RETROFIT INDUSTRIAL - NÍVEL AVANÇADO)
// ===================================================================

const RETROFIT_CATALOG = [
  // --- PAIR 1: ROBÓTICA & PALETIZAÇÃO ---
  {
    id: 'comp_cobot',
    title: 'Robô Colaborativo (Cobot) 15 kg com Limitação de Força',
    category: 'NR-17 Ergonomia',
    cost: 38000,
    required: true,
    isCorrect: true,
    desc: 'Manipulador articulado colaborativo de 6 eixos com limitadores biomecânicos de força e potência (ISO/TS 15066) para movimentação de caixas de até 15 kg.'
  },
  {
    id: 'comp_scara_fast',
    title: 'Robô SCARA de Alta Cadência (35 ciclos/min)',
    category: 'Robótica Industrial',
    cost: 29000,
    required: false,
    isCorrect: false,
    desc: 'Manipulador industrial de 4 eixos para paletização de alta cadência, acionado por servomotores rápidos sem limitação de força e potência.',
    rejectReason: 'Não-conformidade técnica (NR-12 e ISO 10218-1): Robôs industriais convencionais de alta velocidade sem enclausuramento físico total e sem tecnologia colaborativa (ISO/TS 15066) geram risco inaceitável de esmagamento.'
  },

  // --- PAIR 2: DISPOSITIVOS ÓPTICOS DE SEGURANÇA ---
  {
    id: 'comp_curtain_cat2',
    title: 'Cortina de Luz Óptica Categoria 2 / PLc',
    category: 'NR-12 Dispositivos Ópticos',
    cost: 5500,
    required: false,
    isCorrect: false,
    desc: 'Barreira fotoelétrica de feixes infravermelhos com resolução óptica de 30 mm e autoteste cíclico de alinhamento entre ciclos operacionais.',
    rejectReason: 'Não-conformidade na Apreciação de Riscos (ISO 13849-1): Células com manipuladores robóticos exigem no mínimo Categoria 4 / PLe. Sistemas Categoria 2 podem falhar entre testes, deixando a zona desprotegida.'
  },
  {
    id: 'comp_curtain_cat4',
    title: 'Cortina de Luz Óptica Categoria 4 / PLe com Muting',
    category: 'NR-12 Dispositivos Ópticos',
    cost: 12000,
    required: true,
    isCorrect: true,
    desc: 'Barreira fotoelétrica de segurança com resolução de 14 mm, saídas duplas semicondutoras OSSD e sensores integrados para muting de esteira.'
  },

  // --- PAIR 3: COMANDO E PROCESSAMENTO DE SEGURANÇA ---
  {
    id: 'comp_common_relay',
    title: 'Painel com Relés Eletromecânicos Industriais de 24V',
    category: 'Comando Elétrico Geral',
    cost: 2000,
    required: false,
    isCorrect: false,
    desc: 'Módulo de comando em trilho DIN com relés eletromecânicos auxiliares de bobina 24Vcc e contatos reversíveis para interposição de sinais.',
    rejectReason: 'Desvio grave de segurança (NR-12 item 12.5): Relés comuns não possuem contatos mecanicamente guiados nem redundância. Se um contato sofrer microssolda por arco elétrico, a parada de emergência falhará.'
  },
  {
    id: 'comp_safety_plc',
    title: 'CLP de Segurança Dedicado (Cat 4 / SIL 3 / PLe)',
    category: 'NR-12 e ISO 13849',
    cost: 14500,
    required: true,
    isCorrect: true,
    desc: 'Controlador lógico programável de segurança modular com canais duplos redundantes e autoteste contínuo de entradas e saídas OSSD.'
  },

  // --- PAIR 4: INTERTRAVAMENTO DE PORTAS E PROTEÇÕES MÓVEIS ---
  {
    id: 'comp_rfid_interlock',
    title: 'Chaves de Intertravamento RFID com Bloqueio',
    category: 'NR-12 e ISO 14119',
    cost: 7500,
    required: true,
    isCorrect: true,
    desc: 'Chave eletromecânica de segurança codificada por transponder RFID de alto nível e solenóide com força de retenção de 1500 N.'
  },
  {
    id: 'comp_microswitch',
    title: 'Chave Fim-de-Curso Eletromecânica com Roldana',
    category: 'Chaveamento Eletromecânico',
    cost: 1200,
    required: false,
    isCorrect: false,
    desc: 'Chave de posição mecânica com invólucro termoplástico reforçado e atuador basculante de roldana metálica para batentes de porta.',
    rejectReason: 'Vulnerabilidade de segurança (ABNT NBR ISO 14119): Chaves de roldana simples possuem baixo nível de codificação e são facilmente burladas com fitas ou ferramentas comuns, sendo rejeitadas em células robotizadas.'
  },

  // --- PAIR 5: ACIONAMENTO E EFICIÊNCIA ENERGÉTICA ---
  {
    id: 'comp_pneumatic_boost',
    title: 'Bloco de Válvulas Pneumáticas de Vazão Ampliada',
    category: 'Automação Pneumática',
    cost: 4500,
    required: false,
    isCorrect: false,
    desc: 'Conjunto de válvulas pneumáticas de 5/2 vias de alta vazão com conexões G 1/2 e carretel pilotado por solenoide para atuadores de transporte.',
    rejectReason: 'Incompatibilidade com metas ambientais (ISO 50001): Ampliar a infraestrutura pneumática agrava o consumo em kWh/peça e eleva custos operacionais, contrariando a substituição por eixos elétricos sustentáveis.'
  },
  {
    id: 'comp_servo_ie4',
    title: 'Servomotores Elétricos + Inversores IE4 Super Premium',
    category: 'Ambiental & ISO 50001',
    cost: 8000,
    required: true,
    isCorrect: true,
    desc: 'Eixos eletromecânicos acionados por servomotores síncronos de ímãs permanentes classe IE4 com inversores dotados de frenagem regenerativa.'
  }
];

class Stage3Controller {
  constructor() {
    this.totalBudget = 85000; // Teto R$ 85.000,00 (Itens corretos totalizam R$ 80.000,00)
    this.installed = [];
  }

  init() {
    this.installed = window.gameStorage.state.stage3.installedComponents || [];
    this.renderCatalog();
    this.renderBlueprint();
    this.updateBudgetUI();
    this.updateProgressUI();
  }

  toggleComponent(compId) {
    const comp = RETROFIT_CATALOG.find(c => c.id === compId);
    if (!comp) return;

    const idx = this.installed.indexOf(compId);
    if (idx > -1) {
      this.installed.splice(idx, 1);
      if (window.soundFx) window.soundFx.click();
    } else {
      const currentSpent = this.calculateSpent();
      if (currentSpent + comp.cost > this.totalBudget) {
        if (window.soundFx) window.soundFx.error();
        alert(`Orçamento Excedido! Saldo restante: R$ ${(this.totalBudget - currentSpent).toLocaleString('pt-BR')}.`);
        return;
      }
      this.installed.push(compId);
      if (window.soundFx) window.soundFx.success();
    }

    window.gameStorage.state.stage3.installedComponents = this.installed;
    window.gameStorage.state.stage3.budgetSpent = this.calculateSpent();
    window.gameStorage.save();

    this.renderCatalog();
    this.renderBlueprint();
    this.updateBudgetUI();
  }

  calculateSpent() {
    return this.installed.reduce((acc, id) => {
      const c = RETROFIT_CATALOG.find(item => item.id === id);
      return acc + (c ? c.cost : 0);
    }, 0);
  }

  renderCatalog() {
    const container = document.getElementById('retrofit-catalog-items');
    if (!container) return;

    container.innerHTML = RETROFIT_CATALOG.map(item => {
      const isInstalled = this.installed.includes(item.id);
      return `
        <div class="catalog-item-card ${isInstalled ? 'installed' : ''}" onclick="stage3.toggleComponent('${item.id}')" id="cat-item-${item.id}" style="cursor: pointer;">
          <div style="flex: 1; padding-right: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.2rem;">
              <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${item.title}</span>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.35rem;">${item.desc}</p>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="font-family: monospace; font-size: 0.7rem; color: var(--tech-cyan); background: rgba(6,182,212,0.1); padding: 0.1rem 0.4rem; border-radius: 4px;">
                ${item.category}
              </span>
              <span style="font-family: monospace; font-size: 0.75rem; font-weight: 700; color: var(--warning-amber);">
                R$ ${item.cost.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
          <div>
            <span style="font-size: 1.1rem; color: ${isInstalled ? 'var(--safety-green)' : 'var(--text-dim)'};">
              ${isInstalled ? '✓' : '+'}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  updateBudgetUI() {
    const spent = this.calculateSpent();
    const pct = Math.min(100, (spent / this.totalBudget) * 100);

    const spentEl = document.getElementById('budget-spent-txt');
    const totalEl = document.getElementById('budget-total-txt');
    const barEl = document.getElementById('budget-bar-fill');

    if (spentEl) spentEl.textContent = `Gasto: R$ ${spent.toLocaleString('pt-BR')}`;
    if (totalEl) totalEl.textContent = `Teto: R$ ${this.totalBudget.toLocaleString('pt-BR')}`;
    if (barEl) {
      barEl.style.width = `${pct}%`;
      barEl.style.background = spent > this.totalBudget ? 'var(--hazard-red)' : 'linear-gradient(90deg, var(--safety-green), var(--warning-amber))';
    }
  }

  renderBlueprint() {
    const wrap = document.getElementById('blueprint-visual-wrap');
    if (!wrap) return;

    const hasCobot = this.installed.includes('comp_cobot');
    const hasScara = this.installed.includes('comp_scara_fast');

    const hasCurtainCat4 = this.installed.includes('comp_curtain_cat4');
    const hasCurtainCat2 = this.installed.includes('comp_curtain_cat2');

    const hasPlc = this.installed.includes('comp_safety_plc');
    const hasRelay = this.installed.includes('comp_common_relay');

    const hasRfid = this.installed.includes('comp_rfid_interlock');
    const hasMicroswitch = this.installed.includes('comp_microswitch');

    const hasServo = this.installed.includes('comp_servo_ie4');
    const hasPneumatic = this.installed.includes('comp_pneumatic_boost');

    wrap.innerHTML = `
      <svg viewBox="0 0 1000 562" style="width: 100%; height: 100%; display: block; border-radius: 12px; overflow: hidden;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <filter id="scadaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- CAMADA 1: VISÃO ISOMÉTRICA SCADA EM ALTA RESOLUÇÃO (2.5D CHÃO DE FÁBRICA) -->
        <image href="assets/scenarios/isometric_cell.jpg" xlink:href="assets/scenarios/isometric_cell.jpg" x="0" y="0" width="1000" height="562" preserveAspectRatio="none" />

        <!-- Overlay Sutil para Integração CAD dos Componentes Instalados -->
        <rect width="1000" height="562" fill="rgba(6, 12, 24, 0.15)"/>

        <!-- CAMADA 2: COMPONENTES DINÂMICOS NEUTROS (APARECEM / DESAPARECEM AO CLICAR) -->

        <!-- [SUBSISTEMA 1: ROBÔ / PALETIZAÇÃO CENTRAL NA BAIA CIRCULAR] -->
        ${hasCobot ? `
          <g id="dyn-cobot">
            <image href="assets/scenarios/stage3_components/comp_cobot.png" xlink:href="assets/scenarios/stage3_components/comp_cobot.png" x="425" y="145" width="220" height="220" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="430" y="365" width="210" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="535" y="381" font-size="9.5" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">COBOT 15 KG (ISO/TS 15066)</text>
          </g>
        ` : hasScara ? `
          <g id="dyn-scara">
            <image href="assets/scenarios/stage3_components/comp_scara_fast.png" xlink:href="assets/scenarios/stage3_components/comp_scara_fast.png" x="430" y="140" width="215" height="215" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="430" y="365" width="210" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="535" y="381" font-size="9.5" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">ROBÔ SCARA (35 CICLOS/MIN)</text>
          </g>
        ` : ''}

        <!-- [SUBSISTEMA 2: CORTINA DE LUZ ÓPTICA NA ENTRADA DA ESTEIRA] -->
        ${hasCurtainCat4 ? `
          <g id="dyn-curtain-cat4">
            <image href="assets/scenarios/stage3_components/comp_curtain_cat4.png" xlink:href="assets/scenarios/stage3_components/comp_curtain_cat4.png" x="250" y="160" width="140" height="140" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="220" y="295" width="200" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="320" y="311" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">CORTINA CAT 4 / PLe (MUTING)</text>
          </g>
        ` : hasCurtainCat2 ? `
          <g id="dyn-curtain-cat2">
            <image href="assets/scenarios/stage3_components/comp_curtain_cat2.png" xlink:href="assets/scenarios/stage3_components/comp_curtain_cat2.png" x="255" y="170" width="130" height="130" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="225" y="295" width="190" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="320" y="311" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">CORTINA CAT 2 / PLc</text>
          </g>
        ` : ''}

        <!-- [SUBSISTEMA 3: PAINEL ELÉTRICO / CLP NA PAREDE LATERAL] -->
        ${hasPlc ? `
          <g id="dyn-plc">
            <image href="assets/scenarios/stage3_components/comp_safety_plc.svg" xlink:href="assets/scenarios/stage3_components/comp_safety_plc.svg" x="690" y="120" width="120" height="120" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="650" y="235" width="200" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="750" y="251" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">CLP DE SEGURANÇA SIL 3 / PLe</text>
          </g>
        ` : hasRelay ? `
          <g id="dyn-relay">
            <image href="assets/scenarios/stage3_components/comp_common_relay.svg" xlink:href="assets/scenarios/stage3_components/comp_common_relay.svg" x="690" y="120" width="120" height="120" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="655" y="235" width="190" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="750" y="251" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">PAINEL COM RELÉS AUXILIARES</text>
          </g>
        ` : ''}

        <!-- [SUBSISTEMA 4: INTERTRAVAMENTO NO PORTÃO DE ACESSO] -->
        ${hasRfid ? `
          <g id="dyn-rfid">
            <image href="assets/scenarios/stage3_components/comp_rfid_interlock.svg" xlink:href="assets/scenarios/stage3_components/comp_rfid_interlock.svg" x="135" y="360" width="110" height="110" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="85" y="470" width="210" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="190" y="486" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">INTERTRAVAMENTO RFID (1500 N)</text>
          </g>
        ` : hasMicroswitch ? `
          <g id="dyn-microswitch">
            <image href="assets/scenarios/stage3_components/comp_microswitch.svg" xlink:href="assets/scenarios/stage3_components/comp_microswitch.svg" x="135" y="360" width="110" height="110" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="85" y="470" width="210" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="190" y="486" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">FIM-DE-CURSO ELETROMECÂNICO</text>
          </g>
        ` : ''}

        <!-- [SUBSISTEMA 5: EFICIÊNCIA ENERGÉTICA / ACIONAMENTO NA BAIA DIREITA] -->
        ${hasServo ? `
          <g id="dyn-servo">
            <image href="assets/scenarios/stage3_components/comp_servo_ie4.svg" xlink:href="assets/scenarios/stage3_components/comp_servo_ie4.svg" x="720" y="295" width="130" height="130" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="680" y="425" width="210" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="785" y="441" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">SERVOMOTORES IE4 COM FREIO STO</text>
          </g>
        ` : hasPneumatic ? `
          <g id="dyn-pneumatic">
            <image href="assets/scenarios/stage3_components/comp_pneumatic_boost.svg" xlink:href="assets/scenarios/stage3_components/comp_pneumatic_boost.svg" x="720" y="295" width="130" height="130" preserveAspectRatio="xMidYMid meet" />
            <!-- Tag HUD Neutra CAD -->
            <rect x="675" y="425" width="220" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="785" y="441" font-size="9" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">BLOCO PNEUMÁTICO ALTA VAZÃO</text>
          </g>
        ` : ''}

        <!-- BARRA HUD INFERIOR SCADA (NEUTRA DURANTE A MONTAGEM DO PROJETO) -->
        <g id="scada-status-bar">
          <rect x="30" y="525" width="940" height="30" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5"/>
          <text x="50" y="544" font-size="10" font-family="monospace" font-weight="bold" fill="#E2E8F0">
            ⚙️ PROJETO DA CÉLULA: ${this.installed.length} / 5 COMPONENTES ALOCADOS | CLIQUE EM "SIMULAR PARTIDA" PARA SUBMETER À AUDITORIA FISCAL
          </text>
        </g>
      </svg>
    `;
  }

  isRetrofitFullyCompliant() {
    const requiredIds = ['comp_cobot', 'comp_curtain_cat4', 'comp_safety_plc', 'comp_rfid_interlock', 'comp_servo_ie4'];
    const hasAll = requiredIds.every(id => this.installed.includes(id));
    const hasAnyTrap = this.installed.some(id => {
      const c = RETROFIT_CATALOG.find(item => item.id === id);
      return c && !c.isCorrect;
    });
    return hasAll && !hasAnyTrap && this.calculateSpent() <= this.totalBudget;
  }

  runCommissioningAudit() {
    const traps = this.installed
      .map(id => RETROFIT_CATALOG.find(c => c.id === id))
      .filter(c => c && !c.isCorrect);

    if (traps.length > 0) {
      if (window.soundFx) window.soundFx.error();
      const reasons = traps.map(t => `• ${t.title}:\n  ${t.rejectReason}`).join('\n\n');
      alert(`PROJETO REPROVADO EM AUDITORIA FISCAL!\n\nForam detectados componentes tecnicamente inseguros:\n\n${reasons}\n\nRemova os itens inadequados no catálogo!`);
      return;
    }

    if (this.calculateSpent() > this.totalBudget) {
      if (window.soundFx) window.soundFx.error();
      alert('PROJETO REPROVADO! O custo total excedeu o teto orçamentário aprovado de R$ 85.000,00.');
      return;
    }

    if (this.isRetrofitFullyCompliant()) {
      if (window.soundFx) window.soundFx.stageComplete();
      if (window.confetti) {
        window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      }

      window.gameStorage.state.stage3.retrofitApproved = true;
      window.gameStorage.addScore('stage3', 400);
      window.gameStorage.state.currentStage = 4;
      window.gameStorage.save();

      this.updateProgressUI();
      window.appRouter.showView('finish');
    } else {
      if (window.soundFx) window.soundFx.error();
      alert('AUDITORIA INCOMPLETA! A linha ainda não atende a todos os requisitos mandatórios da notificação (NR-10, NR-12, NR-17 e Eficiência Energética). Instale os 5 componentes técnicos essenciais homologados.');
    }
  }

  updateProgressUI() {
    const s3 = window.gameStorage.state.stage3;
    const scoreVal = document.getElementById('hud-score-value');
    if (scoreVal) scoreVal.textContent = window.gameStorage.state.scores.total;

    const btnAudit = document.getElementById('btn-run-audit');
    if (btnAudit) {
      btnAudit.disabled = this.installed.length === 0;
    }
  }

  autoSolveAll() {
    this.installed = [
      'comp_cobot',
      'comp_curtain_cat4',
      'comp_safety_plc',
      'comp_rfid_interlock',
      'comp_servo_ie4'
    ];
    window.gameStorage.state.stage3.installedComponents = this.installed;
    window.gameStorage.state.stage3.budgetSpent = this.calculateSpent();
    window.gameStorage.state.stage3.retrofitApproved = true;
    window.gameStorage.state.scores.stage3 = 400;
    window.gameStorage.state.currentStage = 4;
    window.gameStorage.unlockStage(4);
    window.gameStorage.save();

    this.renderCatalog();
    this.renderBlueprint();
    this.updateBudgetUI();
    this.updateProgressUI();
    if (window.appRouter && window.appRouter.renderStagePills) {
      window.appRouter.renderStagePills();
    }
    if (window.soundFx && window.soundFx.stageComplete) window.soundFx.stageComplete();
  }

  autoSolverAll() {
    return this.autoSolveAll();
  }

  downloadFinalPDF() {
    window.pdfGen.generateStage3FinalPDF(window.gameStorage.state);
  }
}

window.stage3 = new Stage3Controller();
