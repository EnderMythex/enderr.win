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
      hint: 'click anywhere to go back'
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
      email: 'e-mail'
    },
    projects: {
      hint: 'cliquez ailleurs pour revenir'
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
      email: 'メール'
    },
    projects: {
      hint: 'クリックで戻る'
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
      email: 'почта'
    },
    projects: {
      hint: 'нажмите для возврата'
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
  const linkKeys = ['twitter', 'discord', 'axiom', 'grass', 'status', 'projects', 'email'];
  links.forEach((link, i) => {
    if (linkKeys[i] !== 'projects') {
      link.textContent = t.links[linkKeys[i]];
    }
  });

  document.getElementById('projectsBtn').textContent = t.links.projects;

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
    }, 5000);
  });
});