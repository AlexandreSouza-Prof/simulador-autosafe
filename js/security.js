// ===================================================================
// SISTEMA DE INTEGRIDADE PEDAGÓGICA E PROTEÇÃO CONTRA CÓPIA E CAPTURA
// Plataforma AutoSafe 4.0 - Simulador de Segurança Industrial
// ===================================================================

(function () {
  'use strict';

  // 1. Limpeza segura de área de transferência
  function clearClipboard() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('').catch(function () {});
      }
    } catch (_) {}
  }

  // 2. Controle da Cortina de Proteção Visual
  function activateCurtain() {
    const curtain = document.getElementById('anti-cheat-curtain');
    if (curtain) {
      curtain.classList.add('active');
      document.body.classList.add('anti-cheat-active');
    }
  }

  function deactivateCurtain() {
    const curtain = document.getElementById('anti-cheat-curtain');
    if (curtain) {
      curtain.classList.remove('active');
      document.body.classList.remove('anti-cheat-active');
    }
  }

  // 3. Montagem da Cortina no DOM
  function setupCurtainDOM() {
    if (document.getElementById('anti-cheat-curtain')) return;

    const curtain = document.createElement('div');
    curtain.id = 'anti-cheat-curtain';
    curtain.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 2px solid #06B6D4; border-radius: 16px; padding: 2.2rem 2.8rem; text-align: center; max-width: 460px; box-shadow: 0 0 50px rgba(6, 182, 212, 0.35);">
        <div style="font-size: 2.5rem; margin-bottom: 0.85rem;">🛡️</div>
        <h3 style="color: #F1F5F9; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.6rem; letter-spacing: 0.05em;">
          PROTEÇÃO DE TELA ATIVA
        </h3>
        <p style="color: #94A3B8; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1.5rem;">
          A captura de tela e a troca de janelas estão bloqueadas durante o exercício didático.
        </p>
        <button id="btn-anti-cheat-dismiss" style="background: linear-gradient(135deg, #06B6D4, #3B82F6); color: #FFFFFF; font-weight: 700; font-size: 0.85rem; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; cursor: pointer;">
          Clique para Retornar ao Simulador
        </button>
      </div>
    `;

    document.body.appendChild(curtain);

    // Permitir retornar ao clicar no botão ou na cortina
    curtain.addEventListener('click', function () {
      deactivateCurtain();
    });
  }

  // 4. Bloqueio de Menu de Contexto (Botão Direito do Mouse)
  document.addEventListener('contextmenu', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
      return; // Permite digitação nos campos de cadastro
    }
    e.preventDefault();
  }, { capture: true });

  // 5. Bloqueio de Cópia, Recorte e Arraste
  ['copy', 'cut', 'dragstart'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return; // Permite edição normal de texto nos inputs
      }
      e.preventDefault();
      clearClipboard();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '');
      }
    }, { capture: true });
  });

  // 6. Bloqueio de Atalhos de Teclado
  // NOTA PEDAGÓGICA: F12 mantido LIBERADO a pedido do professor
  window.addEventListener('keydown', function (e) {
    const isInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');

    // F12 liberado explicitamente
    if (e.key === 'F12') {
      return;
    }

    // Tecla PrintScreen (dispara proteção imediata e limpa o clipboard)
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      activateCurtain();
      clearClipboard();
      e.preventDefault();
      return;
    }

    // Atalhos com Ctrl / Cmd
    if (e.ctrlKey || e.metaKey) {
      const key = e.key ? e.key.toLowerCase() : '';

      // Ctrl + C (Copiar)
      if (key === 'c' && !isInput) {
        e.preventDefault();
        clearClipboard();
        return;
      }

      // Ctrl + S (Salvar Página)
      if (key === 's') {
        e.preventDefault();
        return;
      }

      // Ctrl + U (Código-fonte)
      if (key === 'u') {
        e.preventDefault();
        return;
      }

      // Ctrl + P (Imprimir)
      if (key === 'p') {
        e.preventDefault();
        return;
      }

      // Ctrl + A (Selecionar Tudo)
      if (key === 'a' && !isInput) {
        e.preventDefault();
        return;
      }
    }
  }, { capture: true });

  window.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      activateCurtain();
      clearClipboard();
    }
  }, { capture: true });

  // 7. Proteção de Foco da Janela (Ferramenta de Captura Win+Shift+S, Alt+Tab, Minimizar)
  // Quando o Windows abre a ferramenta de captura ou outra janela, a aba perde o foco ('blur')
  window.addEventListener('blur', function () {
    activateCurtain();
    clearClipboard();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      activateCurtain();
      clearClipboard();
    }
  });

  // Quando o usuário volta à janela do simulador
  window.addEventListener('focus', function () {
    // Pequeno atraso para impedir que capturas com timer peguem a tela reabrindo rápido demais
    setTimeout(function () {
      deactivateCurtain();
    }, 150);
  });

  // Inicializa o DOM da cortina
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCurtainDOM);
  } else {
    setupCurtainDOM();
  }

  // Expõe função de teste global caso o professor queira testar via console
  window.testAntiCheatCurtain = activateCurtain;
})();
