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

// Carousel navigation (Work section: photo/video clips per category)
const ytPlayers = {};

function pauseYouTubeIn(el) {
  if (!el) return;
  const iframe = el.querySelector ? el.querySelector('iframe[id^="yt-"]') : null;
  if (iframe && ytPlayers[iframe.id] && typeof ytPlayers[iframe.id].pauseVideo === 'function') {
    ytPlayers[iframe.id].pauseVideo();
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    Object.keys(ytPlayers).forEach(function (id) {
      const player = ytPlayers[id];
      if (player !== event.target && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
    });
  }
}

window.onYouTubeIframeAPIReady = function () {
  document.querySelectorAll('iframe[id^="yt-"]').forEach(function (iframe) {
    ytPlayers[iframe.id] = new YT.Player(iframe.id, {
      events: { onStateChange: onPlayerStateChange }
    });
  });
};

document.querySelectorAll('.carousel').forEach(function (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = track.children;
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  let index = 0;

  if (slides.length > 1) {
    prevBtn.hidden = false;
    nextBtn.hidden = false;
  }

  function update() {
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
  }

  if (prevBtn) prevBtn.addEventListener('click', function () {
    pauseYouTubeIn(slides[index]);
    index = (index - 1 + slides.length) % slides.length;
    update();
  });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    pauseYouTubeIn(slides[index]);
    index = (index + 1) % slides.length;
    update();
  });
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
