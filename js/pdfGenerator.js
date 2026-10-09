// ===================================================================
// GERADOR DE RELATÓRIO DE CONCLUSÃO DE ATIVIDADE PRÁTICA EM PDF
// Plataforma AutoSafe 4.0 - Simulador de Segurança Industrial
// ===================================================================

class PDFGenerator {
  constructor() {
    this.jsPDF = window.jspdf ? window.jspdf.jsPDF : null;
  }

  getDoc() {
    if (!this.jsPDF && window.jspdf) {
      this.jsPDF = window.jspdf.jsPDF;
    }
    if (!this.jsPDF) {
      throw new Error('Biblioteca jsPDF não carregada.');
    }
    return new this.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }

  // --- RELATÓRIO CONSOLIDADO DE EXECUÇÃO DA ATIVIDADE PRÁTICA ---
  generateStage3FinalPDF(state) {
    const doc = this.getDoc();
    const student = state.student || { name: 'Aluno', classGroup: 'Automação' };
    const s1Score = (state.scores && state.scores.stage1) || 0;
    const s2Score = (state.scores && state.scores.stage2) || 0;
    const s3Score = (state.scores && state.scores.stage3) || 0;
    const totalScore = (state.scores && state.scores.total) || (s1Score + s2Score + s3Score);

    const dateStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const answers = (state.stage1 && state.stage1.answers) ? state.stage1.answers : {};
    const s1CorrectCount = Object.values(answers).filter(a => a && a.isCorrect).length;
    const pctS1 = Math.min(100, Math.round((s1Score / 1200) * 100));
    const pctS2 = Math.min(100, Math.round((s2Score / 1000) * 100));
    const pctS3 = Math.min(100, Math.round((s3Score / 400) * 100));
    const pctTotal = Math.min(100, Math.round((totalScore / 2600) * 100));

    // ===============================================================
    // CABEÇALHO DO DOCUMENTO
    // ===============================================================
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 24, 'F');

    doc.setTextColor(6, 182, 212); // cyan-500
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('AUTOSAFE 4.0 - SIMULADOR DE SEGURANÇA INDUSTRIAL', 14, 11);

