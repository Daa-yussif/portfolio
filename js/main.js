// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const root = document.documentElement;
      const isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Scroll reveal — fade/rise elements into place once, on first view.
  // Cards inside stat/project/skill grids stagger in one after another;
  // everything else marked .reveal-on-scroll fades in as a single block.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  const staggerContainers = document.querySelectorAll(
    ".stat-grid, .project-grid, .skills-columns"
  );
  staggerContainers.forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      child.classList.add("reveal-on-scroll");
      child.style.transitionDelay = `${i * 90}ms`;
      revealObserver.observe(child);
    });
  });

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    // stagger-container children were already observed above (they carry
    // an inline transition-delay); everything else gets observed here
    if (!el.style.transitionDelay) {
      revealObserver.observe(el);
    }
  });

  // Timeline items (About page) — reveal one at a time with a short stagger,
  // and grow the connecting line downward as each step appears
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    timelineItems.forEach((item, i) => {
      item.style.transitionDelay = `${i * 90}ms`;
      timelineObserver.observe(item);
    });
  }

  // Scroll progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.prepend(progressBar);

  const navbarEl = document.querySelector(".navbar");
  let ticking = false;
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
    if (navbarEl) {
      navbarEl.classList.toggle("is-condensed", scrollTop > 40);
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
  onScroll();

  // Animate skill bars when visible
  const bars = document.querySelectorAll(".bar-fill");
  if (bars.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.width = el.dataset.value + "%";
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach((b) => obs.observe(b));
  }

  // Project filter (only on projects page)
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        projectCards.forEach((card) => {
          const match = filter === "all" || card.dataset.category === filter;
          card.style.display = match ? "flex" : "none";
        });
      });
    });
  }

  // Contact form → opens WhatsApp with the message pre-filled
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name").value;
      const email = form.querySelector("#email").value;
      const subject = form.querySelector("#subject").value || "New portfolio inquiry";
      const message = form.querySelector("#message").value;
      const whatsappNumber = "233593827001"; // international format, no + or leading 0
      const text =
        `Hi Daa Yussif, my name is ${name}.\n` +
        `Subject: ${subject}\n\n` +
        `${message}\n\n` +
        `(Reply to: ${email})`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    });
  }
});