const PAGE_TRANSITION_DELAY = 160;
const SUCCESS_MODAL_DELAY = 7000;

document.addEventListener("DOMContentLoaded", function () {
  initBurgerMenu();
  initModelsSlider();
  initCatalog();
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
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  });
}

function initModelsSlider() {
  const section = document.querySelector(".popular-models");
  const sliderElement = section?.querySelector(".models-slider");

  if (!section || !sliderElement || typeof Swiper === "undefined") {
    return;
  }

  const wrapper = sliderElement.querySelector(".swiper-wrapper");
  const bullets = section.querySelectorAll(".models-pagination .models-bullet");

  if (!wrapper || bullets.length === 0) {
    return;
  }

  const originalSlides = Array.from(wrapper.children).slice(0, 3);
  const preparedSlides = originalSlides.map(function (slide) {
    return slide.cloneNode(true);
  });

  wrapper.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    preparedSlides.forEach(function (slide) {
      wrapper.appendChild(slide.cloneNode(true));
    });
  }

  const uniqueSlidesCount = 3;

  const modelsSwiper = new Swiper(sliderElement, {
    loop: false,
    speed: 1300,
    centeredSlides: true,
    initialSlide: 4,

    slidesPerView: 1.2,
    spaceBetween: 0,

    allowTouchMove: false,
    simulateTouch: false,
    shortSwipes: false,
    longSwipes: false,
    slideToClickedSlide: false,

    watchSlidesProgress: true,
    observer: true,
    observeParents: true,
    roundLengths: true,
    watchOverflow: false,

    navigation: {
      nextEl: section.querySelector(".models-next"),
      prevEl: section.querySelector(".models-prev"),
    },

    breakpoints: {
      0: {
        slidesPerView: 1.2,
        spaceBetween: 0,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
    },

    on: {
      init: function () {
        updateModelsPagination(this);
      },

      slideChange: function () {
        updateModelsPagination(this);
      },

      slideChangeTransitionEnd: function () {
        normalizeInfinitePosition(this);
      },
    },
  });

  bullets.forEach(function (bullet, index) {
    bullet.addEventListener("click", function () {
      modelsSwiper.slideTo(index + 3);
    });
  });

  function normalizeInfinitePosition(swiper) {
    if (swiper.activeIndex <= 2 || swiper.activeIndex >= 6) {
      const normalizedIndex =
        ((swiper.activeIndex % uniqueSlidesCount) + uniqueSlidesCount) %
          uniqueSlidesCount +
        3;

      swiper.slideTo(normalizedIndex, 0, false);
    }

    updateModelsPagination(swiper);
  }

  function updateModelsPagination(swiper) {
    const realIndex =
      ((swiper.activeIndex % uniqueSlidesCount) + uniqueSlidesCount) %
      uniqueSlidesCount;

    bullets.forEach(function (bullet, index) {
      bullet.classList.toggle("is-active", index === realIndex);
    });
  }
}

