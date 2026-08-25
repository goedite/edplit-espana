// ==========================================
// EDPLIT ESPAÑA - JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // PRODUCT TABS FUNCTIONALITY
  // ==========================================
  const tabButtons = document.querySelectorAll(".tab-btn");
  const productCategories = document.querySelectorAll(".product-category");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Get the category to show
      const category = button.getAttribute("data-category");

      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Hide all categories
      productCategories.forEach((cat) => cat.classList.remove("active"));

      // Show selected category (data-category may hold multiple space-separated tokens,
      // e.g. one shared block for both "enchufes" and "interruptores")
      const targetCategory = document.querySelector(
        `.product-category[data-category~="${category}"]`,
      );
      if (targetCategory) {
        targetCategory.classList.add("active");
      }
    });
  });

  // ==========================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#"
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // Get navbar height for offset
        const navbar = document.querySelector(".navbar");
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        // Calculate position
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight -
          20;

        // Smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    if (!navbar) return; // guard: navbar may not exist on all pages
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      navbar.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
  });

  // ==========================================
  // CONTACT FORM SUBMISSION - VERCEL API
  // ==========================================
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form elements
      const submitBtn = document.getElementById("submit-btn");
      const btnText = document.getElementById("btn-text");
      const btnLoading = document.getElementById("btn-loading");
      const formMessage = document.getElementById("form-message");

      // Get form data
      const formData = new FormData(contactForm);
      const data = {
        nombre: formData.get("nombre"),
        empresa: formData.get("empresa"),
        email: formData.get("email"),
        telefono: formData.get("telefono"),
        tipo: formData.get("tipo"),
        mensaje: formData.get("mensaje"),
      };

      // Show loading state
      submitBtn.disabled = true;
      btnText.style.display = "none";
      btnLoading.style.display = "inline";
      formMessage.style.display = "none";

      try {
        // Send to Vercel API
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Enviar evento de conversión a Google Analytics / GTM
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "generate_lead",
            form_type: formData.get("tipo") || "contacto_general",
          });

          // Success message
          formMessage.textContent =
            "¡Mensaje enviado correctamente! Te contactaremos pronto.";
          formMessage.style.backgroundColor = "#d4edda";
          formMessage.style.color = "#155724";
          formMessage.style.border = "1px solid #c3e6cb";
          formMessage.style.display = "block";

          // Reset form
          contactForm.reset();

          // Hide message after 5 seconds
          setTimeout(() => {
            formMessage.style.display = "none";
          }, 5000);
        } else {
          throw new Error(result.message || "Error al enviar el mensaje");
        }
      } catch (error) {
        // Error message
        formMessage.textContent =
          error.message ||
          "Hubo un error al enviar el mensaje. Por favor, intenta de nuevo o contáctanos directamente.";
        formMessage.style.backgroundColor = "#f8d7da";
        formMessage.style.color = "#721c24";
        formMessage.style.border = "1px solid #f5c6cb";
        formMessage.style.display = "block";

        console.error("Form submission error:", error);
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
      }
    });
  }

  // ==========================================
  // PREFILL DEL FORMULARIO — vía ?motivo=soporte | ?motivo=partners | ?motivo=formacion
  // ==========================================
  (function handleMotivoPrefill() {
    const MOTIVO_CONFIG = {
      formacion: {
        tipoValue: "formacion",
        template: "Hola.\nNecesito formación sobre los productos EDPLIT.",
        waText: "Hola. Necesito formación sobre los productos EDPLIT.",
      },
      soporte: {
        tipoValue: "soporte_tecnico",
        template:
          "Hola.\n" +
          "Necesito soporte técnico para un producto EDPLIT.\n" +
          "Descripción de la consulta: ",
        waText:
          "Hola. Necesito soporte técnico para un producto EDPLIT. " +
          "Producto o modelo: ____. Número de pedido, si corresponde: ____. " +
          "Descripción de la consulta: ____.",
      },
      partners: {
        tipoValue: "profesional",
        template:
          "Hola.\n" +
          "Me gustaría recibir información sobre el Programa Partners de EDPLIT.\n" +
          "Un poco sobre nosotros:",
        waText:
          "Hola. Me gustaría recibir información sobre el Programa Partners de EDPLIT. " +
          "Soy: ____. Actividad: ____. Ciudad o provincia: ____. Tipo de colaboración: ____.",
      },
    };

    const params = new URLSearchParams(window.location.search);
    const motivo = params.get("motivo");
    const config = MOTIVO_CONFIG[motivo];
    if (!config) return;

    const contactSection = document.getElementById("contacto");
    const tipoSelect = document.getElementById("tipo");
    const mensajeField = document.getElementById("mensaje");
    if (!contactSection || !contactForm) return;

    if (tipoSelect) {
      tipoSelect.value = config.tipoValue;
    }

    if (mensajeField && !mensajeField.value.trim()) {
      mensajeField.value = config.template;
    }

    // Pre-rellena el enlace de WhatsApp junto al formulario, si existe
    const whatsappLink = document.getElementById("whatsapp-contact-link");
    if (whatsappLink) {
      whatsappLink.href = `https://wa.me/34614825778?text=${encodeURIComponent(config.waText)}`;
    }

    contactSection.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      const requiredFields = contactForm.querySelectorAll("[required]");
      for (const field of requiredFields) {
        if (!field.value.trim()) {
          field.focus();
          break;
        }
      }
    }, 500);
  })();

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Select all elements with the reveal class
  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });

  // ==========================================
  // MOBILE MENU
  // ==========================================
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-mobile");

  if (mobileMenuBtn && navLinks) {
    // Create overlay element
    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    // Toggle menu
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuBtn.classList.toggle("active");
      navLinks.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Close menu when clicking overlay
    overlay.addEventListener("click", () => {
      mobileMenuBtn.classList.remove("active");
      navLinks.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("active");
        navLinks.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // ==========================================
  // GOOGLE ANALYTICS CUSTOM EVENTS (Google Ads)
  // ==========================================
  // Rastrear clics hacia la tienda de Shopify
  document.querySelectorAll('a[href*="tienda.edplit.es"]').forEach((link) => {
    link.addEventListener("click", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "click_tienda",
        link_url: this.href,
        link_text: this.innerText.trim(),
      });
    });
  });

  // Rastrear clics hacia redes sociales / YouTube / Contacto
  document
    .querySelectorAll(
      'a[href*="youtube.com"], a[href*="instagram.com"], a[href*="tiktok.com"]',
    )
    .forEach((link) => {
      link.addEventListener("click", function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "click_social",
          social_network: this.href,
        });
      });
    });

  // Initialize carousels
  initCarousels();

  // Initialize Hero Slider
  initHeroSlider();

  // Initialize FAQ accordion + category tabs
  initFaq();

  // Initialize Lightbox — use idle time to not block the main thread (FID fix)
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(initLightbox, { timeout: 2000 });
  } else {
    setTimeout(initLightbox, 500);
  }
});

