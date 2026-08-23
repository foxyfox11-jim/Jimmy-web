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

// Unified media control: only one player (YouTube or SoundCloud) plays at a time
const mediaPlayers = { yt: {}, sc: {} };

function pauseAllMediaExcept(type, id) {
  Object.keys(mediaPlayers.yt).forEach(function (k) {
    if (type === 'yt' && k === id) return;
    const p = mediaPlayers.yt[k];
    if (p && typeof p.pauseVideo === 'function') p.pauseVideo();
  });
  Object.keys(mediaPlayers.sc).forEach(function (k) {
    if (type === 'sc' && k === id) return;
    const p = mediaPlayers.sc[k];
    if (p && typeof p.pause === 'function') p.pause();
  });
}

function pauseYouTubeIn(el) {
  if (!el) return;
  const iframe = el.querySelector ? el.querySelector('iframe[id^="yt-"]') : null;
  if (iframe && mediaPlayers.yt[iframe.id] && typeof mediaPlayers.yt[iframe.id].pauseVideo === 'function') {
    mediaPlayers.yt[iframe.id].pauseVideo();
  }
}

window.onYouTubeIframeAPIReady = function () {
  document.querySelectorAll('iframe[id^="yt-"]').forEach(function (iframe) {
    const id = iframe.id;
    mediaPlayers.yt[id] = new YT.Player(id, {
      events: {
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.PLAYING) pauseAllMediaExcept('yt', id);
        }
      }
    });
  });
};

window.addEventListener('load', function () {
  if (typeof SC === 'undefined') return;
  document.querySelectorAll('iframe[id^="sc-"]').forEach(function (iframe) {
    const id = iframe.id;
    const widget = SC.Widget(id);
    mediaPlayers.sc[id] = widget;
    widget.bind(SC.Widget.Events.PLAY, function () {
      pauseAllMediaExcept('sc', id);
    });
  });
});

// Carousel navigation (Work section: photo/video clips per category)

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

  // Fallback: the last section can't be scrolled into the middle detection
  // zone once the page hits its bottom, so force it active when at bottom.
  window.addEventListener('scroll', function () {
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
    if (atBottom) {
      const lastSection = sections[sections.length - 1];
      const lastLink = document.querySelector('.nav-links a[href="#' + lastSection.id + '"]');
      if (lastLink) {
        navAnchors.forEach(function (a) { a.classList.remove('active'); });
        lastLink.classList.add('active');
      }
    }
  });
}
