const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const themeText = document.querySelector(".theme-text");
const canvas = document.querySelector("#tech-background");
const year = document.querySelector("#year");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const smallViewport = window.matchMedia("(max-width: 760px)").matches;

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
  if ("IntersectionObserver" in window && !reducedMotion && !smallViewport) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.02 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

// 3D Card Tilt Physics Engine (UI/UX Pro Max)
const tiltCards = document.querySelectorAll(".work-card, .service-list article, .contact-card, .hud-card, .stats div");

if (tiltCards.length && !reducedMotion) {
  tiltCards.forEach((card) => {
    let glare = card.querySelector(".card-glare-3d");
    if (!glare) {
      glare = document.createElement("div");
      glare.className = "card-glare-3d";
      card.appendChild(glare);
    }

    const maxTilt = 12;

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;

      if (glare) {
        const isLight = document.documentElement.dataset.theme === "light";
        const glareColor = isLight ? "rgba(1, 62, 55, 0.16)" : "rgba(255, 239, 179, 0.26)";
        glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, ${glareColor}, transparent 65%)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      if (glare) {
        glare.style.background = "none";
      }
    });
  });
}

// Three.js 3D WebGL Scene & Parallax Background System
if (canvas && !reducedMotion && !smallViewport) {
  if (typeof THREE !== "undefined") {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 40;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 3D Floating Geometries
      const geometries = [
        new THREE.IcosahedronGeometry(3.5, 1),
        new THREE.OctahedronGeometry(2.8, 0),
        new THREE.TorusGeometry(3.2, 0.8, 12, 24),
        new THREE.TorusKnotGeometry(2.5, 0.6, 64, 8)
      ];

      const isLight = document.documentElement.dataset.theme === "light";
      const meshColor = isLight ? 0x013e37 : 0xffefb3;

      const meshMaterial = new THREE.MeshBasicMaterial({
        color: meshColor,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      });

      const floatingMeshes = [];
      const positions = [
        { x: -22, y: 12, z: -10 },
        { x: 22, y: -10, z: -15 },
        { x: -18, y: -18, z: -8 },
        { x: 18, y: 16, z: -12 }
      ];

      positions.forEach((pos, i) => {
        const mesh = new THREE.Mesh(geometries[i % geometries.length], meshMaterial);
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.008 + 0.003,
          rotSpeedY: (Math.random() - 0.5) * 0.008 + 0.003,
          baseY: pos.y,
          floatOffset: Math.random() * Math.PI * 2
        };
        scene.add(mesh);
        floatingMeshes.push(mesh);
      });

      // 3D Particle Cloud
      const particleCount = 240;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePos[i] = (Math.random() - 0.5) * 95;
        particlePos[i + 1] = (Math.random() - 0.5) * 95;
        particlePos[i + 2] = (Math.random() - 0.5) * 55;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

      const particleMat = new THREE.PointsMaterial({
        color: meshColor,
        size: 1.25,
        transparent: true,
        opacity: 0.65
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Mouse & Scroll Parallax Tracking
      let targetMouseX = 0;
      let targetMouseY = 0;
      let mouseX = 0;
      let mouseY = 0;
      let targetScrollY = 0;

      window.addEventListener("mousemove", (event) => {
        targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      });

      window.addEventListener("scroll", () => {
        targetScrollY = window.scrollY;
      }, { passive: true });

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      let clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        camera.position.x = mouseX * 5;
        camera.position.y = -mouseY * 5 + (targetScrollY * -0.006);
        camera.lookAt(scene.position);

        floatingMeshes.forEach((mesh) => {
          mesh.rotation.x += mesh.userData.rotSpeedX;
          mesh.rotation.y += mesh.userData.rotSpeedY;
          mesh.position.y = mesh.userData.baseY + Math.sin(elapsedTime * 1.5 + mesh.userData.floatOffset) * 1.2;
        });

        particleSystem.rotation.y = elapsedTime * 0.035;
        particleSystem.rotation.x = elapsedTime * 0.018;

        renderer.render(scene, camera);
      }

      animate();
    } catch (err) {
      console.warn("Three.js 3D initialization fallback:", err);
    }
  }
}