// ==========================================
// FAQ — category tabs + accordion
// ==========================================
function initFaq() {
  const tabs = document.querySelectorAll(".faq-tab");
  const panels = document.querySelectorAll(".faq-panel");
  const questions = document.querySelectorAll(".faq-question");
  if (tabs.length === 0 && questions.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.getAttribute("data-faq-category");

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      panels.forEach((panel) => {
        panel.classList.toggle(
          "active",
          panel.getAttribute("data-faq-panel") === category,
        );
      });
    });
  });

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      question.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}

// ==========================================
// HERO SLIDER — infinite loop + smooth transition
// ==========================================
function initHeroSlider() {
  const track = document.getElementById("heroSliderTrack");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  const dots = document.querySelectorAll(".hero-dot");
  const slides = document.querySelectorAll(".hero-slide");
  if (!track || slides.length === 0) return;

  const TOTAL = slides.length;
  let currentIndex = 1; // 1 = first real slide (index 0 is cloned-last)
  let isTransitioning = false;
  let autoplayTimer = null;

  // --- Clone first & last slides for seamless infinite loop ---
  const firstClone = slides[0].cloneNode(true);
  const lastClone  = slides[TOTAL - 1].cloneNode(true);
  track.appendChild(firstClone);              // after last  → [last-clone]
  track.insertBefore(lastClone, slides[0]);   // before first ← [first-clone]
  // Track now: [clone-last] [slide1] [slide2] ... [slideN] [clone-first]
  //  indices:       0           1       2    ...    N          N+1

  // Set starting position without animation
  setPosition(currentIndex, false);

  function setPosition(index, animate) {
    track.style.transition = animate
      ? 'transform 1.1s cubic-bezier(0.33, 1, 0.68, 1)'
      : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function updateDots() {
    // real dot index = currentIndex - 1, wrapped
    const dotIdx = (currentIndex - 1 + TOTAL) % TOTAL;
    dots.forEach((d, i) => d.classList.toggle("active", i === dotIdx));
  }

  function updateActiveSlide() {
    Array.from(track.children).forEach(el => el.classList.remove('is-active'));
    const active = track.children[currentIndex];
    if (active) {
      void active.offsetWidth; // force reflow so animation restarts
      active.classList.add('is-active');
    }
  }

  function goTo(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    setPosition(currentIndex, true);
    updateDots();
    updateActiveSlide();
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIndex === TOTAL + 1) {
      currentIndex = 1;
      setPosition(currentIndex, false);
      updateActiveSlide();
    } else if (currentIndex === 0) {
      currentIndex = TOTAL;
      setPosition(currentIndex, false);
      updateActiveSlide();
    }
  });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(currentIndex + 1), 5850);
  }

  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  // Arrows
  if (prevBtn) prevBtn.addEventListener("click", () => { goTo(currentIndex - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { goTo(currentIndex + 1); startAutoplay(); });

  // Dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { goTo(i + 1); startAutoplay(); });
  });

  // Pause on hover
  const slider = document.getElementById("heroSlider");
  if (slider) {
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
  }

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(currentIndex + (diff > 0 ? 1 : -1)); startAutoplay(); }
  }, { passive: true });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { goTo(currentIndex - 1); startAutoplay(); }
    if (e.key === "ArrowRight") { goTo(currentIndex + 1); startAutoplay(); }
  });

  // Set initial active and dot state
  updateDots();
  updateActiveSlide();
  startAutoplay();
}

