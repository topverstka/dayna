<?php require 'config.php'; ?>
<!DOCTYPE html>
<html lang="RU">
<head>
	<meta charset="utf-8">
	<title>Трансформационный онлайн-курс для женщин</title>
	<meta name="viewport" content="width=device-width">
	<meta name="description" content="Не откладывай свою жизнь «на потом», а своё счастье «на следующий раз»">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png">
	<link rel="manifest" href="./site.webmanifest">
	<link rel="mask-icon" href="./safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff">

    <link rel="stylesheet" href="./css/style.css"> 
</head> 
<body>
	<div class="wrapper">
		<section class="thank">
			<div class="container">
				<div class="thank__body">
					<h1 class="thank__title wow slideInUp">Спасибо за регистрацию на вебинар!</h1>
					<ol class="thank__list">
						<li class="thank__item wow slideInUp" data-wow-delay="100ms">Посмотри видео, чтобы узнать, как попасть в вебинарную комнату.</li>
						<li class="thank__item wow slideInUp" data-wow-delay="200ms">Проверь, пожалуйста, папки «Спам» и «Промоакции», чтобы не пропустить ссылку на вебинар.</li>
						<li class="thank__item wow slideInUp" data-wow-delay="300ms">Обязательно ПОДПИШИСЬ на бота в Telegram. В день вебинара мы отправим там ссылку и напоминание за час до начала вебинара.</li>
					</ol>
					<a href="https://t.me/Einbergs_bot" class="btn btn_full thank__button wow bounceIn" data-wow-delay="600ms">Подписаться!</a>
				</div>
			</div>
		</section>
		<div class="thank-video">
			<div class="container">
				<div class="thank-video__body">
					<div class="thank-video__block wow fadeIn" data-wow-offset="200">
						<iframe src="https://youtube.com/embed/iFtCLjT8e_4?rel=0&fmt=18&html5=1&showinfo=0" width="960" height="540" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
					</div>
				</div>
			</div>
		</div>
		<div class="thank-insta">
			<div class="container">
				<div class="thank-insta__body">
					<div class="thank-insta__left wow slideInLeft"><img src="./img/thank-insta/bg2.png" alt=""></div>
					<div class="thank-insta__content wow slideInRight">
						<p class="thank-insta__text">Подписывайся на Instagram @dainaexpert,<br>пиши в Direct слово «ВРЕМЯ» и получай в подарок руководство по достижению целей «12 полезных советов от Дайны»</p>
						<a href="https://www.instagram.com/dainaexpert/" class="btn btn_full thank-insta__button">Подписаться</a>
					</div>
				</div>
			</div>
		</div>
		<footer class="footer">
			<div class="container">
				<div class="footer__wrap">
					<div class="footer__content">
						<span class="footer__content-text">Трансформационный онлайн-<br>курс для женщин</span>
						<h2 class="footer__content-slogan">Я РАСКРЫВАЮСЬ СЧАСТЬЮ!</h2>
					</div>
					<div class="footer__policy">
						<a href="https://drive.google.com/file/d/121_URM7hXpk1xDpq7QT7zl5aLpysKfVx/view" target="_blank" class="footer__policy-link" >Политика конфиденциальности</a>
						<a href="https://drive.google.com/file/d/1PBo5aW68wAFtt9fEXsphqtNsHJPpEy53/view" target="_blank" class="footer__policy-link">Noteikumi un Privātuma politika</a>
					</div>
					<div class="footer__contacts">
						<a href="mailto:<?php echo $email; ?>" class="footer__email">
							<span class="footer__email-icon"><img src="./img/icons/email.png" alt="Email"></span>
							<span class="footer__email-text"><?php echo $email; ?></span>
						</a>
						<div class="footer__social">
							<span class="footer__social-text">Присоединяйтесь</span>
							<div class="footer__social-list">
								<a href="<?php echo $instagram; ?>" class="footer__social-link"><img src="./img/icons/instagram.png" alt="instagram"></a>
								<a href="<?php echo $facebook; ?>" class="footer__social-link"><img src="./img/icons/facebook.png" alt="facebook"></a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	</div>

	<!-- Модальные окна -->
	<!-- <div class="modal" id="privacy-policy">
		<div class="modal__body">
			<div class="modal__content">
				<h2>Политика конфиденциальности</h2>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt id perspiciatis vitae illo ea sequi nihil, sunt, libero ducimus atque mollitiaLorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt id perspiciatis vitae illo ea sequi nihil, sunt, libero ducimus atque mollitiaLorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt id perspiciatis vitae illo ea sequi nihil, sunt, libero ducimus atque mollitiaLorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt id perspiciatis vitae illo ea sequi nihil, sunt, libero ducimus atque mollitiaLorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt id perspiciatis vitae illo ea sequi nihil, sunt, libero ducimus atque mollitiaLorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt id perspiciatis vitae illo ea sequi nihil, sunt, libero ducimus atque mollitiaLorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt id perspiciatis vitae illo ea sequi nihil, sunt, libero ducimus atque mollitia.</p>
				<div class="modal__close">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect width="20" height="2.11" transform="matrix(0.707107 0.707107 -0.719783 0.694199 3.75928 1.92889)" fill="#0C2A4E"/>
						<rect width="20" height="2.11" transform="matrix(0.707107 -0.707107 0.719783 0.694199 2.24072 16.071)" fill="#0C2A4E"/>
					</svg>
				</div>
			</div>
		</div>
	</div> -->

	<script src="js/wow.min.js"></script>
	<script>
		new WOW().init();
	</script>
	<script src="./js/app.js"></script>
</body>
</html>