// We need this to parse ES+ code with babel and
//  transform es2015 modules to commonjs
require('babel-register')({
  plugins: ['transform-es2015-modules-commonjs'],
})