// ==========================================
// PRODUCT CAROUSELS — infinite smooth auto-rotate
// Same technique as the hero slider: clone first/last for seamless loop
// ==========================================
function initCarousels() {
  const carousels = document.querySelectorAll('.product-carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    if (slides.length < 2) return;

    // Clone first and last slide to create seamless loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone  = slides[slides.length - 1].cloneNode(true);
    track.appendChild(firstClone);             // [clone-first] at end
    track.insertBefore(lastClone, slides[0]);  // [clone-last] at start
    // Final layout: [clone-last] [slide1] ... [slideN] [clone-first]

    const TOTAL = slides.length;
    let current = 1;           // start at real slide 1
    let isTransitioning = false;
    let snapTimer = null;      // fallback for hidden carousels (see finishTransition)

    // Jump to start position without animation
    track.style.transition = 'none';
    track.style.transform   = `translateX(-${current * 100}%)`;

    // Jump silently back to a real slide when hitting a clone, and clear the
    // transitioning lock. Normally triggered by 'transitionend', but that
    // event never fires while the carousel is inside a display:none tab
    // (CSS transitions don't run on unrendered elements), which would
    // otherwise leave isTransitioning stuck at true forever. snapTimer is a
    // fallback that self-heals that case; transitionend cancels it when it
    // fires first, so visible carousels are unaffected.
    function finishTransition() {
      if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; }
      if (current === TOTAL + 1) {
        // Was clone-first → jump to real first
        current = 1;
        track.style.transition = 'none';
        track.style.transform   = `translateX(-${current * 100}%)`;
      } else if (current === 0) {
        // Was clone-last → jump to real last
        current = TOTAL;
        track.style.transition = 'none';
        track.style.transform   = `translateX(-${current * 100}%)`;
      }
      isTransitioning = false;
    }

    function goNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      current++;
      track.style.transition = 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
      track.style.transform   = `translateX(-${current * 100}%)`;
      snapTimer = setTimeout(finishTransition, 700);
    }

    function goPrev() {
      if (isTransitioning) return;
      isTransitioning = true;
      current--;
      track.style.transition = 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
      track.style.transform   = `translateX(-${current * 100}%)`;
      snapTimer = setTimeout(finishTransition, 700);
    }

    track.addEventListener('transitionend', finishTransition);

    // Auto-advance every 4.5s
    let timer = setInterval(goNext, 4500);

    // Pause on hover — resume on leave
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
      timer = setInterval(goNext, 4500);
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      clearInterval(timer);
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goNext() : goPrev();
      }
      timer = setInterval(goNext, 4500);
    }, { passive: true });
  });
}

