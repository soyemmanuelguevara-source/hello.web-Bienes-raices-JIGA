(() => {
  const body = document.body;
  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobMenu = document.getElementById("mob-menu");
  const marquee = document.getElementById("marquee");
  const year = document.getElementById("year");
  const waForm = document.getElementById("wa-form");
  const canvas = document.getElementById("hero-canvas");

  body.classList.add("loading");

  const minLoaderTime = 1700;
  const startTime = performance.now();

  const hideLoader = () => {
    const elapsed = performance.now() - startTime;
    window.setTimeout(() => {
      loader?.classList.add("hide");
      body.classList.remove("loading");
    }, Math.max(0, minLoaderTime - elapsed));
  };

  window.addEventListener("load", hideLoader, { once: true });
  window.setTimeout(hideLoader, 2800);

  const setNavbar = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
  };

  setNavbar();
  window.addEventListener("scroll", setNavbar, { passive: true });

  hamburger?.addEventListener("click", () => {
    const isOpen = mobMenu?.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  mobMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobMenu.classList.remove("open");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  if (marquee) {
    const items = [
      "Compra de propiedades",
      "Venta de propiedades",
      "Alquiler inmobiliario",
      "Asesoría personalizada",
      "Transparencia profesional",
      "Bienes Raíces JIGA"
    ];
    marquee.innerHTML = [...items, ...items, ...items, ...items]
      .map((item) => `<span>${item}</span>`)
      .join("");
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const nums = entry.target.querySelectorAll(".stat-num");
      nums.forEach(animateCount);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  const statsGrid = document.querySelector(".stats-grid");
  if (statsGrid) countObserver.observe(statsGrid);

  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const started = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  if (waForm) {
    waForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("f-name");
      const interest = document.getElementById("f-interest");
      const msg = document.getElementById("f-msg");

      if (!name.value.trim() || !msg.value.trim()) {
        [name, msg].forEach((field) => {
          if (!field.value.trim()) {
            field.focus();
            field.style.borderColor = "rgba(126, 217, 87, 0.9)";
          }
        });
        return;
      }

      const text = [
        "Hola, vi la página de Bienes Raíces JIGA y quiero asesoría inmobiliaria.",
        `Nombre: ${name.value.trim()}`,
        `Interés: ${interest.value}`,
        `Mensaje: ${msg.value.trim()}`
      ].join("\n");

      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    });
  }

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(Math.min(80, Math.max(36, Math.floor(width / 18))));
    };

    const createParticles = (count) => Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      r: Math.random() * 1.8 + 0.8,
      a: Math.random() * 0.36 + 0.12
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dx = p.x - pointerX;
        const dy = p.y - pointerY;
        const dist = Math.hypot(dx, dy);

        if (dist < 120 && pointerX && pointerY) {
          p.x += dx * 0.002;
          p.y += dy * 0.002;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126, 217, 87, ${p.a})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 116) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 117, 198, ${0.18 * (1 - d / 116)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    }, { passive: true });

    resize();
    draw();
  }
})();
