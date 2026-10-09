// ===================================================================
// ETAPA 1: INSPEÇÃO DE RISCOS NO CHÃO DE FÁBRICA (NÍVEL TÉCNICO RIGOROSO)
// ===================================================================

const HAZARDS_DATABASE = [
  // --- CENÁRIO 1: PAINEL CCM E SUBESTAÇÃO (NR-10 & IEC 60204-1) ---
  {
    id: 'h_ccm_wires',
    scenarioId: 'ccm',
    scenarioName: 'Painel CCM / Subestação',
    title: 'Barramento Trifásico Exposto (Infração Grau de Proteção)',
    norma: 'NR-10 e ABNT NBR IEC 60204-1 (Proteção Contra Choques)',
    coords: { x: 465, y: 115, r: 38 },
    question: 'Em conformidade com a ABNT NBR IEC 60204-1 (item 6.2.2) e a NR-10, qual é o requisito técnico mandatório para proteção básica contra contatos diretos em partes energizadas dentro do painel elétrico?',
    options: [
      { text: 'Isolação física ou barreiras mecânicas que assegurem no mínimo o Grau de Proteção IP2X (ou IPXXB) nas faces de operação acessíveis.', isCorrect: true },
      { text: 'Grau de proteção IP4X obrigatório em todas as faces internas, complementado por chave de aterramento rápido na abertura da porta.', isCorrect: false },
      { text: 'Tensão limite de toque mantida abaixo de 120V em corrente alternada sem necessidade de barreiras físicas isolantes internas.', isCorrect: false },
      { text: 'Disposição dos barramentos em plano vertical com distanciamento fase-fase não inferior a 300 mm dispensando blindagens acrílicas.', isCorrect: false }
    ],
    explanation: 'A IEC 60204-1 e a NR-10 determinam que superfícies internas energizadas acessíveis durante manutenção devem possuir barreira mínima IP2X (ou IPXXB) para impedir contato acidental do dedo com condutores sob tensão.'
  },
  {
    id: 'h_ccm_loto',
    scenarioId: 'ccm',
    scenarioName: 'Painel CCM / Subestação',
    title: 'Disjuntor sem Trava Mecânica (Violação do Princípio de Energia Zero)',
    norma: 'NR-10 item 10.5 (Desenergização e Bloqueio LOTO)',
    coords: { x: 460, y: 280, r: 38 },
    question: 'Conforme o subitem 10.5.1 da NR-10, o estado normativo de desenergização para liberação de serviços elétricos em painéis industriais exige qual critério sobre o impedimento de reenergização?',
    options: [
      { text: 'Manter comando do disjuntor em posição remota via software supervisório com senha de acesso restrita ao operador.', isCorrect: false },
      { text: 'Instalação de travamento mecânico efetivo com chave sob controle exclusivo do responsável pelo serviço e respectiva sinalização de advertência.', isCorrect: true },
      { text: 'Desconexão dos cabos de comando na régua de bornes e monitoramento presencial contínuo por eletricista qualificado na subestação.', isCorrect: false },
      { text: 'Aplicação de aterramento provisório de alta corrente nos barramentos de alimentação a montante da chave seccionadora.', isCorrect: false }
    ],
    explanation: 'O subitem 10.5.1 da NR-10 exige impedimento mecânico físico de reenergização com trava e cadeado sob posse exclusiva do profissional executor, impedindo religamentos intempestivos.'
  },
  {
    id: 'h_ccm_ip',
    scenarioId: 'ccm',
    scenarioName: 'Painel CCM / Subestação',
    title: 'Porta Aberta / Falha de Vedação do Invólucro (Grau IP Violado)',
    norma: 'ABNT NBR IEC 60529 e NR-10 (Influências Externas)',
    coords: { x: 200, y: 210, r: 42 },
    question: 'Segundo a ABNT NBR IEC 60529 e NR-10, a classificação IP54 atribuída ao invólucro do painel CCM estabelece qual proteção física para os componentes elétricos internos?',
    options: [
      { text: 'Estanqueidade total a gases inflamáveis e proteção contínua contra jatos de água de alta pressão a 100 bar.', isCorrect: false },
      { text: 'Proteção contra poeira em quantidade prejudicial ao funcionamento e proteção contra respingos de água vindos de qualquer direção.', isCorrect: true },
      { text: 'Imunidade completa contra penetração de vapor d\'água saturado e proteção mecânica contra impactos de 20 Joules (IK10).', isCorrect: false },
      { text: 'Blindagem contra campos eletromagnéticos industriais e proteção térmica contra elevação de temperatura ambiente até 80°C.', isCorrect: false }
    ],
    explanation: 'No código IP54 (IEC 60529), o primeiro dígito "5" indica proteção contra depósitos nocivos de poeira e o segundo dígito "4" garante proteção contra projeção e respingos de água de todas as direções.'
  },
  {
    id: 'h_ccm_ground',
    scenarioId: 'ccm',
    scenarioName: 'Painel CCM / Subestação',
    title: 'Condutor PE (Protective Earth) Interrompido',
    norma: 'NR-10 e ABNT NBR 5410 (Proteção por Seccionamento Automático)',
    coords: { x: 330, y: 385, r: 28 },
    question: 'Em instalações industriais operando no esquema de aterramento TN-S (ABNT NBR 5410 e NR-10), qual o mecanismo técnico pelo qual o condutor PE previne o choque elétrico por contato indireto?',
    options: [
      { text: 'Condução das correntes de fuga para a terra de modo a manter a carcaça metálica em potencial flutuante acima de 220V.', isCorrect: false },
      { text: 'Conversão da falta fase-massa em corrente de curto-circuito de alta intensidade para sensibilizar a proteção contra sobrecorrente no tempo prescrito.', isCorrect: true },
      { text: 'Redução da frequência da corrente de falta para 0 Hz através da impedância de aterramento distribuída nos eletrodos.', isCorrect: false },
      { text: 'Equilíbrio vetorial das correntes de fase no barramento primário para anular a circulação de corrente no condutor neutro.', isCorrect: false }
    ],
    explanation: 'No esquema TN-S da NBR 5410 e NR-10, o condutor PE transforma uma falha de isolação (fase-massa) em corrente de curto-circuito suficiente para sensibilizar a proteção magnética do disjuntor em tempo inferior a 0,4 segundos.'
  },

  // --- CENÁRIO 2: CÉLULA ROBOTIZADA DE PALETIZAÇÃO (NR-12 & ISO 13849-1) ---
  {
    id: 'h_rob_interlock',
    scenarioId: 'robot',
    scenarioName: 'Célula Robotizada de Paletização',
    title: 'Intertravamento com Chave Mecânica Burlada (Burla de Segurança)',
    norma: 'NR-12 e ABNT NBR ISO 14119 (Dispositivos de Intertravamento)',
    coords: { x: 230, y: 230, r: 38 },
    question: 'A ABNT NBR ISO 14119 classifica os dispositivos de intertravamento associados a proteções móveis. Por qual motivo chaves do Tipo 4 com alto nível de codificação (RFID) são especificadas em células robotizadas de alta periculosidade?',
    options: [
      { text: 'Possuem tempo de resposta inferior a 0,1 milissegundo dispensando a utilização de relés de segurança na arquitetura.', isCorrect: false },
      { text: 'Possuem transponder com mais de 1.000 variações de código, inviabilizando tentativas de burla por substituição de atuador ou ferramentas comuns.', isCorrect: true },
      { text: 'Dispensam cabeamento de sinal por transmitirem o estado de parada via rede Wi-Fi industrial em padrão SIL 4.', isCorrect: false },
      { text: 'Suportam forças de retenção mecânica superiores a 50 kN para contenção balística de peças arremessadas pelo robô.', isCorrect: false }
    ],
    explanation: 'A ISO 14119 classifica atuadores RFID codificados como Tipo 4 / Alto Nível de Codificação (>1000 códigos), eliminando a vulnerabilidade histórica de burla por chaves reservas ou ímãs avulsos.'
  },
  {
    id: 'h_rob_curtain',
    scenarioId: 'robot',
    scenarioName: 'Célula Robotizada de Paletização',
    title: 'Ausência de Cortina de Luz Óptica na Esteira de Saída',
    norma: 'NR-12 e ABNT NBR ISO 13855 (Cálculo da Distância de Segurança)',
    coords: { x: 660, y: 265, r: 40 },
    question: 'No cálculo da distância de segurança de uma cortina óptica vertical de proteção perimetral (ABNT NBR ISO 13855: S = (K × T) + C), qual o valor normativo adotado para a velocidade de aproximação (K) de membros humanos e o que representa a constante C?',
    options: [
      { text: 'K = 500 mm/s; C representa a distância física do transmissor óptico até o espelho defletor na grade perimetral.', isCorrect: false },
      { text: 'K = 2000 mm/s (para aproximação de mão); C é a distância de penetração suplementar baseada na resolução óptica do feixe antes da detecção.', isCorrect: true },
      { text: 'K = 10000 mm/s; C representa o tempo de ciclo do programa do robô para concluir a trajetória de soldagem ou paletização.', isCorrect: false },
      { text: 'K = 250 mm/s; C é a espessura da barreira física de enclausuramento metálico para absorção de choque mecânico.', isCorrect: false }
    ],
    explanation: 'A equação da ISO 13855 adota K = 2000 mm/s para membros superiores e adiciona a constante C (profundidade de penetração) para garantir que a máquina atinja parada total antes do contato físico.'
  },
  {
    id: 'h_rob_estop',
    scenarioId: 'robot',
    scenarioName: 'Célula Robotizada de Paletização',
    title: 'Botão de Emergência com Contatos Soldados / Sem Rearme Seguro',
    norma: 'NR-12 e ABNT NBR ISO 13850 (Parada de Emergência)',
    coords: { x: 130, y: 345, r: 32 },
    question: 'A ABNT NBR ISO 13850 e a NR-12 determinam que botões de emergência cogumelo operem com ação mecânica positiva. Qual a implicação técnica dessa exigência sobre os contatos elétricos do botão?',
    options: [
      { text: 'Garante que o retorno do atuador cogumelo ocorra de forma automática assim que a mão do operador for retirada da botoeira.', isCorrect: false },
      { text: 'Assegura que a abertura física dos contatos NF ocorra por esforço direto do atuador, rompendo eventuais microssoldas de contato sem depender de molas.', isCorrect: true },
      { text: 'Exige que o botão seja alimentado em corrente contínua de 48V para permitir comunicação em protocolo fieldbus de segurança.', isCorrect: false },
      { text: 'Limita a força máxima de acionamento do operador em 5 Newtons para permitir o disparo por comando de voz ou pedal óptico.', isCorrect: false }
    ],
    explanation: 'A abertura positiva (IEC 60947-5-1) garante que o movimento mecânico da manopla force diretamente a separação das lâminas de contato, eliminando falhas por soldagem elétrica de arco.'
  },
  {
    id: 'h_rob_mesh',
    scenarioId: 'robot',
    scenarioName: 'Célula Robotizada de Paletização',
    title: 'Abertura da Grade Perimetral Incompatível com Distância de Risco',
    norma: 'NR-12 e ABNT NBR ISO 13857 (Distâncias de Segurança de Membros)',
    coords: { x: 465, y: 345, r: 35 },
    question: 'Em proteções fixas enclausuradas (ABNT NBR ISO 13857), quando a malha da tela metálica apresenta abertura quadrada de 30 mm, qual a distância mínima (ds) exigida entre a tela e o ponto de esmagamento do manipulador robótico para membros superiores?',
    options: [
      { text: 'Distância mínima de 120 mm para acesso restrito à ponta dos dedos conforme tabela antropométrica do Anexo B.', isCorrect: false },
      { text: 'Distância mínima de 850 mm até a zona perigosa, devido à possibilidade de alcance do braço através da abertura da tela.', isCorrect: true },
      { text: 'Distância mínima de 50 mm desde que o operador utilize luvas de malha de aço certificadas pela NR-6.', isCorrect: false },
      { text: 'Distância mínima de 200 mm calculada exclusivamente pelo raio de alcance estático do punho articulado do robô.', isCorrect: false }
    ],
    explanation: 'A Tabela 4 da ABNT NBR ISO 13857 estipula que aberturas quadradas entre 30 mm e 40 mm permitem alcance do membro superior até o ombro, exigindo afastamento de segurança mínimo de 850 mm.'
  },

  // --- CENÁRIO 3: LINHA DE ENVASE E EMBALAGEM (NR-17 & AMBIENTAL) ---
  {
    id: 'h_pkg_lifting',
    scenarioId: 'packaging',
    scenarioName: 'Linha de Envase e Embalagem',
    title: 'Movimentação Manual de Carga com Sobrecarga em L4/L5',
    norma: 'NR-17 (Biomecânica do Levantamento Manual de Cargas)',
    coords: { x: 560, y: 230, r: 42 },
    question: 'Na equação de levantamento do NIOSH adotada nos estudos da NR-17, a constante de carga base (LC) é de 23 kg sob condições ideais. Como o Fator de Distância Horizontal (HM = 25/H) e o Fator de Frequência (FM) afetam o Limite de Peso Recomendado (LPR) em linhas industriais contínuas?',
    options: [
      { text: 'Ampliam o limite de carga permissível em até 50% quando o operador realiza a pega com ambas as mãos apoiadas.', isCorrect: false },
      { text: 'Reduzem drasticamente o peso seguro permissível à medida que a carga é levantada afastada do tronco ou com alta repetição por minuto.', isCorrect: true },
      { text: 'Anulam a exigência de pausas compensatórias desde que a altura vertical inicial da caixa esteja no nível do solo.', isCorrect: false },
      { text: 'Tornam irrelevante o peso da carga caso a velocidade de transporte da esteira seja inferior a 0,5 metros por segundo.', isCorrect: false }
    ],
    explanation: 'O multiplicador horizontal penaliza severamente o afastamento da carga em relação ao centro de gravidade lombar, gerando momentos fletores críticos sobre os discos L4-L5 e L5-S1.'
  },
  {
    id: 'h_pkg_bench',
    scenarioId: 'packaging',
    scenarioName: 'Linha de Envase e Embalagem',
    title: 'Bancada com Altura Fisiologicamente Incompatível',
    norma: 'NR-17 (Antropometria de Postos de Trabalho)',
    coords: { x: 750, y: 285, r: 38 },
    question: 'Na elaboração da Análise Ergonômica do Trabalho (AET - NR-17), qual é a diretriz biomecânica para dimensionamento da altura de bancadas de trabalho executadas na postura em pé com esforço moderado?',
    options: [
      { text: 'Manter o plano de trabalho no nível do abdômen inferior (70 a 75 cm) para concentrar o esforço no quadríceps e membros inferiores.', isCorrect: false },
      { text: 'Ajustar o plano de trabalho ligeiramente abaixo da altura dos cotovelos (± 95 a 105 cm), permitindo alinhamento da coluna na linha neutra e ombros relaxados.', isCorrect: true },
      { text: 'Fixar a bancada em 125 cm de altura forçando a elevação dos antebraços para favorecer o retorno venoso dos membros superiores.', isCorrect: false },
      { text: 'Adotar altura uniforme de 115 cm para todas as estações fabris independentemente da estatura dos operadores ou percentis da população.', isCorrect: false }
    ],
    explanation: 'A NR-17 preconiza trabalho com ombros relaxados e cotovelos a 90°. Superfícies inadequadas causam hipercifose, compressão cervical e distúrbios osteomusculares graves (LER/DORT).'
  },
  {
    id: 'h_pkg_airleak',
    scenarioId: 'packaging',
    scenarioName: 'Linha de Envase e Embalagem',
    title: 'Vazamento Contínuo na Rede de Ar Comprimido (Desperdício Energético)',
    norma: 'ISO 50001 e Viabilidade Ambiental da Automação',
    coords: { x: 505, y: 65, r: 35 },
    question: 'Sob a ótica da gestão de energia (ISO 50001) e viabilidade ambiental na automação, por que a substituição de atuadores pneumáticos por cilindros elétricos servoacionados apresenta ganho substancial de rendimento global?',
    options: [
      { text: 'A eletricidade direta elimina o ciclo de compressão termodinâmica do ar, cuja eficiência energética típica é de apenas 10% a 15% na geração e distribuição.', isCorrect: true },
      { text: 'Cilindros servoacionados consomem energia reativa indutiva que anula as tarifas de demanda contratada da planta fabril.', isCorrect: false },
      { text: 'Sistemas elétricos dispensam sensores de fim-de-curso e relés de proteção térmica em ambientes industriais agressivos.', isCorrect: false },
      { text: 'O ar comprimido exige descarte contínuo de óleo em aterros industriais Classe IIB a cada ciclo de avanço e recuo do atuador.', isCorrect: false }
    ],
    explanation: 'Cerca de 85% a 90% da eletricidade consumida por compressores industriais dissipa-se em calor. Servomotores elétricos superam 90% de rendimento cinemático direto.'
  },
  {
    id: 'h_pkg_waste',
    scenarioId: 'packaging',
    scenarioName: 'Linha de Envase e Embalagem',
    title: 'Tambor de Óleo sem Bacia de Contenção (Risco Classe I)',
    norma: 'ABNT NBR 10004 e Legislação Ambiental (Licenciamento Industrial)',
    coords: { x: 125, y: 300, r: 45 },
    question: 'Segundo os critérios de toxicidade, reatividade e inflamabilidade da norma ABNT NBR 10004, como são enquadrados óleos lubrificantes minerais usados e materiais absorventes contaminados por hidrocarbonetos na automação industrial?',
    options: [
      { text: 'Resíduos Classe II A (Não Inertes), passíveis de disposição direta em aterros sanitários municipais comuns sem tratamento prévio.', isCorrect: false },
      { text: 'Resíduos Classe I (Perigosos), exigindo armazenamento estanque sobre bacia de contenção, transporte com MTR e destinação por rerrefino ou coprocessamento.', isCorrect: true },
      { text: 'Resíduos Classe II B (Inertes), com liberação irrestrita para queima ao ar livre como fonte secundária de biomassa térmica.', isCorrect: false },
      { text: 'Subprodutos recicláveis de grau alimentício isentos de licenciamento ambiental perante os órgãos de controle estadual.', isCorrect: false }
    ],
    explanation: 'Óleos usados são resíduos Classe I (Perigosos) pela NBR 10004. O descarte sem bacia de contenção contamina solos e aquíferos subterrâneos, configurando crime ambiental inafiançável.'
  }
];

