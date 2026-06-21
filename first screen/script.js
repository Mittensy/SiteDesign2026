const PAGE_TRANSITION_DELAY = 160;
const SUCCESS_MODAL_DELAY = 7000;

document.addEventListener("DOMContentLoaded", function () {
  initBurgerMenu();
  initModelsSlider();
  initOpportunitiesSlider();
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

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      burger.classList.remove("is-open");
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
}

function initModelsSlider() {
  const sliderElement = document.querySelector(".models-slider");

  if (!sliderElement || typeof Swiper === "undefined") {
    return;
  }

  const wrapper = sliderElement.querySelector(".swiper-wrapper");
  const bullets = Array.from(document.querySelectorAll(".models-pagination .models-bullet"));

  if (!wrapper || bullets.length === 0) {
    return;
  }

  const originalSlides = Array.from(wrapper.children).slice(0, 3);
  const uniqueSlidesCount = originalSlides.length;

  if (uniqueSlidesCount === 0) {
    return;
  }

  wrapper.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    originalSlides.forEach(function (slide) {
      wrapper.appendChild(slide.cloneNode(true));
    });
  }

  const modelsSwiper = new Swiper(sliderElement, {
    loop: false,
    speed: 700,
    centeredSlides: false,
    initialSlide: uniqueSlidesCount,
    slidesPerView: 1,
    spaceBetween: 0,
    allowTouchMove: false,
    simulateTouch: false,
    observer: true,
    observeParents: true,
    watchOverflow: false,
    navigation: {
      nextEl: ".models-next",
      prevEl: ".models-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: false,
      },
      769: {
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: false,
      },
      1025: {
        slidesPerView: 3,
        spaceBetween: 0,
        centeredSlides: true,
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
      modelsSwiper.slideTo(uniqueSlidesCount + index);
    });
  });

  function getRealIndex(swiper) {
    return ((swiper.activeIndex % uniqueSlidesCount) + uniqueSlidesCount) % uniqueSlidesCount;
  }

  function normalizeInfinitePosition(swiper) {
    if (
      swiper.activeIndex < uniqueSlidesCount ||
      swiper.activeIndex >= uniqueSlidesCount * 2
    ) {
      swiper.slideTo(uniqueSlidesCount + getRealIndex(swiper), 0, false);
    }

    updateModelsPagination(swiper);
  }

  function updateModelsPagination(swiper) {
    const realIndex = getRealIndex(swiper);

    bullets.forEach(function (bullet, index) {
      bullet.classList.toggle("is-active", index === realIndex);
    });
  }
}

function initOpportunitiesSlider() {
  const opportunitiesSliderElement = document.querySelector(".opportunities-slider");

  if (!opportunitiesSliderElement || typeof Swiper === "undefined") {
    return;
  }

  new Swiper(opportunitiesSliderElement, {
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
      nextEl: ".opportunities-next",
      prevEl: ".opportunities-prev",
    },
    pagination: {
      el: ".opportunities-pagination",
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

function initMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement || !window.google || !google.maps) {
    return;
  }

  const mapStyles = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#000000" }, { lightness: 13 }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#08304b" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#0c4152" }, { lightness: 5 }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0b434f" }, { lightness: 25 }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0b3d51" }, { lightness: 16 }],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ color: "#146474" }],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ color: "#021019" }],
    },
  ];

  const center = { lat: 59.9343, lng: 30.3351 };

  const map = new google.maps.Map(mapElement, {
    center: center,
    zoom: 12,
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  });

  new google.maps.Marker({
    position: center,
    map: map,
    title: "Коллаж",
  });
}

