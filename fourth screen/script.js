document.addEventListener("DOMContentLoaded", function () {
  initBurgerMenu();
  initGridSliders();
  initProfileModal();
  initPageTransitions();
  initModalWindows();
});

function initBurgerMenu() {
  const burger = document.querySelector(".burger-btn");
  const nav = document.querySelector(".site-nav");

  if (!burger || !nav) {
    return;
  }

  burger.addEventListener("click", function () {
    const isOpen = burger.classList.toggle("is-open");

    nav.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      burger.classList.remove("is-open");
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}
function initGridSliders() {
  const sliders = document.querySelectorAll(".js-slider");

  sliders.forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const prevButton = slider.querySelector(".slider-prev");
    const nextButton = slider.querySelector(".slider-next");
    const pagination = slider.querySelector(".slider-pagination");

    if (!slides.length || !pagination) return;

    let currentIndex = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });

    if (currentIndex < 0) {
      currentIndex = 0;
    }

    pagination.innerHTML = "";

    const bullets = slides.map(function (_, index) {
      const bullet = document.createElement("button");

      bullet.type = "button";
      bullet.setAttribute("aria-label", "Слайд " + (index + 1));

      bullet.addEventListener("click", function () {
        showSlide(index);
      });

      pagination.appendChild(bullet);

      return bullet;
    });

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === currentIndex;

        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      bullets.forEach(function (bullet, bulletIndex) {
        const isActive = bulletIndex === currentIndex;

        bullet.classList.toggle("is-active", isActive);
        bullet.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        showSlide(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        showSlide(currentIndex + 1);
      });
    }

    showSlide(currentIndex);
  });
}

function initPageTransitions() {
  const links = document.querySelectorAll("a[href]");

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (event.defaultPrevented) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href) return;

      if (link.classList.contains("js-profile-open")) {
        return;
      }

      const isAnchor = href.startsWith("#");
      const isMail = href.startsWith("mailto:");
      const isPhone = href.startsWith("tel:");
      const isBlank = link.target === "_blank";
      const isDownload = link.hasAttribute("download");

      if (isAnchor || isMail || isPhone || isBlank || isDownload) {
        return;
      }

      const currentUrl = new URL(window.location.href);
      const nextUrl = new URL(link.href, window.location.href);

      if (currentUrl.origin !== nextUrl.origin) {
        return;
      }

      event.preventDefault();

      document.body.classList.add("page-leaving");

      setTimeout(function () {
        window.location.href = nextUrl.href;
      }, 160);
    });
  });
}