window.HAZARDS_DATABASE = HAZARDS_DATABASE;

class Stage1Controller {
  constructor() {
    this.currentScenario = 'ccm';
    this.activeModalHazard = null;
    this.falsePositiveCount = 0;
  }

  init() {
    this.renderScenarioTabs();
    this.renderCurrentScenario();
    this.renderChecklist();
    this.updateProgressUI();
  }

  setScenario(scenarioId) {
    this.currentScenario = scenarioId;
    window.gameStorage.state.stage1.currentScenario = scenarioId;
    window.gameStorage.save();
    this.renderScenarioTabs();
    this.renderCurrentScenario();
    this.renderChecklist();
    if (window.soundFx) window.soundFx.click();
  }

  renderScenarioTabs() {
    const tabs = [
      { id: 'ccm', label: '1. Painel CCM (NR-10)', badge: '4 Perigos' },
      { id: 'robot', label: '2. Célula Robotizada (NR-12)', badge: '4 Perigos' },
      { id: 'packaging', label: '3. Linha de Envase (NR-17)', badge: '4 Perigos' }
    ];

    const container = document.getElementById('scenario-tabs-container');
    if (!container) return;

    container.innerHTML = tabs.map(tab => {
      const activeClass = this.currentScenario === tab.id ? 'active' : '';
      return `
        <button class="scenario-tab-btn ${activeClass}" onclick="stage1.setScenario('${tab.id}')" id="tab-${tab.id}">
          <span>${tab.label}</span>
          <span class="scenario-tab-badge">${tab.badge}</span>
        </button>
      `;
    }).join('');
  }

