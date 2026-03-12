const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const progressBar = document.querySelector(".scroll-progress");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const countElements = document.querySelectorAll(".count-up");
const tiltCards = document.querySelectorAll(".tilt-card");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const updateScrollProgress = () => {
  if (!progressBar) {
    return;
  }

  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? scrollTop / scrollable : 0;

  progressBar.style.transform = `scaleX(${progress})`;
};

const updateActiveNav = () => {
  let currentId = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    if (window.scrollY >= top) {
      currentId = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("active", anchor.getAttribute("href") === `#${currentId}`);
  });
};

const animateCount = (element) => {
  const target = Number(element.dataset.target);
  const duration = 1200;
  const start = performance.now();
  const hasDecimal = String(element.dataset.target).includes(".");

  const step = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    element.textContent = hasDecimal ? value.toFixed(1) : Math.round(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = hasDecimal ? target.toFixed(1) : String(target);
    }
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        if (entry.target.classList.contains("count-up") && !entry.target.dataset.played) {
          entry.target.dataset.played = "true";
          animateCount(entry.target);
        }
      }
    });
  },
  {
    threshold: 0.16,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

countElements.forEach((element) => {
  observer.observe(element);
});

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform =
      `perspective(1000px) rotateX(${offsetY * -5}deg) rotateY(${offsetX * 7}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", () => {
  updateScrollProgress();
  updateActiveNav();
});
