'use strict';

var CUR_GALLERY_INDEX;
var GALLERY_COUNT;

function randomFromInterval(from, to) {
     return Math.floor(Math.random() * (to - from + 1) + from);
}

// On document load, selects one of three randcom images for the background
// if BG1 is selected, sets the text to dark, if not, left at light text
$(document).ready( function() {

    var ranNumber = randomFromInterval(1, 3)
    var picture = null;

  switch(ranNumber) {
    case 1:
    picture = './img/bgs/homepage_bg1.jpg'
    break;
    case 2:
    picture = './img/bgs/homepage_bg2.jpg'
    break;
    case 3:
    picture = './img/bgs/homepage_bg3.jpg'
    break;
  }

  $(".homepage-container").css({
     'background-image': "url('" + picture + "')"
  })

  if ((picture) == './img/bgs/homepage_bg1.jpg') {
    $("html, body, a").addClass('dark-text');
  }

});



// Setting the preloadImage variable for background images
var preloadImage = function (index, value) {
   var name = './img/bgs/' +
    $.trim(
      $(value).text().toLowerCase()
      ) + '_bg.jpg';

    var c = new Image();

    c.onload = function(){
        $("#Your Div ID").css("background-image", "url(" + name + ")");
    }

    c.src = name;
}

// Performing the preloadImage function on each background
// as a result of clicking on expand-link(s)
$('.expand-link').each(preloadImage);

// Event listener for clicking on a portfolio link
// Removes hidden class on content-container
// sets the bg img to white
// changes type color to dark
// removes hidden class on portfolio story (right now)
$('.port-link').click(function(e) {
  e.preventDefault();
  $('.content-container').removeClass('hidden');
  $('.homepage-container').css('background-image', 'url(./img/bgs/white.jpg)');
  $('html, body, a').css({'color': '#333'});
  $('.port-story').removeClass('hidden');
  $('.single-image-container').addClass('hidden');
  $('.single-image-nav-container').addClass('hidden');
  // $('.content-container').fadeTo(fast, 1);
});

// Event listener for clicking the portfolio close 'x'
// adds the hidden class to the port-story div
$('.port-close').click(function(e) {
  e.preventDefault();
  console.log ('you clicked the port story x link!');
  $('.port-story').addClass('hidden');
});

// Event listener for clicking on the expand-link anchors
// Counts up the number of li's in each ul
// calculates height of one li
// adds hidden class on content-container div and port-story div
// resets all the expand-links to non-active besdies the one that is clicked on
// sets the max height of the subnav container div to liCount * liHeight
// takes the name of the expand-link and sets the background to the appropriate image
// sets the text color appropriate based on which background image is used
$('.expand-link').click(function(e) {
  e.preventDefault();
  var self = this;
  var liCount = $(this).next().children().length;
  var liHeight = $('.subnav-container li').height();
  console.log (liCount);
  console.log (liHeight);
  $('.content-container').addClass('hidden');
  $('.port-story').addClass('hidden');
  var curSubnav = $(self).next();

  // $('.expand-link').next().removeClass('active');
  var resetAllButClicked = function(index, elm) {
    if ((self) == (elm)) {
      curSubnav.toggleClass('active');
    }
      else {
        $(elm).next().removeClass('active');
         $(elm).next().css({
          'max-height' : '0'
          });
      }
  };

  $('.expand-link').each(resetAllButClicked);

  if (curSubnav.hasClass('active')) {
    $('.subnav-container.active').css({
    'max-height' : liCount * liHeight
    });
  }
  else {
    curSubnav.css({
      'max-height' : '0'
      });
  }



  // Change the background image and typeface color on menu click!

  var name = './img/bgs/' + $.trim($(this).text().toLowerCase()) + '_bg.jpg';


  $('.homepage-container').css({
    'background-image': "url('" + name + "')"
  });

  var fontColor = null;

  switch (name) {
    case './img/bgs/musicians_bg.jpg':
    fontColor = '#ccc'
    break;
    case './img/bgs/comedy_bg.jpg':
    fontColor = '#333'
    break;
  }

  $('html, body, a').css({
    'color': ""+ fontColor +""
  });

  var homepageBackgroundUrl = $(".homepage-container").css("background-image");

  console.log (name);
  console.log (fontColor);
});

// Applies the justified gallery plugin to the div with the mygallery ID
$("#mygallery").justifiedGallery({
  rowHeight: 200,
  lastRow: 'justify',
  margins: 10,
});

// Click listener for clicking on a link within the gallery
// Prevents default, loads link in single-image div
// calculates imgUrl to direct user to proper full-size image
// closes the portfolio story div (if open)
// reveals the single-img-nav-container
$('#mygallery a').click(function(e) {
  e.preventDefault();
  var self = this;
  GALLERY_COUNT = ($("#mygallery a").length - 1);
  console.log(GALLERY_COUNT);
  $('#mygallery a').each(function(i, el) {
    if (el == self) {
      CUR_GALLERY_INDEX = i;
      console.log(CUR_GALLERY_INDEX);
    }
  });

  $('#mygallery').toggleClass('hidden');
  $('.single-image-container').toggleClass('hidden');
  var self = this;
  var imageUrl = $(this).attr('href');
  // var calculatedImageSize = $(this).
  // var singleImageSize = 'max-height="400" width="500"'
  // $('.single-image').html('<img src="'+ imageUrl +'" "'+ singleImageSize +'" />');
  $('.single-image').html('<img src="'+ imageUrl +'" />');
  $('.port-story').addClass('hidden');
  $('.single-image-nav-container').removeClass('hidden');
});

$('.image-nav-icon .next').click(function(e) {
  e.preventDefault();
  console.log('you clicked the right arrow!');
  if (CUR_GALLERY_INDEX == GALLERY_COUNT) {
    CUR_GALLERY_INDEX = 0;
  }
    else {
      CUR_GALLERY_INDEX++;
    }
  console.log($('#mygallery a')[CUR_GALLERY_INDEX]);
  console.log(CUR_GALLERY_INDEX);
  var nextEl = $('#mygallery a')[CUR_GALLERY_INDEX];
  var imageUrl = $(nextEl).attr('href');
    $('.single-image').html('<img src="'+ imageUrl +'" />');
});



