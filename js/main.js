/* ============================================================
   SEVÁ — main.js  |  Lambert-inspired interactions
   ============================================================ */

(function () {
  'use strict';

  /* === PRÉ-SET GSAP — esconde os elementos hero imediatamente,
     antes que o loader suma, evitando flash de conteúdo. === */
  if (typeof gsap !== 'undefined') {
    gsap.set('#hero .hero-line-inner',               { yPercent: 110 });
    gsap.set('#hero .hero-eyebrow',                  { opacity: 0, y: 20 });
    gsap.set(['#hero .hero-sub', '#hero .hero-cta'], { opacity: 0, y: 16 });
    gsap.set('#hero .hero-scroll',                   { opacity: 0 });
  }

  /* === LOADER === */
  var _heroFired = false;
  function _fireLoader() {
    if (_heroFired) return;
    _heroFired = true;
    var loader = document.getElementById('loader');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('hidden');
        setTimeout(function () {
          loader.style.display = 'none';
          initHeroGsap();
        }, 700);
      }, 600);
    } else {
      initHeroGsap();
    }
  }
  window.addEventListener('load', _fireLoader);
  /* Fallback: dispara em no máximo 2.5s — evita tela de loading infinita em mobile */
  setTimeout(_fireLoader, 2500);

  /* === HEADER SCROLL === */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* === HAMBURGER / MOBILE NAV === */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* === HERO SCROLL BUTTON === */
  var heroScroll = document.getElementById('heroScroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function () {
      var target = document.getElementById('essencia') || document.querySelector('section:nth-of-type(2)');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* === HERO — Ken Burns na imagem única === */
  function initHeroKenBurns() {
    var img = document.querySelector('#hero .hero-slide-img');
    if (!img || typeof gsap === 'undefined') return;
    gsap.set(img, { opacity: 1, scale: 1.0 });
    gsap.to(img, { scale: 1.08, duration: 14, ease: 'none' });
  }
  initHeroKenBurns();

  /* === GSAP HERO — entrada + parallax ===
     Inspirado em donmolinico.es: clip-reveal por linha,
     zoom-out na imagem, stagger nos elementos de UI
  */
  function initHeroGsap() {
    if (typeof gsap === 'undefined') return;

    var lines    = document.querySelectorAll('#hero .hero-line-inner');
    var eyebrow  = document.querySelector('#hero .hero-eyebrow');
    var sub      = document.querySelector('#hero .hero-sub');
    var cta      = document.querySelector('#hero .hero-cta');
    var scrollI  = document.querySelector('#hero .hero-scroll');
    var firstImg = document.querySelector('#hero .hero-slide.is-active .hero-slide-img');

    /* GSAP assume controle total das propriedades — sem conflito com CSS */
    gsap.set(lines,               { yPercent: 110 });
    gsap.set(eyebrow,             { opacity: 0, y: 20 });
    gsap.set(sub,                 { opacity: 0, y: 16 });
    gsap.set(cta,                 { opacity: 0, y: 16 });
    gsap.set(scrollI,             { opacity: 0 });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    /* 1. Imagem: zoom-out suave na entrada */
    if (firstImg) {
      tl.from(firstImg, { scale: 1.18, duration: 2.2, ease: 'power2.out' }, 0);
    }

    /* 2. Eyebrow */
    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.75 }, 0.45);

    /* 3. Linhas do título: clip-reveal staggerado */
    if (lines.length) {
      tl.to(lines, { yPercent: 0, duration: 1.05, stagger: 0.14 }, 0.62);
    }

    /* 4. Subtítulo e botão */
    if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');
    if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 0.7 }, '-=0.45');

    /* 5. Indicador de scroll */
    if (scrollI) tl.to(scrollI, { opacity: 1, duration: 0.5 }, '-=0.3');

    /* 6. ScrollTrigger — animações transacionais com o scroll */
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      /* Texto: fade-out + translação suave ao rolar — "transacional" */
      gsap.to('#hero .hero-content', {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '45% top',
          scrub: 1
        }
      });

      /* Imagem: parallax (move mais devagar que o scroll) */
      gsap.to('#hero .hero-slides-wrapper', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  /* === O RESTAURANTE — pin + animações GSAP === */
  function initRestaurantGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Headline — clip-reveal */
    var restHeadline = document.querySelector('.rest-headline');
    if (restHeadline) {
      gsap.from(restHeadline, {
        yPercent: 110,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.rest-title-wrap',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* "Culinária Autoral" — fade-up */
    var restAutoral = document.querySelector('.rest-autoral');
    if (restAutoral) {
      gsap.from(restAutoral, {
        opacity: 0, y: 24, duration: 0.75, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.rest-hero-content',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Cards grandes — stagger slide-up */
    var catCards = document.querySelectorAll('.rest-cat-card');
    if (catCards.length) {
      gsap.set(catCards, { opacity: 0, y: 90 });
      gsap.to(catCards, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.rest-cat-cards',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Títulos dos cards — clip-reveal staggerado */
    var catNames = document.querySelectorAll('.rest-cat-name');
    if (catNames.length) {
      gsap.set(catNames, { yPercent: 110 });
      gsap.to(catNames, {
        yPercent: 0,
        duration: 0.95,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.rest-cat-cards',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  }
  initRestaurantGsap();

  /* === A CERVEJARIA — GSAP ScrollTrigger === */
  function initBreweryGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Headline: clip-reveal ao entrar na viewport */
    var brewHeadline = document.querySelector('.brew-headline');
    if (brewHeadline) {
      gsap.from(brewHeadline, {
        yPercent: 110,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.brew-title-wrap',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Tap note: fade-up */
    var tapNote = document.querySelector('.brew-tap-note');
    if (tapNote) {
      gsap.from(tapNote, {
        opacity: 0, y: 18, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: tapNote, start: 'top 88%', toggleActions: 'play none none none' }
      });
    }

    /* Cards: sobrepostos → leque ao rolar (reverso no scroll up, sem desaparecimento) */
    var cards = document.querySelectorAll('.brew-card');
    if (cards.length) {
      var c0 = cards[0]; // esquerda
      var c1 = cards[1]; // centro
      var c2 = cards[2]; // direita

      /* Estado inicial: cards sobrepostos atrás do centro — apenas c1 visível */
      gsap.set(c0, { opacity: 0, xPercent: 85, y: 4, rotation: -2, scale: 0.93, zIndex: 1 });
      gsap.set(c1, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, zIndex: 3 });
      gsap.set(c2, { opacity: 0, xPercent: -85, y: 4, rotation: 2, scale: 0.93, zIndex: 1 });

      /* Scrub: leque abre com scroll down, fecha com scroll up */
      var cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.brew-cards',
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1.2
        }
      });

      cardTl
        .to(c0, { opacity: 1, xPercent: 0, y: 64, rotation: -8, scale: 1, duration: 1, ease: 'power2.out' }, 0)
        .to(c2, { opacity: 1, xPercent: 0, y: 64, rotation: 8,  scale: 1, duration: 1, ease: 'power2.out' }, 0);

      cards.forEach(function(card) {
        card.addEventListener('click', function() {
          window.location.href = 'cervejaria.html';
        });
      });
    }

    /* "Cinco anos brassando": clip-reveal */
    var bigClaim = document.querySelector('.brew-big-claim-inner');
    if (bigClaim) {
      gsap.from(bigClaim, {
        yPercent: 110,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.brew-big-claim-wrap',
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Parágrafos do vídeo: stagger fade-up */
    var videoParas = document.querySelectorAll('.brew-video-text p');
    if (videoParas.length) {
      gsap.from(videoParas, {
        opacity: 0, y: 28, duration: 0.65, stagger: 0.11, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.brew-video-text',
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Botão no vídeo */
    var brewCta = document.querySelector('.brew-video-content .btn');
    if (brewCta) {
      gsap.from(brewCta, {
        opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: brewCta,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    }
  }
  initBreweryGsap();

  /* === NOSSA ESSÊNCIA — Cinematic ScrollTrigger ===
     Fase 1: imagem sobe de baixo (y:100vh → 0)
     Fase 2: texto sobe sobre a imagem (y:50vh → -30vh)
     Fase 3: tudo dissolve no branco
  */
  function initEssenciaGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var section = document.getElementById('essencia');
    if (!section) return;

    var imgCard = section.querySelector('.essencia-img-card');
    var text    = section.querySelector('.essencia-text');
    if (!imgCard || !text) return;

    /* Estado inicial: tudo off-screen */
    gsap.set(imgCard, { y: '100vh', opacity: 0 });
    gsap.set(text,    { y: '50vh',  opacity: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.7
      }
    });

    /* Fase 1 (0→30%): imagem flutua de baixo e para centralizada */
    tl.to(imgCard, {
      y: 0,
      opacity: 1,
      ease: 'power2.out',
      duration: 2.5
    }, 0);

    /* Fase 2a (30→35%): texto aparece */
    tl.to(text, {
      opacity: 1,
      ease: 'power1.out',
      duration: 0.4
    }, 2.5);

    /* Fase 2b (30→70%): texto sobe — imagem permanece fixada */
    tl.to(text, {
      y: '-30vh',
      ease: 'none',
      duration: 4
    }, 2.5);
  }
  initEssenciaGsap();

  /* === HORÁRIOS — Lazy-load de vídeos (performance) ===
     IntersectionObserver: só carrega/toca quando o card entra na viewport
  */
  function initHoursVideos() {
    var videos = document.querySelectorAll('.hours-card-video[data-src]');
    if (!videos.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var video = entry.target;
        var src = video.getAttribute('data-src');
        if (src && !video.getAttribute('src')) {
          video.setAttribute('src', src);
          video.load();
          video.play().catch(function () {});
        }
        observer.unobserve(video);
      });
    }, { rootMargin: '200px', threshold: 0 });

    videos.forEach(function (v) { observer.observe(v); });
  }
  initHoursVideos();

  /* === HORÁRIOS — GSAP ScrollTrigger ===
     Título clip-reveal staggerado, tagline fade-up,
     cards slide-up stagger, parallax no vídeo de cada card
  */
  function initHoursGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var section = document.getElementById('hours');
    if (!section) return;

    var lines   = section.querySelectorAll('.hours-line-inner');
    var tagline = section.querySelector('.hours-tagline');
    var cards   = section.querySelectorAll('.hours-card');
    var wraps   = section.querySelectorAll('.hours-card-video-wrap');

    /* Título: clip-reveal staggerado (padrão do site) */
    if (lines.length) {
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section.querySelector('.hours-title-wrap'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Tagline: fade-up */
    if (tagline) {
      gsap.to(tagline, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: tagline,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
      gsap.set(tagline, { y: 20 });
    }

    /* Cards: stagger slide-up com fade */
    if (cards.length) {
      gsap.set(cards, { y: 80 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section.querySelector('.hours-cards'),
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Parallax: vídeo se move em velocidade diferente do card
       Wrapper oversized (130% h, top:-15%) → GSAP move -25% ao rolar
       Resultado: vídeo "flutua" dentro do card enquanto a página rola */
    wraps.forEach(function (wrap) {
      gsap.fromTo(wrap,
        { y: '0%' },
        {
          y: '-15%',
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.closest('.hours-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });
  }
  initHoursGsap();

  /* === SCROLL REVEAL === */
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
  }
  initReveal();

  /* === MENU TABS (Cardápio) === */
  var menuTabs = document.querySelectorAll('.menu-tab');
  var menuPanels = document.querySelectorAll('.menu-panel');

  if (menuTabs.length) {
    menuTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.tab;
        menuTabs.forEach(function (t) { t.classList.remove('active'); });
        menuPanels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.classList.add('active');
          // Re-trigger reveal animations in new panel
          panel.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) {
            el.classList.add('visible');
          });
        }
      });
    });
  }

  /* === TESTIMONIALS — Título reveal + Marquee ===
     OBS: parallax removido — a seção é sticky (300vh), os ScrollTriggers
     de parallax no conteúdo interno causavam distorção. O vídeo é
     controlado pelo scroll na função dedicada abaixo. */
  function initTestimonialsGsap() {
    var section = document.getElementById('testimonials');
    var sticky  = document.getElementById('testiSticky');
    if (!section || typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    /* Título: clip-reveal — trigger no sticky (que é o 100vh visível) */
    var lines = section.querySelectorAll('.testi-line-inner');
    if (lines.length) {
      gsap.to(lines, {
        y: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: {
          trigger: sticky || section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Marquee: width:390, gap:20, 12 cards por set */
    var track = document.getElementById('testiTrack');
    if (!track) return;

    var setW         = 12 * (390 + 20); /* 4920px */
    var xPos         = 0;
    var speed        = 0.55;
    var speedTarget  = speed;
    var speedCurrent = speed;

    track.addEventListener('mouseenter', function () { speedTarget = 0; });
    track.addEventListener('mouseleave', function () { speedTarget = speed; });

    gsap.ticker.add(function () {
      speedCurrent += (speedTarget - speedCurrent) * 0.08;
      xPos -= speedCurrent;
      if (xPos <= -setW) xPos += setW;
      gsap.set(track, { x: xPos });
    });
  }
  initTestimonialsGsap();

  /* === GALLERY FILTER === */
  var galleryFilters = document.querySelectorAll('.gallery-filter');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryFilters.length) {
    galleryFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;
        galleryFilters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        galleryItems.forEach(function (item) {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* === LIGHTBOX === */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var lightboxImages = [];
  var lightboxIndex = 0;

  if (lightbox && galleryItems.length) {
    galleryItems.forEach(function (item, i) {
      var img = item.querySelector('img');
      if (img) lightboxImages.push({ src: img.src, alt: img.alt });
      item.addEventListener('click', function () {
        lightboxIndex = i;
        showLightbox(i);
      });
    });

    function showLightbox(index) {
      lightboxIndex = index;
      lightboxImg.src = lightboxImages[index].src;
      lightboxImg.alt = lightboxImages[index].alt;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      showLightbox(lightboxIndex);
    });
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      showLightbox(lightboxIndex);
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev.click();
      if (e.key === 'ArrowRight') lightboxNext.click();
    });
  }

  /* === ACTIVE NAV LINK === */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* === COMO CHEGAR — GSAP ScrollTrigger === */
  function initChegarGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var section = document.getElementById('como-chegar');
    if (!section) return;

    /* Parallax no fundo */
    gsap.to('.chegar-bg-parallax', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    /* Eyebrow: fade-in */
    gsap.to('.chegar-eyebrow', {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' }
    });

    /* Título: clip-reveal staggerado */
    var lines = section.querySelectorAll('.chegar-line-inner');
    if (lines.length) {
      gsap.to(lines, {
        y: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.chegar-title-wrap',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* Ornamento */
    gsap.to('.chegar-ornament', {
      opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out',
      scrollTrigger: { trigger: '.chegar-title-wrap', start: 'top 80%', toggleActions: 'play none none none' }
    });

    /* Info cards: stagger slide-up */
    var cards = section.querySelectorAll('[data-chegar-card]');
    if (cards.length) {
      gsap.to(cards, {
        opacity: 1, y: 0,
        duration: 0.75,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.chegar-info-cards',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* CTA */
    var cta = section.querySelector('[data-chegar-cta]');
    if (cta) {
      gsap.to(cta, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: cta, start: 'top 90%', toggleActions: 'play none none none' }
      });
    }

    /* Mapa: slide-in da direita + scale */
    var mapCol = section.querySelector('[data-chegar-map]');
    if (mapCol) {
      gsap.to(mapCol, {
        opacity: 1, x: 0, scale: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mapCol,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
    }
  }
  initChegarGsap();

  /* === TESTIMONIALS CANVAS — sequência WebP scroll-driven ===
     120 frames em /images/cervejas/frames_webp/frame_0001.webp … frame_0120.webp
     - Pré-carrega todos como Image objects
     - Scroll → progress → frameIndex → ctx.drawImage()
     - Lerp suave no índice para movimento cinematográfico
     - Sem scroll hijacking, sem pinning extra, canvas responsivo          */
  (function () {
    var canvas  = document.getElementById('testiCanvas');
    var section = document.getElementById('testimonials');
    if (!canvas || !section) return;

    var ctx         = canvas.getContext('2d');
    var TOTAL       = 120;
    var frames      = [];           /* Image[] preloaded                  */
    var loaded      = 0;
    var currentF    = 0;            /* índice atual (float, lerp)         */
    var targetF     = 0;            /* índice alvo calculado pelo scroll  */
    var rafId       = null;
    var ready       = false;        /* true quando ao menos frame 0 carregou */

    /* ── Tamanho do canvas: copia o tamanho CSS do elemento ── */
    function resizeCanvas() {
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        if (ready) drawFrame(Math.round(currentF));
      }
    }

    /* ── Desenha um frame no canvas (cover fit) ── */
    function drawFrame(idx) {
      var img = frames[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      var cw = canvas.width,  ch = canvas.height;
      var iw = img.naturalWidth, ih = img.naturalHeight;
      /* object-fit: contain — mantém transparência alpha */
      var scale = Math.min(cw / iw, ch / ih);
      var dw = iw * scale, dh = ih * scale;
      var dx = (cw - dw) / 2, dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    /* ── Progresso 0→1 ao longo dos 300vh da seção ── */
    function getProgress() {
      var rect       = section.getBoundingClientRect();
      var scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    /* ── RAF loop: lerp currentF → targetF, desenha se mudou ── */
    function tick() {
      rafId = requestAnimationFrame(tick);
      /* lerp suave (fator 0.12 → ~8 frames para alcançar) */
      currentF += (targetF - currentF) * 0.12;
      var idx = Math.min(TOTAL - 1, Math.max(0, Math.round(currentF)));
      drawFrame(idx);
    }

    /* ── Scroll handler ── */
    function onScroll() {
      targetF = getProgress() * (TOTAL - 1);
    }

    /* ── Preload de todos os frames ── */
    function preload() {
      for (var i = 0; i < TOTAL; i++) {
        (function (i) {
          var img = new Image();
          var num = ('0000' + (i + 1)).slice(-4);
          img.src = 'images/cervejas/frames_webp/frame_' + num + '.webp';
          frames[i] = img;
          img.onload = function () {
            loaded++;
            /* Assim que o frame 0 carrega, mostra e inicia o loop */
            if (i === 0 && !ready) {
              ready = true;
              resizeCanvas();
              drawFrame(0);
              window.addEventListener('scroll', onScroll, { passive: true });
              onScroll();
              tick();
            }
          };
        }(i));
      }
    }

    window.addEventListener('resize', resizeCanvas);
    preload();

    /* Expõe estado para debug */
    window._testiCanvas = {
      getLoaded : function () { return loaded; },
      getTarget : function () { return targetF; },
      getCurrent: function () { return currentF; }
    };
  }());

  /* === SMOOTH SCROLL for anchor links === */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
