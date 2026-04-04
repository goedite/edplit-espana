/**
 * EdPlit Exit-Intent Popup — Vanilla JS
 *
 * Triggers:
 *   Desktop → mouse leaves viewport from top (exit-intent)
 *   Mobile  → scroll-up gesture OR 45 seconds on page
 *
 * Features:
 *   - Sends lead to Brevo via /api/subscribe (list ID 6)
 *   - Remembers dismissal for 7 days (localStorage)
 *   - Gold/dark EDPLIT branding
 *   - ESC key, click outside to close
 */
(function () {
  'use strict';

  const STORAGE_KEY   = 'edplit_popup_dismissed';
  const DISMISS_DAYS  = 7;
  const MOBILE_DELAY  = 45000; // 45 s
  const DESKTOP_DELAY = 5000;  // wait 5 s before activating exit-intent

  let hasTriggered = false;
  let lastScrollY  = 0;
  let popupEl      = null;
  let mobileTimer  = null;

  /* ── helpers ────────────────────────────────────────────── */

  function isDismissed() {
    try {
      const ts = localStorage.getItem(STORAGE_KEY);
      if (!ts) return false;
      return (Date.now() - parseInt(ts, 10)) / 86400000 < DISMISS_DAYS;
    } catch (e) { return false; }
  }

  function markDismissed() {
    try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch (e) {}
  }

  /* ── build DOM ──────────────────────────────────────────── */

  function buildPopup() {
    const overlay = document.createElement('div');
    overlay.id = 'edplit-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Oferta especial EdPlit');

    overlay.innerHTML = `
      <style>
        #edplit-popup-overlay {
          position: fixed; inset: 0; z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px; box-sizing: border-box;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: ep-fade .3s ease-out;
        }
        #edplit-popup-box {
          position: relative; width: 100%; max-width: 440px;
          max-height: calc(100vh - 32px); overflow-y: auto; /* Evita que se salga el 5% por arriba/abajo en móviles */
          background: #1A1A2E; border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.55);
          animation: ep-up .4s ease-out;
          margin: auto;
        }
        #edplit-popup-close {
          position: absolute; top: 12px; right: 12px;
          width: 32px; height: 32px; border: none; padding: 0;
          background: rgba(255,255,255,0.1); border-radius: 50%;
          color: #999; font-size: 18px; line-height: 1;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background .2s, color .2s;
        }
        #edplit-popup-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
        #edplit-popup-submit:hover:not(:disabled) { background: #A07548 !important; }
        #edplit-nombre:focus, #edplit-email:focus {
          border-color: #B88657 !important; outline: none;
        }
        #edplit-popup-box input::placeholder { color: #666; }
        @keyframes ep-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ep-up {
          from { opacity: 0; transform: translateY(30px) scale(.95) }
          to   { opacity: 1; transform: translateY(0)     scale(1)  }
        }
      </style>

      <div id="edplit-popup-box">

        <!-- gold bar -->
        <div style="height:4px;background:linear-gradient(90deg,#B88657,#D4A574,#B88657)"></div>

        <!-- close -->
        <button id="edplit-popup-close" aria-label="Cerrar">✕</button>

        <!-- inner -->
        <div style="padding:32px 28px 28px">

          <!-- FORM -->
          <div id="edplit-form-state">
            <span style="display:inline-block;padding:4px 12px;background:rgba(184,134,87,.15);
              border-radius:20px;color:#B88657;font-size:12px;font-weight:600;
              letter-spacing:1px;text-transform:uppercase;margin-bottom:16px">
              Oferta exclusiva
            </span>
            <h2 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 8px;
              line-height:1.3;font-family:inherit">¿Ya te vas?</h2>
            <h3 style="color:#B88657;font-size:28px;font-weight:700;margin:0 0 12px;
              font-family:inherit">5% de descuento</h3>
            <p style="color:#aaa;font-size:14px;line-height:1.6;margin:0 0 24px">
              En tu primer pedido + catálogo PDF con toda nuestra colección.
              Solo necesitamos tu email.
            </p>

            <form id="edplit-popup-form" novalidate>
              <input id="edplit-nombre" type="text" placeholder="Tu nombre (opcional)"
                autocomplete="given-name"
                style="width:100%;padding:12px 16px;margin-bottom:10px;
                  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
                  border-radius:8px;color:#fff;font-size:15px;box-sizing:border-box;
                  transition:border-color .2s;font-family:inherit"/>
              <input id="edplit-email" type="email" placeholder="Tu email *"
                autocomplete="email" required
                style="width:100%;padding:12px 16px;margin-bottom:10px;
                  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
                  border-radius:8px;color:#fff;font-size:15px;box-sizing:border-box;
                  transition:border-color .2s;font-family:inherit"/>

              <p id="edplit-error-msg" style="color:#E57373;font-size:13px;
                margin:0 0 10px;display:none"></p>

              <button id="edplit-popup-submit" type="submit"
                style="width:100%;padding:14px;background:#B88657;border:none;
                  border-radius:8px;color:#fff;font-size:16px;font-weight:600;
                  cursor:pointer;transition:background .2s;font-family:inherit">
                Obtener mi 5% de descuento
              </button>
            </form>

            <p style="text-align:center;color:#555;font-size:11px;margin:16px 0 0;line-height:1.4">
              Sin spam. Solo productos de diseño.<br>
              Distribuidor oficial en España · Garantía 10 años
            </p>
          </div>

          <!-- SUCCESS -->
          <div id="edplit-success-state" style="display:none;text-align:center;padding:20px 0">
            <div style="font-size:48px;color:#B88657;margin-bottom:16px">✓</div>
            <h3 style="color:#B88657;font-size:22px;font-weight:600;
              margin:0 0 12px;font-family:inherit">¡Código activado!</h3>
            <p style="color:#ccc;font-size:15px;margin:0 0 16px;line-height:1.5">
              Tu código de descuento es:
            </p>
            <div style="display:inline-block;padding:12px 24px;
              background:rgba(184,134,87,.15);border:2px dashed #B88657;
              border-radius:8px;color:#B88657;font-size:24px;font-weight:700;
              letter-spacing:3px;font-family:monospace">
              BIENVENIDO5
            </div>
            <p style="color:#666;font-size:13px;margin:16px 0 0">
              Revisa tu email para el catálogo completo
            </p>
          </div>

        </div>
      </div>`;

    return overlay;
  }

  /* ── show / close ───────────────────────────────────────── */

  function showPopup() {
    if (hasTriggered || isDismissed()) return;
    hasTriggered = true;
    if (mobileTimer) clearTimeout(mobileTimer);

    popupEl = buildPopup();
    document.body.appendChild(popupEl);
    document.body.style.overflow = 'hidden';

    document.getElementById('edplit-popup-close').addEventListener('click', closePopup);
    popupEl.addEventListener('click', function (e) {
      if (e.target === popupEl) closePopup();
    });
    document.getElementById('edplit-popup-form').addEventListener('submit', handleSubmit);
    document.addEventListener('keydown', onKey);
  }

  function closePopup() {
    markDismissed();
    if (popupEl && popupEl.parentNode) popupEl.parentNode.removeChild(popupEl);
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    popupEl = null;
  }

  function onKey(e) { if (e.key === 'Escape') closePopup(); }

  /* ── form submit ────────────────────────────────────────── */

  async function handleSubmit(e) {
    e.preventDefault();

    const nombre    = document.getElementById('edplit-nombre').value.trim();
    const email     = document.getElementById('edplit-email').value.trim();
    const errorEl   = document.getElementById('edplit-error-msg');
    const submitBtn = document.getElementById('edplit-popup-submit');

    errorEl.style.display = 'none';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent  = 'Por favor, introduce un email válido';
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled   = true;
    submitBtn.textContent = 'Enviando…';
    submitBtn.style.opacity = '0.7';

    try {
      const res = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          nombre,
          email,
          source:   'exit_popup',
          discount: 'BIENVENIDO5'
        })
      });

      if (!res.ok) throw new Error();

      // Show success state
      document.getElementById('edplit-form-state').style.display    = 'none';
      document.getElementById('edplit-success-state').style.display = 'block';
      markDismissed();

      // Push GA4 event if GTM is loaded
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'popup_lead', email_captured: true });

      setTimeout(closePopup, 4000);

    } catch (_) {
      errorEl.textContent   = 'Ha ocurrido un error. Inténtalo de nuevo.';
      errorEl.style.display = 'block';
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Obtener mi 5% de descuento';
      submitBtn.style.opacity = '1';
    }
  }

  /* ── triggers ───────────────────────────────────────────── */

  function init() {
    if (isDismissed()) return;

    const isMobile = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);

    if (isMobile) {
      // 45-second timer
      mobileTimer = setTimeout(showPopup, MOBILE_DELAY);

      // Scroll-up detection
      window.addEventListener('scroll', function () {
        const y = window.scrollY;
        if (y < lastScrollY - 100 && y > 300) showPopup();
        lastScrollY = y;
      }, { passive: true });

    } else {
      // Exit-intent: activate after DESKTOP_DELAY to avoid immediate triggers
      setTimeout(function () {
        document.addEventListener('mouseleave', function onLeave(e) {
          if (e.clientY <= 0) {
            document.removeEventListener('mouseleave', onLeave);
            showPopup();
          }
        });
      }, DESKTOP_DELAY);
    }
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
