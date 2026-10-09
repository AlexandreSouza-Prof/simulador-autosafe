# 🛡️ AutoSafe 4.0 - Simulador de Segurança e Conformidade na Automação Industrial

[![Status](https://img.shields.io/badge/status-concluído-success.svg)](#)
[![Tecnologias](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JS%20ES6+-blue.svg)](#)
[![Zero Dependências](https://img.shields.io/badge/backend-zero%20dependencies-brightgreen.svg)](#)
[![Normas](https://img.shields.io/badge/normas-NR--10%20%7C%20NR--12%20%7C%20NR--17%20%7C%20ISO%2013849-orange.svg)](#)

O **AutoSafe 4.0** é uma plataforma educacional gamificada e interativa voltada para a capacitação prática de estudantes e técnicos nas áreas de **Automação Industrial**, **Eletrotécnica**, **Mecatrônica** e **Segurança do Trabalho**. 

O simulador coloca o aluno no papel de inspetor, técnico de manutenção e projetista industrial, enfrentando cenários realistas de chão de fábrica, procedimentos regulamentares e projetos de adequação de segurança com foco nas Normas Regulamentadoras brasileiras e internacionais (**NR-10, NR-12, NR-17, ABNT NBR ISO 13849-1 e NBR 10004**).

---

## 🎮 Visão Geral das Etapas

O treinamento é estruturado em uma trilha progressiva com 3 etapas práticas complementares:

### 1. 🔍 Etapa 1: Inspeção Técnica de Riscos
* **Cenários Industriais Interativos:** Painel CCM (Centro de Controle de Motores) e Célula de Manufatura Robotizada.
* **12 Infrações Críticas:** Identificação prática de perigos como contato elétrico direto, barramento desprotegido, falta de aterramento PE, intertravamento ausente ou burlado, acúmulo de resíduos e distâncias incorretas de barreiras ópticas.
* **Quiz Diagnóstico Técnico:** Avaliação pedagógica fundamentada em artigos normativos (NR-10, NR-12 e NR-17), com pontuação e taxa de assertividade mínima exigida para aprovação (meta: $\ge 75\%$).

### 2. ⚙️ Etapa 2: Procedimentos de Campo & Gestão ESG
* **Bloqueio e Etiquetagem (LOTO - Lockout & Tagout):**
  * Simulação da sequência regulamentar de 6 passos: *Notificação de Operadores*, *Desligamento*, *Desenergização*, *Bloqueio/Etiquetagem física*, *Dissipação de Energias Residuais* e *Teste de Energia Zero*.
* **Ergonomia e Biomecânica (Linha Neutra):**
  * Ajuste interativo de bancadas de trabalho e postos de montagem (altura da mesa, distância de alcance e nível de iluminância em Lux).
  * Avaliação ergonômica com cálculo de pontuação **RULA** e verificação de limites de levantamento de peso segundo a equação **NIOSH**.
* **Eficiência Energética & Gestão Ambiental (ESG):**
  * **Caça a Vazamentos Pneumáticos:** Varredura em linha de ar comprimido com detector ultrassônico acústico e cálculo de perdas financeiras e potência desperdiçada (kW).
  * **Retrofit de Motores e Inversores:** Seleção de classes de rendimento (IE2, IE3, IE4) e sistemas de acionamento para atingir a meta operacional ($\le 0,30\text{ kWh/peça}$).
  * **Triagem de Resíduos Industriais:** Classificação e destinação ambientalmente adequada de resíduos perigosos e recicláveis conforme a **ABNT NBR 10004** e resoluções **CONAMA**.

### 3. 🏗️ Etapa 3: Segurança no Projeto (Safety by Design & Retrofit)
* **Engenharia de Adequação da Linha:**
  * Modernização de uma célula de paletização manual com risco ergonômico severo.
  * Seleção e instalação de componentes de segurança monitorados: manipulador colaborativo (Cobot), cortinas de luz de segurança Categoria 4 / PLe, chaves de intertravamento RFID, CLP de Segurança e relés dedicados.
  * **Gerenciamento de Custos:** O aluno deve atingir o nível máximo de conformidade mantendo o investimento dentro do orçamento de **R$ 85.000,00**.

---

## 📄 Relatório de Conclusão da Atividade Prática (PDF)

Ao término da terceira etapa, o simulador consolida o desempenho do aluno em um **Relatório de Execução de Atividade Prática** em formato PDF de página única (A4), pronto para anexo em ambientes virtuais de aprendizagem (como Moodle, Teams ou Google Classroom):

* **Identificação:** Nome do estudante, identificação da turma e data/hora de realização.
* **Matriz de Aproveitamento:** Desempenho e pontuação detalhada de cada etapa (máximo: 2.600 pontos).
* **Quadro de Tarefas Práticas:** Registro descritivo de todas as habilidades operacionais exercitadas pelo estudante.
* **Tabela de Normas:** Demonstração dos conteúdos normativos praticados durante o exercício.
* **Sem Burocracia Oficial:** O documento é estritamente pedagógico e registra unicamente a entrega do exercício escolar no simulador.

---

## 🛡️ Sistema de Integridade Pedagógica e Anti-Cópia

Para garantir que o aluno resolva as questões com base em seu próprio raciocínio em ambiente de sala de aula ou laboratório:

* **Bloqueio de Seleção e Cópia:** `user-select: none`, neutralização de `Ctrl + C`, `Ctrl + S`, `Ctrl + U` e botão direito do mouse.
* **Proteção contra Captura de Tela:**
  * O acionamento da tecla `PrintScreen` ou da Ferramenta de Captura do Windows (`Win + Shift + S`) ativa instantaneamente uma cortina escura com escudo de proteção (`z-index: 2147483647`), borrando todo o conteúdo subjacente e limpando a área de transferência.
* **Acesso do Professor Preservado:**
  * A tecla **`F12`** e o console de desenvolvedor permanecem liberados para inspeção pedagógica e testes rápidos do instrutor.

---

## 🚀 Como Executar o Projeto

O AutoSafe 4.0 foi desenvolvido em **HTML5, CSS3 e JavaScript puro (Vanilla)**, sem necessidade de Node.js, compilação ou instalação de dependências.

### Opção 1: Servidor Local Rápido (Python)
No terminal, dentro da pasta do projeto:
```bash
python -m http.server 3000
```
Acesse no navegador:
```
http://localhost:3000/index.html
```

### Opção 2: Extensão Live Server (VS Code)
1. Abra a pasta do projeto no VS Code;
2. Clique com o botão direito em `index.html` e selecione **Open with Live Server**.

### Opção 3: Qualquer Servidor Estático
Compatível com NGINX, Apache, GitHub Pages, Vercel ou Netlify apenas servindo a pasta raiz.

---

## ⌨️ Atalhos e Comandos do Instrutor (Console F12)

Para fins de demonstração, validação docente ou testes ágeis, o instrutor pode pressionar **`F12`** e executar no Console:

```javascript
// Resolve instantaneamente a Etapa 1 com pontuação máxima:
stage1.autoSolveAll();

// Resolve instantaneamente a Etapa 2 (LOTO, Ergonomia e Eficiência ESG):
stage2.autoSolveAll();

// Resolve instantaneamente a Etapa 3 (Retrofit dentro do orçamento):
stage3.autoSolveAll();
```

---

## 📁 Estrutura de Arquivos

```text
Jogos_Educativos/Normas_seguranca/
├── index.html              # Estrutura HTML5 da aplicação e visualizadores SCADA
├── README.md               # Documentação técnica e guia do projeto
├── .gitignore              # Regras de exclusão do repositório Git
├── css/
│   └── styles.css          # Design System Cyber-SCADA, Glassmorphism e responsividade
├── js/
│   ├── app.js              # Controlador principal, roteamento de views e HUD
│   ├── stage1.js           # Lógica da Etapa 1 (Inspeção de perigos em CCM e Robótica)
│   ├── stage2.js           # Lógica da Etapa 2 (LOTO, Ergonomia RULA e Eficiência ESG)
│   ├── stage3.js           # Lógica da Etapa 3 (Engenharia de Retrofit e Orçamento)
│   ├── security.js         # Módulo de integridade, bloqueio de cópia e captura
│   ├── sound.js            # Síntese de áudio procedural com Web Audio API
│   ├── storage.js          # Persistência de estado local (LocalStorage)
│   └── pdfGenerator.js     # Motor de geração do relatório pedagógico em PDF
├── libs/
│   ├── jspdf.umd.min.js    # Biblioteca jsPDF para exportação de documentos
│   └── confetti.browser.min.js # Efeitos de comemoração visual
└── assets/
    └── scenarios/          # Renderizações de chão de fábrica e componentes industriais
```

---

## 📜 Licença

Projeto desenvolvido para fins educacionais e didáticos. Livre para uso acadêmico e adaptações curriculares em instituições de ensino técnico e profissionalizante.