window.initMap = initMap;

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

  let profileUrl = "../fifth%20screen/index.html";

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
    models: {
      "CANON EOS 5D": {
        type: "model",
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
        type: "model",
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
        type: "model",
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
    locations: {
      "Y2K студия": {
        type: "location",
        windowName: "STUDIO",
        title: "Y2K студия",
        description:
          "Яркая студия в эстетике 2000-х: глянец, неон, дерзкие детали и настроение клипов MTV.",
        image: "wasingmachine.svg",
        alt: "Y2K студия",
        price: 3200,
        features: [
          ["Площадь студии:", "38 м²"],
          ["Оснащение:", "неон, реквизит"],
          ["Высота потолков:", "3,2 м"],
          ["Гримерная:", "24 м²"],
        ],
      },
      "Домашняя студия": {
        type: "location",
        windowName: "STUDIO",
        title: "Домашняя студия",
        description:
          "Уютная студия с тёплой атмосферой для семейных фотосессий, съёмок с детьми и нежных памятных кадров.",
        image: "girlonSofa.svg",
        alt: "Домашняя студия",
        price: 3400,
        features: [
          ["Площадь студии:", "45 м²"],
          ["Оснащение:", "кондиционер"],
          ["Высота потолков:", "3,4 м"],
          ["Софтбоксы:", "60×90 см"],
          ["Окна:", "2,2 м на 1,2 м"],
          ["Отражатели:", "5 в 1"],
          ["Гримерная:", "34 м²"],
        ],
      },
      "Киберпанк студия": {
        type: "location",
        windowName: "STUDIO",
        title: "Киберпанк студия",
        description:
          "Футуристическое пространство с неоновым светом, тёмными фактурами и атмосферой цифрового города.",
        image: "ergoproxi.svg",
        alt: "Киберпанк студия",
        price: 3600,
        features: [
          ["Площадь студии:", "42 м²"],
          ["Оснащение:", "неон, дым"],
          ["Высота потолков:", "3,1 м"],
          ["Свет:", "RGB панели"],
        ],
      },
    },
    services: {
      "Фото ретушь": {
        type: "service",
        windowName: "SERVICE",
        title: "Фото ретушь",
        description:
          "Аккуратно работаем с цветом, светом, кожей, деталями кадра и общей стилистикой изображения.",
        image: "japane6.svg",
        alt: "Фото ретушь",
        price: 1500,
        features: [
          ["Срок выполнения:", "от 2 дней"],
          ["Формат:", "JPG / TIFF"],
          ["Коррекция:", "цвет и свет"],
          ["Результат:", "цифровой файл"],
        ],
      },
      "Восстановление фото": {
        type: "service",
        windowName: "SERVICE",
        title: "Восстановление фото",
        description:
          "Восстанавливаем старые и повреждённые снимки: убираем царапины, заломы, пыль и возвращаем аккуратный вид.",
        image: "restovration.svg",
        alt: "Восстановление фото",
        price: 1800,
        features: [
          ["Срок выполнения:", "от 3 дней"],
          ["Очистка:", "царапины и пыль"],
          ["Цвет:", "коррекция тона"],
          ["Формат:", "цифровая копия"],
        ],
      },
      "Создание веб-архива": {
        type: "service",
        windowName: "SERVICE",
        title: "Создание веб-архива",
        description:
          "Создаём удобный онлайн-архив для фотографий, который можно просматривать, хранить и отправлять близким.",
        image: "webarchive.svg",
        alt: "Создание веб-архива",
        price: 4200,
        features: [
          ["Объём:", "до 500 фото"],
          ["Доступ:", "по ссылке"],
          ["Сортировка:", "по альбомам"],
          ["Хранение:", "12 месяцев"],
        ],
      },
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

    const modelButton = target.closest(".model-more-btn");

    if (modelButton) {
      const card = modelButton.closest(".model-card");
      const title = normalizeText(card && card.querySelector("h4"));

      openDetail(modalData.models[title]);
      return;
    }

    const locationButton = target.closest(".location-text > button");

    if (locationButton) {
      const card = locationButton.closest(".location-card");
      const title = normalizeText(card && card.querySelector(".location-text h3"));

      openDetail(modalData.locations[title]);
      return;
    }

    const serviceButton = target.closest(".opportunities-text > button");

    if (serviceButton) {
      const slide = serviceButton.closest(".opportunities-inner");
      const title = normalizeText(slide && slide.querySelector(".opportunities-text h3"));

      openDetail(modalData.services[title]);
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

  function openDetail(item) {
    if (!item || !detailWindow) {
      return;
    }

    currentItem = item;
    previousWindow = null;
    clearSuccessTimer();

    detailWindow.querySelector(".modal-window-name").textContent = item.windowName || "CAMERA";
    detailWindow.querySelector("#modal-detail-title").textContent = item.title;
    detailWindow.querySelector(".modal-detail-description").textContent = item.description;

    const imageWrap = detailWindow.querySelector(".modal-detail-image");
    const image = imageWrap.querySelector("img");

    image.src = item.image;
    image.alt = item.alt || item.title;

    imageWrap.classList.toggle("is-camera", item.type === "model");

    const features = detailWindow.querySelector(".modal-detail-features");

    features.innerHTML = "";

    item.features.forEach(function (feature) {
      const featureElement = document.createElement("div");

      featureElement.className = "modal-feature";
      featureElement.innerHTML = "<b>" + feature[0] + "</b><span>" + feature[1] + "</span>";

      features.appendChild(featureElement);
    });

    openLayer();
    showWindow(detailWindow);
  }

  function openOrder(item) {
    if (!orderWindow) {
      return;
    }

    currentItem =
      item ||
      currentItem || {
        title: "Заявка",
        price: 0,
      };

    previousWindow = detailWindow && !detailWindow.hidden ? detailWindow : null;
    clearSuccessTimer();

    const list = orderWindow.querySelector(".modal-order-list");
    const mainPrice = Number(currentItem.price || 0);
    const secondItemTitle =
      currentItem.type === "model" ? "Olympus OM-1" : "Дополнительная услуга";
    const secondPrice = currentItem.type === "contact" ? 0 : 620;

    list.innerHTML =
      createOrderItem(currentItem.title || "Заявка", mainPrice) +
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