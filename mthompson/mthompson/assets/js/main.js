'use strict';

var CUR_GALLERY_INDEX;
var GALLERY_COUNT;
var DARK_SOCIAL_MEDIA_ICONS;
var DARK_COLOR_SCHEME;
var WHITE_BACKGROUND = false;

function randomFromInterval(from, to) {
     return Math.floor(Math.random() * (to - from + 1) + from);
}

// On document load, selects one of three randcom images for the background
// if BG1 is selected, sets the text to dark, if not, left at light text
$(document).ready( function() {

  // Load navigation
  // Fetch the nav labels
  $.ajax({
    url: "fetch-categories/",
  }).done(function(response) {
    // Create nav elements based on nav labels
    var menuContainer = $('.nav-menu');
    var categories = response['categories'];

    console.log(response);
    for (var i = 0, l = categories.length; i < l; i++) {
      var name = categories[i]['name'];

      var li =  $('<li></li>');
      var a = $('<a href="" class="nav-link">' + name + '</a>');

      li.append(a);

      if (categories[i]['galleries'].length <= 1) {
        a.addClass('port-link');
        a.data('gallery-id', categories[i]['galleries'][0]['id']);
        if (!!categories[i]['galleries'][0]['story']) {
          var story_icon = $('<a class="story-link" href=""></a>');
          a.append(story_icon);
        }

      }
      else {
        a.addClass('expand-link');
        a.data('bg-src', categories[i]['bg_img']);
        a.data('nav-appearance', categories[i]['nav_appearance']);

        var subnav = $('<ul class="subnav-container"></ul>');
        li.append(subnav);

        for (var a = 0, b = categories[i]['galleries'].length; a < b; a++) {
          var subnav_item_container = $('<li></li>');
          var subnav_title = $('<a class="sub-link port-link" href="">' + categories[i]['galleries'][a]['name'] + '</a>');
          subnav_title.data('gallery-id', categories[i]['galleries'][a]['id']);
          subnav.append(subnav_item_container);
          subnav_item_container.append(subnav_title);

          if (!!categories[i]['galleries'][a]['story']) {
            var story_icon = $('<a class="story-link" href=""></a>');
            subnav_item_container.append(story_icon);
          }
        }

      }

      menuContainer.append(li);
    }


    initPage();
  });

});


