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
const burger = document.querySelector('.burger');
burger.addEventListener('click', function(e) {
  burger.classList.toggle('_active')
})