function initModalWindows() {
  const modalLayer = document.querySelector(".modal-layer");

  if (!modalLayer) {
    return;
  }

  document.body.appendChild(modalLayer);

  const detailWindow = modalLayer.querySelector('[data-modal="detail"]');
  const orderWindow = modalLayer.querySelector('[data-modal="order"]');
  const successWindow = modalLayer.querySelector('[data-modal="success"]');

  const studioData = {
    "Y2K студия": {
      title: "Y2K студия",
      description:
        "Яркая и дерзкая студия в эстетике 2000-х: неон, глянец, винтажные экраны и настроение поп-культуры. Подходит для fashion-съёмок, клипов, портретов и смелого контента.",
      image: "pop1.svg",
      alt: "Y2K студия",
      price: 3600,
      features: [
        ["Стиль:", "Y2K / неон"],
        ["Подходит для:", "fashion и клипов"],
        ["Свет:", "неон + импульсный"],
        ["Вместимость:", "до 6 человек"],
      ],
    },

    "Квартира студия": {
      title: "Квартира студия",
      description:
        "Уютное интерьерное пространство с винтажной мебелью, мягким светом и домашней атмосферой. Подходит для портретов, lifestyle-съёмок и камерных проектов.",
      image: "1kvartira.svg",
      alt: "Квартира студия",
      price: 3400,
      features: [
        ["Стиль:", "домашний интерьер"],
        ["Подходит для:", "портретов и lifestyle"],
        ["Свет:", "естественный + студийный"],
        ["Вместимость:", "до 5 человек"],
      ],
    },

    "Минималистичная студия": {
      title: "Минималистичная студия",
      description:
        "Светлая студия с чистым фоном, спокойными оттенками и минималистичной мебелью. Хорошо подходит для аккуратных портретов, предметной съёмки и lookbook.",
      image: "pop3.svg",
      alt: "Минималистичная студия",
      price: 3200,
      features: [
        ["Стиль:", "минимализм"],
        ["Подходит для:", "lookbook и beauty"],
        ["Фон:", "светлый / нейтральный"],
        ["Вместимость:", "до 5 человек"],
      ],
    },

    "Минимал студия": {
      title: "Минимал студия",
      description:
        "Светлая студия с чистым фоном, спокойными оттенками и минималистичной мебелью. Нейтральная атмосфера помогает получить сдержанные, стильные и выразительные кадры.",
      image: "1minimal.svg",
      alt: "Минимал студия",
      price: 3200,
      features: [
        ["Стиль:", "минимализм"],
        ["Подходит для:", "портретов и предметки"],
        ["Фон:", "светлый / нейтральный"],
        ["Вместимость:", "до 5 человек"],
      ],
    },

    "Лофт студия": {
      title: "Лофт студия",
      description:
        "Просторная студия с грубыми фактурами, кирпичными стенами, деревянной мебелью и мягким естественным светом. Подходит для портретных и атмосферных съёмок.",
      image: "31kvartira.svg",
      alt: "Лофт студия",
      price: 3800,
      features: [
        ["Стиль:", "лофт / индустриальный"],
        ["Подходит для:", "портретов и брендов"],
        ["Свет:", "естественный + лампы"],
        ["Вместимость:", "до 8 человек"],
      ],
    },
  };

  let currentItem = null;
  let previousWindow = null;
  let successTimer = null;

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (
      target.closest(
        ".slider-nav, .slider-pagination button, .win95-btn:not(.js-modal-close)"
      )
    ) {
      return;
    }

    const heroOrderButton = target.closest(".hero-content .button");
    if (heroOrderButton) {
      event.preventDefault();
      openOrder({
        title: "Фотосессия",
        description: "Заявка на фотосессию в студии.",
        image: "mainPhoto.svg",
        alt: "Фотосессия",
        price: 0,
        features: [],
      });
      return;
    }

    const popularButton = target.closest(".feature-content .button");
    if (popularButton) {
      event.preventDefault();
      const slide = popularButton.closest("[data-slide]");
      const title = normalizeText(slide && slide.querySelector(".feature-content h3"));
      openDetail(getStudioItem(title, slide));
      return;
    }

    const studioButton = target.closest(".studios-button");
    if (studioButton) {
      event.preventDefault();
      const slide = studioButton.closest("[data-slide]");
      const title = normalizeText(slide && slide.querySelector(".studios-text-card h3"));
      openDetail(getStudioItem(title, slide));
      return;
    }
  });

  const pageOrderForm = document.querySelector(".order-form");
  if (pageOrderForm) {
    pageOrderForm.addEventListener("submit", function (event) {
      event.preventDefault();
      openSuccess();
      openLayer();
    });
  }

  modalLayer.addEventListener("click", function (event) {
    if (event.target === modalLayer || event.target.closest(".js-modal-close")) {
      closeModal();
    }
  });

  if (orderWindow) {
    orderWindow.addEventListener("click", function (event) {
      const minusButton = event.target.closest(".modal-counter-minus");
      const plusButton = event.target.closest(".modal-counter-plus");

      if (!minusButton && !plusButton) {
        return;
      }

      const row = event.target.closest(".modal-order-row");

      if (!row) {
        return;
      }

      const countElement = row.querySelector(".modal-order-count");

      if (!countElement) {
        return;
      }

      let count = Number(countElement.textContent);

      if (minusButton) {
        count = Math.max(1, count - 1);
      }

      if (plusButton) {
        count += 1;
      }

      countElement.textContent = count;
      updateOrderTotal();
    });

    orderWindow.addEventListener("change", function (event) {
      const startInput = event.target.closest(".modal-date-start");
      const endInput = event.target.closest(".modal-date-end");

      if (!startInput && !endInput) {
        return;
      }

      const row = event.target.closest(".modal-order-row");

      if (!row) {
        return;
      }

      const rowStartInput = row.querySelector(".modal-date-start");
      const rowEndInput = row.querySelector(".modal-date-end");

      if (!rowStartInput || !rowEndInput) {
        return;
      }

      if (startInput) {
        rowEndInput.min = rowStartInput.value;

        if (rowEndInput.value && rowEndInput.value < rowStartInput.value) {
          rowEndInput.value = rowStartInput.value;
        }
      }

      if (
        endInput &&
        rowStartInput.value &&
        rowEndInput.value < rowStartInput.value
      ) {
        rowEndInput.value = rowStartInput.value;
      }
    });

    orderWindow.addEventListener("submit", function (event) {
      event.preventDefault();
      openSuccess();
    });
  }

  const orderButton = modalLayer.querySelector(".js-modal-order");
  if (orderButton) {
    orderButton.addEventListener("click", function () {
      openOrder(currentItem);
    });
  }

  const backButton = modalLayer.querySelector(".js-modal-back");
  if (backButton) {
    backButton.addEventListener("click", function () {
      if (previousWindow === detailWindow && currentItem) {
        showWindow(detailWindow);
        return;
      }

      closeModal();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalLayer.classList.contains("is-open")) {
      closeModal();
    }
  });

  function normalizeText(element) {
    return element ? element.textContent.trim().replace(/\s+/g, " ") : "";
  }

  function getStudioItem(title, slide) {
    if (studioData[title]) {
      return studioData[title];
    }

    const imageElement = slide ? slide.querySelector("img") : null;
    const descriptionElement = slide ? slide.querySelector("p") : null;

    return {
      title: title || "Студия",
      description: normalizeText(descriptionElement) || "Атмосферная студия для творческой съёмки.",
      image: imageElement ? imageElement.getAttribute("src") : "mainPhoto.svg",
      alt: imageElement ? imageElement.getAttribute("alt") : title,
      price: 3200,
      features: [
        ["Формат:", "аренда студии"],
        ["Подходит для:", "фотосессии"],
        ["Свет:", "студийный"],
        ["Вместимость:", "до 5 человек"],
      ],
    };
  }

  function openDetail(item) {
    if (!item || !detailWindow) {
      return;
    }

    currentItem = item;
    previousWindow = null;
    clearSuccessTimer();

    detailWindow.querySelector(".modal-window-name").textContent = "STUDIO";
    detailWindow.querySelector("#modal-detail-title").textContent = item.title;
    detailWindow.querySelector(".modal-detail-description").textContent = item.description;

    const imageWrap = detailWindow.querySelector(".modal-detail-image");
    const image = imageWrap.querySelector("img");

    image.src = item.image;
    image.alt = item.alt || item.title;

    const features = detailWindow.querySelector(".modal-detail-features");
    features.innerHTML = "";

    item.features.forEach(function (feature) {
      const featureElement = document.createElement("div");
      featureElement.className = "modal-feature";
      featureElement.innerHTML =
        "<b>" + feature[0] + "</b><span>" + feature[1] + "</span>";

      features.appendChild(featureElement);
    });

    openLayer();
    showWindow(detailWindow);
  }

  function openOrder(item) {
    if (!orderWindow) {
      return;
    }

    currentItem = item || currentItem || {
      title: "Фотосессия",
      price: 0,
    };

    previousWindow = detailWindow && !detailWindow.hidden ? detailWindow : null;
    clearSuccessTimer();

    const list = orderWindow.querySelector(".modal-order-list");

    const mainPrice = Number(currentItem.price || 0);
    const secondItemTitle = currentItem.title === "Фотосессия" ? "Консультация" : "Подготовка студии";
    const secondPrice = currentItem.title === "Фотосессия" ? 0 : 620;

    list.innerHTML =
      createOrderItem(currentItem.title || "Фотосессия", mainPrice) +
      createOrderItem(secondItemTitle, secondPrice);

    updateOrderTotal();

    openLayer();
    showWindow(orderWindow);
  }

  function createOrderItem(title, price) {
    return `
      <div class="modal-order-row" data-price="${price}">
        <div class="modal-order-item">
          <span>${title}</span>
          <span class="modal-order-dots"></span>
          <button class="modal-counter-btn modal-counter-minus" type="button" aria-label="Уменьшить">−</button>
          <span><span class="modal-order-count">1</span> шт.</span>
          <button class="modal-counter-btn modal-counter-plus" type="button" aria-label="Увеличить">+</button>
        </div>

        <div class="modal-order-date-row">
          <span>с</span>
          <input class="modal-date-input modal-date-start" type="date" aria-label="Дата начала">
          <span>до</span>
          <input class="modal-date-input modal-date-end" type="date" aria-label="Дата окончания">
        </div>
      </div>
    `;
  }

  function updateOrderTotal() {
    if (!orderWindow) {
      return;
    }

    const rows = Array.from(orderWindow.querySelectorAll(".modal-order-row"));
    let total = 0;

    rows.forEach(function (row) {
      const price = Number(row.dataset.price || 0);
      const countElement = row.querySelector(".modal-order-count");
      const count = Number(countElement ? countElement.textContent : 1);

      total += price * count;
    });

    const priceElement = orderWindow.querySelector(".modal-order-price");

    if (priceElement) {
      priceElement.textContent = total + " руб.";
    }
  }

  function openSuccess() {
    if (!successWindow) {
      return;
    }

    clearSuccessTimer();
    previousWindow = null;
    openLayer();
    showWindow(successWindow);

    successTimer = setTimeout(function () {
      closeModal();
    }, 7000);
  }

  function openLayer() {
    modalLayer.classList.add("is-open");
    modalLayer.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function showWindow(activeWindow) {
    [detailWindow, orderWindow, successWindow].forEach(function (modalWindow) {
      if (modalWindow) {
        modalWindow.hidden = modalWindow !== activeWindow;
      }
    });
  }

  function closeModal() {
    clearSuccessTimer();
    modalLayer.classList.remove("is-open");
    modalLayer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    previousWindow = null;

    [detailWindow, orderWindow, successWindow].forEach(function (modalWindow) {
      if (modalWindow) {
        modalWindow.hidden = true;
      }
    });
  }

  function clearSuccessTimer() {
    if (successTimer) {
      clearTimeout(successTimer);
      successTimer = null;
    }
  }
}

