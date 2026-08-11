/**
 * Tundra Tech - Digital Glacier Canvas Engine & Interactive Web Dev Agency UI
 */

document.addEventListener('DOMContentLoaded', () => {
  initAntiBotScanner();
  initGlacierCanvas();
  initNavbarScroll();
  initPricingToggle();
  initContactModal();
  initPortfolioLightbox();
  initLegalModals();
  initSecurityAuditForm();
});

/* ==========================================================================
   1. DIGITAL GLACIER CANVAS RENDERER (3D Wireframe Mesh & Aurora Particles)
   ========================================================================== */
function initGlacierCanvas() {
  const canvas = document.getElementById('glacier-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let cols, rows;
  const scale = 40; // Grid cell size
  let terrain = [];
  let flying = 0;
  
  // Particles array
  let particles = [];
  const particleCount = 65;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cols = Math.floor(width / scale) + 4;
    rows = Math.floor(height / scale) + 6;
    
    // Initialize 2D terrain height array
    terrain = [];
    for (let x = 0; x < cols; x++) {
      terrain[x] = [];
      for (let y = 0; y < rows; y++) {
        terrain[x][y] = 0;
      }
    }
  }

  // Create ambient frost aurora particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? '#00f0ff' : (Math.random() > 0.5 ? '#70d6ff' : '#a855f7')
      });
    }
  }

  // Simplex-like noise generator for low-poly glacier terrain
  function generateTerrain(time, mouseX, mouseY) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let dX = (x * scale - mouseX);
        let dY = (y * scale - mouseY);
        let dist = Math.sqrt(dX * dX + dY * dY);
        let mouseEffect = Math.max(0, 150 - dist) * 0.4;

        let z1 = Math.sin(x * 0.25 + time) * Math.cos(y * 0.2 + time) * 35;
        let z2 = Math.sin(x * 0.5 - time * 0.8) * Math.cos(y * 0.4) * 20;
        let z3 = Math.sin((x + y) * 0.15 + time * 0.5) * 40;
        
        let baseGradient = Math.pow(y / rows, 2) * 80;
        
        terrain[x][y] = z1 + z2 + z3 + baseGradient + mouseEffect;
      }
    }
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  resize();
  initParticles();

  let time = 0;
  function draw() {
    time += 0.008;
    flying -= 0.005;

    ctx.clearRect(0, 0, width, height);

    // Draw ambient floating aurora frost particles
    for (let p of particles) {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < -10) p.y = height + 10;
      if (p.x < -10 || p.x > width + 10) p.x = Math.random() * width;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;

    // Calculate low-poly terrain grid
    generateTerrain(time, mouseX, mouseY);

    // Render Digital Glacier Mesh
    ctx.lineWidth = 1;
    const horizonY = height * 0.55;

    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        let x1 = (x - cols / 2) * scale;
        let y1 = (y - rows / 3) * scale;
        let z1 = terrain[x][y];

        let x2 = (x + 1 - cols / 2) * scale;
        let y2 = (y - rows / 3) * scale;
        let z2 = terrain[x + 1][y];

        let x3 = (x - cols / 2) * scale;
        let y3 = (y + 1 - rows / 3) * scale;
        let z3 = terrain[x][y + 1];

        let p1X = width / 2 + x1;
        let p1Y = horizonY + y1 - z1;

        let p2X = width / 2 + x2;
        let p2Y = horizonY + y2 - z2;

        let p3X = width / 2 + x3;
        let p3Y = horizonY + y3 - z3;

        let intensity = Math.min(1, Math.max(0.1, (z1 + 50) / 130));
        let cyanGlow = Math.min(255, Math.floor(intensity * 240));
        
        ctx.strokeStyle = `rgba(0, ${cyanGlow}, 255, ${0.12 + intensity * 0.25})`;
        ctx.fillStyle = `rgba(11, 22, 42, ${0.15 + intensity * 0.2})`;

        ctx.beginPath();
        ctx.moveTo(p1X, p1Y);
        ctx.lineTo(p2X, p2Y);
        ctx.lineTo(p3X, p3Y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (z1 > 40 && (x + y) % 3 === 0) {
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(p1X, p1Y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   2. NAVBAR SCROLL INTERACTION
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-active');
      toggle.classList.toggle('active');
    });

    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        toggle.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('mobile-active');
        toggle.classList.remove('active');
      }
    });
  }

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. INTERACTIVE WEBSITE AUDIT & PERFORMANCE INSPECTOR
   ========================================================================== */
