const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const themeText = document.querySelector(".theme-text");
const canvas = document.querySelector("#tech-background");
const year = document.querySelector("#year");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

function markPageLoaded() {
  document.documentElement.classList.add("is-loaded");
}

if (document.readyState === "complete") {
  markPageLoaded();
} else {
  window.addEventListener("DOMContentLoaded", markPageLoaded, { once: true });
  window.addEventListener("load", markPageLoaded, { once: true });
}

window.setTimeout(markPageLoaded, 450);

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Theme still works for the current page if storage is unavailable.
  }

  if (themeToggle && themeText) {
    const isDark = theme === "dark";
    themeText.textContent = isDark ? "Dark" : "Light";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
}

setTheme(document.documentElement.dataset.theme || "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

const shouldAnimateBackground =
  canvas &&
  !reducedMotion &&
  window.innerWidth >= 760;

if (shouldAnimateBackground) {
  const ctx = canvas.getContext("2d");
  const points = [];
  const pointer = { x: 0, y: 0, active: false };
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let lastDraw = 0;

  function resizeCanvas() {
    const pixelRatio = 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const pointCount = Math.min(34, Math.max(18, Math.floor(width / 46)));
    points.length = 0;

    for (let index = 0; index < pointCount; index += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
      });
    }
  }

  function getThemeColors() {
    const isLight = document.documentElement.dataset.theme === "light";
    return {
      dot: isLight ? "rgba(232, 79, 17, 0.58)" : "rgba(255, 179, 92, 0.72)",
      line: isLight ? "rgba(232, 79, 17, " : "rgba(255, 106, 26, ",
      beam: isLight ? "rgba(196, 94, 26, 0.11)" : "rgba(255, 179, 92, 0.11)",
    };
  }

  function draw(timestamp = 0) {
    if (timestamp - lastDraw < 33) {
      animationFrame = window.requestAnimationFrame(draw);
      return;
    }

    lastDraw = timestamp;
    const colors = getThemeColors();
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = colors.beam;
    ctx.lineWidth = 1;
    for (let y = height * 0.2; y < height; y += 92) {
      ctx.beginPath();
      ctx.moveTo(width * 0.1, y);
      ctx.lineTo(width * 0.92, y - height * 0.18);
      ctx.stroke();
    }

    points.forEach((point, index) => {
      point.x += point.vx * point.z;
      point.y += point.vy * point.z;

      if (point.x < -40) point.x = width + 40;
      if (point.x > width + 40) point.x = -40;
      if (point.y < -40) point.y = height + 40;
      if (point.y > height + 40) point.y = -40;

      for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 2) {
        const other = points[nextIndex];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);

        if (distance < 145) {
          const alpha = (1 - distance / 145) * 0.34;
          ctx.strokeStyle = `${colors.line}${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      if (pointer.active) {
        const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y);

        if (distance < 190) {
          const alpha = (1 - distance / 190) * 0.5;
          ctx.strokeStyle = `${colors.line}${alpha})`;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = colors.dot;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.4 + point.z * 1.7, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrame = window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  resizeCanvas();
  draw();

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(animationFrame);
  });
}
