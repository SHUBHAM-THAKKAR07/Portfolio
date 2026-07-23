/* ====================================
   CUSTOM CURSOR
   ==================================== */
(function initCustomCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="cursor-label"></span>';
  document.body.appendChild(cursor);

  const label = cursor.querySelector('.cursor-label');
  document.documentElement.classList.add('custom-cursor-active');

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovering = false;
  let activeLabel = '';

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function animate() {
    currentX = lerp(currentX, targetX, 0.12);
    currentY = lerp(currentY, targetY, 0.12);
    const s = isHovering ? 3 : 1;
    cursor.style.transform =
      `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%)) scale(${s})`;
    requestAnimationFrame(animate);
  }

  animate();

  function getCursorLabel(el) {
    if (el.hasAttribute('data-cursor')) return el.dataset.cursor || '';
    if (el.tagName === 'A' && (el.target === '_blank' || el.href.startsWith('http'))) {
      return 'OPEN';
    }
    return '';
  }

  let hoveredEl = null;

  document.addEventListener(
    'mouseover',
    (e) => {
      const target = e.target.closest('a, button, [data-cursor]');
      if (target && target !== hoveredEl) {
        hoveredEl = target;
        activeLabel = getCursorLabel(target);
        // Elements with data-cursor="" are explicitly opted out
        if (target.hasAttribute('data-cursor') && activeLabel === '') {
          isHovering = false;
          cursor.classList.remove('is-hovering');
          label.textContent = '';
          return;
        }
        label.textContent = activeLabel;
        isHovering = true;
        cursor.classList.add('is-hovering');
      }
    },
    true,
  );

  document.addEventListener(
    'mouseout',
    (e) => {
      const target = e.target.closest('a, button, [data-cursor]');
      if (target && target === hoveredEl) {
        const related = e.relatedTarget
          ? e.relatedTarget.closest('a, button, [data-cursor]')
          : null;
        if (!related) {
          hoveredEl = null;
          isHovering = false;
          cursor.classList.remove('is-hovering');
        }
      }
    },
    true,
  );
})();

/* ====================================
   SCROLL PROGRESS SPINE
   ==================================== */
(function initScrollSpine() {
  if (window.innerWidth < 768) return;

  const spine = document.createElement('div');
  spine.className = 'scroll-spine';

  const fill = document.createElement('div');
  fill.className = 'scroll-spine-fill';
  spine.appendChild(fill);

  const ticks = document.createElement('div');
  ticks.className = 'scroll-spine-ticks';
  spine.appendChild(ticks);

  document.body.appendChild(spine);

  const SECTION_IDS = ['about', 'work', 'skills', 'experience', 'contact'];

  function getSections() {
    return SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);
  }

  function renderTicks() {
    ticks.innerHTML = '';
    const sections = getSections();
    if (!sections.length) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const pct = Math.min((top / scrollable) * 100, 100);

      const tick = document.createElement('div');
      tick.className = 'scroll-spine-tick';
      tick.style.top = pct + '%';
      ticks.appendChild(tick);
    });
  }

  function updateFill() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(window.scrollY / scrollable, 1);
    fill.style.transform = 'scaleY(' + progress + ')';
  }

  renderTicks();
  updateFill();

  window.addEventListener('scroll', updateFill, { passive: true });
  window.addEventListener('resize', renderTicks);
})();

/* ====================================
   ABOUT SECTION — TIMELINE ENTRANCE
   ==================================== */
(function initTimelineAnimation() {
  const aboutSection = document.getElementById('about');
  const items = document.querySelectorAll('.timeline-item');
  if (!aboutSection || !items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          items.forEach((item) => {
            item.classList.add('is-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(aboutSection);
})();
