
var gallery = require('./gallery');
var about = require('./about');

document.addEventListener("DOMContentLoaded", function(event) {
  console.log()
  var grid = document.querySelector('.gallery__grid');
  if (grid) {
    gallery.loadImages(grid);
  }


  // Menu
  var navigationIcon = document.body.querySelector('.js-navigation-icon');
  var mobileMenuContainer = document.body.querySelector('.js-menu-container');

  console.log('load!')

  navigationIcon.onclick = function(e) {
    navigationIcon.classList.toggle('navigation-icon--open');
    mobileMenuContainer.classList.toggle('mobile-menu--open');
  };
});
