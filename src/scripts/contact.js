var _ = require('underscore')
var request = require('superagent')

var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

var contactForm = {
  fromName: "",
  fromEmail: "",
  text: ""
}

var validation = {
  fromName: function (val) { return val && val.trim && val.trim() },
  fromEmail: function (val) { return emailRegex.test(val) },
  text: function (val) { return val && val.trim && val.trim() }
}

var validationText = {
  fromName: "Your name is required.",
  fromEmail: "Please enter a valid email address.",
  text: "Please enter a message for Claire."
}

function setup() {
  inputs = document.querySelectorAll('input')
  textareas = document.querySelectorAll('textarea')
  inputs.forEach(handleInputChanges);
  textareas.forEach(handleInputChanges);

  sendButton = document.querySelector('.js-send')
  sendButton.addEventListener('click', send.bind(this, contactForm))

}

function handleInputChanges(elem) {
  // elem.addEventListener('blur', handleLabelMovement);
  elem.addEventListener('keyup', handleLabelMovement);
}

function handleLabelMovement(e) {
  console.log('blur', e.target)
  if (e.target.value && e.target.parentNode) e.target.parentNode.classList.add('dirty')
  else e.target.parentNode.classList.remove('dirty')
  validateItem(true, e.target.name)
  validate(false)
}

function validate(alert) {
  var keys = Object.keys(contactForm)
  var valid = true;
  valid = (keys.filter(validateItem.bind(this, alert))).length === 0
  return valid
}

function validateItem(alert, key) {
  var elem = document.querySelector('[name="'+key+'"]')
  var val = (elem.value && elem.value.trim) ? elem.value.trim() : ""
  if (name && name !== key) {return}
  if (!validation[key](val)) {
    if (alert) {
      var helper = document.querySelector(".js-validation-"+key)
      if (helper) helper.innerHTML = validationText[key]
    }
    document.querySelector('.btn').classList.add('btn-disabled')
    return true
  } else {
    if (alert) {
      var helper = document.querySelector(".js-validation-"+key)
      if (helper) helper.innerHTML = ''
    }
    document.querySelector('.btn').classList.remove('btn-disabled')
    contactForm[key] = val
    return false
  }
}

function clearInputs() {

}

function send() {
  if (validate(true)) {
    console.log('sending', contactForm)
    serverUrl = document.documentElement.dataset.serverUrl
    request
      .post(serverUrl + "/messages")
      .send(contactForm)
      .set('Accept', 'application/json')
      .then(function(res) {
        window.location.replace("/success")
      }).catch(function(error) {
        alert("Oops, an error occurred. Please try again.")
      });
  }
}

module.exports = {
  setup: setup
};
