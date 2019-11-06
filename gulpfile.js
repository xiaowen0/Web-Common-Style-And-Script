// 引入 gulp及组件
var gulp=require('gulp'),  //gulp基础库
    minifycss=require('gulp-minify-css'),   //css压缩
    concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    rename=require('gulp-rename'),   //文件重命名
    jshint=require('gulp-jshint'),   //js检查
    notify=require('gulp-notify'),   //提示
    htmlmin = require('gulp-htmlmin'),//html压缩
    cssmin = require('gulp-minify-css'),//css压缩
    processhtml = require('gulp-processhtml'),
    replace = require('gulp-replace'),
    cache = require('gulp-cache'),//图片压缩缓存
    clean = require('gulp-clean'),//清空文件夹
    plumber=require('gulp-plumber'),//检测错误
    gutil=require('gulp-util'),//如果有自定义方法，会用到
    fs = require('fs');

var packageInfo = JSON.parse(fs.readFileSync('./package.json'));
var version = packageInfo.version;
var targetFolder = 'dist/' + version + '/';

function errrHandler(e)
{
    // 控制台发声,错误时beep一下
    gutil.beep();
    gutil.log(e);
    this.emit('end');
}

gulp.task('build', function() {
  // 将你的默认的任务代码放在这
  // gulp.start('minifyhtml','minifycss','minifyjs');
  gulp.start('copy_style_image', 'minifycss', 'minifyjs');
});

// copy image in style folder
gulp.task('copy_style_image', function (){
    return gulp.src([
        'style/**/*.jpg',
        'style/**/*.png',
        'style/**/*.gif'
    ]).pipe(gulp.dest(targetFolder + 'style/'))            //输出文件目录
      .pipe(notify({message:'copy style image task ok', onLast : true})); //提示成功
});

// minify css file
gulp.task('minifycss',function(){
    return gulp.src('style/**/*.css')            //设置css
	   .pipe(replace("$VERSION", version))     //输出版本号
       .pipe(rename({suffix:'.min'}))          //修改文件名
       .pipe(minifycss())                      //压缩文件
       .pipe(gulp.dest(targetFolder + 'style/'))       //输出文件目录
       .pipe(notify({message:'minify css task ok', onLast : true})); //提示成功
});

// minify js file
gulp.task('minifyjs',function(){
    /*gulp.src('script/common_script/common_function.js')       //选择合并的JS
       //.pipe(concat('order_query.js'))  //合并js
       //.pipe(gulp.dest('dist/js'))      //输出
       .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest('script/common_script/'))        //输出 
       .pipe(notify({message:"minify js task ok"}));    //提示*/
	   
	gulp.src('script/**/*.js')       // script folder's js file
       //.pipe(concat('order_query.js'))  //合并js
       //.pipe(gulp.dest('dist/js'))      //输出
       .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest(targetFolder + 'script/'))        //输出 
       .pipe(notify({message:"copy and minify js file finished.", onLast : true}));    //提示
	   
	gulp.src('script/**/*.md')		// script folder's markdown file
		.pipe(gulp.dest(targetFolder + 'script/'))        //输出 
       .pipe(notify({message:"copy markdown file finished.", onLast : true}));    //提示
	   
	return true;
});


