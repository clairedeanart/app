function fetchImages() {
  console.log('fetching')
  apiUrl = document.querySelector('html').dataset.serverUrl
  console.log(apiUrl)
}

module.exports = {
  fetchImages: fetchImages,
};
