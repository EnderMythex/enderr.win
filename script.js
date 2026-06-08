const translations = {
  en: {
    description: 'developer • trader<br>building stuff on the internet.',
    links: {
      twitter: 'twitter',
      discord: 'discord',
      axiom: 'axiom',
      grass: 'grass',
      status: 'status',
      projects: 'projects',
      stats: 'stats',
      email: 'email'
    },
    projects: {
      hint: 'click anywhere to go back'
    },
    stats: {
      replies: 'replies',
      likes: 'likes',
      claims: 'claims',
      flames: 'flames',
      hint: 'click anywhere to go back',
      lastAction: 'last action: {action} • {time}',
      never: 'never',
      offline: 'stats offline',
      loading: '…'
    },
    copy: '© {year} - All rights reserved'
  },
  fr: {
    description: 'développeur • trader<br>crée des trucs sur internet.',
    links: {
      twitter: 'twitter',
      discord: 'discord',
      axiom: 'axiom',
      grass: 'grass',
      status: 'statut',
      projects: 'projets',
      stats: 'stats',
      email: 'e-mail'
    },
    projects: {
      hint: 'cliquez ailleurs pour revenir'
    },
    stats: {
      replies: 'réponses',
      likes: 'likes',
      claims: 'réclamations',
      flames: 'flames',
      hint: 'cliquez ailleurs pour revenir',
      lastAction: 'dernière action : {action} • {time}',
      never: 'jamais',
      offline: 'stats hors-ligne',
      loading: '…'
    },
    copy: '© {year} - Tous droits réservés'
  },
  ja: {
    description: 'デベロッパー • トレーダー<br>インターネットで何かを作っています。',
    links: {
      twitter: 'twitter',
      discord: 'discord',
      axiom: 'axiom',
      grass: 'grass',
      status: 'ステータス',
      projects: 'プロジェクト',
      stats: '統計',
      email: 'メール'
    },
    projects: {
      hint: 'クリックで戻る'
    },
    stats: {
      replies: 'リプライ',
      likes: 'いいね',
      claims: 'クレーム',
      flames: 'フレーム',
      hint: 'クリックで戻る',
      lastAction: '最終アクション: {action} • {time}',
      never: 'なし',
      offline: '統計オフライン',
      loading: '…'
    },
    copy: '© {year} - 無断転載禁止'
  },
  ru: {
    description: 'разработчик • трейдер<br>создаю вещи в интернете.',
    links: {
      twitter: 'twitter',
      discord: 'discord',
      axiom: 'axiom',
      grass: 'grass',
      status: 'статус',
      projects: 'проекты',
      stats: 'статистика',
      email: 'почта'
    },
    projects: {
      hint: 'нажмите для возврата'
    },
    stats: {
      replies: 'ответы',
      likes: 'лайки',
      claims: 'клеймы',
      flames: 'огни',
      hint: 'нажмите для возврата',
      lastAction: 'последнее действие: {action} • {time}',
      never: 'никогда',
      offline: 'статистика недоступна',
      loading: '…'
    },
    copy: '© {year} - Все права защищены'
  }
};

function updateYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = year;
  });
}

function getBrowserLang() {
  const lang = navigator.language.substring(0, 2);
  return translations[lang] ? lang : 'en';
}

function switchLang(lang) {
  localStorage.setItem('lang', lang);
  applyLang(lang);
}

