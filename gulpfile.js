const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const postcssurl = require('postcss-url');
const path = require('path');

const outDir = './src/css/dist'

gulp.task('default', () => {
  return gulp.src('./src/css/*.css')
    .pipe(postcss([
            autoprefixer(),
            postcssurl({
                // this function will modify URLs
                url: function (asset) {
                    if (!asset.url || asset.url.indexOf("base64") !== -1) {
                        return asset.url;
                    }
                    return path.relative(outDir, asset.absolutePath).split("\\").join("/");
                }
            })
        ]))
    .pipe(gulp.dest(outDir));
});
