/* ============================================================
   main.js — Cinematic Portfolio
   Rocket Launch Intro + Scroll Portals + Click-to-Expand
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     0. PRELOADER — hide once all assets are ready
     ============================================================ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (preloader) preloader.classList.add('hidden');
  });
  // Fallback: hide after 4 seconds max even if load event is slow
  setTimeout(() => {
    if (preloader) preloader.classList.add('hidden');
  }, 4000);

  /* ============================================================
     1. CINEMATIC LAUNCH SEQUENCE - Real CanSat video
     ============================================================ */
  const overlay = document.getElementById('launchOverlay');
  const scene = document.getElementById('launchScene');
  const launchVideo = document.getElementById('launchVideo');
  const countdownTimer = document.getElementById('countdownTimer');
  const countdownStatus = document.getElementById('countdownStatus');
  const launchSides = document.getElementById('launchSides');
  const launchFlash = document.getElementById('launchFlash');
  const skipBtn = document.getElementById('launchSkip');

  let launchDone = false;

  function endLaunch() {
    if (launchDone) return;
    launchDone = true;
    if (launchVideo) launchVideo.pause();
    if (overlay) overlay.classList.add('done');
    document.body.classList.remove('launch-active');
    setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 1000);
  }

  function runLaunchSequence() {
    document.body.classList.add('launch-active');

    // Start video playback
    if (launchVideo) {
      launchVideo.currentTime = 0;
      launchVideo.play().catch(() => {});
    }

    // T-5: Systems check
    if (countdownTimer) countdownTimer.textContent = 'T-00:05';
    if (countdownStatus) { countdownStatus.textContent = 'SYSTEMS CHECK'; countdownStatus.className = 'countdown-status'; }

    // T-4
    setTimeout(() => {
      if (countdownTimer) countdownTimer.textContent = 'T-00:04';
      if (countdownStatus) { countdownStatus.textContent = 'FUEL PRESSURIZED'; countdownStatus.className = 'countdown-status'; }
    }, 800);

    // T-3
    setTimeout(() => {
      if (countdownTimer) countdownTimer.textContent = 'T-00:03';
      if (countdownStatus) { countdownStatus.textContent = 'ALL SYSTEMS GO'; countdownStatus.className = 'countdown-status go'; }
    }, 1600);

    // T-2
    setTimeout(() => {
      if (countdownTimer) countdownTimer.textContent = 'T-00:02';
      if (countdownStatus) { countdownStatus.textContent = 'IGNITION ARMED'; countdownStatus.className = 'countdown-status warning'; }
    }, 2400);

    // T-1
    setTimeout(() => {
      if (countdownTimer) countdownTimer.textContent = 'T-00:01';
      if (countdownStatus) { countdownStatus.textContent = 'IGNITION SEQUENCE'; countdownStatus.className = 'countdown-status warning'; }
    }, 3200);

    // LIFTOFF — show the big text, flash, shake
    setTimeout(() => {
      if (countdownTimer) { countdownTimer.textContent = 'LIFTOFF'; countdownTimer.className = 'countdown-timer liftoff'; }
      if (countdownStatus) { countdownStatus.textContent = 'ALL ENGINES NOMINAL'; countdownStatus.className = 'countdown-status go'; }
      if (scene) scene.classList.add('shaking');
      if (launchFlash) { launchFlash.classList.add('flash'); setTimeout(() => launchFlash.classList.remove('flash'), 200); }
      setTimeout(() => { if (scene) scene.classList.remove('shaking'); }, 400);
    }, 4000);

    // Fade out side panels after liftoff so user can watch the launch video clearly
    setTimeout(() => {
      if (launchSides) { launchSides.style.opacity = '0'; launchSides.style.transition = 'opacity 1.2s ease'; }
    }, 5000);

    // Let the viewer enjoy the launch for ~4 seconds after liftoff, then fade out
    setTimeout(endLaunch, 8500);
  }

  if (skipBtn) skipBtn.addEventListener('click', endLaunch);

  if (sessionStorage.getItem('launchSeen')) {
    if (overlay) overlay.style.display = 'none';
    document.body.classList.remove('launch-active');
  } else {
    runLaunchSequence();
    sessionStorage.setItem('launchSeen', '1');
  }

  /* ============================================================
     2. SCROLL PROGRESS
     ============================================================ */
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }, { passive: true });

  /* ============================================================
     3. NAVBAR
     ============================================================ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ============================================================
     4. HAMBURGER
     ============================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('active') ? 'true' : 'false');
    });
    navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ============================================================
     5. SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); const t = document.querySelector(link.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth' }); });
  });

  /* ============================================================
     6. HERO LETTERS
     ============================================================ */
  const heroName = document.getElementById('heroName');
  if (heroName) {
    const text = heroName.textContent;
    heroName.innerHTML = '';
    text.split('').forEach(char => {
      if (char === ' ') { heroName.appendChild(Object.assign(document.createElement('span'), { className: 'space' })); }
      else { const s = document.createElement('span'); s.className = 'letter'; s.textContent = char; heroName.appendChild(s); }
    });
    const startDelay = sessionStorage.getItem('launchSeen_prev') ? 400 : 3500;
    setTimeout(() => {
      heroName.querySelectorAll('.letter').forEach((l, i) => setTimeout(() => l.classList.add('visible'), i * 50));
    }, startDelay);
  }
  // Mark for future visits
  sessionStorage.setItem('launchSeen_prev', '1');

  /* ============================================================
     7. TYPEWRITER
     ============================================================ */
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const full = typeEl.textContent; typeEl.textContent = '';
    const typeDelay = sessionStorage.getItem('launchSeen_prev2') ? 1800 : 4800;
    setTimeout(() => {
      let i = 0;
      const cursor = document.createElement('span'); cursor.className = 'cursor'; typeEl.appendChild(cursor);
      (function type() {
        if (i < full.length) { typeEl.insertBefore(document.createTextNode(full[i]), cursor); i++; setTimeout(type, 35 + Math.random() * 25); }
      })();
    }, typeDelay);
  }
  sessionStorage.setItem('launchSeen_prev2', '1');

  /* ============================================================
     8. STARFIELD (background)
     ============================================================ */
  const starfield = document.getElementById('starfield');
  if (starfield) {
    [{ count: 120, size: 1, opacity: 0.6, cls: 'star-layer-1' },
     { count: 70, size: 1.5, opacity: 0.35, cls: 'star-layer-2' },
     { count: 40, size: 2, opacity: 0.18, cls: 'star-layer-3' }].forEach(cfg => {
      const layer = document.createElement('div');
      layer.className = `star-layer ${cfg.cls}`;
      const shadows = [];
      for (let i = 0; i < cfg.count; i++) {
        shadows.push(`${Math.random()*2500}px ${Math.random()*2500}px 0 ${cfg.size}px rgba(255,255,255,${cfg.opacity})`);
      }
      layer.style.boxShadow = shadows.join(',');
      starfield.appendChild(layer);
    });
  }

  /* ============================================================
     9. SCROLL PORTALS — zoom-through
     ============================================================ */
  const portals = document.querySelectorAll('.scroll-portal');
  function updatePortals() {
    portals.forEach(portal => {
      const rect = portal.getBoundingClientRect();
      const sectionH = portal.offsetHeight;
      const scrolledIn = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolledIn / (sectionH - window.innerHeight)));
      const svgWrap = portal.querySelector('.portal-svg-wrap');
      const textWrap = portal.querySelector('.portal-text');
      if (!svgWrap || !textWrap) return;

      let scale, svgOpacity;
      if (progress < 0.5) {
        const p = progress / 0.5;
        scale = 0.5 + p * 0.5;
        svgOpacity = 0.08 + p * 0.35;
      } else {
        const p = (progress - 0.5) / 0.5;
        scale = 1.0 + p * 2.5;
        svgOpacity = 0.43 - p * 0.43;
      }
      svgWrap.style.transform = `scale(${scale})`;
      svgWrap.style.opacity = svgOpacity;

      let textOpacity, textY;
      if (progress < 0.3) { textOpacity = 0; textY = 40; }
      else if (progress < 0.5) { const p = (progress - 0.3) / 0.2; textOpacity = p; textY = 40 - p * 40; }
      else if (progress < 0.8) { textOpacity = 1; textY = 0; }
      else { const p = (progress - 0.8) / 0.2; textOpacity = 1 - p; textY = -p * 30; }
      textWrap.style.opacity = textOpacity;
      textWrap.style.transform = `translateY(${textY}px)`;
    });
  }
  window.addEventListener('scroll', updatePortals, { passive: true });
  updatePortals();

  /* ============================================================
     10. HOVER-TO-PREVIEW PROJECT SHOWCASE
     ============================================================ */
  const projectListItems = document.querySelectorAll('.project-list-item');
  const previewPanels = document.querySelectorAll('.preview-panel');

  let activateProject = function(index) {
    projectListItems.forEach(item => item.classList.remove('active'));
    previewPanels.forEach(panel => panel.classList.remove('active'));

    const targetItem = document.querySelector(`.project-list-item[data-project="${index}"]`);
    const targetPanel = document.querySelector(`.preview-panel[data-preview="${index}"]`);

    if (targetItem) targetItem.classList.add('active');
    if (targetPanel) targetPanel.classList.add('active');
  };

  projectListItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      activateProject(item.dataset.project);
    });
    // Also support click/tap for mobile
    item.addEventListener('click', () => {
      activateProject(item.dataset.project);
    });
  });

  /* ============================================================
     11. CLICK-TO-EXPAND CARDS (Experience, Leadership only)
     ============================================================ */
  document.querySelectorAll('[data-expandable]').forEach(card => {
    // Keyboard + screen-reader support
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', 'false');
    card.addEventListener('keydown', (e) => {
      if (e.target !== card) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking a link inside
      if (e.target.closest('a')) return;
      
      // Close other expanded cards in the same section
      const parent = card.closest('.timeline');
      if (parent) {
        parent.querySelectorAll('.expandable-card.expanded').forEach(other => {
          if (other !== card) { other.classList.remove('expanded'); other.setAttribute('aria-expanded', 'false'); }
        });
      }
      
      card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', card.classList.contains('expanded') ? 'true' : 'false');
    });
  });

  /* ============================================================
     11b. THEME TOGGLE
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('dk-theme');

  // Apply saved theme or detect OS preference
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.classList.add('light-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('dk-theme', isLight ? 'light' : 'dark');
    });
  }

  /* ============================================================
     12. CERTIFICATE IMAGE ZOOM
     ============================================================ */
  document.querySelectorAll('.cert-image').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // Don't toggle the parent card
      if (img.classList.contains('zoomed')) {
        // Unzoom
        img.classList.remove('zoomed');
        const overlay = document.querySelector('.cert-overlay');
        if (overlay) overlay.remove();
      } else {
        // Zoom
        const overlay = document.createElement('div');
        overlay.className = 'cert-overlay';
        overlay.addEventListener('click', () => {
          img.classList.remove('zoomed');
          overlay.remove();
        });
        document.body.appendChild(overlay);
        img.classList.add('zoomed');
      }
    });
  });

  /* ============================================================
     12. SCROLL REVEAL
     ============================================================ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); revealObs.unobserve(e.target); }
    });
  }, { rootMargin: '-8% 0px -8% 0px', threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-scale, .reveal-left').forEach(el => revealObs.observe(el));

  /* ============================================================
     13. COUNTER ANIMATION
     ============================================================ */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = 'true';
        const target = parseFloat(e.target.dataset.count);
        const dec = String(target).includes('.') ? String(target).split('.')[1].length : 0;
        const start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / 2000, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = dec ? (eased * target).toFixed(dec) : Math.round(eased * target);
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* Custom cursor removed */


  /* ============================================================
     15. ACTIVE NAV
     ============================================================ */
  const navAll = document.querySelectorAll('.nav-link');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAll.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));

  /* ============================================================
     INTERACTIVE PARTICLE CANVAS — Cursor-Connected Stars
     ============================================================ */
  const pCanvas = document.getElementById('particleCanvas');
  if (pCanvas) {
    const pCtx = pCanvas.getContext('2d');
    let pW, pH;
    const particles = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 150;
    const CURSOR_RADIUS = 200;
    let mouseX = -1000, mouseY = -1000;

    function resizeParticleCanvas() {
      pW = pCanvas.width = window.innerWidth;
      pH = pCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    // Track mouse
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.4 + 0.15
      });
    }

    function getParticleColors() {
      const isLight = document.body.classList.contains('light-theme');
      return {
        dot: isLight ? 'rgba(8,145,178,' : 'rgba(0,229,255,',
        line: isLight ? 'rgba(8,145,178,' : 'rgba(0,229,255,'
      };
    }

    function animateParticles() {
      pCtx.clearRect(0, 0, pW, pH);
      const colors = getParticleColors();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = pW;
        if (p.x > pW) p.x = 0;
        if (p.y < 0) p.y = pH;
        if (p.y > pH) p.y = 0;

        // Draw dot
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = colors.dot + p.opacity + ')';
        pCtx.fill();

        // Connect to cursor if within radius
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_RADIUS) {
          const alpha = (1 - dist / CURSOR_RADIUS) * 0.35;
          pCtx.beginPath();
          pCtx.moveTo(p.x, p.y);
          pCtx.lineTo(mouseX, mouseY);
          pCtx.strokeStyle = colors.line + alpha + ')';
          pCtx.lineWidth = 0.6;
          pCtx.stroke();
        }

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < CONNECTION_DIST) {
            // Only draw if cursor is near at least one particle
            const cursorNearP = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2) < CURSOR_RADIUS;
            const cursorNearP2 = Math.sqrt((p2.x - mouseX) ** 2 + (p2.y - mouseY) ** 2) < CURSOR_RADIUS;

            if (cursorNearP || cursorNearP2) {
              const alpha = (1 - dist2 / CONNECTION_DIST) * 0.15;
              pCtx.beginPath();
              pCtx.moveTo(p.x, p.y);
              pCtx.lineTo(p2.x, p2.y);
              pCtx.strokeStyle = colors.line + alpha + ')';
              pCtx.lineWidth = 0.4;
              pCtx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ============================================================
     COVER FLOW GALLERY & LIGHTBOX
     ============================================================ */
  const cfSlides = document.querySelectorAll('.cf-slide');
  const cfCounter = document.getElementById('cfCounter');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');

  if (cfSlides.length > 0 && lightboxModal) {
    let currentIndex = 0;
    const totalSlides = cfSlides.length;
    let autoPlayInterval;

    // Build image data
    const galleryImages = Array.from(cfSlides).map(slide => {
      return {
        src: slide.querySelector('img').src,
        caption: slide.querySelector('.cf-caption-title').textContent + ' - ' + slide.querySelector('.cf-caption-sub').textContent
      };
    });

    let progress = 0;
    let targetProgress = 0;
    let animationFrameId;

    function renderCoverFlow() {
      // Smooth lerp for buttery transitions
      progress += (targetProgress - progress) * 0.05;

      cfSlides.forEach((slide, i) => {
        // Calculate shortest distance on a circle
        let diff = (i - progress) % totalSlides;
        if (diff < -totalSlides / 2) diff += totalSlides;
        if (diff > totalSlides / 2) diff -= totalSlides;

        let absX = Math.abs(diff);
        let sign = Math.sign(diff);

        let translateX, scale, blur, opacity, rotateY, zIndex;
        zIndex = Math.round(100 - absX * 10);

        if (absX <= 1) {
          translateX = sign * absX * 150;
          scale = 1.2 - absX * 0.35; // 1.2 to 0.85
          blur = absX * 1.5;
          opacity = 1 - absX * 0.2;
          rotateY = -sign * absX * 25;
        } else if (absX <= 2) {
          translateX = sign * (150 + (absX - 1) * 110);
          scale = 0.85 - (absX - 1) * 0.2; // 0.85 to 0.65
          blur = 1.5 + (absX - 1) * 2;
          opacity = 0.8 - (absX - 1) * 0.5;
          rotateY = -sign * 25;
        } else {
          translateX = sign * (260 + (absX - 2) * 90);
          scale = 0.65 - (absX - 2) * 0.2; // 0.65 to 0.45
          blur = 3.5 + (absX - 2) * 2;
          opacity = Math.max(0, 0.3 - (absX - 2) * 0.3);
          rotateY = -sign * 25;
        }

        slide.style.transform = `translateX(${translateX}px) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`;
        slide.style.filter = `blur(${blur}px)`;
        slide.style.opacity = opacity;
        slide.style.zIndex = zIndex;

        if (absX < 0.5) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update indicator based on nearest integer
      if (cfCounter) {
        let currentIndex = Math.round(progress) % totalSlides;
        if (currentIndex < 0) currentIndex += totalSlides;
        const num = String(currentIndex + 1).padStart(2, '0');
        const total = String(totalSlides).padStart(2, '0');
        cfCounter.textContent = `${num} / ${total}`;
      }

      animationFrameId = requestAnimationFrame(renderCoverFlow);
    }

    function nextSlide() {
      targetProgress = Math.ceil(targetProgress);
      if (targetProgress - progress < 0.1) {
          targetProgress += 1;
      }
    }

    function prevSlide() {
      targetProgress = Math.floor(targetProgress);
      if (progress - targetProgress < 0.1) {
          targetProgress -= 1;
      }
    }
    
    function startAutoPlay() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      autoPlayInterval = setInterval(nextSlide, 3500);
    }
    
    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    document.getElementById('cfNext')?.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
    
    document.getElementById('cfPrev')?.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    cfSlides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        if (slide.classList.contains('active')) {
          // Open Lightbox
          openLightbox(i);
        } else {
          // Calculate distance to this slide
          let diff = (i - progress) % totalSlides;
          if (diff < -totalSlides / 2) diff += totalSlides;
          if (diff > totalSlides / 2) diff -= totalSlides;
          targetProgress += diff;
          resetAutoPlay();
        }
      });
      
      slide.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      slide.addEventListener('mouseleave', startAutoPlay);
    });

    // Lightbox Logic
    let currentLightboxIndex = 0;

    function openLightbox(index) {
      currentLightboxIndex = index;
      lightboxImage.src = galleryImages[index].src;
      lightboxImage.alt = galleryImages[index].caption;
      lightboxCaption.textContent = galleryImages[index].caption;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      clearInterval(autoPlayInterval);
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      resetAutoPlay();
    }

    function navigateLightbox(direction) {
      currentLightboxIndex = (currentLightboxIndex + direction + totalSlides) % totalSlides;
      lightboxImage.src = galleryImages[currentLightboxIndex].src;
      lightboxImage.alt = galleryImages[currentLightboxIndex].caption;
      lightboxCaption.textContent = galleryImages[currentLightboxIndex].caption;
    }

    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.getElementById('lightboxPrev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
    document.getElementById('lightboxNext')?.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });

    document.addEventListener('keydown', (e) => {
      if (lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      } else {
        // Allow arrow keys for cover flow if it's visible in viewport
        const cfRect = document.querySelector('.coverflow-wrapper')?.getBoundingClientRect();
        if (cfRect && cfRect.top >= 0 && cfRect.bottom <= window.innerHeight) {
          if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
          }
          if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
          }
        }
      }
    });

    // Mobile swipe for cover flow
    const isTouchForCF = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchForCF) {
      const cfViewport = document.querySelector('.cf-viewport');
      if (cfViewport) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let isSwiping = false;

        cfViewport.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
          isSwiping = true;
        }, { passive: true });

        cfViewport.addEventListener('touchmove', (e) => {
          if (!isSwiping) return;
          const diffX = Math.abs(e.changedTouches[0].screenX - touchStartX);
          const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
          if (diffX > diffY && diffX > 10) {
            e.preventDefault();
          }
        }, { passive: false });

        cfViewport.addEventListener('touchend', (e) => {
          if (!isSwiping) return;
          isSwiping = false;
          touchEndX = e.changedTouches[0].screenX;
          const swipeDistance = touchEndX - touchStartX;
          const minSwipe = 50;
          if (Math.abs(swipeDistance) > minSwipe) {
            if (swipeDistance < 0) { nextSlide(); resetAutoPlay(); }
            else { prevSlide(); resetAutoPlay(); }
          }
        }, { passive: true });
      }
    }

    // Initialize
    renderCoverFlow();
    startAutoPlay();
  }

  /* ============================================================
     MICRO-INTERACTION 1: MAGNETIC BUTTONS
     Buttons subtly pull toward the cursor when nearby.
     ============================================================ */
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const pullStrength = 0.3;
        btn.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ============================================================
     MICRO-INTERACTION 2: TEXT SCRAMBLE ON PROJECT SWITCH
     Project titles scramble through random chars before revealing.
     ============================================================ */
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function textScramble(element, finalText) {
    const length = finalText.length;
    let iteration = 0;
    const totalIterations = 8;
    const interval = 25;

    element.classList.add('scrambling');

    const scrambleInterval = setInterval(() => {
      element.textContent = finalText
        .split('')
        .map((char, index) => {
          if (index < iteration) return finalText[index];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      iteration += length / totalIterations;

      if (iteration >= length) {
        element.textContent = finalText;
        element.classList.remove('scrambling');
        clearInterval(scrambleInterval);
      }
    }, interval);
  }

  // Patch the existing activateProject function to add scramble
  const originalActivateProject = activateProject;
  activateProject = function(index) {
    originalActivateProject(index);
    const targetPanel = document.querySelector(`.preview-panel[data-preview="${index}"]`);
    if (targetPanel) {
      const titleEl = targetPanel.querySelector('.preview-title');
      if (titleEl) {
        const finalText = titleEl.textContent;
        textScramble(titleEl, finalText);
      }
    }
  };

  /* ============================================================
     MICRO-INTERACTION 3: MOBILE TOOLTIP TAP
     On mobile, tapping a skill tag shows its tooltip briefly.
     ============================================================ */
  if (isTouchDevice) {
    document.querySelectorAll('.skill-tag[data-tooltip]').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        // Remove any other visible tooltips
        document.querySelectorAll('.skill-tag.tooltip-visible').forEach(other => {
          if (other !== tag) other.classList.remove('tooltip-visible');
        });
        tag.classList.toggle('tooltip-visible');
        // Auto-hide after 2 seconds
        setTimeout(() => tag.classList.remove('tooltip-visible'), 2000);
      });
    });

    // Dismiss tooltips when tapping elsewhere
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.skill-tag')) {
        document.querySelectorAll('.skill-tag.tooltip-visible').forEach(t => {
          t.classList.remove('tooltip-visible');
        });
      }
    });
  }
  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
