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
      $('.stocks').empty();
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  });

//---------------------------Stock Functions--------------------------------
  //AJAX request to get current price of one stock
  let getCurrentPrice = function(stock_purchases){
    stock_purchases.forEach(function(stock){
      $.ajax({
        data: { symbol: stock.ticker },
        url: 'http://dev.markitondemand.com/Api/v2/Quote/jsonp',
        dataType: "jsonp",
            }).done(function(data) {
              stock.current_price = data.LastPrice;
            }).fail(function(jqxhr) {
              console.error(jqxhr);
        });
      });
    return stock_purchases;
  };

  //Map array of stock_purchases from back-end to new array of same stock_purchases
  //with current price from Markit API added
  let addCurrentPrice = function(stock_purchases){
    return getCurrentPrice(stock_purchases);
  };

  //Invoke handlebars template to populate stocks table
  let displayStockPurchases = function(stock_purchases){
    let stockPurchaseListingTemplate = require('./stock-purchase-listing.handlebars');
    $('.stocks').html(stockPurchaseListingTemplate({stock_purchases}));
  };

  //GET all stock_purchases associated with current_user and populate table with them
  $('.show-stocks').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: myApp.BASE_URL + '/stock_purchases',
      method: 'GET',
      dataType: 'json',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
    }).done(function(data) {
      displayStockPurchases(addCurrentPrice(data.stock_purchases));
      console.log(data.stock_purchases);
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  });

  //Create new stock associated with current_user
  $('#create-stock').on('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    $.ajax({
      url: myApp.BASE_URL + '/stock_purchases',
      method: 'POST',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      contentType: false,
      processData: false,
      data: formData,
    }).done(function(data) {
      console.log(data.stock_purchases);
      $('.create-stock-modal').modal('hide');
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  });
});
