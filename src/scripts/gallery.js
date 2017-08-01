function loadImages(grid) {
  // FIXME: Create loading state and limit query to only display 5-10 images
  
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

  iso.layout();

  imagesLoaded( grid ).on( 'progress', function() {
    iso.layout();
  });
}

module.exports = {
  loadImages: loadImages,
};
