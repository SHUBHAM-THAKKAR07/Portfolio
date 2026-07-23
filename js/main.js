/* ====================================
   THEME TOGGLE
   ==================================== */
const THEME_KEY = 'coza-portfolio-theme';

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

applyTheme(getPreferredTheme());

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(e.matches ? 'light' : 'dark');
  }
});

window.toggleTheme = toggleTheme;

/* ====================================
   NAV SCROLL
   ==================================== */
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });

/* ====================================
   MOBILE NAV
   ==================================== */
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');

function openMobileNav() {
  hamburgerBtn.classList.add('open');
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  hamburgerBtn.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburgerBtn && mobileNav) {
  hamburgerBtn.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobileNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });
}

/* ====================================
   ENTRANCE ANIMATIONS
   ==================================== */
function triggerEntranceAnimations() {
  const els = document.querySelectorAll('.animate-on-load');
  requestAnimationFrame(() => {
    els.forEach((el) => {
      el.classList.add('animate-visible');
    });
  });
}

if (document.readyState === 'complete') {
  triggerEntranceAnimations();
} else {
  window.addEventListener('load', triggerEntranceAnimations);
}

/* ====================================
   CONTACT FORM — MAILTO HANDLER
   ==================================== */
(function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    var name = fd.get('name');
    var email = fd.get('email');
    var message = fd.get('message');
    var subject = encodeURIComponent('Portfolio Contact from ' + name);
    var body = encodeURIComponent(
      'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message,
    );
    window.location.href =
      'mailto:shubhamthakkar2007@gmail.com?subject=' + subject + '&body=' + body;
  });
})();

/* ====================================
   LAST UPDATED FOOTER
   ==================================== */
(function setLastUpdated() {
  var el = document.getElementById('last-updated');
  if (el && window.LAST_UPDATED) {
    el.textContent = 'Last updated: ' + window.LAST_UPDATED;
  }
})();

/* ====================================
   PROJECTS — DYNAMIC RENDERING + FILTER + SKELETON
   ==================================== */
(function renderProjects() {
  var container = document.getElementById('work-projects');
  if (!container || !window.PROJECTS) return;

  var currentFilter = 'All';

  function displayUrl(project) {
    if (project.liveUrl) {
      try { return new URL(project.liveUrl).hostname; } catch(e) { return project.liveUrl; }
    }
    return project.title.toLowerCase().replace(/\s+/g, '') + '.local';
  }

  function renderProjectCards(filter) {
    var filtered = filter === 'All'
      ? window.PROJECTS
      : window.PROJECTS.filter(function (p) { return p.category === filter; });

    container.innerHTML = filtered
      .map(function (project, i) {
        var originalIndex = window.PROJECTS.indexOf(project);
        var reversed = originalIndex % 2 !== 0;
        return (
          '<article class="project-card" style="opacity:0;transition:opacity 300ms ease">' +
            '<div class="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 min-w-0' +
              (reversed ? ' lg:flex-row-reverse' : '') +
            '">' +
              '<div class="project-image-wrapper flex-1 min-w-0">' +
                '<div class="browser-chrome">' +
                  '<div class="browser-header">' +
                    '<div class="browser-dots">' +
                       '<span></span><span></span><span></span>' +
                    '</div>' +
                    '<span class="browser-url">' + displayUrl(project) + '</span>' +
                  '</div>' +
                  '<div class="browser-body">' +
                    '<div class="project-skeleton"></div>' +
                    '<img class="project-img" src="' + project.image + '" alt="' + project.title + ' screenshot" loading="lazy" style="opacity:0;transition:opacity 200ms ease" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />' +
                    '<div class="project-image-fallback" style="display:none"><span>' + project.title.charAt(0) + '</span></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="project-info flex-1 min-w-0">' +
                '<span class="project-number">// ' +
                  String(originalIndex + 1).padStart(2, '0') +
                '</span>' +
                '<h3 class="project-title">' + project.title + '</h3>' +
                (project.badge
                  ? '<span class="project-badge">' + project.badge + '</span>'
                  : '') +
                '<div class="project-detail">' +
                  '<h4>Problem</h4>' +
                  '<p>' + project.problem + '</p>' +
                '</div>' +
                '<div class="project-detail">' +
                  '<h4>Solution</h4>' +
                  '<p>' + project.solution + '</p>' +
                '</div>' +
                '<div class="project-tech">' +
                  project.techStack
                    .map(function (t) { return '<span class="tech-tag">' + t + '</span>'; })
                    .join('') +
                '</div>' +
                '<div class="project-links">' +
                  (project.liveUrl
                    ? '<a href="' + project.liveUrl + '" target="_blank" rel="noopener noreferrer" class="project-link min-h-[44px] inline-flex items-center">Live Site &rarr;</a>'
                    : '') +
                  (project.codeUrl
                    ? '<a href="' + project.codeUrl + '" target="_blank" rel="noopener noreferrer" class="project-link min-h-[44px] inline-flex items-center">Source Code &rarr;</a>'
                    : '') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</article>'
        );
      })
      .join('');

    // Stagger fade-in and attach skeleton loaders
    requestAnimationFrame(function () {
      var cards = container.querySelectorAll('.project-card');
      cards.forEach(function (card, i) {
        setTimeout(function () { card.style.opacity = '1'; }, i * 100);
      });

      var imgs = container.querySelectorAll('.project-img');
      imgs.forEach(function (img) {
        function onLoaded() {
          img.style.opacity = '1';
          var skeleton = img.previousElementSibling;
          if (skeleton && skeleton.classList.contains('project-skeleton')) {
            skeleton.style.opacity = '0';
            setTimeout(function () { skeleton.remove(); }, 300);
          }
        }
        if (img.complete) {
          onLoaded();
        } else {
          img.addEventListener('load', onLoaded);
          img.addEventListener('error', onLoaded);
        }
      });
    });
  }

  renderProjectCards(currentFilter);

  // Filter buttons
  var filterContainer = document.getElementById('project-filters');
  if (filterContainer) {
    filterContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-pill');
      if (!btn) return;
      var filter = btn.dataset.filter;
      if (filter === currentFilter) return;

      filterContainer.querySelectorAll('.filter-pill').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      currentFilter = filter;
      renderProjectCards(filter);
    });
  }
})();
