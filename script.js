/* ============================================================
   ПОЛИНА & ИЛЬЯ — свадебный сайт
   script.js — загрузка, анимации, обратный отсчёт, форма
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ПРЕЛОАДЕР ---------- */
  var loader = document.getElementById('loader');

  function revealSite() {
    if (!loader) return runHeroIntro();
    requestAnimationFrame(function () {
      loader.classList.add('is-opening');
      setTimeout(function () {
        loader.classList.add('is-hidden');
        runHeroIntro();
      }, reduceMotion ? 0 : 1500);
    });
  }

  window.addEventListener('load', function () {
    setTimeout(revealSite, reduceMotion ? 0 : 500);
  });
  // safety net in case 'load' already fired or takes too long
  setTimeout(function () {
    if (loader && !loader.classList.contains('is-opening')) revealSite();
  }, 3500);

  /* ---------- HERO INTRO ---------- */
  function runHeroIntro() {
    var items = document.querySelectorAll('[data-anim="hero"]');
    if (window.gsap) {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.14,
        clearProps: 'transform'
      });
    } else {
      items.forEach(function (el) { el.style.opacity = 1; });
    }
  }
  // set initial offset for hero items via GSAP (avoids FOUC before JS loads)
  if (window.gsap) {
    gsap.set('[data-anim="hero"]', { y: 18 });
  }

  /* ---------- SCROLL REVEALS ---------- */
  function initScrollReveals() {
    var reveals = document.querySelectorAll('.reveal, .reveal-scale');
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      reveals.forEach(function (el) {
        var isScale = el.classList.contains('reveal-scale');
        gsap.fromTo(el,
          { opacity: 0, y: isScale ? 0 : 30, scale: isScale ? 0.94 : 1 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.9, ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // subtle parallax on disco ball wrap
      var discoWrap = document.querySelector('.disco-wrap');
      if (discoWrap) {
        gsap.to(discoWrap, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: '#act-two',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    } else {
      // fallback: IntersectionObserver
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.transition = 'opacity .8s ease, transform .8s ease';
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'none';
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }
  initScrollReveals();

  /* ---------- SCROLL CUE ---------- */
  var scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var target = document.getElementById('invitation');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- ОБРАТНЫЙ ОТСЧЁТ ---------- */
  var countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    var targetDate = new Date('2026-09-16T14:00:00+03:00').getTime();
    var dEl = countdownEl.querySelector('[data-unit="days"]');
    var hEl = countdownEl.querySelector('[data-unit="hours"]');
    var mEl = countdownEl.querySelector('[data-unit="mins"]');
    var sEl = countdownEl.querySelector('[data-unit="secs"]');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var now = Date.now();
      var diff = Math.max(0, targetDate - now);
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- RSVP: доп. поля для напитков ---------- */
  function bindSubInput(checkboxId, inputId) {
    var cb = document.getElementById(checkboxId);
    var input = document.getElementById(inputId);
    if (!cb || !input) return;
    cb.addEventListener('change', function () {
      input.disabled = !cb.checked;
      if (!cb.checked) input.value = '';
      else input.focus();
    });
  }
  bindSubInput('strongCheck', 'strongInput');
  bindSubInput('nonAlcCheck', 'nonAlcInput');

  /* ---------- RSVP: отправка формы ---------- */
  var rsvpForm = document.getElementById('rsvpForm');
  var formMsg = document.getElementById('formMsg');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Здесь можно подключить отправку на сервер / Google Forms / email-сервис.
      if (formMsg) {
        formMsg.classList.add('is-visible');
        formMsg.setAttribute('role', 'status');
      }
      rsvpForm.querySelector('.btn-gold').textContent = 'Спасибо!';
    });
  }

})();

// Image Animation
document.addEventListener("DOMContentLoaded", () => {

    const items = document.querySelectorAll(".image1");

    console.log(items);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            console.log(entry.isIntersecting);

            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
            } else {
                entry.target.classList.remove("animate");
            }

        });
    }, {
        threshold: 0
    });

    items.forEach(item => observer.observe(item));

});

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {

rsvpForm.addEventListener("submit", async function(e){

    e.preventDefault();


    const drinks = [];

    document.querySelectorAll('input[name="drink"]:checked')
    .forEach(item => {
        drinks.push(item.value);
    });


    const data = {

        name: document.getElementById("guestName")?.value || "Без имени",

        attendance:
        document.querySelector('input[name="attendance"]:checked')?.value || "",

        diet1:
        document.getElementById("diet1").value,

        diet2:
        document.getElementById("diet2").value,

        drinks: drinks,

        hit:
        document.getElementById("hit").value
    };


    try {

    const response = await fetch(
        "https://late-block-315d.rwgjsrz5pk.workers.dev",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        }
    );


    if (!response.ok) {
        throw new Error("Ошибка отправки");
    }


    document.getElementById("formMsg").style.display="block";

    rsvpForm.reset();


} catch(error) {

    alert("Не удалось отправить анкету. Попробуйте ещё раз.");

    console.error(error);

}


    document.getElementById("formMsg").style.display="block";

    rsvpForm.reset();

});

}