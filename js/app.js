// Служебные переменные
const d = document;
const body = d.querySelector('body');



//<------Служебные функции---------->

// Сокращенный аналог querySelector
function find(selector) {
	return d.querySelector(selector)
}

// Сокращенный аналог querySelectorAll
function findAll(selectors) {
	return d.querySelectorAll(selectors)
}

// Удалить у всех элементов определенный класс
function removeAll(items,itemClass) {   
	if (typeof items == 'string') {
	  items = document.querySelectorAll(items)
	}
	for (let i = 0; i < items.length; i++) {
	  const item = items[i]
	  item.classList.remove(itemClass)
	}
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
  
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
}

// Скрипт запрещающий скроллить тело страницы
function bodyLock() {  
	if (body.classList.contains('_lock')) {
	  	body.classList.remove('_lock');
	} else {
	  	body.classList.add('_lock');
	}
}

// Аккордеоны в разделе с ценами
accordion()
function accordion() {
	const accElems = findAll('.acc')
	
	for (let i = 0; i < accElems.length; i++) {
		const acc = accElems[i];
		const accBtn = acc.querySelector('.acc__btn')
		const accBody = acc.querySelector('.acc__body')
		
		// После загрузки DOM аккордеоны с классом _show активируются
		if (acc.classList.contains('_show')) {
			accBody.style.maxHeight = accBody.scrollHeight + 'px';
		}

		// При клике по кнопке "Узнать подробнее" активируется аккордеон
		accBtn.addEventListener('click', () => {
			scrollToStartAcc(acc)
			removeAll(accElems, '_show')
			acc.classList.add('_show')

			for (let i = 0; i < accElems.length; i++) {
				const acc = accElems[i];
				const accBody = acc.querySelector('.acc__body')

				accBody.style.maxHeight = 0;
			}

			if (acc.classList.contains('_show')) {
				accBody.style.maxHeight = accBody.scrollHeight + 'px';
			}
			else {
				accBody.style.maxHeight = 0;
			}
		})
	}

	// Скролл до начала аккордеона
	function scrollToStartAcc(acc) {
		const distanceTop = getCoords(acc).top
		window.scrollTo(0, distanceTop)
	}
}

// Слайдер в разделах отзывах на экранах меньше 480px
if (window.innerWidth <= 440) {
	const swiper = new Swiper('.reviews__slider', {	
		slidesPerView: 1, // Кол-во показываемых слайдов
		spaceBetween: 0, // Расстояние между слайдами
		// loop: true, // Бесконечный слайдер
		// freeMode: true, // Слайдеры не зафиксированны

		breakpoints: {
			1200: {

			},
			700: {

			},
			400: {

			}
		},

		navigation: {
			nextEl: '.reviews__arrow-next',
			prevEl: '.reviews__arrow-prev',
		}
	});
}

// Маска для телефона
[].forEach.call( document.querySelectorAll('[type="tel"]'), function(input) {
    var keyCode;
    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        var matrix = "+7 (___) ___ ____",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)
});