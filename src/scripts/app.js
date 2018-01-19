// var Flickity = require('flickity');
// var autosize = require('autosize');

var gallery = require('./gallery');
var about = require('./about');
var contact = require('./contact')

document.addEventListener("DOMContentLoaded", function(event) {

  // Gallery
  var grid = document.querySelector('.gallery__grid');
  if (grid) {
    gallery.loadImages(grid);
    gallery.setupImages();
  }

  // Navigation
  var navigationIcon = document.body.querySelector('.js-navigation-icon');
  var mobileMenuContainer = document.body.querySelector('.js-menu-container');
  var w = window.innerWidth || window.screen.width
  if (w > 490) {
    console.log('mobile!', w)
    mobileMenuContainer.style.display = 'none'
  }

  navigationIcon.onclick = function(e) {
    navigationIcon.classList.toggle('navigation-icon--open');
    mobileMenuContainer.classList.toggle('mobile-menu--open');
  };

  // Contact page
  if (window.location.pathname === '/contact') {
    contact.setup();
    // autosize(document.querySelectorAll('textarea'));
  }
});