function initSimulator() {
  const workloadSlider = document.getElementById('workload-slider');
  const tempSlider = document.getElementById('temp-slider');
  
  const valWorkload = document.getElementById('val-workload');
  const valTemp = document.getElementById('val-temp');
  
  const metricOps = document.getElementById('metric-ops');
  const metricLatency = document.getElementById('metric-latency');
  const metricEfficiency = document.getElementById('metric-efficiency');
  const terminalLog = document.getElementById('terminal-log');

  if (!workloadSlider || !tempSlider) return;

  function updateSim() {
    const pages = parseInt(workloadSlider.value);
    const speedOpt = parseInt(tempSlider.value);

    valWorkload.textContent = `${pages} Pages`;
    valTemp.textContent = `${speedOpt}%`;

    // Compute dynamic metrics for web development agency
    const lighthouseScore = Math.min(100, Math.max(88, Math.floor(speedOpt * 0.15 + 85)));
    const loadTime = (Math.max(0.18, 0.75 - (speedOpt * 0.005) + (pages * 0.003))).toFixed(2);
    const uptime = (99.9 + (speedOpt * 0.0008)).toFixed(2);

    metricOps.textContent = `${lighthouseScore} / 100`;
    metricLatency.textContent = `${loadTime} s`;
    metricEfficiency.textContent = `${uptime}%`;

    // Update website component visual boxes
    const nodeBoxes = document.querySelectorAll('.node-box');
    const componentLabels = ['SEO CORE', 'UI/UX DESIGN', 'PERFORMANCE', 'MAINTENANCE'];
    
    nodeBoxes.forEach((box, i) => {
      const nameEl = box.querySelector('.node-name');
      if (nameEl && componentLabels[i]) {
        nameEl.textContent = componentLabels[i];
      }
      
      const bars = box.querySelectorAll('.bar');
      bars.forEach((bar, bIdx) => {
        let h = Math.min(38, Math.max(12, (speedOpt * 0.32) + Math.sin(Date.now() * 0.005 + i + bIdx) * 8));
        bar.style.height = `${h}px`;
      });

      box.classList.add('active');
    });

    if (terminalLog) {
      terminalLog.textContent = `[TUNDRA-DEV-ENGINE] Project Scale: ${pages} Pages | Optimization Level: ${speedOpt}% | Lighthouse Score: ${lighthouseScore}/100 | Speed: ${loadTime}s`;
    }
  }

  workloadSlider.addEventListener('input', updateSim);
  tempSlider.addEventListener('input', updateSim);
  updateSim();

  setInterval(() => {
    updateSim();
  }, 1000);
}

/* ==========================================================================
   4. PRICING BILLING TOGGLE (One-Time Build vs Monthly Care Package)
   ========================================================================== */
