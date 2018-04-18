// var Flickity = require('flickity');
// var autosize = require('autosize');
var Barba = require('barba.js');
var $ = require('jquery');
var assign = require('object-assign');
var ScrollReveal = require('scrollreveal');
var Flickity  = require('flickity-imagesloaded');
// require('flickity-imagesloaded');
window.jQuery = window.$ = $;
require('velocity-animate');
require('fullpage.js');
require('animatescroll.js');
require('scrollnav');
// delete window.jQuery;
// delete window.$;

var gallery = require('./gallery');
var about = require('./about');
var contact = require('./contact');
var setupTws = require('./tws');
var disableScrollPager = true;
var disableScrollReveal = true;
var togglerWidth = '8.67302em',
  togglerHeight = '7.67302em',
  togglerLocation = '1.31em',
  smallTogglerLocation = '-1em',
  togglerLocationExtend = '1.31em',
  togglerIntermediateLocation = "0px",
  smallToggleBubbleScale = 0.5,
  toggleBubbleScale = 1,
  isAnimating = false,
  isInitialized = false,
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
    easingcss3: 'ease-in-out',
    onLeave: function(e) {
      if (isSmallDevice()) { $('.js-page-toggler').velocity() }
    }
  },
  scrollRevealDefaults = {
     duration: 300,
     delay: 250
  },
  GrowTransition = {
    cda_id: 'GrowTransition',
    start: function() {
      Promise
      .all([this.newContainerLoading, this.fadeOut(), doWait(velocityDuration)])
      .then(this.fadeIn.bind(this));
    },
    waitThenShowText: waitThenShowText,
    fadeIn: function() { fadeIn.call(this) },
    fadeOut: function() { fadeOut.call(this) },
  },
  FadeTransition = {
    cda_id: 'FadeTransition',
    start: function() {
      Promise
      .all([this.newContainerLoading, this.opacityOut() ])
      .then(this.opacityIn.bind(this));
    },
    opacityIn: function() { opacityIn.call(this) },
    opacityOut: function() { opacityOut.call(this) },
  },
  Homepage = {
    namespace: 'transitioner',
    onEnter: function() {
      var h = Barba.HistoryManager.history
      // alert('enter')
      initializePage();
    },
    onLeave: function() {
      // alert('leave')
    },
    onEnterComplete: function() {
      isAnimating = true;
    },
    onLeaveComplete: function() {
      isAnimating = false;
    },
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

function getPath() {
  return window.location.pathname;
}

function isSmallDevice() {
  return window.innerWidth < 650
}

function getPageTogglerPath() {
  // return isGallery() ? '/' :  '/gallery'
}

function getNextPath(path) {
  return path ? '/' + path : (getPath() === '/' ? '/gallery' : '/');
}

function updatePageToggler(path) {
  if (isAnimating) return;
  Barba.Pjax.goTo(getNextPath(path));
}

function showGallery() {
  var $gallery = $('.js-toggler-text-gallery');
  var $portfolio = $('.js-toggler-text-portfolio');
  $gallery.velocity({
    translateY: '30px',
    opacity: 1,
  });
  $portfolio.velocity({
    translateY: '50px',
    opacity: 0,
  });
}

function showPortfolio() {
  var $gallery = $('.js-toggler-text-gallery');
  var $portfolio = $('.js-toggler-text-portfolio');
  $portfolio.velocity({
    translateY: '30px',
    opacity: 1,
  });
  $gallery.velocity({
    translateY: '50px',
    opacity: 0,
  });
}

function handleShowTogglerText(active, rest) {
  var show = { translateY: '30px', opacity: 1 };
  var hide = { translateY: '80px', opacity: 0 };
  $(active).velocity(show);
  rest.forEach(function(r) {
    $(r).velocity(hide)
  })
}

function setCurrentActiveTransition(nextTransition) {
  Barba.Pjax.getTransition = function() {
    return nextTransition || FadeTransition;
  };
}

function getRouteFromUrl(url) {
  if (!url) return getPath();
  var pa = url.split('/');
  var i = 3;
  return pa[i] || '/';
}

function getTransitionObject(curr, next) {

  // var t = GrowTransition;
  // var currHome = (curr === '/' || curr === 'gallery');
  // var nextHome = (next === '/' || next === 'gallery');
  // if (!next)
  //   t = (currHome) ? GrowTransition : FadeTransition;
  // else
  // t = (currHome && nextHome) ? GrowTransition : FadeTransition;
  // if (currHome && nextHome) { t = GrowTransition }
  // else if (currHome && !nextHome) { FadeTransition }
  // else { t = FadeTransition }

  // switch (path) {
  //   case '/':
  //   case '/gallery':
  //   // case '/lessons':
  //     t =  GrowTransition;
  //     break;
  //   case '/lessons':
  //      t = FadeTransition;
  //      break;
  // }
  // console.log('ttt', t.cda_id)
  var t = GrowTransition;
  return Barba.BaseTransition.extend(t);
}

function showPageToggler(isHovering) {
  var $pageTogglerBubble = $('.js-page-toggler');
  var $image = $('.js-toggler-image');
  var $texts = $('.js-toggler-text');
  var active = null;
  var rest = [];
  $texts.each(function(t, i) {
    ($(this).data('path') === getPath()) ? active = this : rest.push(this);
  });
  handleShowTogglerText(active, rest);
  $image.velocity({translateY: '-10px'});
}

function renderNextPageTogglerState(ig) {
  var $pageTogglerBubble = $('.js-page-toggler');
  $pageTogglerBubble.velocity({
    scale: isSmallDevice() ? smallToggleBubbleScale : toggleBubbleScale,
    height: togglerHeight,
    width: togglerWidth,
    left: isSmallDevice() ? smallTogglerLocation : togglerLocation,
    top: isSmallDevice() ? smallTogglerLocation : togglerLocation,
  }, velocityDefaults, 'easeInSine');
}

function initializePageToggler() {
  // console.log('initializePageToggler')
  if (isInitialized) return;
  var $pageTogglerBubble = $('.js-page-toggler');
  var $togglerText = $('.js-toggler-text');
  $pageTogglerBubble.on('click', function() {
    updatePageToggler(null)
  });
  isInitialized = true;
  // $pageTogglerBubble.on('mouseenter', showPageToggler.bind(this, true));
  // $pageTogglerBubble.on('mouseleave', showPageToggler.bind(this, false));
}

function initiaizeGallery() {
  var grid = document.querySelector('.gallery__grid');
  gallery.setupImages();
  if (grid) {
    gallery.loadImages(grid);
  }
}

function initializeLessons() {
  var wildthings = document.querySelector('.js-gallery-wildthings')
  if (wildthings) gallery.loadImages(wildthings)
  var popup = document.querySelector('.js-gallery-popup')
  if (popup) gallery.loadImages(popup)
  var constructed = document.querySelector('.js-gallery-constructed')
  if (constructed) gallery.loadImages(constructed)
}

function initializeContact() {
  contact.setup();
}

function initializePrimaryCallsToAction() {
  var $primaryCallToActions = $('.js-call-to-action-button')
  $primaryCallToActions.on('click', handleCallToAction);
}

function handleCallToAction(e) {
  var path = $(e.currentTarget).data('name');
  if ($(e.currentTarget).data('scroll')) {
    $('.js-page-location__'+path).animatescroll();
  } else updatePageToggler(path);
    // console.log('handleCallToAction', )
    // var ft = Barba.BaseTransition.extend(FadeTransition);
    // Barba.Pjax.getTransition = function() { return ft };
    // Route to path
    // Barba.Pjax.goTo("/" + path);
}

function setupPager() {
  if (disableScrollPager) return
  if ($.fn.fullpage) {
    $('.js-pages-container').fullpage(fullPageDefaults);
  }
}

function setupScollReveal() {
  if (disableScrollReveal) return
  window.sr = ScrollReveal({ reset: true });
  // Customizing a reveal set
  sr.reveal('.heading-image--large', scrollRevealDefaults);
  sr.reveal('.teaching-card', scrollRevealDefaults);
}

function setupGalleryScrollReveal() {
  window.sr = ScrollReveal({ reset: true });
  // Customizing a reveal set
  sr.reveal('.heading-image--large', scrollRevealDefaults);
}

function destroyPager() {
  $.fn.fullpage && isFunction($.fn.fullpage.destroy) && $.fn.fullpage.destroy('all');
}

function initializePage() {
  $(document).scrollTop(0);
  initializePageToggler();
  initiaizeGallery();
  initializeContact();
  setupTws();
  initializeLessons();
  initializePrimaryCallsToAction();
  waitThenShowText();

  if (!isGallery()) {
    if (hasMounted) destroyPager()
    setupPager()
    setupScollReveal()
  } else if (destroyPager()) {}

  // Setup or reset page transition
  // setCurrentActiveTransition(getTransitionObject())
}

function doWait(time) {
  return new Promise(function(resolve, reject) { setTimeout(resolve, time) } );
}

function waitThenShowText() {
  return doWait(velocityDuration * 0.5).then(showPageToggler)
}

function opacityIn() {
  // console.log('opacityIn')
  var _this = this;
  var $newContainer = $(this.newContainer);
  var $pageTogglerBubble = $('.js-page-toggler');

  $newContainer.velocity({
    opacity: 1,
    // scale: "1",
  }, assign({}, velocityDefaults, {
    complete: function() {
      if (isFunction(_this.done)) {
        _this.done();
      }
    }
  }));

  setTimeout(function() {
    // renderNextPageTogglerState();
    // $pageTogglerBubble.removeClass("page-toggler--open");
  }, velocityDuration * 2);
}

function opacityOut() {
  // var $pageTogglerBubble = $('.js-page-toggler');
  // $pageTogglerBubble.addClass("page-toggler--open");
  // $pageTogglerBubble.velocity({
  //   scale: "1.5",
  //   height: window.innerHeight,
  //   width: window.innerWidth,
  //   right: '0px',
  //   bottom: '0px',
  // }, velocityDefaults);

  doHideToggler();

  return $(this.oldContainer).velocity({
    opacity: 0,
  }, {duration: velocityDefaults.duration * 0.5}).promise();
}

function fadeIn() {
  var _this = this;
  var $newContainer = $(this.newContainer);
  var $pageTogglerBubble = $('.js-page-toggler');

  doShowToggler();

  $newContainer.velocity({
    opacity: 1,
    // scale: "1",
  }, assign({}, velocityDefaults, {
    complete: function() {
      if (isFunction(_this.done)) {
        _this.done();
      }
    }
  }));

  setTimeout(function() {
    renderNextPageTogglerState();
    $pageTogglerBubble.removeClass("page-toggler--open");
  }, velocityDuration * 2);
}

function fadeOut() {
  var $pageTogglerBubble = $('.js-page-toggler');
  $(this.oldContainer).velocity({
    opacity: 0,
  }, {duration: velocityDefaults.duration * 0.5})

  $pageTogglerBubble.addClass("page-toggler--open");
  return $pageTogglerBubble.velocity({
    scale: "1.5",
    height: window.innerHeight,
    width: window.innerWidth,
    left: '0px',
    top: '0px',
  }, velocityDefaults).promise();
}

function doShowToggler() {
  var $pageTogglerBubble = $('.js-page-toggler');
  // $pageTogglerBubble.velocity({
  //   scale: "1.5",
  // }, velocityDefaults);
}

function doHideToggler() {
  var $pageTogglerBubble = $('.js-page-toggler');
  $pageTogglerBubble.addClass("page-toggler--hidden");
  $pageTogglerBubble.velocity({
    scale: "0",
  }, velocityDefaults);
}

function setupPage() {
  var hp = Barba.BaseView.extend(Homepage);
  initializePage();
  fadeIn();
  hp.init();
  Barba.Pjax.start();
  setCurrentActiveTransition(getTransitionObject(getPath(), getPath()));
  // Barba.Dispatcher.on('initStateChange', function(currentStatus) {
  //
  //   // alert(Barba.HistoryManager.history[Barba.HistoryManager.history.length - 1].url)
  //   // // Barba.HistoryManager.history.length - 1
  //   // alert(Barba.HistoryManager.history[Barba.HistoryManager.history.length - 2].url)
  //   // console.log('currentStatus, oldStatus, container', currentStatus, oldStatus, container)
  //   var nextTransition = FadeTransition;
  //
  //   if (currentStatus) {
  //     var h = Barba.HistoryManager.history;
  //     var currentRoute = h[h.length - 2].url;
  //     var nextRoute = h[h.length - 1].url;
  //     // console.log('')
  //     if (typeof nextRoute === 'undefined') return getTransitionObject('/' + getRouteFromUrl(currentRoute))
  //     nextTransition = getTransitionObject(getRouteFromUrl(currentRoute), getRouteFromUrl(nextRoute))
  //   } else nextTransition = getTransitionObject(getPath(), getPath())
  //   Barba.Pjax.getTransition = function() { return nextTransition }
  //   // return setCurrentActiveTransition(getTransitionObject(getPath(), getPath()))
  //
  // });
}

document.addEventListener("DOMContentLoaded", function(event) {
  setTimeout(function() { setupPage() }, velocityDuration * 3);
  hasMounted = true;
});
