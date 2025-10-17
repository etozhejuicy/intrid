let isMobile = window.innerWidth <= 992;
const header = document.querySelector(".header");
const menu = document.querySelector(".menu");
const menuOpenButtons = document.querySelectorAll("[data-menu]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const catalogCloseButtons = document.querySelectorAll("[data-catalog-close]");
const closeButtons = document.querySelectorAll("[btn-close-modal]");
const burgerButton = document.querySelector(".btn-burger");
const mapLinks = document.querySelectorAll('[data-modal-open="map"]');
const mapModal = document.querySelector("#map-wrapper");
const inputNumbers = document.querySelectorAll("[data-input-number]");
const inputPhones = document.querySelectorAll("[data-input-phone]");
const emailInputs = document.querySelectorAll('input[type="email"]');
const tabContainers = document.querySelectorAll(".tabs-container");
const notification = document.createElement("div");
const scrollToTopElem = document.querySelector("#scrollToTop");
const uagent = navigator.userAgent.toLowerCase();

let tooltip = null;
let tooltipIsInit = false;
let notificationTimer = null;

// glightbox
const lightbox = GLightbox({
  touchNavigation: true,
  loop: false,
  autoplayVideos: true,
  selector: '.glightbox',
});

window.addEventListener("scroll", setFixedHeader);

// Функция дебаунса
function debounce(func, delay) {
	let timeout;

	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), delay);
	};
}

function setFixedHeader() {
	if (window.scrollY >= header.offsetHeight / 2) {
		header.classList.add("scrolled");
	} else {
		header.classList.remove("scrolled");
	}
}

function openMenu(menuElem) {
	if (menuElem.getAttribute("data-menu") === "open") {
		menuElem.setAttribute("data-menu", "closed");
		menu.classList.remove("menu-show");
		document.documentElement.classList.remove("menu-open");
	} else {
		menuElem.setAttribute("data-menu", "open");
		menu.classList.add("menu-show");
		document.documentElement.classList.add("menu-open");
	}
}

function closeMenu() {
	document.querySelector(".btn-burger").setAttribute("data-menu", "closed");
	menu.classList.remove("menu-show");
	document.documentElement.classList.remove("menu-open");
}

// Обработчик событий для кнопки открытия меню
menuOpenButtons?.forEach((menuElem) => {
	menuElem?.addEventListener("click", () => {
		openMenu(menuElem);
	});
});

// Обработчик событий для кнопки закрытия меню
menuCloseButtons?.forEach((menuItem) => {
	menuItem?.addEventListener("click", () => {
		closeMenu();
	});
});

// Обработчик событий для закрытия каталога при клике вне каталога
document.addEventListener("click", (event) => {
	if (
		!Array.from(menuOpenButtons).some((button) =>
			button.contains(event.target)
		) &&
		!menu.contains(event.target)
	) {
		closeMenu();
	}
});

// Инициализация всех слайдеров
document.querySelectorAll(".slider").forEach((sliderElement) => {
	if (!sliderElement) return;

	if (sliderElement.id === "thumbnail-slider") {
		const slider = new Slider(sliderElement);

		sliders.push(slider);

		console.log(
			`Слайдер с id ${sliderElement.id} не будет инициализирован из-за ширины окна.`
		);

		return;
	}

	if (sliderElement.dataset.sliderInit === "true") {
		// Остальные в работе
		const slider = new Slider(sliderElement);

		sliders.push(slider);
	} else {
		// Этот слайдер не будет запущен
		console.log(
			`Слайдер с id ${sliderElement.id} не будет инициализирован.`
		);
	}
});

class Modal {
	constructor() {
		this.openButtons = document.querySelectorAll("[data-modal-open]");
		this.closeButtons = document.querySelectorAll("[data-modal-close]");
		this.generateButtons = document.querySelectorAll(
			"[data-modal-generate]"
		);
		this.title = "";
		this.content = "";
		this.selector = "";
		this.events();
	}

