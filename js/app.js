// Служебные переменные
const d = document;
const body = d.querySelector('body');

//<------Служебные функции---------->
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

// Изменение скролла у body
function bodyLock(con) {
    if (con == true) {
        body.classList.add('_lock');
    } else if (con == false) {
        body.classList.remove('_lock');
    }
}

// Изменение даты на 2 дня вперед
changeDate()
function changeDate() {
	const elem = document.querySelector('.main__label span')
	const date = new Date()
	const day = date.getDate()

	elem.innerText = day + 2
}

// Аккордеоны в разделе с ценами
accordion()
function accordion() {
	const accElems = d.querySelectorAll('.acc')
	let isSafari = /safari/.test(navigator.userAgent.toLowerCase());

	for (let i = 0; i < accElems.length; i++) {
		const acc = accElems[i];
		const accBtn = acc.querySelector('.acc__btn')
		const accBody = acc.querySelector('.acc__body')
        const accBodyHeight = isSafari ? accBody.scrollHeight + 40 : accBody.scrollHeight
		
		// После загрузки DOM аккордеоны с классом _show активируются
		if (acc.classList.contains('_show')) {
            console.log(accBodyHeight)
            accBody.style.maxHeight = accBodyHeight + 'px'
		}

		// При клике по кнопке "Узнать подробнее" активируется аккордеон
		accBtn.addEventListener('click', () => {
			removeAll(accElems, '_show')
			acc.classList.add('_show')

			for (let i = 0; i < accElems.length; i++) {
				const acc = accElems[i];
				const accBody = acc.querySelector('.acc__body')

				accBody.style.maxHeight = 0;
			}

			if (acc.classList.contains('_show')) {
				accBody.style.maxHeight = accBodyHeight + 'px'
			}
			else {
				accBody.style.maxHeight = 0
			}
            setTimeout(() => {
                scrollToStartAcc(acc)
            }, 400)
		})
	}

	// Скролл до начала аккордеона
	function scrollToStartAcc(acc) {
		const distanceTop = getCoords(acc).top
        window.scroll({
            top: distanceTop,
            left: 0,
            behavior: 'smooth'
        })
	}
}

// Слайдер в разделах отзывах на экранах меньше 480px
if (window.innerWidth <= 440) {
	const reviewsSlider = new Swiper('.reviews__slider', {	
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,

		navigation: {
			nextEl: '.reviews__arrow-next',
			prevEl: '.reviews__arrow-prev',
		}
	});
}

// Открытие модального окна, если в url указан его id
openModalHash()
function openModalHash() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1)
        const modal = document.querySelector(`.modal#${hash}`)

        if (modal) {
            modal.classList.add('_show');
            bodyLock(true)
            closeWhenClickingOnBg(`#${hash} .modal__content`, modal);
        }
    }
}

// Закрытие модальных окон при клике по крестику
closeModalWhenClickingOnCross()
function closeModalWhenClickingOnCross() {
    const modalElems = document.querySelectorAll('.modal')
    for (let i = 0; i < modalElems.length; i++) {
        const modal = modalElems[i];
        const closeThisModal = modal.querySelector('.modal__close')

        closeThisModal.addEventListener('click', () => {
            modal.classList.remove('_show')
            bodyLock(false)
            resetHash()
        })
    }
}

// Закрытие модальных окон при нажатии по клавише ESC
closeModalWhenClickingOnESC()
function closeModalWhenClickingOnESC() {
    const modalElems = document.querySelectorAll('.modal')
    for (let i = 0; i < modalElems.length; i++) {
        const modal = modalElems[i];

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modal.classList.remove('_show')
                bodyLock(false)
                resetHash()
            }
        })
    }
}

// Сброс id модального окна в url
function resetHash() {
    const windowTop = window.pageYOffset
    window.location.hash = ''
    window.scrollTo(0, windowTop)
}

// Открытие модальных окон
openModal()
function openModal() {
    const btnsOpenModal = document.querySelectorAll('[data-modal-open]');

    for (let i = 0; i < btnsOpenModal.length; i++) {
        const btn = btnsOpenModal[i];

        btn.addEventListener('click', (e) => {
            const dataBtn = btn.dataset.modalOpen;
            const modalThatOpens = document.querySelector(`#${dataBtn}`)

            btn.classList.add('modal-show');
            modalThatOpens.classList.add('_show');
            bodyLock(true)
            closeWhenClickingOnBg(`#${dataBtn} .modal__content`, modalThatOpens);
            window.location.hash = dataBtn
        });
    }
}

// Закрытие модального окна при клике по заднему фону
function closeWhenClickingOnBg(itemArray, itemParent, classShow = '_show') {
    document.addEventListener('click', (e) => {
        let itemElems = document.querySelectorAll(itemArray)

        for (let i = 0; i < itemElems.length; i++) {
            const item = itemElems[i];

            const target = e.target,
                itsItem = target == item || item.contains(target),
                itemIsShow = item.classList.contains(classShow);

            if (itemParent) {
                const itsItemParent = target == itemParent || itemParent.contains(target),
                    itemParentIsShow = itemParent.classList.contains(classShow);

                if (!itsItem && itsItemParent && itemParentIsShow) {
                    itemParent.classList.remove(classShow);

                    if (body.classList.contains('_lock')) {
                        bodyLock(false)
                    }

                    if (window.location.hash === '#' + itemParent.getAttribute('id')) {
                        resetHash()
                    }
                }
            } else {
                if (!itsItem && itemIsShow) {
                    item.classList.remove(classShow);
                    if (body.classList.contains('_lock')) {
                        bodyLock(false)
                    }

                    if (window.location.hash === '#' + itemParent.getAttribute('id')) {
                        resetHash()
                    }
                }
            }

        }
    })
}

scrollToAnchor(150)
function scrollToAnchor(distanceTop = 0) {
    const linkElems = document.querySelectorAll('[href^="#"]')
    for (let i = 0; i < linkElems.length; i++) {
        const link = linkElems[i];
        link.addEventListener('click', (e) => {
            e.preventDefault()
            let href = link.getAttribute('href')
            let anchor = document.querySelector(href)
            window.scroll({
                top: anchor.getBoundingClientRect().top + pageYOffset - distanceTop,
                left: 0,
                behavior: 'smooth'
            })
        })
    }
}