// ===== DARK MODE =====
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);
themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

// ===== ANNOUNCEMENT BAR =====
document.getElementById('annClose').addEventListener('click', () => {
  const bar = document.getElementById('annBar');
  bar.style.maxHeight = bar.scrollHeight + 'px';
  requestAnimationFrame(() => {
    bar.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease';
    bar.style.maxHeight = '0'; bar.style.opacity = '0'; bar.style.padding = '0';
  });
  setTimeout(() => bar.remove(), 420);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  highlightNav();
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
document.getElementById('mobClose').addEventListener('click', () => mobileMenu.classList.remove('open'));
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileMenu.querySelectorAll('.mob-link, .btn').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ===== STATS COUNTER =====
const counters = document.querySelectorAll('.stat-num[data-target]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.getAttribute('data-target');
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, 28);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

// ===== FAQ =====
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      const ans = item.querySelector('.faq-a');
      ans.style.maxHeight = ans.scrollHeight + 'px';
    }
  });
});

// ===== TESTIMONIALS CAROUSEL =====
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
let current = 0;
const total = dots.length;

function goTo(index) {
  current = (index + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
dots.forEach(d => d.addEventListener('click', () => goTo(+d.getAttribute('data-index'))));

// Auto-play
let autoplay = setInterval(() => goTo(current + 1), 5000);
track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
track.parentElement.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current + 1), 5000); });

// ===== FAB SPEED DIAL =====
const fabMain = document.getElementById('fabMain');
const fabOptions = document.getElementById('fabOptions');
let fabOpen = false;

fabMain.addEventListener('click', e => {
  e.stopPropagation();
  fabOpen = !fabOpen;
  fabMain.classList.toggle('open', fabOpen);
  fabOptions.classList.toggle('show', fabOpen);
  fabMain.textContent = fabOpen ? '+' : '📞';
  if (fabOpen) { const p = fabMain.querySelector('.fab-pulse'); if(p) fabMain.appendChild(p); }
});

document.addEventListener('click', () => {
  if (fabOpen) { fabOpen = false; fabMain.classList.remove('open'); fabOptions.classList.remove('show'); fabMain.textContent = '📞'; }
});

fabOptions.addEventListener('click', e => e.stopPropagation());

// ===== FAB: close when enquiry clicked =====
const enqBtn = fabOptions.querySelector('.fab-btn.enq');
if (enqBtn) enqBtn.addEventListener('click', () => {
  fabOpen = false; fabMain.classList.remove('open'); fabOptions.classList.remove('show'); fabMain.textContent = '📞';
});

// ===== SCROLL TOP =====
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== ACTIVE NAV HIGHLIGHT =====
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  let active = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) active = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + active));
}

// ===== DESTINATION CARD TILT =====
document.querySelectorAll('.dest-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== FORM SUBMIT =====
function handleSubmit() {
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  if (!name || !email) { showToast('Please enter your name and email.', 'error'); return; }
  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.innerHTML = '✅ Request Sent!';
    showToast('Thank you ' + name + '! We will contact you soon at ' + email, 'success');
    setTimeout(() => {
      btn.disabled = false; btn.innerHTML = 'Book Free Consultation ✈️';
      ['cf-name','cf-email','cf-phone','cf-msg'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('cf-dest').value = '';
    }, 3500);
  }, 1200);
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  document.getElementById('toast')?.remove();
  const t = document.createElement('div');
  t.id = 'toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', bottom:'90px', left:'50%', transform:'translateX(-50%) translateY(20px)',
    background: type === 'success' ? 'linear-gradient(135deg,#1B3A7A,#2451A8)' : '#E8572A',
    color:'#fff', padding:'14px 28px', borderRadius:'12px',
    boxShadow:'0 8px 32px rgba(0,0,0,0.2)', fontFamily:'Plus Jakarta Sans,sans-serif',
    fontSize:'0.9rem', fontWeight:'600', zIndex:'99999', opacity:'0',
    transition:'all 0.4s ease', maxWidth:'90vw', textAlign:'center'
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 4500);
}
