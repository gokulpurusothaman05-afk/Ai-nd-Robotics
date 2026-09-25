/**
 * STACKLY - AI & ROBOTICS ECOSYSTEM
 * Interactivity: Navigation, Feature Tabs, Video Lightbox, Accordion FAQ,
 * Counter Animations, Strict Gmail Validation & Dashboard Routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCounters();
  initFeatureTabs();
  initAccordionFAQ();
  initVideoModal();
  init404Redirects();
  initFormsValidation();
  initAuthSession();
  initTerminalSimulation();
  initDashboardNav();
});

/* -------------------------------------------------------------
   1. MOBILE NAVIGATION DRAWER
   ------------------------------------------------------------- */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileDrawer.classList.add('open');
        hamburgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close when clicking any link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* -------------------------------------------------------------
   2. NUMBER COUNTERS ANIMATION
   ------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.count-up-number-animation');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : (target % 1 !== 0 ? 1 : 0);
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = target * easeOut;

          if (decimals > 0) {
            el.textContent = current.toFixed(decimals);
          } else {
            el.textContent = Math.floor(current).toLocaleString();
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
          }
        };

        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* -------------------------------------------------------------
   3. FEATURE TABS SWITCHER
   ------------------------------------------------------------- */
function initFeatureTabs() {
  const tabBtns = document.querySelectorAll('.feature-tab-btn');
  const tabContents = document.querySelectorAll('.feature-tab-content');

  if (!tabBtns.length || !tabContents.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const featureId = btn.getAttribute('data-feature');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        if (content.id === `featureContent${featureId}`) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   4. FAQ ACCORDION
   ------------------------------------------------------------- */
function initAccordionFAQ() {
  const accordions = document.querySelectorAll('.accordion-wrapper.v2');
  if (!accordions.length) return;

  accordions.forEach(acc => {
    acc.addEventListener('click', (e) => {
      // Toggle
      const isActive = acc.classList.contains('active');
      accordions.forEach(a => a.classList.remove('active'));
      if (!isActive) {
        acc.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
   5. VIDEO / MEDIA REDIRECTION TO 404
   ------------------------------------------------------------- */
function initVideoModal() {
  const openBtn = document.getElementById('openVideoBtn');
  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }
}

/* -------------------------------------------------------------
   6. 404 REDIRECTOR FOR UNLINKED ROUTES
   ------------------------------------------------------------- */
function init404Redirects() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#' || href === 'javascript:void(0);') {
      if (link.classList.contains('dash-logout-btn') || link.closest('.primary-button') || link.id === 'openVideoBtn') {
        return;
      }
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

/* -------------------------------------------------------------
   7. GMAIL VALIDATION HELPER
   ------------------------------------------------------------- */
function isValidGmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  return regex.test(email.trim());
}

/* -------------------------------------------------------------
   8. FORMS VALIDATION & 404 REDIRECT (EXCEPT LOGIN & SIGNUP)
   ------------------------------------------------------------- */
function initFormsValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    // Exclude login and signup forms
    const formId = (form.id || '').toLowerCase();
    const formClass = (form.className || '').toLowerCase();
    const isAuthForm = formId.includes('login') || 
                       formId.includes('signup') || 
                       formId.includes('sign-up') || 
                       formId.includes('register') || 
                       formClass.includes('login') || 
                       formClass.includes('signup') || 
                       formClass.includes('sign-up') || 
                       formClass.includes('register') ||
                       (form.closest('.auth-page-section') && formId === 'stacklyloginform');

    if (isAuthForm) {
      return; // Authentication forms are handled separately by initAuthSession
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // HTML5 built-in validation (required fields, minlength, format, etc.)
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Check required text and textarea inputs for non-empty content
      const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      for (const input of requiredInputs) {
        if (!input.value || !input.value.trim()) {
          form.reportValidity();
          input.focus();
          return;
        }
      }

      // Validate email inputs with Gmail format requirement if present
      const emailInputs = form.querySelectorAll('input[type="email"]');
      for (const emailInput of emailInputs) {
        const email = emailInput.value.trim();
        if (!isValidGmail(email)) {
          alert('Access Restricted: Only authorized @gmail.com accounts are permitted.');
          emailInput.focus();
          return;
        }
      }

      // All form information is valid -> redirect to 404 page
      window.location.href = '404.html';
    });
  });
}

/* -------------------------------------------------------------
   9. AUTHENTICATION & ROLE ROUTING
   ------------------------------------------------------------- */
function initAuthSession() {
  const loginForm = document.getElementById('stacklyLoginForm');
  const roleButtons = document.querySelectorAll('.role-tab-btn');
  const roleInput = document.getElementById('selectedRole');
  const roleTitle = document.getElementById('loginRoleTitle');
  const alertBox = document.getElementById('authAlert');
  const emailInput = document.getElementById('authEmail');
  const passwordInput = document.getElementById('authPassword');

  // Role Toggle
  if (roleButtons.length && roleInput) {
    roleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        roleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const role = btn.getAttribute('data-role');
        roleInput.value = role;

        if (roleTitle) {
          roleTitle.textContent = role === 'admin' ? 'Admin Swarm Console' : 'Client Robotics Portal';
        }
      });
    });
  }

  // Submission with STRICT GMAIL ONLY validation & zero default credentials
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput?.value.trim() || '';
      const password = passwordInput?.value || '';
      const role = roleInput?.value || 'client';

      if (!email) {
        showAuthAlert('Please enter your account email.', 'error');
        return;
      }

      if (!isValidGmail(email)) {
        showAuthAlert('Access Restricted: Only valid @gmail.com accounts are permitted.', 'error');
        return;
      }

      if (!password || password.length < 4) {
        showAuthAlert('Please enter your access password (min 4 characters).', 'error');
        return;
      }

      showAuthAlert('Authentication confirmed. Establishing neural link...', 'success');

      sessionStorage.setItem('stackly_user', JSON.stringify({
        email: email,
        role: role
      }));

      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'client-dashboard.html';
        }
      }, 1000);
    });
  }

    function showAuthAlert(msg, type) {
    if (!alertBox) return;
    alertBox.className = `auth-feedback-box ${type}`;
    alertBox.textContent = msg;
    alertBox.style.display = 'block';
  }

  // Sign Up Form Handling
  const signupForm = document.getElementById('stacklySignupForm');
  const signupRoleButtons = document.querySelectorAll('.signup-role-tab-btn');
  const signupRoleInput = document.getElementById('signupSelectedRole');
  const signupRoleTitle = document.getElementById('signupRoleTitle');
  const signupAlertBox = document.getElementById('authSignupAlert');
  const signupNameInput = document.getElementById('authSignupName');
  const signupEmailInput = document.getElementById('authSignupEmail');
  const signupPasswordInput = document.getElementById('authSignupPassword');
  const signupConfirmPasswordInput = document.getElementById('authSignupConfirmPassword');

  if (signupRoleButtons.length && signupRoleInput) {
    signupRoleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        signupRoleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const role = btn.getAttribute('data-role');
        signupRoleInput.value = role;

        if (signupRoleTitle) {
          signupRoleTitle.textContent = role === 'admin' ? 'Create Admin Account' : 'Create Client Account';
        }
      });
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupNameInput?.value.trim() || '';
      const email = signupEmailInput?.value.trim() || '';
      const password = signupPasswordInput?.value || '';
      const confirmPassword = signupConfirmPasswordInput?.value || '';
      const role = signupRoleInput?.value || 'client';

      if (!name) {
        showSignupAlert('Please enter your full name.', 'error');
        return;
      }

      if (!isValidGmail(email)) {
        showSignupAlert('Access Restricted: Only valid @gmail.com accounts are permitted.', 'error');
        return;
      }

      if (!password || password.length < 4) {
        showSignupAlert('Please enter a password with at least 4 characters.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showSignupAlert('Passwords do not match. Please verify.', 'error');
        return;
      }

      showSignupAlert('Account registered successfully! Initializing neural dashboard...', 'success');

      sessionStorage.setItem('stackly_user', JSON.stringify({
        email: email,
        name: name,
        role: role
      }));

      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'client-dashboard.html';
        }
      }, 1000);
    });
  }

  function showSignupAlert(msg, type) {
    if (!signupAlertBox) return;
    signupAlertBox.className = `auth-feedback-box ${type}`;
    signupAlertBox.textContent = msg;
    signupAlertBox.style.display = 'block';
  }

  // Dashboard Session Check & Email display
  const userEmailDisplay = document.getElementById('sessionUserEmail');
  if (userEmailDisplay) {
    const raw = sessionStorage.getItem('stackly_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.email) userEmailDisplay.textContent = parsed.email;
      } catch (e) {}
    }
  }

  // Logout Handlers
  document.querySelectorAll('.dash-logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('stackly_user');
      window.location.href = 'login.html';
    });
  });
}

