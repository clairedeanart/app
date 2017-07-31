function loadImages() {
  var grid = document.querySelector('.gallery__grid');

  var iso = new Isotope( grid, {
    itemSelector: '.grid__item',
    percentPosition: true,
    layoutMode: 'masonry',
    masonry: {
      columnWidth: '.grid-sizer',
      gutter: 10,
      transitionDuration: '0.2s',
    }
  });

  imagesLoaded( grid ).on( 'progress', function() {
    // layout Isotope after each image loads
    iso.layout();
  });
}

module.exports = {
  loadImages: loadImages,
};
