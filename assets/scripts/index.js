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
      showStocks();
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

  //Invoke handlebars template to populate stocks table
  let displayStockPurchases = function(stock_purchases){
    let stockPurchaseListingTemplate = require('./stock-purchase-listing.handlebars');
    $('.stocks').html(stockPurchaseListingTemplate({stock_purchases}));
  };

  let createCollapseAlert = function(){
    $('.collapse').collapse('show');
    setTimeout(function() {
      $('.collapse').collapse('hide');
    }, 2000);
  };

  //Load all stocks associated with user from database, display them, and
  //generate pie chart using their values
  let showStocks = function(){
    $.ajax({
      url: myApp.BASE_URL + '/stock_purchases',
      method: 'GET',
      dataType: 'json',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
    }).done(function(data) {
      myApp.stockPurchases = data.stock_purchases;
      calculatePortfolioGainLoss();
      myApp.stockPurchases.forEach(normalizeDollars);
      displayStockPurchases(myApp.stockPurchases);
      loadPieChart();
      console.log(myApp.stockPurchases);
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  };

  //GET all stock_purchases associated with current_user and populate table with them
  $('.show-stocks').on('click', function(e) {
    e.preventDefault();
    showStocks();
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
      showStocks();
      $('.create-stock-modal').modal('hide');
    }).fail(function(jqxhr) {
      createCollapseAlert();
      console.error(jqxhr);
    });
  });

  //Add id of stock to submit button in update-stock-modal
  $('.stocks').on('click', '.update-stock', function(e){
    let id = $(e.target).attr("data-stock-id");
    $(".update-stock-btn").attr("data-stock-id", id);
  });

  //Update the stock on the back-end
  $('#update-stock').on('submit', function(e){
    e.preventDefault();
    let id = $('.update-stock-btn').attr('data-stock-id');
    let formData = new FormData(e.target);
    $.ajax({
      url: myApp.BASE_URL + '/stock_purchases/' + id,
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      contentType: false,
      processData: false,
      data: formData,
    }).done(function() {
      showStocks();
      $('.update-stock-modal').modal('hide');
    }).fail(function(jqxhr) {
      createCollapseAlert();
      console.error(jqxhr);
    });
  });

  //Delete the stock on back-end, and reload list of stocks
  $('.stocks').on('click', '.delete-stock', function(e){
    e.preventDefault();
    $.ajax({
      url: myApp.BASE_URL + '/stock_purchases/' + $(e.target).attr("data-stock-id"),
      method: 'DELETE',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
    }).done(function() {
      showStocks();
      console.log("Deleted!");
    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  });

  //Calculate difference between purchase value and current value for each
  //purchase in the portfolio
  let calculatePortfolioGainLoss = function(){
    myApp.stockPurchases.forEach(calculateIndividualGainLoss);
  };

  let calculateIndividualGainLoss = function(stock){
    stock.purchaseValue = stock.purchase_price * stock.shares_purchased;
    stock.currentValue = stock.current_price * stock.shares_purchased;
    stock.gainLoss = stock.currentValue - stock.purchaseValue;
  };

  let normalizeDollars = function(stock){
    stock.purchase_price = stock.purchase_price.toFixed(2);
    stock.current_price = stock.current_price.toFixed(2);
    stock.gainLoss = stock.gainLoss.toFixed(2);
  };

  //required for chart to work
  google.charts.load('current', {packages: ['corechart']});

  //Generates pie chart with breakdown of all holdings in portfolio
  let loadPieChart = function(){
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      let arr = myApp.stockPurchases;
      let stocksArray = [];
      arr.forEach(function(stock){
        stocksArray.push([stock.name, stock.currentValue]);
      });
      let data = new google.visualization.DataTable();
      data.addColumn('string', 'Company');
      data.addColumn('number', 'Current Value');
      data.addRows(stocksArray);

      let options = {
        title: 'Your Portfolio Breakdown',
        pieHole: 0.4,
        'width':800,
        'height':600
      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

      chart.draw(data, options);
    }
  };
});
