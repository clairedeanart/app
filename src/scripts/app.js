
var gallery = require('./gallery');
var about = require('./about');

window.onload = function() {
  gallery.loadImages();

  // Menu
  var navigationIcon = document.body.querySelector('.js-navigation-icon');
  var mobileMenuContainer = document.body.querySelector('.js-menu-container');
  
  navigationIcon.onclick = function(e) {
    navigationIcon.classList.toggle('navigation-icon--open');

    mobileMenuContainer.classList.toggle('mobile-menu--open');
  };




}
