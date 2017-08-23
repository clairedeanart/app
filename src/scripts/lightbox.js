function Lightbox(images, event) {
  this.lightbox = null;
  this.lightboxBackdrop = null;
  this.lightboxCloseIconWrapper = null;
  this.lightboxCloseIcon = null;
  this.lightboxImageWrapper = null;
  this.lightboxImage = null;
  this.event = event;
  this.image = event.target;
  this.images = images;
  this.fadeClass = 'lightbox--fade-in';
  this.unmounting = false;
  this.win = {
    height: window.innerHeight,
    width: window.innerWidth,
  }
}

Lightbox.prototype.layout = function layout() {
  if (document.querySelector('.lightbox')) return;

  this.lightbox = document.createElement('div');
  this.lightboxBackdrop = document.createElement('div');
  this.lightboxCloseIconWrapper = document.createElement('div');
  this.lightboxCloseIcon = document.createElement('p');
  this.lightboxImageWrapper = document.createElement('div');
  this.lightboxImage = document.createElement('img');

  this.lightbox.onclick = this.handleClick.bind(this);
  this.lightboxCloseIconWrapper.onclick = this.unmount.bind(this);
  // this.lightboxImage.touchstart = this.handleTouchStart(this);

  this.lightbox.className = 'lightbox';
  this.lightboxBackdrop.className = 'lightbox__backdrop';
  this.lightboxImageWrapper.className = 'lightbox__image__wrapper';
  this.lightboxImage.className = 'lightbox__image';
  this.lightboxCloseIcon.className = 'lightbox__close-icon';
  this.lightboxCloseIconWrapper.className = 'js-close-icon lightbox__close-icon__wrapper';

  this.lightboxImage.style.transform = 'translateY('+ this.win.height + 'px';
  this.lightboxImage.src = this.image.getAttribute('src');
  this.lightboxImage.height = this.win.height;

  this.lightboxCloseIcon.innerHTML = 'X';

  this.lightboxCloseIconWrapper.appendChild(this.lightboxCloseIcon)
  this.lightboxImageWrapper.appendChild(this.lightboxImage);
  this.lightboxBackdrop.appendChild(this.lightboxImageWrapper);
  this.lightbox.appendChild(this.lightboxBackdrop);
  this.lightbox.appendChild(this.lightboxCloseIconWrapper);

  document.body.appendChild(this.lightbox);

  this.mount()

};

Lightbox.prototype.createImage = function createImage() {

};


Lightbox.prototype.animateLightbox = function animateLightbox(direction) {
  if (direction === 'in') { this.lightbox.classList.add(this.fadeClass) }
  else { this.lightbox.classList.remove(this.fadeClass) }
}

Lightbox.prototype.animateImage = function animateImage(direction) {
  if (direction === 'in') {
    this.lightboxImage.style.transform = 'translateY(0px)';
  }
  else {
    this.lightboxImage.style.transform = 'translateY('+ this.win.height + 'px)';
  }
}

Lightbox.prototype.mount = function () {
  setTimeout(function() {
    this.animateLightbox('in');
    this.animateImage('in');
    document.body.style.overflow = 'hidden';
  }.bind(this), 100);
};

Lightbox.prototype.unmount = function () {
  this.unmounting = true;
  this.animateImage('out');
  this.animateLightbox('out');
  setTimeout(function() {

    this.destroy();
  }.bind(this), 300);
};

Lightbox.prototype.destroy = function destroy() {
  setTimeout(function() {
    this.lightbox.remove();
    document.body.style.overflow = 'initial';
  }.bind(this), 300);
}

Lightbox.prototype.handleClick = function handleClick(e) {
  if (this.unmounting) return;
  // if (e.target.classList.contains('lightbox__backdrop')) {
  // this.goRight(e);

  // }
};

Lightbox.prototype.goRight = function goRight(e) {
  this.lightboxImage.style.transform = 'translateX('+ -this.win.width + 'px)';
  this.lightboxImage.style.opacity = 0;
  console.log('goright')
  var oldImage = this.lightboxImage;
  this.lightboxImage = document.createElement('img');
  var nextImage = this.getNextImage(this.image.locationIndex);

  // newImageWrapper.className = 'lightbox__new-image__wrapper';
  this.lightboxImage.className = 'lightbox__new-image';
  this.lightboxImage.src = nextImage.src;
  this.lightboxImage.height = this.win.height;

  // this.lightboxImageWrapper.className = 'lightbox__image__wrapper';
  // this.lightboxImage.className = 'lightbox__image';

  this.lightboxImage.style.transform = 'translateX('+ this.win.width + 'px)';
  this.lightboxImage.style.opacity = 0;

  // this.lightboxImageWrapper.appendChild(this.lightboxImage);
  this.lightboxImageWrapper.appendChild(this.lightboxImage);

  // this.lightboxImage.classList.add('lightbox__image--shift-left');
  setTimeout(function() {
    this.lightboxImage.style.transform = 'translateX(0px)';
    this.lightboxImage.style.opacity = 1;
    setTimeout(function() {
      oldImage.remove()
    }.bind(this), 800);
  }.bind(this), 300)
  this.image = nextImage;

};

Lightbox.prototype.getNextImage = function getNextImage(index) {
  if (this.images[index + 1]) return this.images[index + 1];
  else return this.images[0];
};

function openImage(images, e) {
  var lightbox = new Lightbox(images, e);
  lightbox.layout();
}


module.exports = {
  openImage: openImage,

};
