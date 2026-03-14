(function () {
  'use strict';

  // When user clicks Enter after countdown, redirect to main site:
  var REDIRECT_URL = 'https://auroraplayer.com';

  var TERMINAL_LINES = [
    '> ESTABLISHING_SECURE_CONNECTION...',
    '> ENCRYPTION: AES-256-GCM',
    '> HANDSHAKE: SUCCESS',
    '> AWAITING_OPERATOR_INPUT'
  ];

  // Countdown: disabled for now (set to false to re-enable 30-day countdown)
  var COUNTDOWN_ENABLED = false;

  // Countdown: 30 days from first visit (stored in sessionStorage for demo; use localStorage to persist across tabs)
  var TARGET_KEY = 'enter_page_countdown_target';
  var targetTime = (function () {
    if (!COUNTDOWN_ENABLED) return 0;
    var stored = sessionStorage.getItem(TARGET_KEY);
    if (stored) return parseInt(stored, 10);
    var t = Date.now() + 30 * 24 * 60 * 60 * 1000;
    sessionStorage.setItem(TARGET_KEY, String(t));
    return t;
  })();

  var timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  var countdownComplete = !COUNTDOWN_ENABLED;
  var isConnecting = false;
  var isConnected = false;

  var btn = document.getElementById('enter-btn');
  var btnText = document.getElementById('btn-text');
  var countdownWrap = document.getElementById('countdown-wrap');
  var cdDays = document.getElementById('cd-days');
  var cdHours = document.getElementById('cd-hours');
  var cdMins = document.getElementById('cd-mins');
  var cdSecs = document.getElementById('cd-secs');
  var terminalEl = document.getElementById('terminal-lines');
  var newsletterForm = document.getElementById('newsletter-form');
  var newsletterDone = document.getElementById('newsletter-done');
  var newsletterEmail = document.getElementById('newsletter-email');
  var bgVideo = document.getElementById('bg-video');

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    if (!COUNTDOWN_ENABLED) {
      if (countdownWrap) countdownWrap.classList.add('hidden');
      updateButton();
      return;
    }
    var now = Date.now();
    var diff = targetTime - now;
    if (diff <= 0) {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      countdownComplete = true;
      if (countdownWrap) countdownWrap.classList.remove('hidden');
      updateButton();
      return;
    }
    timeLeft = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
    if (countdownWrap) {
      countdownWrap.classList.remove('hidden');
      if (cdDays) cdDays.textContent = pad2(timeLeft.days);
      if (cdHours) cdHours.textContent = pad2(timeLeft.hours);
      if (cdMins) cdMins.textContent = pad2(timeLeft.minutes);
      if (cdSecs) cdSecs.textContent = pad2(timeLeft.seconds);
    }
    updateButton();
  }

  function updateButton() {
    if (!btn || !btnText) return;
    if (isConnected) {
      btn.disabled = true;
      btn.className = 'enter-btn state-connected';
      btnText.textContent = 'Connected';
      return;
    }
    if (isConnecting) {
      btn.disabled = true;
      btn.className = 'enter-btn state-connecting';
      btnText.textContent = 'Connecting...';
      return;
    }
    // Always show Coming Soon; no redirect for now
    btn.disabled = true;
    btn.className = 'enter-btn';
    btnText.textContent = 'Coming Soon';
    return;
  }

  function handleEnterClick() {
    // No redirect for now; do nothing
    return;
  }

  if (btn) {
    btn.addEventListener('click', handleEnterClick);
  }

  if (COUNTDOWN_ENABLED) setInterval(updateCountdown, 1000);
  updateCountdown();

  // Terminal typewriter
  var totalChars = TERMINAL_LINES.reduce(function (s, l) { return s + l.length; }, 0);
  var typedChars = 0;
  var terminalStart = Date.now() + 800;

  function tickTerminal() {
    var now = Date.now();
    if (now < terminalStart) {
      requestAnimationFrame(tickTerminal);
      return;
    }
    if (typedChars < totalChars) {
      typedChars += 1;
      renderTerminal();
    }
    requestAnimationFrame(tickTerminal);
  }

  function renderTerminal() {
    if (!terminalEl) return;
    var html = '';
    var remaining = typedChars;
    for (var i = 0; i < TERMINAL_LINES.length; i++) {
      var line = TERMINAL_LINES[i];
      var take = Math.max(0, Math.min(remaining, line.length));
      remaining -= line.length;
      var visible = line.slice(0, take);
      var cursor = take > 0 && take < line.length ? '<span class="cursor">|</span>' : '';
      html += '<p>' + escapeHtml(visible) + cursor + '</p>';
    }
    terminalEl.innerHTML = html;
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  requestAnimationFrame(tickTerminal);

  // Newsletter form
  var submitted = localStorage.getItem('enter_page_newsletter') === '1';
  if (newsletterForm && newsletterDone && newsletterEmail) {
    if (submitted) {
      newsletterForm.classList.add('hidden');
      newsletterDone.classList.remove('hidden');
    } else {
      newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (newsletterEmail.value.trim()) {
          localStorage.setItem('enter_page_newsletter', '1');
          newsletterForm.classList.add('hidden');
          newsletterDone.classList.remove('hidden');
        }
      });
    }
  }

  // Background: video only. If it fails to load, page keeps solid dark background (no fallback image).
  if (bgVideo) {
    bgVideo.addEventListener('error', function () {
      bgVideo.classList.add('hidden');
    });
    function tryPlay() {
      if (bgVideo && !bgVideo.classList.contains('hidden')) {
        var p = bgVideo.play();
        if (p && p.catch) p.catch(function () {});
      }
    }
    bgVideo.addEventListener('loadeddata', tryPlay);
    bgVideo.addEventListener('canplay', tryPlay);
    bgVideo.load();
    tryPlay();
  }
})();
