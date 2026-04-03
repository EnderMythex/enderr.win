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
      email: 'email'
    },
    projects: {
      title: 'projects',
      close: '×'
    },
    repos: [
      { name: 'enderr.win', desc: 'Personal portfolio website', url: 'https://github.com/EnderMythex/enderr.win', lang: 'HTML', stars: 0 },
      { name: 'grass-bot', desc: 'Grass automation bot', url: 'https://github.com/EnderMythex/grass-bot', lang: 'Python', stars: 0 },
    ],
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
      email: 'e-mail'
    },
    projects: {
      title: 'projets',
      close: '×'
    },
    repos: [
      { name: 'enderr.win', desc: 'Site portfolio personnel', url: 'https://github.com/EnderMythex/enderr.win', lang: 'HTML', stars: 0 },
      { name: 'grass-bot', desc: 'Bot d\'automatisation Grass', url: 'https://github.com/EnderMythex/grass-bot', lang: 'Python', stars: 0 },
    ],
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
      email: 'メール'
    },
    projects: {
      title: 'プロジェクト',
      close: '×'
    },
    repos: [
      { name: 'enderr.win', desc: '個人ポートフォリオサイト', url: 'https://github.com/EnderMythex/enderr.win', lang: 'HTML', stars: 0 },
      { name: 'grass-bot', desc: 'Grass自動化ボット', url: 'https://github.com/EnderMythex/grass-bot', lang: 'Python', stars: 0 },
    ],
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
      email: 'почта'
    },
    projects: {
      title: 'проекты',
      close: '×'
    },
    repos: [
      { name: 'enderr.win', desc: 'Персональный сайт-портфолио', url: 'https://github.com/EnderMythex/enderr.win', lang: 'HTML', stars: 0 },
      { name: 'grass-bot', desc: 'Бот автоматизации Grass', url: 'https://github.com/EnderMythex/grass-bot', lang: 'Python', stars: 0 },
    ],
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
  const linkKeys = ['twitter', 'discord', 'axiom', 'grass', 'status', 'projects', 'email'];
  links.forEach((link, i) => {
    if (linkKeys[i] !== 'projects') {
      link.textContent = t.links[linkKeys[i]];
    }
  });

  document.getElementById('projectsBtn').textContent = t.links.projects;
  document.querySelector('.modal-header h2').textContent = t.projects.title;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function initModal() {
  const modal = document.getElementById('projectsModal');
  const repoList = document.getElementById('repoList');

  document.getElementById('projectsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const lang = localStorage.getItem('lang') || getBrowserLang();
    const t = translations[lang];

    repoList.innerHTML = t.repos.map(r => `
      <div class="repo-card">
        <h3><a href="${r.url}" target="_blank">${r.name}</a></h3>
        <p>${r.desc}</p>
        <div class="repo-meta">
          <span>${r.lang}</span>
          <span>★ ${r.stars}</span>
        </div>
      </div>
    `).join('');
    modal.classList.add('active');
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
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
  initLinkPreview();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
  });

  // Trigger loader animation on page load
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader-container');
    setTimeout(() => {
      loader.classList.add('panels-open');
    }, 3000);
  });
});