// updateCarousel kept for any legacy callers
function updateCarousel(track, index) {
  track.style.transform = `translateX(-${index * 100}%)`;
}

// Lightbox Functionality — event delegation (no DOM cloning)
function initLightbox() {
  // Create Lightbox DOM if it doesn't exist
  if (!document.getElementById('lightbox')) {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <button class="close-btn" aria-label="Cerrar">&times;</button>
      <img src="" alt="Imagen ampliada del producto">
    `;
    document.body.appendChild(lb);
  }

  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn    = lightbox.querySelector('.close-btn');

  // Make product images visually indicate they are clickable
  document.querySelectorAll('.product-carousel img, .gallery-img').forEach(img => {
    img.style.cursor = 'zoom-in';
  });

  // ── Event delegation: ONE listener on document, no DOM cloning ──
  // This avoids breaking the carousel's setInterval references
  document.addEventListener('click', function (e) {
    const img = e.target.closest('.product-carousel img, .gallery-img');
    if (!img) return;

    // Use data-src if lazyloaded, else src
    const src = img.dataset.src || img.src;
    if (!src || src.endsWith('undefined')) return;

    lightboxImg.src = src;
    lightboxImg.alt = img.alt || 'Imagen del producto';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  });

  // Close functionality
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);

  // Close on click outside image
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });

  // Touch swipe to close on mobile
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 80) closeLightbox();
  }, { passive: true });
}

// ==========================================
// COOKIE CONSENT BANNER
// ==========================================
function initCookieConsent() {
  const banner = document.querySelector(".cookie-consent-banner");
  if (!banner) return; // Exit if banner doesn't exist on this page

  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");
  const CONSENT_KEY = "edplit_cookie_consent";

  // Check if user has already made a choice
  const consent = localStorage.getItem(CONSENT_KEY);

  if (consent === "accepted") {
    // User already accepted, load Analytics immediately
    loadGoogleAnalytics();
  } else if (!consent) {
    // No choice made yet, show banner after a short delay
    setTimeout(() => {
      banner.classList.add("show");
    }, 1000);
  }

  // Handle Accept button
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem(CONSENT_KEY, "accepted");
      hideBanner();
      // Load Google Analytics after consent
      loadGoogleAnalytics();
    });
  }

  // Handle Reject button
  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      localStorage.setItem(CONSENT_KEY, "rejected");
      hideBanner();
    });
  }

  function loadGoogleAnalytics() {
    // Check if already loaded
    if (window.google_tag_manager) {
      console.log("Google Tag Manager ya está cargado");
      return;
    }

    // Load analytics.js (contains GTM code)
    const script = document.createElement("script");
    script.src = "/analytics.js";
    script.async = true;
    document.head.appendChild(script);
    console.log("Google Tag Manager cargado después del consentimiento");
  }

  function hideBanner() {
    banner.classList.remove("show");
    // Remove from DOM after animation completes
    setTimeout(() => {
      banner.style.display = "none";
    }, 400);
  }
}

// Initialize cookie consent when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCookieConsent);
} else {
  initCookieConsent();
}

// ==========================================
// FLOATING WHATSAPP BUTTON
// ==========================================
(function () {
  if (document.getElementById("whatsapp-float-btn")) return;
  const btn = document.createElement("a");
  btn.id = "whatsapp-float-btn";
  btn.className = "whatsapp-float";
  btn.href = "https://wa.me/34614825778";
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.setAttribute("aria-label", "Contactar por WhatsApp");
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
      -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475
      -.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
      .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207
      -.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
      -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2
      5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085
      1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.492
      a.75.75 0 0 0 .918.943l5.84-1.53A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373
      12-12S18.627 0 12 0zm0 21.75a9.73 9.73 0 0 1-4.962-1.355l-.356-.212-3.695.968
      .984-3.595-.232-.37A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25
      S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>`;
  document.body.appendChild(btn);
})();