var initPage = function() {

var screenWidth = $(window).width();

// make the social media icons the correct color (dark/light)
// rendered obsolete with the refactor of social media icons as bg images!
  // var darkSocialMediaIcons = function(index, value) {
  //   var self = this
  //   var currentSourceString = $(self).attr('src');
  //   // console.log('you likced a social media icon!');
  //   // console.log();
  //   var baseSourceString = currentSourceString.slice(0,-4);
  //   var updatedSourceString = baseSourceString + "_dark.png";

  //   // console.log(updatedSourceString);
  //   $(self).attr(
  //     'src', updatedSourceString
  //   )
  //   DARK_SOCIAL_MEDIA_ICONS = true;
  // };

// rendered obsolete with the refactor of social media icons as bg images!
  // var lightSocialMediaIcons = function(index, value) {
  //   var self = this
  //   var currentSourceString = $(self).attr('src');
  //   // console.log('you likced a social media icon!');
  //   // console.log();
  //   var baseSourceString = currentSourceString.slice(0,-9);
  //   var updatedSourceString = baseSourceString + ".png";

  //   // console.log(updatedSourceString);
  //   $(self).attr(
  //     'src', updatedSourceString
  //   )
  //   DARK_SOCIAL_MEDIA_ICONS = false;
  //  };



  var colorScheme = function () {
   if (DARK_COLOR_SCHEME == true) {
      // $('.smi-image').each(darkSocialMediaIcons);
      $("html, body, a, .story-link").addClass('dark');
    }
      else {
        // $('.smi-image').each(lightSocialMediaIcons);
        $("html, body, a, .story-link").removeClass('dark');
        DARK_COLOR_SCHEME = false;
      }
  };

  // Fetch a random home background and set text based on color scheme
  $.ajax({
    url: "fetch-home-bg/",
  }).done(function(response) {

    DARK_COLOR_SCHEME = response['is_dark_color_scheme'];

    $(".homepage-container").css({
       'background-image': "url('" + response['img_url'] + "')"
    })

    colorScheme();


  });

  // switch(ranNumber) {
  //   case 1:
  //   picture = './img/bgs/homepage_bg1.jpg'
  //   break;
  //   case 2:
  //   picture = './img/bgs/homepage_bg2.jpg'
  //   DARK_COLOR_SCHEME = false
  //   break;
  //   case 3:
  //   picture = './img/bgs/homepage_bg3.jpg'
  //   DARK_COLOR_SCHEME = false
  //   break;
  // }


  // var checkInitScreenSize = function() {
  //   if (screenWidth <= 600) {
  //     DARK_COLOR_SCHEME = true;
  //     colorScheme();
  //     // $('.smi-image').each(darkSocialMediaIcons);
  //     // $("html, body, a, .story-link").addClass('dark');
  //     // DARK_COLOR_SCHEME = true;
  //   }
  // };

  // checkInitScreenSize();

  // var colorSchemeController = function() {
  //   if (ranNumber != 1 && screenWidth > 600){
  //     DARK_COLOR_SCHEME = false;
  //     colorScheme();
  //   }
  //   else {
  //     DARK_COLOR_SCHEME = true;
  //     colorScheme();
  //   }
  // };

  // $(window).resize(function() {
  //   colorSchemeController();
  // });

  // if (ranNumber == 1 && screenWidth > 600) {
  //   DARK_COLOR_SCHEME = true;
  //   colorScheme();
  // }


  // $('.smi-image').click(function(e) {
  //   e.preventDefault();
  //   $('.smi-image').each(darkSocialMediaIcons);

  // });

  // Setting the preloadImage variable for background images
  var preloadImage = function (index, value) {
     var name = $(this).data('bg-src');

      var c = new Image();

      c.onload = function(){
          $("#Your Div ID").css("background-image", "url(" + name + ")");
      }

      c.src = name;
  }

  // Performing the preloadImage function on each background
  // as a result of clicking on expand-link(s)
  $('.expand-link').each(preloadImage);

  var whiteBackground = function () {
    $('.homepage-container').css('background-image', 'url(./img/bgs/white.jpg)');
    WHITE_BACKGROUND = true;
  }

  // Event listener for clicking on a portfolio link
  // Removes hidden class on content-container
  // sets the bg img to white
  // changes type color to dark
  // removes hidden class on portfolio story (right now)
  $('.port-link').click(function(e) {
    e.preventDefault();
    WHITE_BACKGROUND = true;
    if (DARK_COLOR_SCHEME == true) {}
      else {
        DARK_COLOR_SCHEME = true;
        colorScheme();
      }

    var galleryContainer = $('#mygallery');

    // clear gallery container
    galleryContainer.empty();

    // add items to gallery container
    var galleryId = $(this).data('gallery-id');
    console.log(galleryId)

    $.ajax({
      url: "fetch-gallery/" + galleryId,
    }).done(function(response) {
      var photos = response['photos'];
      for (var i = 0, l = photos.length; i < l; i++) {
        var photo = photos[i];
        var src = photo['src'];
 // <a href="./img/full/2.jpg">
 //            <img alt="Title 2" src="./img/thumbs/thumbs_2.jpg"/>
 //          </a>

        var a = $('<a href="' + src + '"></a>');
        var img = $('<img src="' + src + '"/>');
        a.append(img);
        galleryContainer.append(a);

      }

      // Applies the justified gallery plugin to the div with the mygallery ID
      $("#mygallery").justifiedGallery({
        rowHeight: 200,
        lastRow: 'justify',
        margins: 10,
      });

      addGalleryThumbsListener();
    });


    $('.content-container').removeClass('hidden');
    whiteBackground();
    $('.single-image-container').addClass('hidden');
    $('.single-image-nav-container').addClass('hidden');
  });

  // Event listener for clicking the portfolio close 'x'
  // adds the hidden class to the port-story div
  $('.port-close').click(function(e) {
    e.preventDefault();
    // console.log ('you clicked the port story x link!');
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
    if (DARK_COLOR_SCHEME == true) {}
      else {
        DARK_COLOR_SCHEME = true;
        colorScheme();
      }
    var self = this;
    var liCount = $(this).next().children().length;
    var liHeight = $('.subnav-container li').height();
    // console.log (liCount);
    // console.log (liHeight);
    var curSubnav = $(self).next();

    // Reset all the subnavs except the one that was clicked
    // keep those subnavs looking good
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
    }

    // Change the background image and typeface color on menu click!
     if (WHITE_BACKGROUND == true || screenWidth <= 600) {}
      else {
      var name = $(this).data('bg-src');


      $('.homepage-container').css({
      'background-image': "url('" + name + "')"
      });

      // var fontColor = null;

      // switch (name) {
      //   case './img/bgs/musicians_bg.jpg':
      //   if (DARK_COLOR_SCHEME == true) {
      //     DARK_COLOR_SCHEME = false;
      //     colorScheme();
      //     console.log('DCS is TRUE!');
      //   }
      //     else {
      //       console.log('DCS is FALSE');
      //     }
      //   // fontColor = '#ccc'
      //   // $('.story-link').removeClass('dark')
      //   break;
      //   case './img/bgs/comedy_bg.jpg':
      //   if (DARK_COLOR_SCHEME == true) {}
      //     else {
      //       DARK_COLOR_SCHEME = true;
      //       colorScheme();
      //     }
      //   // fontColor = '#333'
      //   // $('.story-link').addClass('dark')
      //     // if (DARK_SOCIAL_MEDIA_ICONS != true) {
      //     //   $('.smi-image').each(darkSocialMediaIcons);
      //     // }
      //   break;
      // }

      // $('html, body, a').css({
      //   'color': ""+ fontColor +""
      // });

      DARK_COLOR_SCHEME = false;
      if ($(this).data('nav-appearance') == 'dark') {
        DARK_COLOR_SCHEME = true;
      }
      colorScheme();

      var homepageBackgroundUrl = $(".homepage-container").css("background-image");

      console.log (name);
    }
  });

  // $("#mygallery-video").justifiedGallery({
  //   rowHeight: 300,
  //   lastRow: 'nojustify',
  //   margins: 10,
  //   fixedHeight: true,
  // });

  var updateVideoSrc = function(str) {
    $('.single-image-wrapper iframe').attr("src", str);
  };


  // click listener for "next" image nav icon
  // checks to see if we're at the end of gallery slides
  // if we are, then we reset the gallery slide to 0
  // if not, we move on to the next gallery slide
  $('.image-nav-icon .next').click(function(e) {
    e.preventDefault();
    // console.log('you clicked the right arrow!');
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
    // console.log('you clicked on the index button!');
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
    // console.log('you clicked the curl!');
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

  $('a.video').click(function(e) {
    e.preventDefault();
    // console.log('you clicked the video link!');
  });

  $('.story-link').click(function(e) {
    e.preventDefault();
    $('.content-container').removeClass('hidden');
    $('.homepage-container').css('background-image', 'url(./img/bgs/white.jpg)');
    $('.story-link').addClass('dark');
    $('html, body, a').css({'color': '#333'});
    // $('.port-story').removeClass('hidden');
    $('.single-image-container').addClass('hidden');
    $('.single-image-nav-container').addClass('hidden');
    if (DARK_SOCIAL_MEDIA_ICONS != true) {
      // $('.smi-image').each(darkSocialMediaIcons);
    }
    $('.port-story').toggleClass('hidden');
  });

  $('.mobile-menu-button').click(function(e) {
    e.preventDefault();
    $('.mobile-menu-button').toggleClass('active');
    $('.nav-menu').toggleClass('active');
    $('.social-media-container').toggleClass('active');
  });


};


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

var addGalleryThumbsListener = function() {
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
    // updateImageSrc(imageUrl);
    updateImageSrc(imageUrl);
    // var calculatedImageSize = $(this).
    // var singleImageSize = 'max-height="400" width="500"'
    // $('.single-image').html('<img src="'+ imageUrl +'" "'+ singleImageSize +'" />');
    $('.port-story').addClass('hidden');
    $('.single-image-nav-container').removeClass('hidden');
    });
  };