function applyLang(lang) {
  document.documentElement.lang = lang;
  const t = translations[lang];
  const year = new Date().getFullYear();

  document.querySelector('.description').innerHTML = t.description;
  document.querySelector('.footer p').innerHTML = t.copy.replace('{year}', year);

  const links = document.querySelectorAll('#links a');
  const linkKeys = ['twitter', 'discord', 'axiom', 'grass', 'status', 'projects', 'stats', 'email'];
  links.forEach((link, i) => {
    if (linkKeys[i] !== 'projects' && linkKeys[i] !== 'stats') {
      link.textContent = t.links[linkKeys[i]];
    }
  });

  document.getElementById('projectsBtn').textContent = t.links.projects;
  document.getElementById('statsBtn').textContent = t.links.stats;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const parts = key.split('.');
    let val = t;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) val = val[p];
      else { val = null; break; }
    }
    if (typeof val === 'string') el.textContent = val;
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function initModal() {
  const projectsView = document.getElementById('projects-view');
  const projectsArrows = document.querySelector('.projects-arrows');
  const projectsHint = document.querySelector('.projects-hint');
  const loader = document.getElementById('loader-container');
  let projectsMode = false;

  document.getElementById('projectsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const lang = localStorage.getItem('lang') || getBrowserLang();
    const t = translations[lang];

    if (!projectsView) return;

    loader.classList.remove('panels-open');
    loader.classList.add('hide-signature');
    loader.classList.add('panels-close');

    setTimeout(() => {
      if (projectsHint) projectsHint.textContent = t.projects.hint || 'click anywhere to go back';
      projectsView.classList.add('active');
      setTimeout(() => {
        projectsView.style.opacity = '1';
      }, 50);
    }, 2000);

    projectsMode = true;
  });

  document.addEventListener('click', (e) => {
    if (projectsMode && !e.target.closest('.projects-arrows') && !e.target.closest('#projectsBtn')) {
      projectsMode = false;
      projectsView.style.opacity = '0';
      loader.classList.add('hide-signature');
      setTimeout(() => {
        projectsView.classList.remove('active');
        loader.classList.remove('panels-close');
        loader.classList.add('panels-open');
      }, 300);
    }
  });
}

const TWITTER_API = '/api/stats/og-task-bot';
const TIKTOK_API = '/api/stats/tiktok-task-bot';