    doc.setTextColor(226, 232, 240); // slate-200
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('RELATÓRIO DE EXECUÇÃO DE ATIVIDADE PRÁTICA', 14, 18);

    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.8);
    doc.line(14, 24, 196, 24);

    // ===============================================================
    // DADOS DO ALUNO E DA TAREFA
    // ===============================================================
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 28, 182, 17, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 28, 182, 17, 2, 2, 'D');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`ALUNO(A): ${student.name.toUpperCase()}`, 18, 34.5);
    doc.text(`TURMA / GRUPO: ${student.classGroup.toUpperCase()}`, 18, 41);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`DATA / HORA: ${dateStr}`, 118, 34.5);
    doc.text('FINALIDADE: Entrega de Exercício Prático', 118, 41);

    // ===============================================================
    // RESUMO DO DESEMPENHO NAS ETAPAS (4 CARDS)
    // ===============================================================
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('DESEMPENHO NAS ETAPAS DO SIMULADOR:', 14, 50.5);

    const cards = [
      {
        title: 'ETAPA 1: INSPEÇÃO',
        pts: `${s1Score} / 1.200 pts`,
        sub: `${s1CorrectCount}/12 perigos (${pctS1}%)`,
        status: 'Executada',
        color: [245, 158, 11]
      },
      {
        title: 'ETAPA 2: CAMPO',
        pts: `${s2Score} / 1.000 pts`,
        sub: `3/3 práticas (${pctS2}%)`,
        status: 'Executada',
        color: [245, 158, 11]
      },
      {
        title: 'ETAPA 3: PROJETO',
        pts: `${s3Score} / 400 pts`,
        sub: `Adequação (${pctS3}%)`,
        status: 'Executada',
        color: [245, 158, 11]
      },
      {
        title: 'TOTAL DO EXERCÍCIO',
        pts: `${totalScore} / 2.600`,
        sub: `${pctTotal}% de aproveitamento`,
        status: 'Concluído',
        color: [16, 185, 129]
      }
    ];

    let cx = 14;
    cards.forEach(c => {
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(cx, 53.5, 43, 21.5, 2, 2, 'F');

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.text(c.title, cx + 3.5, 59);

      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.setFontSize(9);
      doc.text(c.pts, cx + 3.5, 65.5);

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(6.2);
      doc.setFont('helvetica', 'normal');
      doc.text(c.sub, cx + 3.5, 69.5);

      doc.setTextColor(c.color[0], c.color[1], c.color[2]);
      doc.setFontSize(6.2);
      doc.setFont('helvetica', 'bold');
      doc.text(c.status, cx + 3.5, 73);

      cx += 46.3;
    });

    // ===============================================================
    // TAREFAS PRÁTICAS EXECUTADAS NO SIMULADOR (2 COLUNAS)
    // ===============================================================
    let y = 80;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('REGISTRO DAS TAREFAS E HABILIDADES PRATICADAS PELO ALUNO:', 14, y);
    y += 4;

    const colW = 89;
    const col1X = 14;
    const col2X = 107;

    // Coluna 1: Inspeção + Projeto
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(col1X, y, colW, 61, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(col1X, y, colW, 61, 2, 2, 'D');

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text('1. INSPEÇÃO TÉCNICA DE RISCOS (NR-10, NR-12, NR-17)', col1X + 4, y + 5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    const col1ItemsA = [
      '• Inspeção de contato elétrico direto em painel CCM;',
      '• Verificação de continuidade e aterramento PE;',
      '• Análise de intertravamento em portas móveis de máquinas;',
      '• Cálculo de distância de segurança para cortinas ópticas.'
    ];
    let subY = y + 9.5;
    col1ItemsA.forEach(it => {
      const lines = doc.splitTextToSize(it, colW - 8);
      doc.text(lines, col1X + 4, subY);
      subY += lines.length * 3.2;
    });

    subY += 1.5;
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text('3. SEGURANÇA NO PROJETO E ADEQUAÇÃO DA LINHA', col1X + 4, subY);

    subY += 4.5;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    const col1ItemsB = [
      '• Automação ergonômica com robô colaborativo;',
      '• Instalação de cortinas de luz e circuitos monitorados;',
      '• Cumprimento dos critérios com controle de orçamento.'
    ];
    col1ItemsB.forEach(it => {
      const lines = doc.splitTextToSize(it, colW - 8);
      doc.text(lines, col1X + 4, subY);
      subY += lines.length * 3.2;
    });

    // Coluna 2: Procedimentos de Campo e Gestão Ambiental
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(col2X, y, colW, 61, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(col2X, y, colW, 61, 2, 2, 'D');

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text('2. PROCEDIMENTOS TÉCNICOS OPERACIONAIS E ESG', col2X + 4, y + 5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    const col2Items = [
      '• Execução simulada dos 6 passos de Bloqueio LOTO;',
      '• Ajuste ergonômico de posto (Método RULA em linha neutra);',
      '• Caça a vazamentos com detector ultrassônico pneumático;',
      '• Diagnóstico e cálculo de perdas em ar comprimido;',
      '• Seleção técnica de motor elétrico com inversor (IE4);',
      '• Triagem e destinação correta de resíduos (NBR 10004).'
    ];
    let subY2 = y + 9.5;
    col2Items.forEach(it => {
      const lines = doc.splitTextToSize(it, colW - 8);
      doc.text(lines, col2X + 4, subY2);
      subY2 += lines.length * 3.2;
    });

    y += 65;

    // ===============================================================
    // TABELA DE NORMAS E TEMAS ABORDADOS NO EXERCÍCIO
    // ===============================================================
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('NORMAS TÉCNICAS E CONCEITOS ABORDADOS NO EXERCÍCIO:', 14, y);
    y += 4;

    const normasData = [
      { norma: 'NR-10 (Segurança em Eletricidade)', ambito: 'Desenergização, Bloqueio LOTO e Aterramento PE', status: 'Executado' },
      { norma: 'NR-12 (Segurança em Máquinas)', ambito: 'Intertravamento, Proteções Físicas e Parada Emergência', status: 'Executado' },
      { norma: 'NR-17 (Ergonomia no Trabalho)', ambito: 'Postura, Linha Neutra (RULA) e Movimentação Manual', status: 'Executado' },
      { norma: 'ABNT NBR ISO 13849-1', ambito: 'Circuitos e Funções de Segurança em Máquinas', status: 'Executado' },
      { norma: 'ABNT NBR 10004 (Resíduos)', ambito: 'Classificação e Destinação de Resíduos Industriais', status: 'Executado' },
      { norma: 'Eficiência Energética Industrial', ambito: 'Diagnóstico de Perdas em Ar Comprimido e Motores', status: 'Executado' }
    ];

    // Cabeçalho da tabela
    doc.setFillColor(226, 232, 240);
    doc.rect(14, y, 182, 5.5, 'F');
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('NORMA / ASSUNTO', 18, y + 3.8);
    doc.text('CONTEÚDO PRATICADO NO SIMULADOR', 75, y + 3.8);
    doc.text('STATUS', 165, y + 3.8);
    y += 5.5;

    normasData.forEach((n, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(14, y, 182, 5.2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, y, 182, 5.2, 'D');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(30, 41, 59);
      doc.text(n.norma, 18, y + 3.6);

      doc.setTextColor(71, 85, 105);
      doc.text(n.ambito, 75, y + 3.6);

      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text(n.status, 165, y + 3.6);

      y += 5.2;
    });

    y += 5;

    // ===============================================================
    // REGISTRO DE CONCLUSÃO DA ATIVIDADE
    // ===============================================================
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('REGISTRO DE CONCLUSÃO DA ATIVIDADE:', 14, y);
    y += 3.5;

    const conclText = `O aluno(a) ${student.name.toUpperCase()} (Turma: ${student.classGroup.toUpperCase()}) completou as 3 etapas de simulação no AutoSafe 4.0 em ${dateStr}, totalizando a pontuação de ${totalScore} pontos (${pctTotal}% de aproveitamento). Todas as atividades práticas do roteiro escolar foram realizadas com sucesso.`;
    const conclLines = doc.splitTextToSize(conclText, 174);
    const conclH = conclLines.length * 3.3 + 6;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, conclH, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, 182, conclH, 2, 2, 'D');

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.text(conclLines, 18, y + 4.8);

    y += conclH + 4;

    // Badge visual simples de conclusão
    doc.setFillColor(16, 185, 129, 0.08);
    doc.roundedRect(14, y, 182, 10, 2, 2, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.roundedRect(14, y, 182, 10, 2, 2, 'D');

    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('✓ ATIVIDADE PRÁTICA EXECUTADA PELO ALUNO NO SIMULADOR', 18, y + 6.5);

    y += 14;

    // ===============================================================
    // RODAPÉ PEDAGÓGICO INFORMATIVO
    // ===============================================================
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, 182, 15, 1.5, 1.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, 182, 15, 1.5, 1.5, 'D');

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('AUTOSAFE 4.0 // COMPROVANTE DE ENTREGA DE ATIVIDADE ESCOLAR', 18, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(6.2);
    doc.text('Documento gerado para fins de acompanhamento didático e entrega de exercício escolar.', 18, y + 8.5);
    doc.text('Registra exclusivamente que o(a) aluno(a) executou as atividades propostas no simulador.', 18, y + 12);

    // Salvar arquivo com nome limpo
    const safeName = student.name.replace(/\s+/g, '_');
    doc.save(`AutoSafe_Relatorio_Atividade_${safeName}.pdf`);
  }

  // Métodos de compatibilidade (redirecionam para o relatório unificado)
  generateStage1PDF(state) {
    this.generateStage3FinalPDF(state);
  }

  generateStage2PDF(state) {
    this.generateStage3FinalPDF(state);
  }
}

window.pdfGen = new PDFGenerator();