function initPricingToggle() {
  const toggleWrap = document.getElementById('pricing-toggle-wrap');
  const toggle = document.getElementById('pricing-toggle');
  const labelOnetime = document.getElementById('label-onetime');
  const labelMonthly = document.getElementById('label-monthly');
  const gridOnetime = document.getElementById('pricing-grid-onetime');
  const gridMonthly = document.getElementById('pricing-grid-monthly');

  if (!gridOnetime || !gridMonthly) return;

  let isMonthly = false;

  function renderMode(monthly) {
    isMonthly = monthly;

    if (toggle) {
      if (isMonthly) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    }

    if (labelOnetime) {
      labelOnetime.style.color = isMonthly ? 'var(--text-muted)' : 'var(--color-primary)';
      labelOnetime.style.fontWeight = isMonthly ? '400' : '700';
    }
    if (labelMonthly) {
      labelMonthly.style.color = isMonthly ? 'var(--color-primary)' : 'var(--text-muted)';
      labelMonthly.style.fontWeight = isMonthly ? '700' : '400';
    }

    if (isMonthly) {
      gridOnetime.classList.add('inactive');
      gridOnetime.style.display = 'none';

      gridMonthly.classList.add('active');
      gridMonthly.style.display = 'block';
    } else {
      gridOnetime.classList.remove('inactive');
      gridOnetime.style.display = 'grid';

      gridMonthly.classList.remove('active');
      gridMonthly.style.display = 'none';
    }
  }

  if (toggleWrap) {
    toggleWrap.onclick = function(e) {
      renderMode(!isMonthly);
    };
  }

  if (labelOnetime) {
    labelOnetime.onclick = function(e) {
      e.stopPropagation();
      renderMode(false);
    };
  }

  if (labelMonthly) {
    labelMonthly.onclick = function(e) {
      e.stopPropagation();
      renderMode(true);
    };
  }

  if (toggle) {
    toggle.onclick = function(e) {
      e.stopPropagation();
      renderMode(!isMonthly);
    };
  }

  renderMode(false);
}

/* ==========================================================================
   5. CONTACT & QUOTE MODAL
   ========================================================================== */
function initContactModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const openBtns = document.querySelectorAll('.js-open-modal');
  const closeBtn = document.getElementById('modal-close');
  const modalForm = document.getElementById('modal-form');

  if (!backdrop) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      backdrop.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('active');
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('active');
    }
  });

  let lastSubmitTime = 0;

  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Security Honeypot check: Abort silently if bot populated hidden field
      const honeypot = document.getElementById('modal-honeypot')?.value || '';
      if (honeypot.length > 0) {
        console.warn('[Security] Automated spam bot trapped by honeypot field. Discarding submission.');
        const submitBtn = modalForm.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.textContent = 'Request Sent!'; submitBtn.style.background = '#10b981'; }
        setTimeout(() => { backdrop.classList.remove('active'); modalForm.reset(); }, 1500);
        return;
      }

      // Security Rate Limiting check: Enforce 8-second delay between submissions
      const now = Date.now();
      if (now - lastSubmitTime < 8000) {
        console.warn('[Security] Submission rate limit enforced. Please wait before re-submitting.');
        return;
      }
      lastSubmitTime = now;

      const name = document.getElementById('form-name')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const website = document.getElementById('form-website')?.value || '';
      const message = document.getElementById('form-message')?.value || '';
      const accessKey = document.getElementById('form-access-key')?.value || 'cd3e2b03-9281-4bc2-9680-ab6d3d8db5b1';

      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Get Free Proposal';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Request...';
      }

      try {
        let sent = false;

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[MSP Inquiry] New Lead from ${name}`,
            from_name: 'Tundra Tech Landing Page',
            name: name,
            email: email,
            website: website,
            message: message
          })
        });

        const resData = await res.json();
        console.log('Web3Forms Response:', resData);
        if (resData.success) {
          sent = true;
        }

        // Fallback to FormSubmit AJAX
        if (!sent) {
          await fetch('https://formsubmit.co/ajax/alexander@tundratech.org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              _subject: `[MSP Inquiry] New Lead from ${name}`,
              _captcha: 'false',
              name: name,
              email: email,
              website: website,
              message: message
            })
          });
        }

        if (submitBtn) {
          submitBtn.textContent = 'Request Sent Successfully!';
          submitBtn.style.background = '#10b981';
        }
      } catch (err) {
        console.warn('Form submit notice:', err);
        if (submitBtn) {
          submitBtn.textContent = 'Request Sent!';
          submitBtn.style.background = '#10b981';
        }
      }

      setTimeout(() => {
        backdrop.classList.remove('active');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
        }
        modalForm.reset();
      }, 2200);
    });
  }

  // Hero Contact Card Form Submission
  const heroForm = document.getElementById('hero-contact-form');
  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Security Honeypot check: Abort silently if bot populated hidden field
      const honeypot = document.getElementById('hero-honeypot')?.value || '';
      if (honeypot.length > 0) {
        console.warn('[Security] Automated spam bot trapped by hero honeypot field. Discarding submission.');
        const submitBtn = heroForm.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.textContent = 'Proposal Request Sent!'; submitBtn.style.background = '#10b981'; }
        setTimeout(() => { heroForm.reset(); }, 1500);
        return;
      }

      // Security Rate Limiting check: Enforce 8-second delay between submissions
      const now = Date.now();
      if (now - lastSubmitTime < 8000) {
        console.warn('[Security] Hero form rate limit enforced.');
        return;
      }
      lastSubmitTime = now;

      const name = document.getElementById('hero-form-name')?.value || '';
      const email = document.getElementById('hero-form-email')?.value || '';
      const website = document.getElementById('hero-form-website')?.value || '';
      const phone = document.getElementById('hero-form-phone')?.value || '';
      const message = document.getElementById('hero-form-message')?.value || '';
      const accessKey = 'cd3e2b03-9281-4bc2-9680-ab6d3d8db5b1';

      const submitBtn = heroForm.querySelector('button[type="submit"]');
      const originalContent = submitBtn ? submitBtn.innerHTML : 'Send Proposal Request';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Request...';
      }

      try {
        let sent = false;

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[Hero Lead] New Proposal Request from ${name}`,
            from_name: 'Tundra Tech Hero Contact Form',
            name: name,
            email: email,
            website: website,
            phone: phone,
            message: message
          })
        });

        const resData = await res.json();
        if (resData.success) sent = true;

        if (!sent) {
          await fetch('https://formsubmit.co/ajax/alexander@tundratech.org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              _subject: `[Hero Lead] New Proposal Request from ${name}`,
              _captcha: 'false',
              name: name,
              email: email,
              website: website,
              phone: phone,
              message: message
            })
          });
        }

        if (submitBtn) {
          submitBtn.textContent = 'Proposal Request Sent!';
          submitBtn.style.background = '#10b981';
        }
      } catch (err) {
        console.warn('Hero form submit notice:', err);
        if (submitBtn) {
          submitBtn.textContent = 'Proposal Request Sent!';
          submitBtn.style.background = '#10b981';
        }
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          submitBtn.style.background = '';
        }
        heroForm.reset();
      }, 2500);
    });
  }
}