  getScenarioHazards() {
    return HAZARDS_DATABASE.filter(h => h.scenarioId === this.currentScenario);
  }

  renderCurrentScenario() {
    const canvasWrap = document.getElementById('hazard-canvas-container');
    if (!canvasWrap) return;

    const hazards = this.getScenarioHazards();
    const foundIds = window.gameStorage.state.stage1.foundHazards;

    let svgBackground = '';
    if (this.currentScenario === 'ccm') {
      svgBackground = this.getCCMSvgBackground();
    } else if (this.currentScenario === 'robot') {
      svgBackground = this.getRobotSvgBackground();
    } else {
      svgBackground = this.getPackagingSvgBackground();
    }

    const hotspotsSvg = hazards.map(h => {
      const isFound = foundIds.includes(h.id);
      const answer = window.gameStorage.state.stage1.answers ? window.gameStorage.state.stage1.answers[h.id] : null;
      const isCorrect = answer ? answer.isCorrect : false;

      let hotspotContent = '';
      if (isFound) {
        if (isCorrect) {
          hotspotContent = `
            <circle cx="${h.coords.x}" cy="${h.coords.y}" r="${h.coords.r}" class="hazard-found-ring correct" />
            <text x="${h.coords.x}" y="${h.coords.y + 4}" font-size="12" font-family="sans-serif" font-weight="bold" fill="#10B981" text-anchor="middle">✓</text>
          `;
        } else {
          hotspotContent = `
            <circle cx="${h.coords.x}" cy="${h.coords.y}" r="${h.coords.r}" class="hazard-found-ring wrong" />
            <text x="${h.coords.x}" y="${h.coords.y + 4}" font-size="12" font-family="sans-serif" font-weight="bold" fill="#EF4444" text-anchor="middle">✕</text>
          `;
        }
      } else {
        hotspotContent = `
          <circle cx="${h.coords.x}" cy="${h.coords.y}" r="16" class="hazard-ring" />
          <circle cx="${h.coords.x}" cy="${h.coords.y}" r="4" fill="#EF4444" />
        `;
      }

      return `
        <g class="hazard-hotspot" onclick="stage1.openHazardInspection('${h.id}', event)" id="hotspot-${h.id}">
          <circle cx="${h.coords.x}" cy="${h.coords.y}" r="${h.coords.r}" class="hotspot-area" fill="transparent" />
          ${hotspotContent}
        </g>
      `;
    }).join('');

    canvasWrap.innerHTML = `
      <svg class="hazard-svg-stage" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" onclick="stage1.onBackgroundClick(event)">
        ${svgBackground}
        ${hotspotsSvg}
      </svg>
    `;
  }

