'use strict';

var CUR_GALLERY_INDEX;
var GALLERY_COUNT;
var DARK_SOCIAL_MEDIA_ICONS;
var DARK_COLOR_SCHEME;
var WHITE_BACKGROUND = false;
var VIMEO_DATA;

function randomFromInterval(from, to) {
     return Math.floor(Math.random() * (to - from + 1) + from);
}

// On document load, selects one of three randcom images for the background
// if BG1 is selected, sets the text to dark, if not, left at light text
$(document).ready( function() {


  // Load navigation
  // Fetch the nav labels
  $.ajax({
    url: "https://vimeo.com/api/v2/user3589164/videos.json",
  }).done(function(response) {
    VIMEO_DATA = response;
    console.log(VIMEO_DATA);
  });


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

      // Single-gallery collection
      if (categories[i]['galleries'].length <= 1) {
        a.addClass('port-link');
        a.data('gallery-id', categories[i]['galleries'][0]['id']);
        a.data('gallery-type', categories[i]['galleries'][0]['type']);

        if (!!categories[i]['galleries'][0]['story']) {
          var story_icon = $('<a class="story-link" href=""></a>');
          a.append(story_icon);
          var story_text = categories[i]['galleries'][0]['story'];
          story_icon.data('story-text', story_text);
        }


      }

      // Multi-gallery collection
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
          subnav_title.data('gallery-type', categories[i]['galleries'][a]['type']);
          subnav.append(subnav_item_container);
          subnav_item_container.append(subnav_title);

          if (!!categories[i]['galleries'][a]['story']) {
            var story_icon = $('<a class="story-link" href=""></a>');
            subnav_item_container.append(story_icon);
            var story_text = categories[i]['galleries'][a]['story'];
            story_icon.data('story-text', story_text);
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

  var colorScheme = function () {
   if (DARK_COLOR_SCHEME == true) {
      $("html, body, a, .story-link").addClass('dark');
    }
      else {
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


  // Attach listeners to Vimeo thumbs.
  var addVimeoThumbListeners = function() {

    $('.vimeo-thumb').mouseover(function(e) {
      $(this).find('.caption').addClass('active-video-caption');
    });

    $('.vimeo-thumb').mouseout(function(e) {
      $(this).find('.caption').removeClass('active-video-caption');
    });

    $('.vimeo-thumb').click(function(e) {
      e.preventDefault();
      var id = $(this).data('video-id');
      console.log(id);
    });

  };

  var updateJustifiedGallery = function() {
    $("#mygallery").justifiedGallery({
      rowHeight: 200,
      lastRow: 'justify',
      margins: 10,
      captionSettings: {
        animationDuration: 500,
        visibleOpacity: .8,
        nonVisibleOpacity: 0.0
      }
    });
  };

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

    $('iframe').attr('src', '');
    var galleryContainer = $('#mygallery');

    // clear gallery container
    galleryContainer.empty();

    // add items to gallery container
    var galleryId = $(this).data('gallery-id');
    var galleryType = $(this).data('gallery-type');

    if (galleryType == 'video') {
      $('.curl').addClass('hidden');

      galleryContainer.data('gallery-type', 'video');
      for (var i = 0, l = VIMEO_DATA.length; i < l; i++) {
        var src = VIMEO_DATA[i]['thumbnail_large'];
        var title = VIMEO_DATA[i]['title'];
        var a = $('<a class="vimeo-thumb" href=""></a>');
        var img = $('<img src="' + src + '" alt="' + title + '" />');
        a.data('video-id', VIMEO_DATA[i]['id']);
        a.append(img);
        galleryContainer.append(a);
      }

      // Applies the justified gallery plugin to the div with the mygallery ID
      updateJustifiedGallery();

      addVimeoThumbListeners();
      addGalleryThumbsListener();
    }
    else {
      $('.curl').removeClass('hidden');
      galleryContainer.data('gallery-type', 'image');
      $.ajax({
        url: "fetch-gallery/" + galleryId,
      }).done(function(response) {
        var photos = response['photos'];
        for (var i = 0, l = photos.length; i < l; i++) {
          var photo = photos[i];
          var src = photo['src'];
          var description = photo['description'];
          var title = photo['title'];

          var a = $('<a href="' + src + '"></a>');
          var img = $('<img src="' + src + '" alt="' + title + '" />');
          a.data('story-text', description);
          a.append(img);
          galleryContainer.append(a);

        }

        // Applies the justified gallery plugin to the div with the mygallery ID
        updateJustifiedGallery();
        addGalleryThumbsListener();
      });

    }




    $('.content-container').removeClass('hidden');
    whiteBackground();
    $('.single-image-container').addClass('hidden');
    $('.single-image-nav-container').addClass('hidden');
  });

  // Event listener for clicking the portfolio close 'x'
  // adds the hidden class to the port-story div
  $('.port-close').click(function(e) {
    e.preventDefault();
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
    var curSubnav = $(self).next();

    // Reset all the subnavs except the one that was clicked
    // keep those subnavs looking good
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
     if (WHITE_BACKGROUND == true || screenWidth <= 600) {}
      else {
      var name = $(this).data('bg-src');


      $('.homepage-container').css({
      'background-image': "url('" + name + "')"
      });

      DARK_COLOR_SCHEME = false;
      if ($(this).data('nav-appearance') == 'dark') {
        DARK_COLOR_SCHEME = true;
      }
      colorScheme();

      var homepageBackgroundUrl = $(".homepage-container").css("background-image");

    }
  });


  // click listener for "next" image nav icon
  // checks to see if we're at the end of gallery slides
  // if we are, then we reset the gallery slide to 0
  // if not, we move on to the next gallery slide
  $('.image-nav-icon .next').click(function(e) {
    e.preventDefault();
    if (CUR_GALLERY_INDEX == GALLERY_COUNT) {
      CUR_GALLERY_INDEX = 0;
    }
      else {
        CUR_GALLERY_INDEX++;
      }
    var nextEl = $('#mygallery a')[CUR_GALLERY_INDEX];

    if ($('#mygallery').data('gallery-type') == 'video') {
      var id = $(nextEl).data('video-id');
      var url = '//player.vimeo.com/video/' + id;
      updateVideoSrc(url);
    }
    else {
      var imageUrl = $(nextEl).attr('href');
      $('#single-image-story-text').text($(nextEl).data('story-text'));
      updateImageSrc(imageUrl);
      resetImageStoryMode();
    }

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

    var prevEl = $('#mygallery a')[CUR_GALLERY_INDEX];

    if ($('#mygallery').data('gallery-type') == 'video') {
      var id = $(prevEl).data('video-id');
      var url = '//player.vimeo.com/video/' + id;
      updateVideoSrc(url);
    }
    else {
      var imageUrl = $(prevEl).attr('href');
      updateImageSrc(imageUrl);
      resetImageStoryMode();

      $('#single-image-story-text').text($(prevEl).data('story-text'));
    }



  });

  // Event listener for clicking on "index" button
  // hides the single image container
  // hides the single image nav container
  // toggles the #mygallery div
  $('.image-nav-icon .index').click(function(e) {
    e.preventDefault();
    $('.single-image-container').addClass('hidden');
    $('.single-image-nav-container').addClass('hidden');
    $('#mygallery').toggleClass('hidden');
    $('iframe').attr('src', '');
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
  });

  $('.story-link').click(function(e) {
    $('#port-story-text').text($(this).data('story-text'));
    e.preventDefault();
    var self = this;
    var curStory = self;
    $('.content-container').removeClass('hidden');
    $('.homepage-container').css('background-image', 'url(./img/bgs/white.jpg)');
    $('.story-link').addClass('dark');
    $('html, body, a').css({'color': '#333'});
    $('.single-image-container').addClass('hidden');
    $('.single-image-nav-container').addClass('hidden');

    if ($('.story-link.active').length > 0) {
      if ($('.story-link.active')[0] == $(this)[0]) {
        $(this).removeClass('active');
        $('.port-story').addClass('hidden');
      }

      else {
        $('.story-link.active').removeClass('active');
        $(this).addClass('active');
        $('.port-story').removeClass('hidden');
      }
    }
    else {
      $(this).addClass('active');
      $('.port-story').removeClass('hidden');
    }
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

var updateVideoSrc = function(str) {
  $('.single-image-wrapper iframe').attr("src", str);
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
    $('.port-story').addClass('hidden');
    $('.single-image-nav-container').removeClass('hidden');

    if ($(self).hasClass('vimeo-thumb')) {
      $('#image-full').hide();
      var id = $(self).data('video-id');
      var url = '//player.vimeo.com/video/' + id;
      updateVideoSrc(url);
      $('#vimeo-full').show();
    }
    else {
      $('#vimeo-full').hide();
      $('#single-image-story-text').text($(this).data('story-text'));
      var imageUrl = $(this).attr('href');
      updateImageSrc(imageUrl);
      $('#image-full').show();
    }

    });
  };