function initProfileModal() {
  const profileLinks = document.querySelectorAll(".js-profile-open");
  const modalLayer = document.querySelector(".profile-modal-layer");

  if (!profileLinks.length || !modalLayer) {
    return;
  }

  document.body.appendChild(modalLayer);

  const windowTitle = modalLayer.querySelector(".profile-window-title");
  const tabs = Array.from(modalLayer.querySelectorAll(".profile-tab"));
  const forms = Array.from(modalLayer.querySelectorAll(".profile-form"));
  const closeButtons = modalLayer.querySelectorAll(".js-profile-close");

  let profileUrl = "/SiteDesign2026/fifth%20screen/index.html";

  profileLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      profileUrl = link.getAttribute("href") || profileUrl;
      openProfileModal("login");
    });
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      openProfileModal(tab.dataset.profileTab);
    });
  });

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      document.body.classList.add("page-leaving");

      setTimeout(function () {
        window.location.href = profileUrl;
      }, 160);
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeProfileModal);
  });

  modalLayer.addEventListener("click", function (event) {
    if (event.target === modalLayer) {
      closeProfileModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalLayer.classList.contains("is-open")) {
      closeProfileModal();
    }
  });

  function openProfileModal(activeTab) {
    const tabName = activeTab === "register" ? "register" : "login";

    modalLayer.classList.add("is-open");
    modalLayer.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-modal-open");

    tabs.forEach(function (tab) {
      tab.classList.toggle("is-active", tab.dataset.profileTab === tabName);
    });

    forms.forEach(function (form) {
      form.classList.toggle("is-active", form.dataset.profileForm === tabName);
    });

    if (windowTitle) {
      windowTitle.textContent = tabName === "register" ? "REGISTERED" : "ENTER";
    }
  }

  function closeProfileModal() {
    modalLayer.classList.remove("is-open");
    modalLayer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("profile-modal-open");
  }
}
