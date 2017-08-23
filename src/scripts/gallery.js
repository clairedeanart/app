var Lightbox = require('./lightbox');

function loadImages(grid) {
  // FIXME: Create loading state and limit query to only display 5-10 images
  var iso, images;

  iso = new Isotope( grid, {
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

function setupImages() {
  images = document.querySelectorAll('.js-image');
  images = [].map.call(images, function(image, index) {
    image.locationIndex = index;
    // Transfer and remove data from html to actual node
    var data = image.getAttribute('data-data');
    image.data = JSON.parse(data);
    image.removeAttribute('data-data');
    // Create lightboxable action
    image.onclick = Lightbox.openImage.bind(null, images);
    return image;
  });
}

module.exports = {
  loadImages: loadImages,
  setupImages: setupImages,
};
