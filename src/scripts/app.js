// var Flickity = require('flickity');
// var autosize = require('autosize');
var Barba = require('barba.js');
var $ = require('jquery');
var assign = require('object-assign');
window.jQuery = window.$ = $;
require('velocity-animate');
require('fullpage.js');
delete window.jQuery;
delete window.$;

var gallery = require('./gallery');
var about = require('./about');
var contact = require('./contact');
var disableScrollPager = true;
var togglerWidth = '8.67302em',
  togglerHeight = '7.67302em',
  togglerLocation = '1.31em',
  smallTogglerLocation = '-1em',
  togglerLocationExtend = '1.31em',
  togglerIntermediateLocation = "0px",
  smallToggleBubbleScale = 0.5,
  toggleBubbleScale = 1,
  isAnimating = false,
  hasMounted = false,
  fullpage = null,
  velocityDuration = 480,
  velocityDefaults = {
    duration: velocityDuration,
  },
  fullPageDefaults = {
    anchors:['top', 'teaching', 'contact'],
    scrollingSpeed: 800,
    menu: '.page-menu',
    // continuousVertical: true,
    // normalScrollElements: ['.normal-scroll-element'],
    // dragAndMove: true,
    easingcss3: 'ease-in-out',
    // parallax: true,
		// parallaxOptions: {type: 'reveal', percentage: 62, property: 'translate'},
    onLeave: function(e) {
      if (isSmallDevice()) { $('.js-page-toggler').velocity({scale: smallToggleBubbleScale}) }
    }
  },
  FadeTransition = {
    start: function() {
      var ig = isGallery()
      Promise
        .all([this.newContainerLoading, this.fadeOut(), this.wait() ])
        .then(this.fadeIn.bind(this));
    },
    wait: function() { return new Promise(function(resolve, reject) { setTimeout(resolve(), velocityDuration * 3) })},
    fadeOut: function() { fadeOut.call(this) },
    fadeIn: function() { fadeIn.call(this) },
  },
  Homepage = {
    namespace: 'transitioner',
    onEnter: function() { initializePage() },
    onEnterComplete: function() { isAnimating = true; },
    onLeaveComplete: function() { isAnimating = false; },
  };

function getScreenDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

function isGallery() {
  return window.location.pathname === '/gallery'
}

function isSmallDevice() {
  return window.innerWidth < 650
}

function getPageTogglerPath() {
  return isGallery() ? '/' :  '/gallery'
}

function updatePageToggler() {
  if (isAnimating) return;
  Barba.Pjax.goTo(getPageTogglerPath());
}

function showPageToggler() {
  var $pageTogglerBubble = $('.js-page-toggler');
  var $gallery = $('.js-toggler-text-gallery');
  var $portfolio = $('.js-toggler-text-portfolio');
  var $image = $('.js-toggler-image');
  if (isGallery()) {
    $gallery.velocity({
      translateY: '30px',
      opacity: 1,
    });
    $portfolio.velocity({
      translateY: '50px',
      opacity: 0,
    });
  } else {
    $portfolio.velocity({
      translateY: '30px',
      opacity: 1,
    });
    $gallery.velocity({
      translateY: '50px',
      opacity: 0,
    });
  }
  $image.velocity({translateY: '-10px'});
}

function renderNextPageTogglerState(ig) {
  var $pageTogglerBubble = $('.js-page-toggler');
  $pageTogglerBubble.velocity({
    scale: isSmallDevice() ? smallToggleBubbleScale : toggleBubbleScale,
    height: togglerHeight,
    width: togglerWidth,
    right: isSmallDevice() ? smallTogglerLocation : togglerLocation,
    top: isSmallDevice() ? smallTogglerLocation : togglerLocation,
  }, velocityDefaults, 'easeInSine');
}

function initializePageToggler() {
  var $pageTogglerBubble = $('.js-page-toggler');
  var $togglerText = $('.js-toggler-text');
  $pageTogglerBubble.one('click', updatePageToggler);
}

function initiaizeGallery() {
  var grid = document.querySelector('.gallery__grid');
  if (grid) {
    gallery.loadImages(grid);
    gallery.setupImages();
  }
}

function initializeContact() {
  if (window.location.pathname === '/contact') {
    contact.setup();
    // autosize(document.querySelectorAll('textarea'));
  }
}

function setupPager() {
  if (disableScrollPager) return
  if ($.fn.fullpage) {
    $('.js-pages-container').fullpage(fullPageDefaults);
  }
}

function destroyPager() {
  $.fn.fullpage && isFunction($.fn.fullpage.destroy) && $.fn.fullpage.destroy('all');
}

function initializePage() {
  initializePageToggler();
  initiaizeGallery();
  initializeContact();
  if (!isGallery()) {
    if (hasMounted) destroyPager()
    setupPager()
  } else if (destroyPager()) {}
}

function fadeOut() {
  var $pageTogglerBubble = $('.js-page-toggler');
  $pageTogglerBubble.addClass("page-toggler--open");
  $pageTogglerBubble.velocity({
    scale: "1.5",
    height: window.innerHeight,
    width: window.innerWidth,
    right: '0px',
    top: '0px',
  }, velocityDefaults);

  return $(this.oldContainer).velocity({
    opacity: 0,
  }, {duration: velocityDefaults.duration * 0.5}).promise();
}

function fadeIn() {
  var _this = this;
  var $newContainer = $(this.newContainer);
  var $pageTogglerBubble = $('.js-page-toggler');

  $newContainer.velocity({
    opacity: 1,
    scale: "1",
  }, assign({}, velocityDefaults, {
    complete: function() {
      if (isFunction(_this.done)) {
        _this.done();
      }
    }
  }));

  setTimeout(function() { showPageToggler() }, velocityDuration)

  setTimeout(function() {
    renderNextPageTogglerState();
    $pageTogglerBubble.removeClass("page-toggler--open");
  }, velocityDuration * 2)
}

function setupPage() {
  var ft = Barba.BaseTransition.extend(FadeTransition);
  var hp = Barba.BaseView.extend(Homepage);
  initializePage();
  fadeIn();
  Barba.Pjax.start();
  hp.init();
  Barba.Pjax.getTransition = function() { return ft };
}

document.addEventListener("DOMContentLoaded", function(event) {
  setTimeout(function() { setupPage() }, velocityDuration * 3);
  hasMounted = true;
});