	events() {
		this.openButtons.forEach((openButton) => {
			openButton.addEventListener("click", (e) => {
				try {
					const modalKey = e.currentTarget.dataset.modalOpen;
					const modal = document.querySelector(
						'[data-modal-id="' + modalKey + '"]'
					);

					e.currentTarget.dataset.modalTitle
						? (this.title = e.currentTarget.dataset.modalTitle)
						: null;
					e.currentTarget.dataset.modalContent
						? (this.content = e.currentTarget.dataset.modalContent)
						: null;
					e.currentTarget.dataset.modalClass
						? (this.selector = e.currentTarget.dataset.modalClass)
						: null;

					this.open(modal);
				} catch (error) {
					console.error(
						`Ошибка, окно не найдено: ${e.currentTarget.dataset.modalOpen} \n ${error}`
					);
				}
			});
		});

		this.generateButtons.forEach((generateButton) => {
			generateButton.addEventListener("click", (e) => {
				try {
					const existModal = document.querySelector(
						'[data-modal-id="' +
							e.currentTarget.dataset.modalGenerate +
							'"]'
					);

					this.title = e.currentTarget.dataset.modalTitle;
					this.content = e.currentTarget.dataset.modalContent;
					this.selector = e.currentTarget.dataset.modalClass;

					if (
						existModal &&
						e.currentTarget.dataset.modalGenerate ===
							existModal.dataset.modalId
					) {
						this.open(existModal);
					} else {
						this.generate(e);
					}
				} catch (error) {
					console.error(error);
				}
			});
		});

		this.closeButtons.forEach((closeButton) => {
			closeButton.addEventListener("click", () => {
				try {
					const modal = closeButton.closest(".modal");

					if (modal) {
						this.close(modal);
					}
				} catch (error) {
					console.error(error);
				}
			});
		});

		window.addEventListener("click", (event) => {
			const modals = document.querySelectorAll(".modal");

			modals.forEach((modal) => {
				if (
					event.target === modal ||
					event.target.closest("[data-modal-close]")
				) {
					this.close(modal);
				}
			});
		});
	}

	generate(e) {
		const modal = document.createElement("div");

		modal.innerHTML = `
            <button class="btn btn-close" data-modal-close>
              <i class="icon-cross"></i>
            </button>
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-title h2"></div>
                <div class="modal-body"></div>
              </div>
            </div>
          `;

		modal.classList.add("modal");
		modal.dataset.modalId = e.currentTarget.dataset.modalGenerate;

		document.body.append(modal);

		setTimeout(() => {
			this.open(modal);
		}, 50);
	}

	create(options = {}) {
		const {
			id = `modal-${Date.now()}`,
			title = "",
			content = "",
			className = "",
			showImmediately = true,
		} = options;

		// Проверяем, существует ли уже модальное окно с таким id
		let modal = document.querySelector(`[data-modal-id="${id}"]`);

		if (!modal) {
			// Создаем новое модальное окно
			modal = document.createElement("div");
			modal.classList.add("modal");
			modal.dataset.modalId = id;

			modal.innerHTML = `
				<button class="btn btn-close" data-modal-close>
					<i class="icon-cross"></i>
				</button>
				<div class="modal-dialog">
					<div class="modal-content">
						${title ? `<div class="modal-title h2">${title}</div>` : ""}
						${content ? `<div class="modal-body">${content}</div>` : ""}
					</div>
				</div>
			`;

			document.body.append(modal);

			// Добавляем кастомный класс если указан
			if (className) {
				modal.classList.add(className);
			}
		} else {
			// Обновляем существующее модальное окно
			this.setup(modal, title, content, className);
		}

		// Показываем модальное окно если требуется
		if (showImmediately) {
			this.open(modal);
		}

		return modal;
	}

