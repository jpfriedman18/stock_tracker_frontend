'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');
require('../styles/index.scss');

const myApp = {
  BASE_URL: 'http://localhost:3000'
};

//Account AJAX requests
$(document).ready(() => {
  $('.alert').hide();
  $('.signed-out').show();
  $('.signed-in').hide();
  //Create new user
  $('#sign-up').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    $.ajax({
      url: myApp.BASE_URL + '/sign-up',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function(data) {
      console.log(data);
      signIn(e);
      $('#sign-up-modal').modal('hide');
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  });

  //Makes Sign In AJAX request
  //called by clicking sign-in button OR successfully signing up
  let signIn = function(e){
    e.preventDefault();
    var formData = new FormData(e.target);
    $.ajax({
      url: myApp.BASE_URL + '/sign-in',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function(data) {
      console.log(data);
      myApp.user = data.user;
      console.log(myApp.user);
      $('.signed-out').hide();
      $('.signed-in').show();
      $('#sign-in-modal').modal('hide');
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  };

  //Login as existing user
  $('#sign-in').on('submit', function(e) {
    e.preventDefault();
    signIn(e);
  });

  //Change password of currently logged-in user
  $('#change-password').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    $.ajax({
      url: myApp.BASE_URL + '/change-password/' + myApp.user.id,
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      contentType: false,
      processData: false,
      data: formData,
    }).done(function(data) {
      console.log(data);
      $('#change-password-modal').modal('hide');
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  });

  //Log out
  $('#sign-out-button').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: myApp.BASE_URL + '/sign-out/' + myApp.user.id,
      method: 'DELETE',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
    }).done(function() {
      console.log("Logged Out!");
      $('.signed-out').show();
      $('.signed-in').hide();
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  });

  
});


//GET data for a given stock symbol
// $(document).ready(function() {
// $.ajax({
//   data: { symbol: 'AAPL' },
//   url: 'http://dev.markitondemand.com/Api/v2/Quote/jsonp',
//   dataType: "jsonp",
//       }).done(function(data) {
//         console.log(data);
//       }).fail(function(jqxhr) {
//         console.error(jqxhr);
//   });
// });
