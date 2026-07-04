/* ============================================================
   Spaces by Nayan — main.js
   Loader · Lenis · reveals · parallax · room index · cursor ·
   page transitions · contact form
   All motion is gated behind prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  // Set FORM_ENDPOINT to a real Formspree endpoint, e.g.
  // 'https://formspree.io/f/abcdwxyz'. Until then the form
  // falls back to opening the visitor's mail client.
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'hello@spacesbynayan.com';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motionOK = !reduceMotion &&
    typeof gsap !== 'undefined' &&
    typeof ScrollTrigger !== 'undefined';

  if (!motionOK) {
    document.documentElement.classList.remove('js-motion', 'is-loading');
  }

  /* ---------- Contact form (always active) ---------- */
  var form = document.querySelector('.contact-form');
  if (form) {
    var statusEl = form.querySelector('.form-status');

    var validate = function () {
      var ok = true;
      form.querySelectorAll('.field').forEach(function (field) {
        var input = field.querySelector('input, select, textarea');
        var valid = input.checkValidity() && input.value.trim() !== '';
        field.classList.toggle('is-invalid', !valid);
        if (!valid) ok = false;
      });
      return ok;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var data = new FormData(form);

      if (FORM_ENDPOINT) {
        statusEl.textContent = 'Sending…';
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (res.ok) {
            form.reset();
            statusEl.textContent = "Thanks — we'll be in touch shortly.";
          } else {
            statusEl.textContent = 'Something went wrong — please email ' + CONTACT_EMAIL + ' instead.';
          }
        }).catch(function () {
          statusEl.textContent = 'Something went wrong — please email ' + CONTACT_EMAIL + ' instead.';
        });
      } else {
        // Stopgap until Formspree is wired: open the mail client pre-filled.
        var body = 'Name: ' + data.get('name') +
          '\nEmail: ' + data.get('email') +
          '\nProject type: ' + data.get('project_type') +
          '\n\n' + data.get('message');
        window.location.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent('Project enquiry — ' + data.get('name')) +
          '&body=' + encodeURIComponent(body);
        statusEl.textContent = "Thanks — we'll be in touch shortly.";
      }
    });
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

    // parallax
    document.querySelectorAll('[data-parallax]').forEach(function (frame) {
      var img = frame.querySelector('img');
      if (!img) return;
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
      });

      gsap.ticker.add(function () {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        cursorEl.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      });

      var viewTargets = document.querySelectorAll('[data-cursor="view"], .frame');
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