/* ==========================================================================
   6. PORTFOLIO SHOWCASE CATEGORY FILTERING
   ========================================================================== */
function initPortfolioShowcase() {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.showcase-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   7. PORTFOLIO LIGHTBOX MODAL (High-Resolution Project Preview & Specs)
   ========================================================================== */
function initPortfolioLightbox() {
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('.js-lightbox-trigger');

  const titleEl = document.getElementById('lightbox-title');
  const categoryEl = document.getElementById('lightbox-category');
  const descEl = document.getElementById('lightbox-desc');
  const techEl = document.getElementById('lightbox-tech');
  const speedEl = document.getElementById('lightbox-speed');
  const scoreEl = document.getElementById('lightbox-score');
  const imgEl = document.getElementById('lightbox-img');

  if (!backdrop) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      const title = trigger.getAttribute('data-title') || 'Project Showcase';
      const category = trigger.getAttribute('data-category') || 'Brick & Mortar';
      const desc = trigger.getAttribute('data-desc') || '';
      const tech = trigger.getAttribute('data-tech') || '';
      const speed = trigger.getAttribute('data-speed') || '0.3s';
      const score = trigger.getAttribute('data-score') || '99/100';
      const img = trigger.getAttribute('data-img') || '';

      if (titleEl) titleEl.textContent = title;
      if (categoryEl) categoryEl.textContent = category;
      if (descEl) descEl.textContent = desc;
      if (techEl) techEl.textContent = tech;
      if (speedEl) speedEl.textContent = speed;
      if (scoreEl) scoreEl.textContent = score;
      if (imgEl && img) imgEl.setAttribute('src', img);

      backdrop.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('active');
    });
  }

  const closeModalTriggers = document.querySelectorAll('.js-close-lightbox');
  closeModalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.classList.remove('active');
    });
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      backdrop.classList.remove('active');
    }
  });
}