  onBackgroundClick(event) {
    const targetHotspot = event.target.closest('.hazard-hotspot');
    if (!targetHotspot) {
      this.falsePositiveCount++;
      if (window.soundFx) window.soundFx.error();
      
      const pt = document.getElementById('sidebar-count-display');
      if (pt) {
        pt.style.borderColor = 'var(--hazard-red)';
        pt.style.color = 'var(--hazard-red)';
        setTimeout(() => {
          pt.style.borderColor = 'rgba(6, 182, 212, 0.2)';
          pt.style.color = 'var(--tech-cyan)';
        }, 600);
      }
    }
  }

  renderChecklist() {
    const container = document.getElementById('checklist-items-container');
    const countEl = document.getElementById('sidebar-count-display');
    if (!container) return;

    const allHazards = HAZARDS_DATABASE;
    const foundIds = window.gameStorage.state.stage1.foundHazards || [];
    const answers = window.gameStorage.state.stage1.answers || {};

    if (countEl) {
      countEl.textContent = `${foundIds.length} / ${allHazards.length}`;
    }

    container.innerHTML = allHazards.map(h => {
      const isFound = foundIds.includes(h.id);
      const answer = answers[h.id];
      const isCurrentScenario = h.scenarioId === this.currentScenario;
      const cardBorder = isCurrentScenario ? 'style="border-left: 3px solid #06B6D4;"' : '';

      let statusClass = '';
      let icon = '!';
      let tagHtml = '';

      if (isFound && answer) {
        if (answer.isCorrect) {
          statusClass = 'correct';
          icon = '✓';
          tagHtml = `<span class="checklist-status-tag success">Correto (+100)</span>`;
        } else {
          statusClass = 'wrong';
          icon = '✕';
          tagHtml = `<span class="checklist-status-tag error">Incorreto (0 pts)</span>`;
        }
      } else if (isFound) {
        statusClass = 'wrong';
        icon = '✕';
        tagHtml = `<span class="checklist-status-tag error">Incorreto (0 pts)</span>`;
      } else {
        tagHtml = `<span class="checklist-status-tag pending">Pendente</span>`;
      }

      return `
        <div class="checklist-item-card ${statusClass}" ${cardBorder} id="card-${h.id}" onclick="stage1.openHazardInspection('${h.id}')" style="cursor: pointer;">
          <div class="checklist-icon">
            ${icon}
          </div>
          <div class="checklist-info">
            <h5>${h.title}</h5>
            <p>${h.scenarioName}</p>
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.25rem;">
              <span class="checklist-badge">${h.norma.split(' ')[0]}</span>
              ${tagHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  openHazardInspection(hazardId, event) {
    if (event) event.stopPropagation();

    const hazard = HAZARDS_DATABASE.find(h => h.id === hazardId);
    if (!hazard) return;

    // Se o perigo for de outro cenário, alterna automaticamente para ele
    if (hazard.scenarioId !== this.currentScenario) {
      this.setScenario(hazard.scenarioId);
    }

    this.activeModalHazard = hazard;
    const modal = document.getElementById('hazard-modal');
    const modalTag = document.getElementById('modal-hazard-tag');
    const modalTitle = document.getElementById('modal-hazard-title');
    const modalDesc = document.getElementById('modal-hazard-desc');
    const qTitle = document.getElementById('modal-quiz-question');
    const optContainer = document.getElementById('modal-quiz-options');
    const feedbackBanner = document.getElementById('modal-feedback-banner');
    const confirmBtn = document.getElementById('btn-confirm-inspection');

    if (!modal) return;

    modalTag.textContent = hazard.norma;
    modalTitle.textContent = hazard.title;
    modalDesc.textContent = `Localizado em: ${hazard.scenarioName}`;
    qTitle.textContent = hazard.question;

    const answers = window.gameStorage.state.stage1.answers || {};
    const existingAnswer = answers[hazard.id];

    if (existingAnswer) {
      // Modo de Revisão: já respondido previamente
      feedbackBanner.className = existingAnswer.isCorrect ? 'feedback-banner success' : 'feedback-banner error';
      feedbackBanner.innerHTML = existingAnswer.isCorrect 
        ? `<strong>Diagnóstico Registrado: Correto (+100 Pontos)!</strong><br>${hazard.explanation}`
        : `<strong>Diagnóstico Registrado: Incorreto (0 Pontos)!</strong><br>${hazard.explanation}`;
      feedbackBanner.style.display = 'block';

      optContainer.innerHTML = hazard.options.map((opt, idx) => {
        let cls = 'quiz-option-btn';
        if (opt.isCorrect) cls += ' correct';
        else if (opt.text === existingAnswer.chosenText) cls += ' wrong';
        return `
          <button class="${cls}" disabled style="cursor: default; opacity: ${opt.isCorrect || opt.text === existingAnswer.chosenText ? '1' : '0.5'};">
            <span style="font-weight: bold; font-family: monospace;">[${String.fromCharCode(65 + idx)}]</span>
            <span>${opt.text}</span>
          </button>
        `;
      }).join('');

      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Fechar Revisão';
      confirmBtn.onclick = () => this.closeInspectionModal();
    } else {
      // Modo de Avaliação ativa
      if (window.soundFx) window.soundFx.hazardFound();
      feedbackBanner.className = 'feedback-banner';
      feedbackBanner.style.display = 'none';

      this.selectedOptionIndex = null;
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Confirmar Diagnóstico';
      confirmBtn.onclick = () => this.submitInspectionAnswer();

      // Embaralha as 4 alternativas para cada abertura
      this.shuffledOptions = [...hazard.options].sort(() => Math.random() - 0.5);

      optContainer.innerHTML = this.shuffledOptions.map((opt, idx) => `
        <button class="quiz-option-btn" onclick="stage1.selectOption(${idx})" id="opt-btn-${idx}">
          <span style="font-weight: bold; font-family: monospace;">[${String.fromCharCode(65 + idx)}]</span>
          <span>${opt.text}</span>
        </button>
      `).join('');
    }

    modal.classList.add('active');
  }

  selectOption(index) {
    this.selectedOptionIndex = index;
    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
      btn.classList.toggle('selected', idx === index);
    });
    const confirmBtn = document.getElementById('btn-confirm-inspection');
    if (confirmBtn) confirmBtn.disabled = false;
    if (window.soundFx) window.soundFx.click();
  }

  submitInspectionAnswer() {
    if (this.selectedOptionIndex === null || !this.activeModalHazard) return;

    const hazard = this.activeModalHazard;
    const chosenOption = this.shuffledOptions[this.selectedOptionIndex];
    const isCorrect = chosenOption.isCorrect;
    const feedbackBanner = document.getElementById('modal-feedback-banner');
    const confirmBtn = document.getElementById('btn-confirm-inspection');

    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
      if (this.shuffledOptions[idx].isCorrect) {
        btn.classList.add('correct');
      } else if (idx === this.selectedOptionIndex && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    if (!window.gameStorage.state.stage1.answers) {
      window.gameStorage.state.stage1.answers = {};
    }

    const wasAlreadyAnswered = Boolean(window.gameStorage.state.stage1.answers[hazard.id]);

    if (!wasAlreadyAnswered) {
      if (!window.gameStorage.state.stage1.foundHazards.includes(hazard.id)) {
        window.gameStorage.state.stage1.foundHazards.push(hazard.id);
      }
      window.gameStorage.state.stage1.answers[hazard.id] = {
        isCorrect: isCorrect,
        chosenText: chosenOption.text,
        points: isCorrect ? 100 : 0
      };
      if (isCorrect) {
        window.gameStorage.addScore('stage1', 100);
      } else {
        window.gameStorage.addScore('stage1', 0);
      }
      window.gameStorage.save();
    }

    if (isCorrect) {
      if (window.soundFx) window.soundFx.success();
      feedbackBanner.className = 'feedback-banner success';
      feedbackBanner.innerHTML = `<strong>Diagnóstico Preciso (+100 Pontos)!</strong><br>${hazard.explanation}`;
      feedbackBanner.style.display = 'block';
      confirmBtn.textContent = 'Continuar Inspeção';
      confirmBtn.onclick = () => this.closeInspectionModal();
    } else {
      if (window.soundFx) window.soundFx.error();
      feedbackBanner.className = 'feedback-banner error';
      feedbackBanner.innerHTML = `<strong>Diagnóstico Incorreto (0 Pontos)!</strong> A alternativa assinalada diverge da diretriz regulamentadora.<br>${hazard.explanation}`;
      feedbackBanner.style.display = 'block';
      confirmBtn.textContent = 'Fechar e Continuar';
      confirmBtn.onclick = () => this.closeInspectionModal();
    }

    this.renderCurrentScenario();
    this.renderChecklist();
    this.updateProgressUI();
  }

  closeInspectionModal() {
    const modal = document.getElementById('hazard-modal');
    if (modal) modal.classList.remove('active');
    const confirmBtn = document.getElementById('btn-confirm-inspection');
    if (confirmBtn) {
      confirmBtn.textContent = 'Confirmar Diagnóstico';
      confirmBtn.onclick = () => this.submitInspectionAnswer();
    }
  }

  updateProgressUI() {
    const answers = window.gameStorage.state.stage1.answers || {};
    const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
    const answeredCount = Object.keys(answers).length;
    const score = window.gameStorage.state.scores.stage1 || 0;

    const scoreVal = document.getElementById('hud-score-value');
    if (scoreVal) scoreVal.textContent = window.gameStorage.state.scores.total;

    // Critério unificado e direto: mínimo de 9 diagnósticos corretos (900 pontos)
    const isStageApproved = correctCount >= 9;

    // Atualiza Métricas e Banner de Critérios no Rodapé
    const correctVal = document.getElementById('metric-correct-val');
    const correctBar = document.getElementById('metric-correct-bar');
    const answeredVal = document.getElementById('metric-answered-val');
    const totalBar = document.getElementById('metric-total-bar');
    const statusBadge = document.getElementById('criteria-badge-status');
    const statusText = document.getElementById('criteria-status-text');
    const footerHint = document.getElementById('criteria-footer-hint');

    const scorePct = Math.round((correctCount / 12) * 100);
    if (correctVal) correctVal.textContent = `${correctCount} / 9 mín. (${scorePct}% | ${score} pts)`;
    if (correctBar) {
      const pct = Math.min(100, Math.round((correctCount / 9) * 100));
      correctBar.style.width = `${pct}%`;
    }

    if (answeredVal) answeredVal.textContent = `${answeredCount} / 12 analisados`;
    if (totalBar) {
      const pctTotal = Math.min(100, Math.round((answeredCount / 12) * 100));
      totalBar.style.width = `${pctTotal}%`;
    }

    if (statusBadge && statusText) {
      if (isStageApproved) {
        statusBadge.className = 'criteria-status-badge approved';
        statusText.textContent = `✅ Aprovado (${scorePct}% de aproveitamento)`;
      } else {
        statusBadge.className = 'criteria-status-badge';
        statusText.textContent = '🔒 Bloqueado (Em Avaliação)';
      }
    }

    if (footerHint) {
      if (isStageApproved) {
        footerHint.innerHTML = `<span>🎉 <strong>Critério atingido com sucesso!</strong> Você alcançou ${correctCount} de 12 acertos (${scorePct}% de aproveitamento | ${score} pts). Pode avançar para a Etapa 2 ou concluir os perigos restantes para nota máxima.</span>`;
      } else {
        const missing = Math.max(0, 9 - correctCount);
        footerHint.innerHTML = `<span>💡 Faltam <strong>${missing} diagnóstico(s) correto(s)</strong> para atingir a meta mínima de 75% (9 de 12 acertos / 900 pontos) e liberar a Etapa 2.</span>`;
      }
    }

    const btnPdf = document.getElementById('btn-pdf-stage1');
    const btnNext = document.getElementById('btn-next-stage1');

    if (btnPdf) btnPdf.disabled = answeredCount === 0;
    if (btnNext) {
      btnNext.disabled = !isStageApproved;
      btnNext.title = isStageApproved ? 'Clique para iniciar a Etapa 2' : `Acerte ao menos 9 diagnósticos para liberar (faltam ${Math.max(0, 9 - correctCount)})`;
      if (isStageApproved) {
        window.gameStorage.unlockStage(2);
      }
    }
  }

  autoSolveAll() {
    if (!window.gameStorage.isRegistered()) {
      window.gameStorage.setStudent('Instrutor / Teste', 'Turma Automação 4.0');
    }
    HAZARDS_DATABASE.forEach(h => {
      const correctOpt = h.options.find(o => o.isCorrect);
      if (!window.gameStorage.state.stage1.foundHazards.includes(h.id)) {
        window.gameStorage.state.stage1.foundHazards.push(h.id);
      }
      if (!window.gameStorage.state.stage1.answers) {
        window.gameStorage.state.stage1.answers = {};
      }
      window.gameStorage.state.stage1.answers[h.id] = {
        isCorrect: true,
        chosenText: correctOpt ? correctOpt.text : '',
        points: 100
      };
    });
    window.gameStorage.state.scores.stage1 = 1200;
    window.gameStorage.unlockStage(2);
    window.gameStorage.save();

    this.renderCurrentScenario();
    this.renderChecklist();
    this.updateProgressUI();
    if (window.appRouter && window.appRouter.renderStagePills) {
      window.appRouter.renderStagePills();
    }
    if (window.soundFx && window.soundFx.stageComplete) window.soundFx.stageComplete();
  }

  autoSolverAll() {
    return this.autoSolveAll();
  }

  downloadPDF() {
    window.pdfGen.generateStage1PDF(window.gameStorage.state, HAZARDS_DATABASE);
  }

  getCCMSvgBackground() {
    return `
      <image href="assets/scenarios/ccm_scenario.jpg" xlink:href="assets/scenarios/ccm_scenario.jpg" x="0" y="0" width="800" height="450" preserveAspectRatio="none" />
    `;
  }

  getRobotSvgBackground() {
    return `
      <image href="assets/scenarios/robot_scenario.jpg" xlink:href="assets/scenarios/robot_scenario.jpg" x="0" y="0" width="800" height="450" preserveAspectRatio="none" />
    `;
  }

  getPackagingSvgBackground() {
    return `
      <image href="assets/scenarios/packaging_scenario.jpg" xlink:href="assets/scenarios/packaging_scenario.jpg" x="0" y="0" width="800" height="450" preserveAspectRatio="none" />
    `;
  }
}

window.stage1 = new Stage1Controller();