/* -------------------------------------------------------------
   10. TERMINAL FEED SIMULATION
   ------------------------------------------------------------- */
function initTerminalSimulation() {
  const terminal = document.getElementById('liveTerminalFeed');
  if (!terminal) return;

  const logs = [
    '[TELEMETRY] Chassis stability 99.98% optimal',
    '[TPU_CLUSTER] Zero-shot inference loop 0.72ms',
    '[SWARM_MESH] 4,812 nodes synchronized across global grid',
    '[SAFETY] LiDAR collision buffer active at 360°',
    '[KERNEL] Real-time thread priority locked: 0 ms delay'
  ];

  setInterval(() => {
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    const line = document.createElement('div');
    line.innerHTML = `[${new Date().toLocaleTimeString()}] <span style="color: #6ee7b7;">[TELEMETRY]</span> ${randomLog}`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    if (terminal.childNodes.length > 20) {
      terminal.removeChild(terminal.firstChild);
    }
  }, 4500);
}

/* -------------------------------------------------------------
   11. DASHBOARD SIDEBAR SECTION NAVIGATION
   ------------------------------------------------------------- */
function initDashboardNav() {
  const navLinks = document.querySelectorAll('.dash-nav-link');
  if (!navLinks.length) return;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // IntersectionObserver to auto-update active tab on scroll
  const sections = document.querySelectorAll('.dash-section');
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              navLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));
  }
}
