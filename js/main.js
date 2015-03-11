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
    $("html, body, a, .story-link").addClass('dark');
    $('.smi-image').each(darkSocialMediaIcons);
  }

});



// make the social media icons the correct color (dark/light)
var darkSocialMediaIcons = function(index, value) {
  var self = this
  var currentSourceString = $(self).attr('src');
  console.log('you likced a social media icon!');
  // console.log();
  var baseSourceString = currentSourceString.slice(0,-4);
  var updatedSourceString = baseSourceString + "_dark.png";

  console.log(updatedSourceString);
  $(self).attr(
    'src', updatedSourceString
  )
}

// $('.smi-image').click(function(e) {
//   e.preventDefault();
//   $('.smi-image').each(darkSocialMediaIcons);

// });

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
  $('.story-link').addClass('dark');
  $('html, body, a').css({'color': '#333'});
  $('.port-story').removeClass('hidden');
  $('.single-image-container').addClass('hidden');
  $('.single-image-nav-container').addClass('hidden');
  $('.smi-image').each(darkSocialMediaIcons);
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
  var whiteBg = ($('.homepage-container').css('background-image'));
  console.log(whiteBg);
  // $('.content-container').addClass('hidden');
  // $('.port-story').addClass('hidden');
  var curSubnav = $(self).next();
  // var storyLinks = $(curSubnav).children().children('.story-link');
  // console.log(storyLinks);

  // $('.expand-link').next().removeClass('active');
  var resetAllButClicked = function(index, elm) {
    if ((self) == (elm)) {
      curSubnav.toggleClass('active');
      // storyLinks.toggleClass('active');
    }
      else {
        $(elm).next().removeClass('active');
        // $(elm).next().children().children('.story-link').removeClass('active');
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
    // $(storyLinks).addClass('active');
  }
  else {
    curSubnav.css({
      'max-height' : '0'
      });
    // $(storyLinks).removeClass('active');
  }

  // Change the background image and typeface color on menu click!
   if (whiteBg == "url(file://localhost/Users/shanetaylor/Documents/meganthompson/design/poop/img/bgs/white.jpg)") {
   }
    else {
    var name = './img/bgs/' + $.trim($(this).text().toLowerCase()) + '_bg.jpg';
    $('.homepage-container').css({
    'background-image': "url('" + name + "')"
    });

    var fontColor = null;

    switch (name) {
      case './img/bgs/musicians_bg.jpg':
      fontColor = '#ccc'
      $('.story-link').removeClass('dark')
      break;
      case './img/bgs/comedy_bg.jpg':
      fontColor = '#333'
      $('.story-link').addClass('dark')
      $('.smi-image').each(darkSocialMediaIcons)
      break;
    }

    $('html, body, a').css({
      'color': ""+ fontColor +""
    });

    var homepageBackgroundUrl = $(".homepage-container").css("background-image");

    console.log (name);
    console.log (fontColor);
  }
});
// Applies the justified gallery plugin to the div with the mygallery ID
$("#mygallery").justifiedGallery({
  rowHeight: 200,
  lastRow: 'justify',
  margins: 10,
});

var updateImageSrc = function(str) {
  $('.single-image-wrapper img').attr("src", str);
  setTimeout(function() {

    var parentWidth = $('.single-image-wrapper').width();
    var imageWidth = $('.single-image-wrapper img').width();
    var offset = ((parentWidth - imageWidth)/2)
    $('.curl').css({
       'right': offset + "px"
    })
    $('.img-story').css({
      'left': offset + "px",
      'width': imageWidth + "px"
    })

  }, 50);

};

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
  updateImageSrc(imageUrl);
  // var calculatedImageSize = $(this).
  // var singleImageSize = 'max-height="400" width="500"'
  // $('.single-image').html('<img src="'+ imageUrl +'" "'+ singleImageSize +'" />');
  $('.port-story').addClass('hidden');
  $('.single-image-nav-container').removeClass('hidden');
});

// click listener for "next" image nav icon
// checks to see if we're at the end of gallery slides
// if we are, then we reset the gallery slide to 0
// if not, we move on to the next gallery slide
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
  updateImageSrc(imageUrl);
  resetImageStoryMode();
    // $('.single-image-wrapper').html('<img src="'+ imageUrl +'" />');
});

// click listener for the "previous" nav icon
// checks to see if we're at the first gallery slide
// if we are, brings us to the end of the gallery
// if not, takes us one gallery slide down
$('.image-nav-icon .previous').click(function(e) {
  e.preventDefault();
  if (CUR_GALLERY_INDEX == 0) {
    CUR_GALLERY_INDEX = GALLERY_COUNT;
  }
    else {
      CUR_GALLERY_INDEX--;
    }
  console.log($('#mygallery a')[CUR_GALLERY_INDEX]);
  console.log(CUR_GALLERY_INDEX);
  var prevEl = $('#mygallery a')[CUR_GALLERY_INDEX];
  var imageUrl = $(prevEl).attr('href');
  updateImageSrc(imageUrl);
  resetImageStoryMode();
    // $('.single-image-wrapper').html('<img src="'+ imageUrl +'" />');
});

// Event listener for clicking on "index" button
// hides the single image container
// hides the single image nav container
// toggles the #mygallery div
$('.image-nav-icon .index').click(function(e) {
  e.preventDefault();
  console.log('you clicked on the index button!');
  $('.single-image-container').addClass('hidden');
  $('.single-image-nav-container').addClass('hidden');
  $('#mygallery').toggleClass('hidden');
});

var toggleImageStoryMode = function() {
  $('.img-story').toggleClass('hidden');
  $('.curl').toggleClass('hidden');
};

var resetImageStoryMode = function() {
  var hiddenStory = $('.img-story').hasClass('hidden');
  if (hiddenStory == false) {
    $('.img-story').addClass('hidden');
    $('.curl').removeClass('hidden');
  }
};

$('.curl').click(function(e) {
  e.preventDefault();
  console.log('you clicked the curl!');
  toggleImageStoryMode();
});

$('.close-single-image').click(function(e) {
  e.preventDefault();
  toggleImageStoryMode();
});

$(window).resize(function(){
  var parentWidth = $('.single-image-wrapper').width();
  var imageWidth = $('.single-image-wrapper img').width();
  var offset = ((parentWidth - imageWidth)/2)
  $('.curl').css({
     'right': offset + "px"
  })
  $('.img-story').css({
    'left': offset + "px",
    'width': imageWidth + "px"
  })
});

// $('.video').click(function(e) {
//   e.preventDefault();
//   console.log('you clicked the video link!');
// });


