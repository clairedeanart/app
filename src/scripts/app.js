// var Flickity = require('flickity');

var gallery = require('./gallery');
var about = require('./about');

document.addEventListener("DOMContentLoaded", function(event) {
  var grid = document.querySelector('.gallery__grid');
  if (grid) {
    gallery.loadImages(grid);
    gallery.setupImages();
  }

  // var elem = document.querySelector('.main-carousel');
  // var flkty = new Flickity( elem, {
  //   // options
  //   cellAlign: 'left',
  //   contain: true
  // });

  // // element argument can be a selector string
  // //   for an individual element
  // var flkty = new Flickity( '.main-carousel', {
  // // options
  // });


  // Menu
  var navigationIcon = document.body.querySelector('.js-navigation-icon');
  var mobileMenuContainer = document.body.querySelector('.js-menu-container');

  navigationIcon.onclick = function(e) {
    navigationIcon.classList.toggle('navigation-icon--open');
    mobileMenuContainer.classList.toggle('mobile-menu--open');
  };



});