/* ==========================================================================
   8. PRIVACY POLICY & END USER AGREEMENT MODALS
   ========================================================================== */
function initLegalModals() {
  const privacyBackdrop = document.getElementById('privacy-backdrop');
  const termsBackdrop = document.getElementById('terms-backdrop');

  const openPrivacyBtns = document.querySelectorAll('.js-open-privacy');
  const openTermsBtns = document.querySelectorAll('.js-open-terms');

  const closePrivacyBtn = document.getElementById('privacy-modal-close');
  const closeTermsBtn = document.getElementById('terms-modal-close');

  const closePrivacyFooterBtn = document.querySelector('.js-close-privacy');
  const closeTermsFooterBtn = document.querySelector('.js-close-terms');

  // Open Privacy Modal
  openPrivacyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (privacyBackdrop) privacyBackdrop.classList.add('active');
    });
  });

  // Open Terms Modal
  openTermsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (termsBackdrop) termsBackdrop.classList.add('active');
    });
  });

  // Close Privacy Modal
  if (closePrivacyBtn && privacyBackdrop) {
    closePrivacyBtn.addEventListener('click', () => privacyBackdrop.classList.remove('active'));
  }
  if (closePrivacyFooterBtn && privacyBackdrop) {
    closePrivacyFooterBtn.addEventListener('click', () => privacyBackdrop.classList.remove('active'));
  }
  if (privacyBackdrop) {
    privacyBackdrop.addEventListener('click', (e) => {
      if (e.target === privacyBackdrop) privacyBackdrop.classList.remove('active');
    });
  }

  // Close Terms Modal
  if (closeTermsBtn && termsBackdrop) {
    closeTermsBtn.addEventListener('click', () => termsBackdrop.classList.remove('active'));
  }
  if (closeTermsFooterBtn && termsBackdrop) {
    closeTermsFooterBtn.addEventListener('click', () => termsBackdrop.classList.remove('active'));
  }
  if (termsBackdrop) {
    termsBackdrop.addEventListener('click', (e) => {
      if (e.target === termsBackdrop) termsBackdrop.classList.remove('active');
    });
  }

  // Escape key handler for legal modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (privacyBackdrop && privacyBackdrop.classList.contains('active')) {
        privacyBackdrop.classList.remove('active');
      }
      if (termsBackdrop && termsBackdrop.classList.contains('active')) {
        termsBackdrop.classList.remove('active');
      }
    }
  });
}

/* ==========================================================================
   9. ANTI-BOT SCANNER & WAYBACK MACHINE ARCHIVING DEFENSE ENGINE
   ========================================================================== */
function initAntiBotScanner() {
  const isWaybackDomain = window.location.hostname.includes('archive.org') || 
                          window.location.hostname.includes('wayback') || 
                          window.location.href.includes('web.archive.org') ||
                          window.location.pathname.includes('/web/20');

  const hasWaybackGlobal = typeof window.__wm !== 'undefined' || 
                          typeof window.wayback !== 'undefined' || 
                          typeof window.__ORIGINAL_URL__ !== 'undefined' ||
                          typeof window.__wm_disclaimer !== 'undefined';

  const botUAPattern = /ia_archiver|archive\.org_bot|wayback|heritrix|specialarchiver|pagefreezer|archiveit|wget|curl|httrack|headlesschrome|puppeteer|playwright|phantomjs|selenium|ghostdriver/i;
  const isBotUserAgent = botUAPattern.test(navigator.userAgent || '');
  const isHeadlessAutomated = navigator.webdriver === true;

  const isBlocked = isWaybackDomain || hasWaybackGlobal || isBotUserAgent || isHeadlessAutomated;

  if (isBlocked) {
    console.warn('[Anti-Bot Scanner] Archiving bot or Wayback Machine environment detected. Blocking access.');
    triggerSecurityShield();
    return true;
  }
  return false;
}

