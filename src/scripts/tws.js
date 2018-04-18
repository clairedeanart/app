var Sticky = require('sticky-js');
var Flickity  = require('flickity-imagesloaded');
// require('flickity-imagesloaded');

module.exports = function setupTws() {
  // setup tws page
  var elem = $('#tws_page-nav');
  if (elem && elem.length) {
    // elem.scrollNav('destroy')
    // var exists = $('.scroll-nav')
    // if (exists.length) { exists.remove() }
    elem.scrollNav({
      sections: '.page-header',
      showHeadline: false,
      showTopLink: false,
    });

    var options = {
      cellAlign: 'center',
      contain: true,
      wrapAround: true,
      prevNextButtons: true,
      pageDots: true,
      imagesLoaded: true,
    };
    var books = document.querySelector('.books-carousel');
    var presentation = document.querySelector('.presentation-carousel');
    // var rubric = document.querySelector('.rubric-carousel');
    // var carousel = document.querySelector('.main-carousel');
    new Flickity( books, options);
    new Flickity( presentation, options);
    // new Flickity( rubric, options);
  }

};
