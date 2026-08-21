// Generate waveform divider bars
document.querySelectorAll('.waveform').forEach(function (el) {
  const bars = 60;
  let html = '';
  for (let i = 0; i < bars; i++) {
    const h = 4 + Math.round(Math.abs(Math.sin(i * 0.45)) * 20 + Math.random() * 6);
    html += '<span style="height:' + h + 'px"></span>';
  }
  el.innerHTML = html;
});

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); });
  });
}

// Scroll-based active link highlighting (main page only)
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
if (sections.length && navAnchors.length) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) { a.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
}