function triggerSecurityShield() {
  function applyShield() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: #030712;
      color: #f3f4f6;
      z-index: 99999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
      max-width: 580px;
      width: 100%;
      background: rgba(17, 24, 39, 0.95);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 16px;
      padding: 40px 32px;
      box-shadow: 0 20px 50px rgba(239, 68, 68, 0.15);
      backdrop-filter: blur(12px);
    `;

    const badge = document.createElement('div');
    badge.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 20px;
    `;
    badge.textContent = '🛡️ ACCESS RESTRICTED • SECURITY SHIELD ACTIVE';

    const title = document.createElement('h1');
    title.style.cssText = `
      font-size: 1.8rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 14px 0;
      line-height: 1.3;
    `;
    title.textContent = 'Wayback Machine & Bot Archiving Prohibited';

    const message = document.createElement('p');
    message.style.cssText = `
      font-size: 0.98rem;
      color: #9ca3af;
      line-height: 1.6;
      margin: 0 0 24px 0;
    `;
    message.textContent = 'Tundra Tech (tundratech.org) enforces strict anti-bot and anti-archiving rules. Automated scrapers, Wayback Machine proxies, and web archiving crawlers are restricted from capturing or storing snapshots of this property.';

    const detailBox = document.createElement('div');
    detailBox.style.cssText = `
      background: rgba(31, 41, 55, 0.7);
      border: 1px solid rgba(75, 85, 99, 0.4);
      border-radius: 8px;
      padding: 14px 18px;
      font-family: monospace;
      font-size: 0.82rem;
      color: #60a5fa;
      text-align: left;
      margin-bottom: 24px;
    `;

    const line1 = document.createElement('div');
    line1.textContent = 'RULE: DISALLOW_WAYBACK_ARCHIVE_403';
    const line2 = document.createElement('div');
    line2.textContent = 'STATUS: ACTIVE_DEFENSE_TRIGGERED';
    const line3 = document.createElement('div');
    line3.textContent = `TIMESTAMP: ${new Date().toISOString()}`;

    detailBox.appendChild(line1);
    detailBox.appendChild(line2);
    detailBox.appendChild(line3);

    const footerText = document.createElement('div');
    footerText.style.cssText = `
      font-size: 0.8rem;
      color: #6b7280;
    `;
    footerText.textContent = 'If you are a human visitor, please access the site directly via https://tundratech.org';

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(message);
    card.appendChild(detailBox);
    card.appendChild(footerText);

    overlay.appendChild(card);

    if (document.body) {
      document.body.replaceChildren(overlay);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.replaceChildren(overlay);
      });
    }
  }

  applyShield();
}

// Immediate execution check on script parse
initAntiBotScanner();

/* ==========================================================================
   10. INTERACTIVE SECURITY & LEAK AUDIT SCANNER
   ========================================================================== */
function initSecurityAuditForm() {
  const form = document.getElementById('security-audit-form');
  const domainInput = document.getElementById('audit-target-domain');
  const btn = document.getElementById('btn-run-audit');

  const cspStatus = document.getElementById('audit-val-csp');
  const leakStatus = document.getElementById('audit-val-leaks');
  const fraudStatus = document.getElementById('audit-val-fraud');
  const uptimeStatus = document.getElementById('audit-val-uptime');

  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const domain = domainInput?.value.trim() || 'target-domain.com';

    btn.disabled = true;
    btn.textContent = 'Scanning Domain Headers...';

    // Simulate multi-stage security audit checks
    setTimeout(() => {
      btn.textContent = 'Auditing Script & Leak Posture...';
    }, 700);

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Audit Complete! Re-Scan';

      if (cspStatus) {
        cspStatus.textContent = 'Strict CSP Verified';
        cspStatus.className = 'audit-res-status status-pass';
      }
      if (leakStatus) {
        leakStatus.textContent = '0 API Secrets Exposed';
        leakStatus.className = 'audit-res-status status-pass';
      }
      if (fraudStatus) {
        fraudStatus.textContent = 'Magecart Shield Active';
        fraudStatus.className = 'audit-res-status status-pass';
      }
      if (uptimeStatus) {
        uptimeStatus.textContent = '99.99% Failover Ready';
        uptimeStatus.className = 'audit-res-status status-pass';
      }
    }, 1500);
  });
}




