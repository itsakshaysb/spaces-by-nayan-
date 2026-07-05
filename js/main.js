/* ============================================================
   Spaces by Nayan — main.js
   Loader · Lenis · reveals · parallax · room index · cursor ·
   page transitions
   All motion is gated behind prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motionOK = !reduceMotion &&
    typeof gsap !== 'undefined' &&
    typeof ScrollTrigger !== 'undefined';

  if (!motionOK) {
    document.documentElement.classList.remove('js-motion', 'is-loading');
  }

  /* ---------- Mobile nav (hamburger) ---------- */
  var navEl = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav-toggle');
  if (navEl && navToggle) {
    var setNavOpen = function (open) {
      navEl.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    navToggle.addEventListener('click', function () {
      setNavOpen(!navEl.classList.contains('is-open'));
    });
    navEl.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setNavOpen(false); });
    });
  }

  /* ---------- Hero slideshow (independent of GSAP) ---------- */
  var slideshowFrame = document.querySelector('[data-slideshow]');
  if (slideshowFrame) {
    var slides = Array.prototype.slice.call(slideshowFrame.querySelectorAll('picture'));
    var slideCaption = slideshowFrame.querySelector('.frame-caption');
    var slideIndex = 0;
    var syncCaption = function () {
      var name = slides[slideIndex].getAttribute('data-project');
      if (slideCaption && name) slideCaption.textContent = name;
    };
    syncCaption();
    if (slides.length > 1 && !reduceMotion) {
      setInterval(function () {
        slides[slideIndex].classList.remove('is-active');
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('is-active');
        syncCaption();
      }, 2800); // 0.8s crossfade + 2s fully visible
    }
  }

  /* ---------- Selected work slider ---------- */
  var workSlider = document.querySelector('[data-work-slider]');
  if (workSlider) {
    var teasers = Array.prototype.slice.call(workSlider.querySelectorAll('.teaser'));
    var workCounter = document.querySelector('[data-work-counter]');
    var workIndex = 0;
    var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

    var showTeaser = function (i) {
      teasers[workIndex].classList.remove('is-current');
      workIndex = (i + teasers.length) % teasers.length;
      var teaser = teasers[workIndex];
      teaser.classList.add('is-current');
      // force-reveal content that scroll animations would otherwise keep hidden
      teaser.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('is-revealed');
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      teaser.querySelectorAll('.line').forEach(function (line) {
        line.style.transform = 'none';
      });
      var frame = teaser.querySelector('.frame');
      if (frame) frame.style.clipPath = 'none';
      if (workCounter) {
        workCounter.textContent = pad2(workIndex + 1) + ' / ' + pad2(teasers.length);
      }
    };

    if (workCounter) {
      workCounter.textContent = pad2(1) + ' / ' + pad2(teasers.length);
    }
    var workPrev = document.querySelector('[data-work-prev]');
    var workNext = document.querySelector('[data-work-next]');
    if (workPrev) workPrev.addEventListener('click', function () { showTeaser(workIndex - 1); });
    if (workNext) workNext.addEventListener('click', function () { showTeaser(workIndex + 1); });
  }

  /* ---------- Back to top ---------- */
  document.querySelectorAll('[data-top]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.lenis) window.lenis.scrollTo(0);
      else window.scrollTo({ top: 0 });
    });
  });

  if (!motionOK) return; // everything below is motion

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = new Lenis({ lerp: 0.1 });
  window.lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Split-text helper ---------- */
  var splitTargets = [];
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var split = new SplitType(el, { types: 'lines', lineClass: 'line' });
    // wrap each line in a mask
    split.lines.forEach(function (line) {
      var mask = document.createElement('span');
      mask.style.display = 'block';
      mask.style.overflow = 'hidden';
      line.parentNode.insertBefore(mask, line);
      mask.appendChild(line);
      line.style.display = 'block';
    });
    splitTargets.push({ el: el, lines: split.lines });
  });

  var revealLines = function (lines, delay) {
    gsap.fromTo(lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power4.out',
        delay: delay || 0
      });
  };

  /* ---------- Generic reveals ---------- */
  var setupScrollReveals = function () {
    // split-text openers reveal on enter (hero handled separately)
    splitTargets.forEach(function (t) {
      if (t.el.closest('.hero')) return;
      gsap.set(t.lines, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: t.el,
        start: 'top 85%',
        once: true,
        onEnter: function () { revealLines(t.lines); }
      });
    });

    // fade/rise reveals
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.closest('.hero')) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          el.classList.add('is-revealed');
          gsap.fromTo(el, { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        }
      });
    });

    // image clip reveals
    document.querySelectorAll('.frame').forEach(function (frame) {
      if (frame.hasAttribute('data-hero-media')) return;
      gsap.set(frame, { clipPath: 'inset(100% 0 0 0)' });
      ScrollTrigger.create({
        trigger: frame,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(frame, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'power3.out'
          });
        }
      });
    });

    // parallax (all imgs, so stacked slideshow layers move together)
    document.querySelectorAll('[data-parallax]').forEach(function (frame) {
      var img = frame.querySelectorAll('img');
      if (!img.length) return;
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  };

  /* ---------- Hero entrance ---------- */
  var heroEntrance = function () {
    var heroSplit = splitTargets.filter(function (t) { return t.el.closest('.hero, .project-hero'); });
    var heroReveals = document.querySelectorAll('.hero [data-reveal], .project-hero [data-reveal]');
    var heroMedia = document.querySelector('[data-hero-media]');

    heroSplit.forEach(function (t) { revealLines(t.lines, 0.1); });

    if (heroReveals.length) {
      heroReveals.forEach(function (el) { el.classList.add('is-revealed'); });
      gsap.fromTo(heroReveals, { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.5, ease: 'power3.out' });
    }

    if (heroMedia) {
      var img = heroMedia.querySelector('img');
      gsap.fromTo(heroMedia, { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.2, delay: 0.35, ease: 'power3.out' });
      if (img) {
        gsap.fromTo(img, { scale: 1.08 }, {
          scale: 1, duration: 1.4, delay: 0.35, ease: 'power2.out',
          onComplete: function () { gsap.set(img, { clearProps: 'scale' }); }
        });
      }
    }
  };

  /* ---------- Preloader ---------- */
  var runLoader = function (done) {
    var loaderEl = document.querySelector('.loader');
    var counter = document.querySelector('.loader-counter');
    var isLoading = document.documentElement.classList.contains('is-loading');

    if (!loaderEl || !counter || !isLoading) { done(); return; }

    var progress = { value: 0 };
    var pageLoaded = document.readyState === 'complete';
    if (!pageLoaded) {
      window.addEventListener('load', function () { pageLoaded = true; });
    }

    var counterTween = gsap.to(progress, {
      value: 100,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate: function () {
        // hold at 90 until the window has actually loaded
        var v = Math.round(progress.value);
        if (v > 90 && !pageLoaded) v = 90;
        counter.textContent = 'Loading ' + v + '%';
      },
      onComplete: function () {
        var finish = function () {
          counter.textContent = 'Loading 100%';
          sessionStorage.setItem('sbn-loaded', '1');
          gsap.timeline({
            onComplete: function () {
              document.documentElement.classList.remove('is-loading');
              loaderEl.style.display = 'none';
              done();
            }
          })
            .to(loaderEl.children, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' })
            .to(loaderEl, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.1');
        };
        if (pageLoaded) finish();
        else window.addEventListener('load', finish, { once: true });
      }
    });
  };

  /* ---------- Page transitions ---------- */
  var veil = document.querySelector('.veil');

  var entryTransition = function (done) {
    if (veil && sessionStorage.getItem('sbn-transition')) {
      sessionStorage.removeItem('sbn-transition');
      gsap.set(veil, { yPercent: 0 });
      gsap.to(veil, {
        yPercent: -100,
        duration: 0.7,
        ease: 'power4.inOut',
        delay: 0.1,
        onComplete: function () {
          gsap.set(veil, { yPercent: 100 });
          done();
        }
      });
    } else {
      done();
    }
  };

  document.querySelectorAll('a[data-transition]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      // let same-page anchors scroll instead of transitioning
      var url = new URL(href, window.location.href);
      var samePage = url.pathname === window.location.pathname;
      if (samePage && url.hash) return;
      e.preventDefault();
      sessionStorage.setItem('sbn-transition', '1');
      gsap.set(veil, { yPercent: 100 });
      gsap.to(veil, {
        yPercent: 0,
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: function () { window.location.href = href; }
      });
    });
  });

  /* ---------- Smooth anchor scrolling via Lenis ---------- */
  document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach(function (link) {
    var url = new URL(link.getAttribute('href'), window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    link.addEventListener('click', function (e) {
      var target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -40 });
    });
  });

  /* ---------- Room index (project page) ---------- */
  var walkthrough = document.querySelector('[data-walkthrough]');
  if (walkthrough) {
    var index = walkthrough.querySelector('.room-index');
    var buttons = index ? Array.prototype.slice.call(index.querySelectorAll('button')) : [];

    ScrollTrigger.create({
      trigger: walkthrough,
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: function (self) {
        if (index) index.classList.toggle('is-visible', self.isActive);
      }
    });

    document.querySelectorAll('[data-room]').forEach(function (room) {
      ScrollTrigger.create({
        trigger: room,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: function (self) {
          if (!self.isActive) return;
          buttons.forEach(function (b) {
            b.classList.toggle('is-active', b.getAttribute('data-room-link') === room.id);
          });
        }
      });
    });

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.getAttribute('data-room-link'));
        if (target) lenis.scrollTo(target, { offset: -20 });
      });
    });
  }

  /* ---------- Custom cursor ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    var cursorEl = document.querySelector('.cursor');
    if (cursorEl) {
      document.documentElement.classList.add('has-cursor');
      var cx = -100, cy = -100, tx = -100, ty = -100;

      window.addEventListener('mousemove', function (e) {
        tx = e.clientX;
        ty = e.clientY;
      }, { passive: true });

      gsap.ticker.add(function () {
        var dx = tx - cx, dy = ty - cy;
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return; // idle: skip the write
        cx += dx * 0.45;
        cy += dy * 0.45;
        cursorEl.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
      });

      // only links marked data-cursor="view" — plain image frames aren't clickable
      var viewTargets = document.querySelectorAll('[data-cursor="view"]');
      viewTargets.forEach(function (t) {
        t.addEventListener('mouseenter', function () { cursorEl.classList.add('is-view'); });
        t.addEventListener('mouseleave', function () { cursorEl.classList.remove('is-view'); });
      });
    }
  }

  /* ---------- Boot sequence ---------- */
  ScrollTrigger.refresh();

  runLoader(function () {
    entryTransition(function () {
      heroEntrance();
    });
  });

  setupScrollReveals();

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
