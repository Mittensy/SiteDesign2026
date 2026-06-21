const PAGE_TRANSITION_DELAY = 160;
const SUCCESS_MODAL_DELAY = 7000;

document.addEventListener("DOMContentLoaded", function () {
  initBurgerMenu();
  initTypesSlider();
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

  function closeMenu() {
    burger.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", function () {
    const isOpen = burger.classList.toggle("is-open");

    nav.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

function initTypesSlider() {
  const sliderElement = document.querySelector(".types-slider");

  if (!sliderElement || typeof Swiper === "undefined") {
    return;
  }

  new Swiper(sliderElement, {
    loop: true,
    speed: 700,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".types-next",
      prevEl: ".types-prev",
    },
    pagination: {
      el: ".types-pagination",
      clickable: true,
      bulletClass: "models-bullet",
      bulletActiveClass: "is-active",
      renderBullet: function (index, className) {
        return (
          '<button class="' +
          className +
          '" type="button" aria-label="Слайд ' +
          (index + 1) +
          '"></button>'
        );
      },
    },
    observer: true,
    observeParents: true,
  });
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
      }, PAGE_TRANSITION_DELAY);
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

function initPageTransitions() {
  const links = document.querySelectorAll("a[href]");

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || link.classList.contains("js-profile-open")) {
        return;
      }

      const isServiceLink =
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:");

      const isNewTab = link.target === "_blank";
      const isDownload = link.hasAttribute("download");
      const isModifiedClick =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;

      if (
        event.defaultPrevented ||
        isServiceLink ||
        isNewTab ||
        isDownload ||
        isModifiedClick
      ) {
        return;
      }

      let nextUrl;

      try {
        nextUrl = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }

      const currentUrl = new URL(window.location.href);

      if (currentUrl.origin !== nextUrl.origin) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("page-leaving");

      setTimeout(function () {
        window.location.href = nextUrl.href;
      }, PAGE_TRANSITION_DELAY);
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

  const modalData = {
    "Восстановление плёнки": {
      windowName: "PROCESSING",
      title: "Восстановление плёнки",
      description:
        "Бережно восстанавливаем старые кадры, убираем повреждения, улучшаем цвет, чёткость и детали.",
      image: "plenkaMain.svg",
      alt: "Восстановление плёнки",
      price: 1800,
      features: [
        ["Срок:", "от 3 дней"],
        ["Материалы:", "сканы и фото"],
        ["Коррекция:", "цвет и детали"],
        ["Результат:", "цифровой файл"],
      ],
    },
    "Ретушь фото": {
      windowName: "PROCESSING",
      title: "Ретушь фото",
      description:
        "Аккуратно убираем лишние детали, корректируем кожу, свет, цвет и настроение кадра.",
      image: "plenkaMain2.svg",
      alt: "Ретушь фото",
      price: 1500,
      features: [
        ["Срок:", "от 2 дней"],
        ["Формат:", "JPG / TIFF"],
        ["Обработка:", "кожа и свет"],
        ["Стиль:", "естественный"],
      ],
    },
    "Цветокоррекция": {
      windowName: "PROCESSING",
      title: "Цветокоррекция",
      description:
        "Настраиваем свет, оттенки, контраст и атмосферу фотографии под выбранный стиль.",
      image: "plenkaMain3.svg",
      alt: "Цветокоррекция",
      price: 1200,
      features: [
        ["Срок:", "от 1 дня"],
        ["Настройка:", "свет и тон"],
        ["Стиль:", "плёнка / кино"],
        ["Результат:", "цифровой файл"],
      ],
    },
  };

  let currentItem = null;
  let previousWindow = null;
  let successTimer = null;

  const modalWindows = [detailWindow, orderWindow, successWindow].filter(Boolean);

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (target.closest(".models-nav, .models-bullet, .win95-btn:not(.js-modal-close)")) {
      return;
    }

    const serviceButton = target.closest(".types-content > button");

    if (serviceButton) {
      const slide = serviceButton.closest(".types-grid");
      const titleElement = slide && slide.querySelector(".types-content h3");
      const title = titleElement ? titleElement.textContent.trim().replace(/\s+/g, " ") : "";

      openDetail(modalData[title]);
    }
  });

  const orderForm = document.querySelector(".order-form");

  if (orderForm) {
    orderForm.addEventListener("submit", function (event) {
      event.preventDefault();
      openSuccess();
    });
  }

  modalLayer.addEventListener("click", function (event) {
    if (event.target === modalLayer || event.target.closest(".js-modal-close")) {
      closeModal();
    }
  });

  if (orderWindow) {
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

  function openDetail(item) {
    if (!item || !detailWindow) {
      return;
    }

    currentItem = item;
    previousWindow = null;
    clearSuccessTimer();

    detailWindow.querySelector(".modal-window-name").textContent = item.windowName;
    detailWindow.querySelector("#modal-detail-title").textContent = item.title;
    detailWindow.querySelector(".modal-detail-description").textContent = item.description;

    const imageWrap = detailWindow.querySelector(".modal-detail-image");
    const image = imageWrap && imageWrap.querySelector("img");

    if (image) {
      image.src = item.image;
      image.alt = item.alt || item.title;
    }

    const features = detailWindow.querySelector(".modal-detail-features");

    if (features) {
      features.innerHTML = "";

      item.features.forEach(function (feature) {
        const featureElement = document.createElement("div");

        featureElement.className = "modal-feature";
        featureElement.innerHTML = "<b>" + feature[0] + "</b><span>" + feature[1] + "</span>";
        features.appendChild(featureElement);
      });
    }

    openLayer();
    showWindow(detailWindow);
  }

  function openOrder(item) {
    if (!orderWindow) {
      return;
    }

    currentItem = item || currentItem || { title: "Заявка", price: 0 };
    previousWindow = detailWindow && !detailWindow.hidden ? detailWindow : null;
    clearSuccessTimer();

    const list = orderWindow.querySelector(".modal-order-list");
    const priceElement = orderWindow.querySelector(".modal-order-price");

    if (list) {
      list.innerHTML = createOrderItem(currentItem.title || "Заявка", Number(currentItem.price || 0));
    }

    if (priceElement) {
      priceElement.textContent = Number(currentItem.price || 0) + " руб.";
    }

    openLayer();
    showWindow(orderWindow);
  }

  function createOrderItem(title, price) {
    return `
      <div class="modal-order-row" data-price="${price}">
        <div class="modal-order-item">
          <span>${title}</span>
          <span class="modal-order-dots"></span>
          <span>1 шт.</span>
        </div>
      </div>
    `;
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
    }, SUCCESS_MODAL_DELAY);
  }

  function openLayer() {
    modalLayer.classList.add("is-open");
    modalLayer.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function showWindow(activeWindow) {
    modalWindows.forEach(function (modalWindow) {
      modalWindow.hidden = modalWindow !== activeWindow;
    });
  }

  function closeModal() {
    clearSuccessTimer();
    modalLayer.classList.remove("is-open");
    modalLayer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    previousWindow = null;

    modalWindows.forEach(function (modalWindow) {
      modalWindow.hidden = true;
    });
  }

  function clearSuccessTimer() {
    if (successTimer) {
      clearTimeout(successTimer);
      successTimer = null;
    }
  }
}