function formatRelative(iso, t) {
  if (!iso) return t.stats.never;
  const then = new Date(iso);
  if (isNaN(then.getTime())) return t.stats.never;
  const diff = Math.max(0, Date.now() - then.getTime());
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon}mo ago`;
  return `${Math.floor(mon / 12)}y ago`;
}

function animateCount(el, target) {
  if (!el) return;
  const start = parseInt(el.dataset.value || '0', 10) || 0;
  if (start === target) {
    el.textContent = target.toLocaleString();
    return;
  }
  const duration = 700;
  const t0 = performance.now();
  function step(now) {
    const p = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(start + (target - start) * eased);
    el.textContent = val.toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.dataset.value = String(target);
  }
  requestAnimationFrame(step);
}

let statsAbort = null;

function renderTwitterBot(data, t) {
  const repliesEl = document.getElementById('stat-twitter-replies');
  const likesEl = document.getElementById('stat-twitter-likes');
  const claimsEl = document.getElementById('stat-twitter-claims');
  const metaEl = document.getElementById('stat-twitter-meta');

  if (!data || Object.keys(data).length === 0) {
    repliesEl.textContent = '—';
    likesEl.textContent = '—';
    claimsEl.textContent = '—';
    metaEl.textContent = t.stats.never;
    return;
  }
  animateCount(repliesEl, data.total_replies || 0);
  animateCount(likesEl, data.total_likes || 0);
  animateCount(claimsEl, data.total_claims || 0);
  const action = data.last_action || '—';
  const when = formatRelative(data.last_action_at, t);
  metaEl.textContent = t.stats.lastAction
    .replace('{action}', action)
    .replace('{time}', when);
}

function renderTiktokBot(data, t) {
  const flamesEl = document.getElementById('stat-tiktok-flames');
  const metaEl = document.getElementById('stat-tiktok-meta');

  if (!data || Object.keys(data).length === 0) {
    flamesEl.textContent = '—';
    metaEl.textContent = t.stats.never;
    return;
  }
  animateCount(flamesEl, data.total_flames || 0);
  const action = data.last_action || '—';
  const when = formatRelative(data.last_action_at, t);
  metaEl.textContent = t.stats.lastAction
    .replace('{action}', action)
    .replace('{time}', when);
}

async function fetchJson(url, signal) {
  const res = await fetch(url, { cache: 'no-store', signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchAndRenderStats() {
  const lang = localStorage.getItem('lang') || getBrowserLang();
  const t = translations[lang];

  if (statsAbort) statsAbort.abort();
  statsAbort = new AbortController();
  const { signal } = statsAbort;

  const results = await Promise.allSettled([
    fetchJson(TWITTER_API, signal),
    fetchJson(TIKTOK_API, signal)
  ]);

  if (results[0].status === 'fulfilled') {
    renderTwitterBot(results[0].value, t);
  } else {
    if (results[0].reason.name === 'AbortError') return;
    console.error('twitter stats fetch failed:', results[0].reason);
    renderTwitterBot(null, t);
    document.getElementById('stat-twitter-meta').textContent = t.stats.offline;
  }

  if (results[1].status === 'fulfilled') {
    renderTiktokBot(results[1].value, t);
  } else {
    if (results[1].reason.name === 'AbortError') return;
    console.error('tiktok stats fetch failed:', results[1].reason);
    renderTiktokBot(null, t);
    document.getElementById('stat-tiktok-meta').textContent = t.stats.offline;
  }
}

function initStats() {
  const statsView = document.getElementById('stats-view');
  const statsBtn = document.getElementById('statsBtn');
  const loader = document.getElementById('loader-container');
  let statsMode = false;
  let refreshTimer = null;

  function open() {
    const lang = localStorage.getItem('lang') || getBrowserLang();
    const t = translations[lang];

    loader.classList.remove('panels-open');
    loader.classList.add('hide-signature');
    loader.classList.add('panels-close');

    setTimeout(() => {
      statsView.classList.add('active');
      setTimeout(() => {
        statsView.style.opacity = '1';
      }, 50);
    }, 2000);

    statsMode = true;
    fetchAndRenderStats();
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(fetchAndRenderStats, 15000);
  }

  function close() {
    statsMode = false;
    statsView.style.opacity = '0';
    loader.classList.add('hide-signature');
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    setTimeout(() => {
      statsView.classList.remove('active');
      loader.classList.remove('panels-close');
      loader.classList.add('panels-open');
    }, 300);
  }

  statsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    open();
  });

  document.addEventListener('click', (e) => {
    if (statsMode
      && !e.target.closest('.stats-columns')
      && !e.target.closest('#statsBtn')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && statsMode) close();
  });
}

function initLinkPreview() {
  const preview = document.getElementById('linkPreview');
  const previewImg = document.getElementById('previewImg');
  const linksContainer = document.getElementById('links');
  const links = document.querySelectorAll('#links a[data-preview]');
  const offset = 15;

  const hidePreview = () => {
    preview.classList.remove('active');
    let video = preview.querySelector('video');
    if (video) video.style.display = 'none';
    previewImg.style.display = 'block';
  };

  // Masquer le popup quand la souris quitte le conteneur
  linksContainer.addEventListener('mouseleave', hidePreview);

  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const src = link.getAttribute('data-preview');
      if (src) {
        const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');

        if (isVideo) {
          previewImg.style.display = 'none';
          let video = preview.querySelector('video');
          if (!video) {
            video = document.createElement('video');
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            preview.appendChild(video);
          }
          video.src = src;
          video.style.display = 'block';
        } else {
          let video = preview.querySelector('video');
          if (video) video.style.display = 'none';
          previewImg.src = src;
          previewImg.style.display = 'block';
        }
        preview.classList.add('active');
      }
    });

    link.addEventListener('mouseleave', hidePreview);

    link.addEventListener('mousemove', (e) => {
      const x = e.clientX + offset;
      const y = e.clientY + offset;

      const maxX = window.innerWidth - preview.offsetWidth - offset;
      const maxY = window.innerHeight - preview.offsetHeight - offset;

      preview.style.left = Math.min(x, maxX) + 'px';
      preview.style.top = Math.min(y, maxY) + 'px';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang');
  const lang = savedLang || getBrowserLang();
  applyLang(lang);
  initModal();
  initStats();
  initLinkPreview();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
  });

  // Trigger loader animation on page load
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader-container');
    setTimeout(() => {
      loader.classList.add('panels-open');
    }, 4200);
  });

  // Music Player
  const audio = document.getElementById('audio');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const progress = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');

  audio.volume = 0.15;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      audio.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  playPauseBtn.addEventListener('click', togglePlayPause);

  audio.addEventListener('timeupdate', updateProgress);

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  progress.addEventListener('input', () => {
    const time = (progress.value / 100) * audio.duration;
    audio.currentTime = time;
  });

  audio.addEventListener('ended', () => {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    progress.value = 0;
    currentTimeEl.textContent = '0:00';
  });

  audio.addEventListener('error', () => {
    console.error('Audio load error');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    currentTimeEl.textContent = 'Error';
    totalTimeEl.textContent = 'Error';
  });
});