	// Обновленный метод setup для поддержки параметров
	setup(modal, title = null, content = null, selector = null) {
		if (modal) {
			const modalTitle = modal?.querySelector(".modal-title");
			const modalContent = modal?.querySelector(".modal-body");

			// Используем переданные значения или значения из экземпляра
			const titleToSet = title !== null ? title : this.title;
			const contentToSet = content !== null ? content : this.content;
			const selectorToSet = selector !== null ? selector : this.selector;

			if (titleToSet && titleToSet !== "" && modalTitle) {
				modalTitle.innerHTML = titleToSet;
			}

			if (contentToSet && contentToSet !== "" && modalContent) {
				modalContent.innerHTML = contentToSet;
			}

			if (selectorToSet && selectorToSet !== "") {
				modal.classList.add(selectorToSet);
			}
		}
	}

	// Существующие методы без изменений
	open(modal, callback) {
		// Если передан string - ищем элемент по data-modal-id
		if (typeof modal === "string") {
			modal = document.querySelector(`[data-modal-id="${modal}"]`);

			if (!modal) {
				console.error(`Модальное окно с id "${modal}" не найдено`);
				return;
			}
		}

		// Проверяем, что modal - это DOM-элемент
		if (!(modal instanceof Element)) {
			console.error(
				"Недопустимый параметр модального окна: должен быть элементом DOM или строкой идентификатора окна"
			);
			return;
		}

		this.setup(modal);
		modal.classList.add("show");
		document.documentElement.classList.add("modal-open");

		if (callback && typeof callback === "function") {
			callback();
		}
	}

	resetState() {
		this.title = "";
		this.content = "";
		this.selector = "";
	}

	close(modal) {
		this.resetState(modal);
		modal.classList.remove("show");
		document.documentElement.classList.remove("modal-open");
	}
}

new Modal();

// map logic
mapLinks?.forEach((link) => {
	link.addEventListener("click", (e) => {
		loadMap(e);
	});
});

function loadMap(e) {
	e.preventDefault();

	mapModal.innerHTML = `<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Acdb2292eeaac2d6e668f17f23894f62f0446a4f81f612617ab0697f930e8b115&amp;source=constructor" frameborder="0"></iframe>`;

	closeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const modal = button.closest(".modal");

			if (modal) {
				mapModal.innerHTML = "";
			}
		});
	});

	document.addEventListener("click", (event) => {
		const modals = document.querySelectorAll(".modal");

		modals.forEach((modal) => {
			if (event.target === modal) {
				mapModal.innerHTML = "";
			}
		});
	});
}

// Функция для инициализации табов
const initTabs = (tabsContainer) => {
	const tabButtons = tabsContainer.querySelectorAll(".tabs-button");
	const tabs = tabsContainer.querySelectorAll(".tab");

	const activateTab = (tabId, shouldScroll = false) => {
		// Закрываем табы только внутри текущего контейнера
		tabButtons.forEach((btn) => btn.classList.remove("active"));
		tabs.forEach((tab) => tab.classList.remove("active"));

		const activeButton = tabsContainer.querySelector(
			`.tabs-buttons [data-tab-open="${tabId}"]`
		);
		const activeTab = tabsContainer.querySelector(
			`.tab[data-tab-id="${tabId}"]`
		);

		if (activeButton) {
			activeButton.classList.add("active");
		}

		if (activeTab) {
			activeTab.classList.add("active");
			// Прокрутка к активной вкладке только если shouldScroll = true
			if (shouldScroll) {
				activeTab.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}
	};

	// Обработчик клика по кнопкам вкладок
	tabButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault();
			// если есть аттрибут for у кнопки, то находим элемент с id указанный в for и переводим в checked
			const checkbox = document.querySelector(
				`[id="${button.getAttribute("for")}"]`
			);
			if (checkbox) {
				checkbox.checked = true;
			}
			const tabId = button.getAttribute("data-tab-open");
			activateTab(tabId);
		});
	});

	// Проверка наличия якоря в URL при инициализации - только если таб существует в этом контейнере
	const hash = window.location.hash.substring(1);
	if (hash) {
		const targetTab = tabsContainer.querySelector(
			`.tab[data-tab-id="${hash}"]`
		);
		// Активируем таб только если он существует в этом контейнере
		if (targetTab) {
			activateTab(hash, false);
		}
	}
};

