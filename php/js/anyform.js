"use strict";
window.$bizon_init_form = window.$bizon_init_form || function (opt) {
	// opt = {
	// 		domain:  'start.bizon365.ru',  // базовый домен сервиса. Можно задать другое значение, если используется Альфа-бизон
	// 		selectors: {
	// 			form: 'form.reg',  // форм может быть несколько
	// 			
	// 			// селекторы в любом месте страницы
	// 			message: '.errormessage', 	// вывод сообщений об ошибках
	// 			closestDate: 'span.date',  	// куда будет выведена ближайшая дата из расписания
	// 			closestTime: 'span.time', 	// куда будет выведено время ближайшей даты из расписания
	// 			submitButton: 'input[type=submit]', // селектор кнопки, если она находится за пределами формы. Или если формы как таковой нет.
	// 		},
	// 		form_fields: {
	// 			// селекторы внутри формы
	//			// По умолчанию, все поля обязательны.
	// 			username: 'input[name=username]',  
	// 			email: 'input[name=email]',
	// 			phone: 'input[name=phone]',
	//			// или phone: { el:'input[name=phone]', required:false  },
	// 			time: '', 		// выбор времени
	// 			
	// 		},
	// 		closestDateOnly: bool,		// использовать только ближайшую дату
	// 		redirectUrl: 'http://',		// переадресация в случае успешной регистрации
	// 		redirectIntervalMs: 0, 		// интервал в мс перед редиректом
	// 		successMessage: '', 		// сообщение в случае успешной регистрации
	// 		skipSuccessMessage: bool, 	// пропустить ли вывод сообщения об успехе (полезно для геткурс)
	// 		allowFormAction: bool,		// разрешать ли штатный переход в форме
	// 		
	// 	Вариант страницы регистрации на вебинар:
	// 		pageId: 'XXXX:ID', 			// ID страницы регистрации
	// 		
	// 	Вариант рассылки:
	// 		sublistId: 'ID', 			// ID рассылки (используется либо pageId, либо sublistId)
	// 		uid: 'XXXX', 				// XXXX - номер аккаунта в Бизоне (если указан sublistId)
	// 		
	// }

	var $ = {};
	$.forEach = function (selector, handler) {
		var list = typeof selector == 'string' ? document.querySelectorAll(selector) : selector;
		if (!list) return;
		for (var i = 0; i < list.length; i++) handler(list[i]);
	}

	opt = opt || {};
	var allowFormAction = opt.allowFormAction || false;

	var global = {
			// days = [  {title:"четверг, 2 февраля", val:"YYYY-MM-DD" } ]
			// pageId
			// ip
			// now: ms
			// schedule: String
		},
		schedule,
		userTimeoffset = 0;
	var selectedWebinarDate = 0; // время,выбранное пользователем или автоматически

	opt.domain = '' + (opt.domain || 'start.bizon365.ru');
	opt.domain = opt.domain.split('//').slice(-1).join(''); // удаляем возможный протокол
	var domain = 'https://' + (opt.domain);

	var cdn = '/form';

	function initUrls() {
		// release
		//		if(!opt.local && !opt.debug) {
		//			domain = '//online.bizon365.ru';
		//			cdn = 'http://st.bizon365.ru/form';
		//		}
		var hostname = window.location.hostname.toString();
		//		if(hostname.indexOf('bizonpages.ru') != -1) {
		//			domain = 'https://start.bizon365.ru';
		//		}
		if (hostname == 'localhost') domain = '';
	}
	initUrls();

	opt.selectors = opt.selectors || {};
	if (!opt.selectors.form) return console.error('Не задан селектор формы!');
	if (!opt.pageId && !opt.sublistId) return console.error('Не задан идентификатор рассылки!');

	// nodes
	var forms = document.querySelectorAll(opt.selectors.form);
	var messageContainer = document.querySelectorAll(opt.selectors.message);

	var m_url_marker = '';

	if (!forms.length) console.log('Формы не найдены!');
	// по всем формам
	$.forEach(forms, function (item) {

		// тестирование наличия полей
		var fields = 'email phone username'.split(' ');
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i].trim();
			if (!field) continue;
			var f = opt.form_fields[field];
			if (!f) continue;
			var sel;
			if (typeof f == 'string') {
				//
				sel = f;
			} else {
				// { el: 'input[name=phone], required: false}
				sel = f.el;
			}

			var t = item.querySelector(sel);
			if (!t) console.warn('Поле ' + sel + ' не найдено');
		}

		item.addEventListener('submit', onSubmit);
	});
	if (opt.selectors.submitButton) {

		var btns = document.querySelectorAll(opt.selectors.submitButton);
		$.forEach(btns, function (item) {
			item.addEventListener('click', onSubmit);
		});
		// console.log('Обработчик onSubmit [selectors] повешен на кнопки: ' + btns.length);
	}
	if (opt.form_fields.submitButton) {

		var btns = document.querySelectorAll(opt.form_fields.submitButton);
		$.forEach(btns, function (item) {
			item.addEventListener('click', onSubmit);
		});
		// console.log('Обработчик onSubmit [form_fields] повешен на кнопки: ' + btns.length);
	}

	lockButtons();

	function showMessage(dom) {
		dom = dom || '';
		if (!messageContainer || !messageContainer.length) {
			if (!dom) return;
			return alert(dom);
		}
		$.forEach(messageContainer, function (item) {
			item.innerHTML = dom || '';
		})
	}

	function xhr(d, rawbody, callback) {
		if (!callback && typeof rawbody == 'function') {
			callback = rawbody;
			rawbody = '';
		}
		var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XHR();
		xhr.open(d.method || 'GET', d.url, true);
		var body = rawbody || '';
		if (d.method == "POST") {
			body = '';
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			if (opt.dataType == 'json' || typeof rawbody == 'object') {
				rawbody.url_marker = m_url_marker;
				for (var p in rawbody) {
					if (body) body += '&';
					body += p + '=' + encodeURIComponent(rawbody[p]);
				}
			} else {
				body = rawbody;
			}
		}

		xhr.onreadystatechange = function () {
			if (this.readyState != 4) return;

			var json;
			try {
				json = window.JSON.parse(this.responseText);
			} catch (e) {
				console.error("Некорректный ответ " + e.message);
			};
			json = json || {};

			if (this.status != 200) {
				console.error(this.status + ': ' + this.responseText);
				//showMessage('<b style="color:red;">Не удалось получить расписание с сервера: '+this.status+' '+this.statusText+'</b>');
				var err = {
					status: this.status,
					message: json.message || this.responseText || '',
				}
				return callback(err);
			}

			callback(null, json);
		}
		xhr.send(body);
	}

	// получить актуальное расписание
	if (opt.pageId) {
		xhr({
			method: 'GET',
			url: domain + '/form/' + opt.pageId + '?format=json&rnd=' + Date.now()
		}, function (err, reply) {
			if (err) return;

			for (var p in reply) {
				global[p] = reply[p];
			}

			calcOffset();
			try {
				schedule = JSON.parse(global.schedule);
			} catch (e) {
				schedule = {};
			}
			updateIface();

			unlockButtons();

			//
			var m = reply.url_marker_name;
			if (m) {
				var locStorId = reply.pageId + ':' + m;
				var mv = localStorage(locStorId);
				if (!mv && url_params && url_params[m]) {
					mv = url_params[m];
					localStorage(locStorId, mv);
				}
				if (mv) {
					console.log(m + '=' + mv)
					m_url_marker = mv;
				}
			}
		});
	} else {
		// рассылка
		unlockButtons();
	}

	function calcOffset() {
		var nowS = global.now || 0;
		var now = new Date();
		var deltaH = (+now - nowS) / (60 * 1e3);
		deltaH += -now.getTimezoneOffset() - 3 * 60;
		deltaH = deltaH / 60;
		if (deltaH < 0 && deltaH > -1)
			deltaH = Math.round(deltaH / 60);
		else
			deltaH = Math.floor(deltaH / 60);
		userTimeoffset = deltaH;
		// console.log('deltaH: ' + deltaH);
	}

	function updateIface() {
		// global.days = [  {title:"четверг, 2 февраля", val:"YYYY-MM-DD" } ]
		// schedule = { "YYYY-MM-DD": [ {text: "20:00", val: ms} ]  }

		var dd, v, times, time;
		var closestDate;
		if (opt.closestDateOnly && global.days && global.days.length > 0) {
			var t = global.days[0];
			var date_text = '',
				time_text = '';
			if (t && t.val) {
				dd = t.val;
				date_text = t.title;
				times = schedule[dd];
				time = times[0];
				if (time) {
					time_text = time.text; // "20:00"
					selectedWebinarDate = time.val || 0;
				}
			}

			showDateTime(date_text, time_text);
		}

	}

	function showDateTime(date_text, time_text) {
		var list, i;
		if (date_text && opt.selectors.closestDate) {
			$.forEach(opt.selectors.closestDate, function (item) {
				item.innerText = date_text
			});
		}

		if (time_text && opt.selectors.closestTime) {
			$.forEach(opt.selectors.closestTime, function (item) {
				item.innerText = time_text
			});
		}
	}

	var is_submitting = false;

	function onSubmit(e) {
		if (is_submitting) return;

		//console.log('onSubmit',e);
		if (!allowFormAction) {
			e.preventDefault();
			console.log('Штатная обработка формы отключена, т.к. параметр allowFormAction != true ')
		}

		var validators = {
			email: {
				func: isEmail,
				msg: 'Укажите правильный e-mail'
			},
			phone: {
				func: isPhone,
				msg: 'Укажите ваш телефон'
			},
		}

		showMessage();

		var data = {};
		var form = e.target;

		var errors = 0;
		var errormsg = '';

		for (var p in opt.form_fields) {
			var f = opt.form_fields[p];
			var sel, required = true;
			if (typeof f == 'string') {
				//
				sel = f;
			} else {
				// { el: 'input[name=phone], required: false}
				sel = f.el;
				required = f.required;
			}
			
			
			var d = form.querySelector(sel);
			if (!d) continue;
			
			var v = ('+7' + d.value || '').trim();
			if (required && validators[p] && !validators[p].func(v)) return showMessage(validators[p].msg);
			data[p] = v;
		}

		if (!Object.keys(data).length) {
			// данные в форме не нашли, значит e.target — это вообще внешняя кнопка
			// Берем первую форму
			$.forEach(forms, function (form) {

				for (var p in opt.form_fields) {
					if (data[p]) continue; // собираем из всех форм?
					var sel = opt.form_fields[p];
					var d = form.querySelector(sel);
					if (!d) {
						errormsg += 'Не найдено поле ' + p + '. \n ';
						errors++;
						return;
					}
					if (p == 'phone') {
						var v = (d.previousElementSibling.querySelector('.iti__selected-dial-code').innerText + ' ' + d.value || '').trim();
					}
					else {
						var v = (d.value || '').trim();
					}
					if (validators[p] && !validators[p].func(v)) {
						errormsg += validators[p].msg + ' \n ';
						errors++;
						return;
					}
					data[p] = v;
				}
				
			});
		}

		if (!Object.keys(data).length) return showMessage('Поля в форме не найдены');

		if (errors) {
			console.log('Данные для отправки:', data);

			errormsg = errormsg || 'Заполните обязательные поля';
			return showMessage(errormsg);
		}

		is_submitting = true;

		data.time = selectedWebinarDate;
		data.timeoffset = userTimeoffset;

		// копируем utm-метки
		var m_utm_fields = 'utm_source utm_medium utm_campaign utm_term utm_content utm_keyword utm_banner utm_phrase utm_group'.split(' ');

		var utm_inputs = '';
		if (url_params) {
			m_utm_fields.forEach(function (p) {
				var v = url_params[p] || '';
				if (v) data[p] = v;
			});
		}

		var url = domain + '/subscriber/';
		if (opt.pageId) {
			url += opt.pageId + '/register';
		} else if (opt.sublistId) {
			url += 'add';
			// добавляем обязательные поля
			data.list = opt.sublistId;
			data.uid = opt.uid;
			data.field_email = data.email;
			data.field_name_first = data.username;
		}
		//console.log(data, url);

		lockButtons();

		xhr({
			method: 'POST',
			url: url,
			dataType: 'json'
		}, data, function (err, json) {
			is_submitting = false;
			//console.log(err,json);
			if (err) {
				console.error('Ошибка связи с сервером: ', err);
				setTimeout(function () {
					unlockButtons();
				}, 200);
				console.log('error')
				// если allowFormAction, то не сообращаем об ошибке пользователю
				return allowFormAction ? false : showMessage('Ошибка ' + err.status + ': ' + err.message);
			}

			console.log('Ответ сервера: ', json);

			if (!allowFormAction) {
				if (!opt.redirectUrl && !opt.skipSuccessMessage) {
					showMessage(opt.successMessage || 'Успешная регистрация. Проверьте ваш почтовый ящик.');
				}

				if (opt.redirectUrl) {
					opt.redirectIntervalMs = +opt.redirectIntervalMs || 0; // сколько миллисекунд ждать перед редиректом

					//if(opt.redirectUrl.slice && opt.redirectUrl.slice(0,4).toLowerCase()=='http')
					//	window.location.href = opt.redirectUrl;

					setTimeout(function () {
						window.location.href = opt.redirectUrl;
					}, opt.redirectIntervalMs);
				}
			} // if(!allowFormAction)
		});

		return // false;
	}

	function lockButtons() {
		eachFormButton(true);
	}

	function unlockButtons() {
		eachFormButton(false);
	}

	function eachFormButton(disabled) {
		disabled = disabled || false;
		$.forEach(forms, function (item) {
			var btns = item.querySelectorAll('button');
			$.forEach(btns, function (btn) {
				btn.disabled = disabled;
			});
		});
	}


	function isEmail(t) {
		var emailreg = /^[-\w.]+@([\w\-\_]+\.)+[A-z]{2,8}$/i;
		return emailreg.test(t);
	}


	function isPhone(t) {
		if (!t) return false;
		var s = '' + t;
		s = s.replace(/[\s\(\)-]/gi, '');
		s = ('' + (+s)).trim();
		if (!s || !s.length || s.length < 10) return false;
		return s;
	}

	function getUrlParams() {
		var r = {};
		try {
			var args = window.location.search.slice(1).split('&');
			for (var i = 0; i < args.length; i++) {
				var p = args[i];
				if (!p) continue;
				var a = p.split('=');
				if (!a[0]) continue;
				r[a[0]] = decodeURIComponent(a[1] || '');
			}
		} catch (e) {
			r = {};
		}
		return r;
	}
	var url_params = getUrlParams();

	function localStorage(key, val) {
		try {
			if (!window.localStorage) return;
			if (val !== undefined) window.localStorage[key] = val;
			return window.localStorage[key];
		} catch (e) {
			console.error(e);
		}
	}
}