function initCatalog() {
  const catalog = document.querySelector(".catalog");

  if (!catalog) {
    return;
  }

  const list = catalog.querySelector(".catalog-list");
  const cards = Array.from(catalog.querySelectorAll(".catalog-card"));

  const yearSelect = catalog.querySelector("#catalog-year");
  const typeSelect = catalog.querySelector("#catalog-type");
  const sortSelect = catalog.querySelector("#catalog-sort");

  const prevBtn = catalog.querySelector(".catalog-prev");
  const nextBtn = catalog.querySelector(".catalog-next");
  const pagination = catalog.querySelector(".catalog-pagination");
  const emptyMessage = catalog.querySelector(".catalog-empty");

  if (
    !list ||
    !yearSelect ||
    !typeSelect ||
    !sortSelect ||
    !prevBtn ||
    !nextBtn ||
    !pagination ||
    !emptyMessage
  ) {
    return;
  }

  const cardsPerPage = 9;
  let currentPage = 1;
  let catalogRenderTimer = null;

  function getYearGroup(year) {
    if (year < 1990) return "old";
    if (year >= 1990 && year <= 1999) return "1990s";
    if (year >= 2000 && year <= 2009) return "2000s";
    if (year >= 2010 && year <= 2019) return "2010s";
    if (year >= 2020) return "2020s";

    return "all";
  }

  function getFilteredCards() {
    const selectedYear = yearSelect.value;
    const selectedType = typeSelect.value;
    const selectedSort = sortSelect.value;

    let filteredCards = cards.filter(function (card) {
      const cardYear = Number(card.dataset.year);
      const cardType = card.dataset.type;

      const matchesYear =
        selectedYear === "all" || getYearGroup(cardYear) === selectedYear;

      const matchesType = selectedType === "all" || cardType === selectedType;

      return matchesYear && matchesType;
    });

    if (selectedSort === "name") {
      filteredCards.sort(function (a, b) {
        const nameA = a.querySelector("h3").textContent.trim();
        const nameB = b.querySelector("h3").textContent.trim();

        return nameA.localeCompare(nameB, "ru");
      });
    }

    if (selectedSort === "year-new") {
      filteredCards.sort(function (a, b) {
        return Number(b.dataset.year) - Number(a.dataset.year);
      });
    }

    if (selectedSort === "year-old") {
      filteredCards.sort(function (a, b) {
        return Number(a.dataset.year) - Number(b.dataset.year);
      });
    }

    return filteredCards;
  }

  function renderCatalog(withAnimation = false) {
    clearTimeout(catalogRenderTimer);

    if (!withAnimation) {
      updateCatalogContent();
      return;
    }

    list.classList.add("is-changing");

    catalogRenderTimer = setTimeout(function () {
      updateCatalogContent();

      requestAnimationFrame(function () {
        list.classList.remove("is-changing");
      });
    }, 220);
  }

  function updateCatalogContent() {
    const filteredCards = getFilteredCards();
    const totalPages = Math.max(
      1,
      Math.ceil(filteredCards.length / cardsPerPage)
    );

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    cards.forEach(function (card) {
      card.hidden = true;
    });

    filteredCards.forEach(function (card) {
      list.appendChild(card);
    });

    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    filteredCards.slice(startIndex, endIndex).forEach(function (card) {
      card.hidden = false;
    });

    emptyMessage.hidden = filteredCards.length !== 0;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || filteredCards.length === 0;

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const bullet = document.createElement("button");

      bullet.type = "button";
      bullet.className = "models-bullet";
      bullet.setAttribute("aria-label", `Страница ${i}`);

      if (i === currentPage) {
        bullet.classList.add("is-active");
      }

      bullet.addEventListener("click", function () {
        if (currentPage === i) {
          return;
        }

        currentPage = i;
        renderCatalog(true);
      });

      pagination.appendChild(bullet);
    }
  }

  function resetPageAndRender() {
    currentPage = 1;
    renderCatalog(true);
  }

  yearSelect.addEventListener("change", resetPageAndRender);
  typeSelect.addEventListener("change", resetPageAndRender);
  sortSelect.addEventListener("change", resetPageAndRender);

  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      renderCatalog(true);
    }
  });

  nextBtn.addEventListener("click", function () {
    const totalPages = Math.ceil(getFilteredCards().length / cardsPerPage);

    if (currentPage < totalPages) {
      currentPage++;
      renderCatalog(true);
    }
  });

  renderCatalog();
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

  let profileUrl = "/fifth screen/index.html";

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

      if (!href) {
        return;
      }

      if (link.classList.contains("js-profile-open")) {
        return;
      }

      const isAnchor = href.startsWith("#");
      const isMail = href.startsWith("mailto:");
      const isPhone = href.startsWith("tel:");
      const isBlank = link.target === "_blank";
      const isDownload = link.hasAttribute("download");
      const isModifiedClick =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;

      if (
        event.defaultPrevented ||
        isAnchor ||
        isMail ||
        isPhone ||
        isBlank ||
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

  const cameraPrices = {
    "CANON EOS 5D": 1960,
    "CANON EOS M10": 1960,
    "KODAK PIXPRO FZ55": 1480,
    "SAMSUNG FINO 35SE": 1240,
    "OLYMPUS OM-1": 1680,
    "PENTAX ESPIO 200": 1180,
    "POLAROID ONESTEP": 1320,
    "CANON POWERSHOT G9 X": 1560,
    "CANON POWERSHOT A35": 980,
    "NIKON L35AF": 1580,
    "OLYMPUS MJU I": 1420,
    "OLYMPUS MJU II": 1760,
    "CANON AE-1 PROGRAM": 1740,
    "PENTAX K1000": 1620,
    "POLAROID 600": 1360,
    "SONY CYBER-SHOT DSC-F505": 1280,
    "CANON POWERSHOT G2": 1180,
    "SONY CYBER-SHOT W50": 980,
    "CANON IXUS 80 IS": 960,
    "FUJIFILM FINEPIX JX250": 940,
    "SONY NEX-5N": 1860,
    "FUJIFILM X-T1": 2140,
    "CANON EOS 80D": 2260,
    "CANON EOS R50": 2480,
  };

  const modalData = {
    models: {
      "CANON EOS 5D": {
        type: "camera",
        windowName: "CAMERA",
        title: "Canon EOS 5D",
        description:
          "Полнокадровая камера для выразительных портретов, студийных съёмок и кадров с мягкой глубиной резкости.",
        image: "leftcamera.svg",
        alt: "Canon EOS 5D",
        price: 1960,
        features: [
          ["Разрешение матрицы:", "12.8 МПикс"],
          ["Байонет:", "Canon EF"],
          ["Качество видеосъёмки:", "FullHD"],
          ["Фокусное расстояние:", "24–105 мм"],
        ],
      },

      "CANON EOS M10": {
        type: "camera",
        windowName: "CAMERA",
        title: "Canon EOS M10",
        description:
          "Лёгкая и компактная фотокамера без проблем помещается в кармане и в небольшой сумке.",
        image: "maincamera.svg",
        alt: "Canon EOS M10",
        price: 1960,
        features: [
          ["Разрешение матрицы:", "21.14 МПикс"],
          ["Байонет:", "отсутствует"],
          ["Качество видеосъёмки:", "FullHD (1920×1080 Пикс)"],
          ["Фокусное расстояние:", "50–200 мм"],
        ],
      },

      "KODAK PIXPRO FZ55": {
        type: "camera",
        windowName: "CAMERA",
        title: "Kodak Pixpro FZ55",
        description:
          "Компактная цифровая камера для прогулок, поездок и быстрых атмосферных снимков без сложных настроек.",
        image: "rightcamera.svg",
        alt: "Kodak Pixpro FZ55",
        price: 1480,
        features: [
          ["Разрешение матрицы:", "16.3 МПикс"],
          ["Зум:", "5× оптический"],
          ["Качество видеосъёмки:", "FullHD"],
          ["Фокусное расстояние:", "28–140 мм"],
        ],
      },
    },
  };

  let currentItem = null;
  let previousWindow = null;
  let successTimer = null;

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (
      target.closest(
        ".models-nav, .models-bullet, .catalog-filter-select, .win95-btn:not(.js-modal-close), .accordion summary"
      )
    ) {
      return;
    }

    const modelButton = target.closest(".model-more-btn");
    if (modelButton) {
      const card = modelButton.closest(".model-card");
      const title = normalizeText(card && card.querySelector("h4"));
      openDetail(modalData.models[title]);
      return;
    }

    const catalogButton = target.closest(".catalog-card > button");
    if (catalogButton) {
      const card = catalogButton.closest(".catalog-card");
      openDetail(createCatalogModalItem(card));
      return;
    }

    const heroButton = target.closest(".hero-content > button");
    if (heroButton) {
      openOrder({
        type: "contact",
        windowName: "CART",
        title: "Консультация",
        price: 0,
      });
    }
  });

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

  function createCatalogModalItem(card) {
    if (!card) {
      return null;
    }

    const title = normalizeText(card.querySelector("h3"));
    const description = normalizeText(card.querySelector("p"));
    const image = card.querySelector("img");
    const year = card.dataset.year || "—";
    const type = card.dataset.type || "digital";
    const typeName = getCameraTypeName(type);
    const price = getCameraPrice(title, type);

    return {
      type: "camera",
      windowName: "CAMERA",
      title: title,
      description: description,
      image: image ? image.getAttribute("src") : "",
      alt: image ? image.getAttribute("alt") : title,
      price: price,
      features: [
        ["Год выпуска:", year],
        ["Тип камеры:", typeName],
        ["Стоимость аренды:", price + " руб."],
        ["Формат:", getCameraFormat(type)],
      ],
    };
  }

  function getCameraPrice(title, type) {
    const normalizedTitle = String(title || "").toUpperCase();

    if (cameraPrices[normalizedTitle]) {
      return cameraPrices[normalizedTitle];
    }

    if (type === "dslr") return 1960;
    if (type === "mirrorless") return 1860;
    if (type === "instant") return 1320;
    if (type === "film") return 1480;

    return 1180;
  }

  function getCameraTypeName(type) {
    const types = {
      film: "Плёночная",
      digital: "Цифровая",
      mirrorless: "Беззеркальная",
      dslr: "Зеркальная",
      instant: "Моментальная",
    };

    return types[type] || "Цифровая";
  }

  function getCameraFormat(type) {
    const formats = {
      film: "35 мм",
      digital: "цифровой файл",
      mirrorless: "фото / видео",
      dslr: "фото / видео",
      instant: "моментальная печать",
    };

    return formats[type] || "фото / видео";
  }

  function openDetail(item) {
    if (!item || !detailWindow) {
      return;
    }

    currentItem = item;
    previousWindow = null;
    clearSuccessTimer();

    detailWindow.querySelector(".modal-window-name").textContent =
      item.windowName || "CAMERA";

    detailWindow.querySelector("#modal-detail-title").textContent = item.title;
    detailWindow.querySelector(".modal-detail-description").textContent =
      item.description;

    const imageWrap = detailWindow.querySelector(".modal-detail-image");
    const image = imageWrap.querySelector("img");

    image.src = item.image;
    image.alt = item.alt || item.title;

    imageWrap.classList.add("is-camera");

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
      title: "Заявка",
      price: 0,
    };

    previousWindow = detailWindow && !detailWindow.hidden ? detailWindow : null;
    clearSuccessTimer();

    const list = orderWindow.querySelector(".modal-order-list");

    const mainPrice = Number(currentItem.price || 0);
    const secondItemTitle =
      currentItem.type === "contact" ? "" : "Комплект аксессуаров";
    const secondPrice = currentItem.type === "contact" ? 0 : 620;

    list.innerHTML = createOrderItem(currentItem.title || "Заявка", mainPrice);

    if (secondItemTitle) {
      list.innerHTML += createOrderItem(secondItemTitle, secondPrice);
    }

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
