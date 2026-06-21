document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initPageTransitions();
  initRenderSlider();
  initCardSliders();
});

function initBurgerMenu() {
  const burger = document.querySelector(".burger-btn");
  const nav = document.querySelector(".site-nav");

  if (!burger || !nav) return;

  const setMenuState = (isOpen) => {
    burger.classList.toggle("is-open", isOpen);
    nav.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  };

  burger.addEventListener("click", () => {
    setMenuState(!burger.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
}

function initPageTransitions() {
  const links = document.querySelectorAll("a[href]");
  const transitionDelay = 160;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !href ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        link.hasAttribute("download") ||
        link.target === "_blank"
      ) {
        return;
      }

      const url = new URL(href, window.location.href);

      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      document.body.classList.add("page-leaving");

      window.setTimeout(() => {
        window.location.href = url.href;
      }, transitionDelay);
    });
  });
}

function initRenderSlider() {
  const slider = document.querySelector(".js-render-slider");

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".render-slide"));
  const dots = Array.from(document.querySelectorAll("[data-render-dot]"));
  const prev = document.querySelector("[data-render-prev]");
  const next = document.querySelector("[data-render-next]");

  if (!slides.length) return;

  let activeIndex = 0;

  const setActiveSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
      slide.classList.toggle("is-left", slideIndex < activeIndex);
      slide.classList.toggle("is-right", slideIndex > activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  prev?.addEventListener("click", () => setActiveSlide(activeIndex - 1));
  next?.addEventListener("click", () => setActiveSlide(activeIndex + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => setActiveSlide(index));
  });

  setActiveSlide(0);
}

function initCardSliders() {
  const sliders = document.querySelectorAll(".js-card-slider");
  const tabletQuery = window.matchMedia("(max-width: 1199.98px)");
  const mobileQuery = window.matchMedia("(max-width: 767.98px)");

  sliders.forEach((slider) => {
    const cards = Array.from(slider.querySelectorAll(".row > div"));
    const dots = Array.from(slider.querySelectorAll("[data-card-dot]"));
    const prev = slider.querySelector("[data-card-prev]");
    const next = slider.querySelector("[data-card-next]");

    if (!cards.length) return;

    let activeIndex = 0;
    let resizeFrame = null;

    const getVisibleCount = () => {
      if (mobileQuery.matches) return 1;
      if (tabletQuery.matches) return 2;
      return cards.length;
    };

    const render = () => {
      const visibleCount = getVisibleCount();

      cards.forEach((card) => {
        card.classList.remove("is-slider-visible");
      });

      if (visibleCount >= cards.length) {
        cards.forEach((card) => {
          card.classList.add("is-slider-visible");
        });
      } else {
        for (let i = 0; i < visibleCount; i += 1) {
          cards[(activeIndex + i) % cards.length].classList.add("is-slider-visible");
        }
      }

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    };

    const setActiveCards = (index) => {
      activeIndex = (index + cards.length) % cards.length;
      render();
    };

    const handleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);

      resizeFrame = requestAnimationFrame(() => {
        activeIndex = 0;
        render();
      });
    };

    prev?.addEventListener("click", () => setActiveCards(activeIndex - 1));
    next?.addEventListener("click", () => setActiveCards(activeIndex + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => setActiveCards(index));
    });

    window.addEventListener("resize", handleResize);
    render();
  });
}
