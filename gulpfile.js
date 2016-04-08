var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		browserSync 	= require('browser-sync'),
		autoPrefixer	= require('gulp-autoprefixer'),
		concat				= require('gulp-concat'),
		uglify				=	require('gulp-uglifyjs'),
		imagemin			= require('gulp-imagemin'),
		pngquant     	= require('imagemin-pngquant'),
		del          	= require('del'),
		cache        	= require('gulp-cache'),
		cssnano				= require('gulp-cssnano'),
		spritesmith		=	require('gulp.spritesmith');

// BrowserSync
gulp.task('browser-sync', function() {
		browserSync.init({
			server: {
				baseDir: "./app"
			},
			notify: false,
			open: false
	});
});

// Компиляция стилей
gulp.task('styles', function() {
	return gulp.src('sass/*.sass')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoPrefixer({browsers: ['last 60 versions'], cascade: false}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
})

//Отслеживание
gulp.task('watch', function() {
	gulp.watch('sass/*.sass', ['styles']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on("change", browserSync.reload);
});

//Default task
gulp.task('default', ['browser-sync', 'watch']);

//Сжатие картинок
gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('app/img')); // выгружаем назад
});

//сборка спрайтов
gulp.task('sprite', function() {
	var spriteData = gulp.src(['app/img/sprite/*.+(png|jpg)', '!app/img/sprite/sprite.png']).pipe(spritesmith({
	    imgName: 'sprite.png',
	    cssName: 'sprite.css',
	    padding: 10, // padding мужду картинками в исходном sprite.png
	    imgPath: '../img/sprite/sprite.png' // путь к спрайту
	  }));
	  return spriteData.pipe(gulp.dest('app/img/sprite/'));
});

//-----------------------------------Production tasks
//js скрипты
gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/jquery/jquery-1.12.3.min.js', // Берем jQuery
		'app/js/main.js' // Берем main.js
		])
		.pipe(concat('all.min.js')) // Собираем их в кучу в новом файле all.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('dist/js')); // Выгружаем в папку app/js
});

//clean dist
gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

//clear cache
gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('production',  ['clean', 'img', 'styles', 'scripts'], function() {
	var moveCss = gulp.src([
			'app/css/main.css'
		])
		.pipe(cssnano({
          discardComments: {removeAll: true} // удаляем комментарии в css
        })) //минификация css
		.pipe(gulp.dest('dist/css')); // перенос css в продакшн

	var moveFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts')); // перенос fonts в продакшн

	var moveImg = gulp.src('app/img/**/*')
		.pipe(gulp.dest('dist/img')); // перенос img в продакшн

	var moveJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js')) // перенос js в продакшн

	var moveLibsJs = gulp.src('app/libs/**/*')
		.pipe(gulp.dest('dist/libs')) // перенос libs js в продакшн

	var moveHtml = gulp.src('app/*.+(html|php)') // перенос html, php в продакшн
		.pipe(gulp.dest('dist'));

	var moveHtml = gulp.src('app/*.html') // перенос html в продакшн
		.pipe(gulp.dest('dist'));

// перенос исходников в папку src
	var moveSass = gulp.src('sass/**/*') 
		.pipe(gulp.dest('dist/src/sass'));
	var moveProjFiles = gulp.src('./*.+(js|json)') 
		.pipe(gulp.dest('dist/src'));

});