// Глобальный обработчик для всех ссылок с data-link-tab-open
document.addEventListener("click", (event) => {
	const link = event.target.closest("[data-link-tab-open]");
	if (link) {
		event.preventDefault();

		const tabId = link.getAttribute("data-link-tab-open");

		// Находим контейнер табов, который содержит вкладку с данным ID
		let targetContainer = null;
		tabContainers.forEach((container) => {
			const targetTab = container.querySelector(
				`.tab[data-tab-id="${tabId}"]`
			);
			if (targetTab) {
				targetContainer = container;
			}
		});

		if (targetContainer) {
			// Активируем таб только в целевом контейнере
			const tabButtons = targetContainer.querySelectorAll(".tabs-button");
			const tabs = targetContainer.querySelectorAll(".tab");

			// Закрываем все табы в целевом контейнере
			tabButtons.forEach((btn) => btn.classList.remove("active"));
			tabs.forEach((tab) => tab.classList.remove("active"));

			// Активируем нужную вкладку
			const activeButton = targetContainer.querySelector(
				`.tabs-buttons [data-tab-open="${tabId}"]`
			);
			const activeTab = targetContainer.querySelector(
				`.tab[data-tab-id="${tabId}"]`
			);

			if (activeButton) activeButton.classList.add("active");
			if (activeTab) {
				activeTab.classList.add("active");
				activeTab.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}

		// Обновляем URL
		window.location.hash = tabId;
	}
});

// Обрабатываем изменение хеша в URL
window.addEventListener("hashchange", () => {
	const hash = window.location.hash.substring(1);
	if (hash) {
		// Находим контейнер, который содержит таб с данным хешем
		let targetContainer = null;
		tabContainers.forEach((container) => {
			const targetTab = container.querySelector(
				`.tab[data-tab-id="${hash}"]`
			);
			if (targetTab) {
				targetContainer = container;
			}
		});

		if (targetContainer) {
			// Активируем таб только в целевом контейнере
			const tabButtons = targetContainer.querySelectorAll(".tabs-button");
			const tabs = targetContainer.querySelectorAll(".tab");

			tabButtons.forEach((btn) => btn.classList.remove("active"));
			tabs.forEach((tab) => tab.classList.remove("active"));

			const activeButton = targetContainer.querySelector(
				`.tabs-buttons [data-tab-open="${hash}"]`
			);
			const activeTab = targetContainer.querySelector(
				`.tab[data-tab-id="${hash}"]`
			);

			if (activeButton) activeButton.classList.add("active");
			if (activeTab) activeTab.classList.add("active");
		}
	}
});

// Инициализация табов для каждого контейнера
if (tabContainers.length > 0) {
	tabContainers.forEach(initTabs);
}

// tooltip logic
function initTooltip() {
	if (window.innerWidth < 992) {
		cleanupTooltip();
		return;
	}

	if (tooltipIsInit) return;

	if (!tooltip) {
		tooltip = document.createElement("div");
		tooltip.classList.add("tooltip");
		document.body.appendChild(tooltip);
	}

	setupTooltip();
	tooltipIsInit = true;
}

function setupTooltip() {
	tooltip?.classList.add("tooltip");
	document.body.appendChild(tooltip);

	let lastMoveTime = 0;
	const throttleDelay = 1; // ms

	document.querySelectorAll("[data-tooltip]").forEach((element) => {
		element.addEventListener("mouseenter", function (e) {
			tooltip.innerHTML = this.getAttribute("data-tooltip");
			tooltip?.classList.add("active");
		});

		element.addEventListener("mousemove", function (e) {
			// Throttling
			const now = Date.now();
			if (now - lastMoveTime < throttleDelay) return;
			lastMoveTime = now;

			const offset = 20;
			let x = e.pageX + offset;
			let y = e.pageY + offset;

			// Проверка правой границы
			if (
				x + tooltip.offsetWidth >
				document.documentElement.scrollWidth
			) {
				x = e.pageX - tooltip.offsetWidth - offset;
			}

			// Проверка нижней границы
			if (
				y + tooltip.offsetHeight >
				document.documentElement.scrollHeight
			) {
				y = e.pageY - tooltip.offsetHeight - offset;
			}

			tooltip.style.left = x + "px";
			tooltip.style.top = y + "px";
		});

		element.addEventListener("mouseleave", function () {
			tooltip?.classList.remove("active");
		});
	});
}

function cleanupTooltip() {
	if (tooltip) {
		tooltip.remove();
		tooltip = null;
	}
	tooltipIsInit = false;
}

// notification logic
function initNotify() {
	notification.classList.add("notification");
	document.body.appendChild(notification);
}

function toggleNotify(content) {
	// Сбрасываем предыдущий таймер
	if (notificationTimer) {
		clearTimeout(notificationTimer);
		notificationTimer = null;
	}

	// Обновляем содержимое и показываем уведомление
	notification.classList.add("show");
	notification.innerHTML = `<p class="small">${content}</p>`;

	// Устанавливаем новый таймер для скрытия
	notificationTimer = setTimeout(() => {
		notification.classList.remove("show");
		setTimeout(() => {
			notification.innerHTML = "";
		}, 250);
	}, 3000);
}

function closeNotify() {
	if (notificationTimer) {
		clearTimeout(notificationTimer);
		notificationTimer = null;
	}
	notification.classList.remove("show");
	setTimeout(() => {
		notification.innerHTML = "";
	}, 250);
}

if (notification) {
	document.addEventListener("DOMContentLoaded", initNotify);
}

// Ввод только цифр для соответствующих полей
inputNumbers.forEach((input) => {
	input.addEventListener("input", () => {
		input.value = input.value.replace(/[^0-9]/g, "");
	});
});

function validNumbers(e) {
	const allowedKeys = [
		"Backspace",
		"Tab",
		"Enter",
		"ArrowLeft",
		"ArrowRight",
		"Delete",
		"Escape",
	];

	// Разрешенные символы для ввода номера телефона
	const allowedCharacters = /^[0-9+\-() *#]$/;

	const isAllowedKey = allowedKeys.includes(e.key);
	const isAllowedCharacter = allowedCharacters.test(e.key);
	if (!isAllowedKey && !isAllowedCharacter) {
		e.preventDefault();
	}

	e.currentTarget.value = e.currentTarget.value.trim();
}

// Ввод только цифр и символов для соответствующих полей
inputPhones.forEach((input) => {
	input.addEventListener("input", (e) => {
		validNumbers(e);
	});
	input.addEventListener("keydown", (e) => {
		validNumbers(e);
	});
	input.addEventListener("change", (e) => {
		validNumbers(e);
	});
});

// Проверка email-полей на заполнение
function validate(e) {
	if (isEmailValid(e.currentTarget.value)) {
		console.log(e.currentTarget.validationMessage);
	} else {
		console.log(e.currentTarget.validationMessage);
	}
}

emailInputs.forEach((input) => {
	input.addEventListener("input", (e) => {
		validate(e);
	});
});

function isEmailValid(value) {
	return value.match(
		/^(([^<>()[\$\\.,;:\s@\"]+(\.[^<>()[\$\\.,;:\s@\"]+)*)|(\".+\"))@((\$[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\$)|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
}

// scrollToTop
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

scrollToTopElem?.addEventListener("click", scrollToTop);

// sort init all function
window.addEventListener("DOMContentLoaded", () => {
	setFixedHeader();
	initTooltip();
});

window.addEventListener("resize", () => {
	setFixedHeader();
	initTooltip();

	if (window.innerWidth >= 992) {
		closeMenu();
	}
});