'use strict';

var CUR_GALLERY_INDEX;
var GALLERY_COUNT;
var DARK_SOCIAL_MEDIA_ICONS;
var DARK_COLOR_SCHEME;
var WHITE_BACKGROUND = false;
var VIMEO_DATA;
var CATEGORY_DATA = [];
var galleryContainer;

function randomFromInterval(from, to) {
     return Math.floor(Math.random() * (to - from + 1) + from);
}

function slugify(Text) {
  return Text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'')
      ;
}

var screenWidth = $(window).width();

// On document load, selects one of three randcom images for the background
// if BG1 is selected, sets the text to dark, if not, left at light text
$(document).ready( function() {
  // Load navigation
  // Fetch the nav labels
  $.ajax({
    url: "https://vimeo.com/api/v2/user3589164/videos.json",
  }).done(function(response) {
    VIMEO_DATA = response;
  });

  /* Using more recent vimeo API - wip etc
  $.ajax({
    method: 'GET',
    url: "https://api.vimeo.com/users/user3589164/videos",
    data: {
      access_token: '6f85e3ba93f628f93f532c16db29bb2b',
    }
  }).done(function(response) {
    console.log(response);
  });
  */



  // Load navigation
  // Fetch the nav labels
  $.ajax({
    url: "/fetch-categories/",
  }).done(function(response) {
    // Create nav elements based on nav labels
    var menuContainer = $('.nav-menu');
    var categories = response['categories'];
    CATEGORY_DATA = categories;

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

    // Create About page link
    var aboutEl = $('<li><a class="nav-link about-link" href="">About</a></li>');
    menuContainer.append(aboutEl);

    $('.about-link').click(function(e) {
      e.preventDefault();
      showAbout();
      updateRoute('/about');
    });

    initPage();
    initRouter();
  });

});

var updateJustifiedGallery = function() {
  $("#mygallery").justifiedGallery({
    rowHeight: 200,
    maxRowHeight: 210,
    lastRow: 'justify',
    margins: 10,
    refreshTime: 300,
    captionSettings: {
      animationDuration: 500,
      visibleOpacity: .8,
      nonVisibleOpacity: 0.0
    }
  });
};

var showGallery = function(elm) {
  // add items to gallery container
    clearGalleryContainer();
    var galleryId = $(elm).data('gallery-id');
    var galleryType = $(elm).data('gallery-type');
    var galleryContainer = $('#mygallery');

    DARK_COLOR_SCHEME = true;
    colorScheme();

    $('.about-container').addClass('hidden');

    if (galleryType == 'video') {

      $.ajax({
        url: "https://vimeo.com/api/v2/user3589164/videos.json",
      }).done(function(response) {
        VIMEO_DATA = response;

        $('.curl').addClass('hidden');

        galleryContainer.data('gallery-type', 'video');
        for (var i = 0, l = VIMEO_DATA.length; i < l; i++) {
          var src = VIMEO_DATA[i]['thumbnail_large'];
          var title = VIMEO_DATA[i]['title'];
          var a = $('<a class="vimeo-thumb" href=""></a>');
          var img = $('<img src="' + src + '" alt="' + title + '" />');
          var caption = $('<div class="caption"><span class="caption-text">' +
              title + '</span></div>');
          a.data('video-id', VIMEO_DATA[i]['id']);
          a.data('thumb-id', VIMEO_DATA[i]['id']);
          a.append(img);
          a.append(caption);
          galleryContainer.append(a);
        }

        // Applies the justified gallery plugin to the div with the mygallery ID
        updateJustifiedGallery();

        addVimeoThumbListeners();
        addGalleryThumbsListener();


      });


    }
    else {
      $('.curl').removeClass('hidden');
      galleryContainer.data('gallery-type', 'image');
      $.ajax({
        url: "/fetch-gallery/" + galleryId,
      }).done(function(response) {
        var photos = response['photos'];
        for (var i = 0, l = photos.length; i < l; i++) {
          var photo = photos[i];
          var src = photo['src'];
          var description = photo['description'];
          var title = photo['title'];
          var id = photo['id'];

          var a = $('<a href="' + src + '"></a>');
          var img = $('<img src="' + src + '" alt="' + title + '" />');
          var caption = $('<div class="caption"><span class="caption-text">' +
            title + '</span></div>');
          a.data('story-text', description);
          a.data('thumb-id', id);
          a.append(img);
          a.append(caption);
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
};

var showSecretPhotoGallery = function(elm) {
  // add items to gallery container
    clearGalleryContainer();
    var galleryId = elm;
    var galleryType = 'photo';
    var galleryContainer = $('#mygallery');

    DARK_COLOR_SCHEME = true;
    colorScheme();

    $('.about-container').addClass('hidden');

    if (galleryType == 'video') {

      $.ajax({
        url: "https://vimeo.com/api/v2/user3589164/videos.json",
      }).done(function(response) {
        VIMEO_DATA = response;

        $('.curl').addClass('hidden');

        galleryContainer.data('gallery-type', 'video');
        for (var i = 0, l = VIMEO_DATA.length; i < l; i++) {
          var src = VIMEO_DATA[i]['thumbnail_large'];
          var title = VIMEO_DATA[i]['title'];
          var a = $('<a class="vimeo-thumb" href=""></a>');
          var img = $('<img src="' + src + '" alt="' + title + '" />');
          var caption = $('<div class="caption"><span class="caption-text">' +
              title + '</span></div>');
          a.data('video-id', VIMEO_DATA[i]['id']);
          a.data('thumb-id', VIMEO_DATA[i]['id']);
          a.append(img);
          a.append(caption);
          galleryContainer.append(a);
        }

        // Applies the justified gallery plugin to the div with the mygallery ID
        updateJustifiedGallery();

        addVimeoThumbListeners();
        addGalleryThumbsListener();


      });


    }
    else {
      $('.curl').removeClass('hidden');
      galleryContainer.data('gallery-type', 'image');
      $.ajax({
        url: "/fetch-gallery/" + galleryId,
      }).done(function(response) {
        var photos = response['photos'];
        for (var i = 0, l = photos.length; i < l; i++) {
          var photo = photos[i];
          var src = photo['src'];
          var description = photo['description'];
          var title = photo['title'];
          var id = photo['id'];

          var a = $('<a href="' + src + '"></a>');
          var img = $('<img src="' + src + '" alt="' + title + '" />');
          var caption = $('<div class="caption"><span class="caption-text">' +
            title + '</span></div>');
          a.data('story-text', description);
          a.data('thumb-id', id);
          a.append(img);
          a.append(caption);
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
};

var showSecretVideoGallery = function(elm) {
  // add items to gallery container
    clearGalleryContainer();
    var galleryId = elm;
    var galleryType = 'video';
    var galleryContainer = $('#mygallery');

    DARK_COLOR_SCHEME = true;
    colorScheme();

    $('.about-container').addClass('hidden');

    if (galleryType == 'video') {

      $.ajax({
        url: "https://vimeo.com/api/v2/user3589164/videos.json",
      }).done(function(response) {
        VIMEO_DATA = response;

        $('.curl').addClass('hidden');

        galleryContainer.data('gallery-type', 'video');
        for (var i = 0, l = VIMEO_DATA.length; i < l; i++) {
          var src = VIMEO_DATA[i]['thumbnail_large'];
          var title = VIMEO_DATA[i]['title'];
          var a = $('<a class="vimeo-thumb" href=""></a>');
          var img = $('<img src="' + src + '" alt="' + title + '" />');
          var caption = $('<div class="caption"><span class="caption-text">' +
              title + '</span></div>');
          a.data('video-id', VIMEO_DATA[i]['id']);
          a.data('thumb-id', VIMEO_DATA[i]['id']);
          a.append(img);
          a.append(caption);
          galleryContainer.append(a);
        }

        // Applies the justified gallery plugin to the div with the mygallery ID
        updateJustifiedGallery();

        addVimeoThumbListeners();
        addGalleryThumbsListener();


      });


    }
    else {
      $('.curl').removeClass('hidden');
      galleryContainer.data('gallery-type', 'image');
      $.ajax({
        url: "/fetch-gallery/" + galleryId,
      }).done(function(response) {
        var photos = response['photos'];
        for (var i = 0, l = photos.length; i < l; i++) {
          var photo = photos[i];
          var src = photo['src'];
          var description = photo['description'];
          var title = photo['title'];
          var id = photo['id'];

          var a = $('<a href="' + src + '"></a>');
          var img = $('<img src="' + src + '" alt="' + title + '" />');
          var caption = $('<div class="caption"><span class="caption-text">' +
            title + '</span></div>');
          a.data('story-text', description);
          a.data('thumb-id', id);
          a.append(img);
          a.append(caption);
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
};

  // Attach listeners to Vimeo thumbs.
  var addVimeoThumbListeners = function() {

    $('.vimeo-thumb').mouseover(function(e) {
      $(this).find('.caption').addClass('active-video-caption');
      $(this).find('.caption-text').addClass('video');
    });

    $('.vimeo-thumb').click(function(e) {
      e.preventDefault();
      var id = $(this).data('video-id');
      console.log(id);
    });

  };


var showMedia = function(elm) {
  var self = elm;

  $('.about-container').addClass('hidden');

  GALLERY_COUNT = ($("#mygallery a").length - 1);


  $('#mygallery a').each(function(i, el) {
    if ($(el)[0] == $(self)[0]) {
      CUR_GALLERY_INDEX = i;
      console.log(CUR_GALLERY_INDEX);
    }
  });

  $('#mygallery').toggleClass('hidden');
  $('.single-image-container').toggleClass('hidden');
  $('.port-story').addClass('hidden');
  $('.single-image-nav-container').removeClass('hidden');

    if ($(elm).hasClass('vimeo-thumb')) {
      $('#image-full').hide();
      var currentUrl = window.location.pathname;
      var id = $(elm).data('video-id');
      var url = '//player.vimeo.com/video/' + id;
      updateRoute(currentUrl + '?id=' + id);
      updateVideoSrc(url);
      $('#vimeo-full').show();
      $(".vimeo-wrapper").show();
      $(".vimeo-wrapper").fitVids();
    }
    else {
      $('#vimeo-full').hide();
      $('.vimeo-wrapper').hide();
      var imageUrl = $(elm).attr('href');
      updateImageSrc(imageUrl);
      $('#image-full').show();
      var imageSlug = $(elm).data('thumb-id');
      var currentUrl = window.location.pathname;
      updateRoute(currentUrl + '?id=' + imageSlug);

      var imgAlt = ($(elm).find('img').attr('alt'));
      $('#single-image-story-text').html(imgAlt);
      var storyText = ($(elm).data('story-text'));
      if (storyText.length > 0) {
        $('#single-image-story-text').append(' - ' + storyText);
     }
    }
};

var colorScheme = function () {
 if (DARK_COLOR_SCHEME == true) {
    $("html, body, a, .story-link").addClass('dark');
  }
    else {
      $("html, body, a, .story-link").removeClass('dark');
      DARK_COLOR_SCHEME = false;
    }
};

// Setting the preloadImage variable for background images
var preloadImage = function (index, value) {
  var name = $(this).data('bg-src');

  var c = new Image();

  // WTF is this doing in the code? Does it serve any purpose? I can't seem to prove it does anything
  // c.onload = function(){
  //     $("#Your Div ID").css("background-image", "url(" + name + ")");
  // }

  c.src = name;
}

// clear gallery container
// and make sure any iframe movie stops playing
// by being REMOVED (src = '')
var clearGalleryContainer = function() {
  $('iframe').attr('src', '');
  var galleryContainer = $('#mygallery');
  galleryContainer.empty();
  console.log('THE GALLERY CONTAINER WAS CLEARED BRO! OMG OMG!');
  galleryContainer.css({
    'height': '5px'
  });
};


var showAbout = function() {
  DARK_COLOR_SCHEME = false;
  colorScheme();
  WHITE_BACKGROUND = false;
  $('.homepage-container').css({
  'background-image': "url(/img/bgs/about_bg.jpg)"
  });
  $('.about-container').removeClass('hidden');
  clearGalleryContainer();
};

var showNav = function(target, forceRouteUpdate) {
  var self = $(target);
  var liCount = $(target).next().children().length;
  var liHeight = $('.subnav-container li').height();
  var curSubnav = $(target).next();

  clearGalleryContainer();

  $('.about-container').addClass('hidden');
  $('.single-image-container').addClass('hidden');
  $('.single-image-nav-container').addClass('hidden');
  // var clickPath = $(target).text();


  var resetAllButClicked = function(index, elm) {
    if ((self)[0] == (elm)) {
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

  if (forceRouteUpdate) {
    if (curSubnav.hasClass('active')) {
      var clickPath = self.text();
      updateRoute('/' + slugify(clickPath));
    }
    else {
      updateRoute('/');
    }
  }


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

  var name = $(target).data('bg-src');

  $('.homepage-container').css({
    'background-image': "url('" + name + "')"
  });

  DARK_COLOR_SCHEME = false;

  if ($(target).data('nav-appearance') == 'dark') {
      DARK_COLOR_SCHEME = true;
    }
    colorScheme();

  var homepageBackgroundUrl = $(".homepage-container").css("background-image");

  // Change the background image and typeface color on menu click!
   if (WHITE_BACKGROUND == true || screenWidth <= 600) {
    console.log('the white background variable is true');
   }
  else {
    console.log('the white background variable is false');
  }
};

var initPage = function() {


  if (window.location.pathname == "/" ) {
    // Fetch a random home background and set text based on color scheme
    $.ajax({
      url: "/fetch-home-bg/",
    }).done(function(response) {

      DARK_COLOR_SCHEME = response['is_dark_color_scheme'];

      $(".homepage-container").css({
         'background-image': "url('" + response['img_url'] + "')"
      })

      colorScheme();

    });
  }

  // Performing the preloadImage function on each background
  // as a result of clicking on expand-link(s)
  $('.expand-link').each(preloadImage);


  // sets the bg img to white
  // changes type color to dark
  var establishGalleryView = function() {
    WHITE_BACKGROUND = true;
    if (DARK_COLOR_SCHEME == true) {}
      else {
        DARK_COLOR_SCHEME = true;
        colorScheme();
      }
  };




  // Event listener for clicking on a portfolio link
  // Removes hidden class on content-container
  // removes hidden class on portfolio story (right now)
  $('.port-link').click(function(e) {
    e.preventDefault();
    establishGalleryView();
    // clearGalleryContainer();
    showGallery($(this));

    // If clicked link is under subnav
    if ($(this).hasClass('sub-link')) {
      var category = slugify($(this).parent().parent().prev().text());
      var gallery = slugify($(this).text());
      updateRoute('/' + category + '/' + gallery)
    }
    // If clicked link is top-level nav
    else {
        var clickPath = $(this).text();
        updateRoute('/' + slugify(clickPath));
    }
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
    showNav($(this), true);

  });


  // click listener for "next" image nav icon
  // checks to see if we're at the end of gallery slides
  // if we are, then we reset the gallery slide to 0
  // if not, we move on to the next gallery slide
  $('.image-nav-icon .next').click(function(e) {
    e.preventDefault();
    console.log('you clicked next nav icon!'); //triggers!
    if (CUR_GALLERY_INDEX == GALLERY_COUNT) {
      CUR_GALLERY_INDEX = 0;
    }
      else {
        CUR_GALLERY_INDEX++;
      }

    var nextEl = $('#mygallery a')[CUR_GALLERY_INDEX];
    console.log(nextEl);
    console.log($('#mygallery a'));
    console.log(CUR_GALLERY_INDEX);

    if ($('#mygallery').data('gallery-type') == 'video') {
      var videoId = $(nextEl).data('video-id');
      var url = '//player.vimeo.com/video/' + videoId;
      updateVideoSrc(url);

      var imageSlug = $(nextEl).data('video-id');
      var currentUrl = window.location.pathname;
      //updateRoute('/');
      updateRoute(currentUrl + '?id=' + imageSlug);

    }
    else {
      var imageUrl = $(nextEl).attr('href');
      updateImageSrc(imageUrl);
      resetImageStoryMode();

      var imageSlug = $(nextEl).data('thumb-id');
      var currentUrl = window.location.pathname;
      //updateRoute('/');
      updateRoute(currentUrl + '?id=' + imageSlug);

      var imgAlt = ($(nextEl).find('img').attr('alt'));
      $('#single-image-story-text').html(imgAlt);
      var storyText = ($(nextEl).data('story-text'));
      if (storyText.length > 0) {
        $('#single-image-story-text').append(' - ' + storyText);
      }
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

      var imageSlug = $(prevEl).data('video-id');
      var currentUrl = window.location.pathname;
      //updateRoute('/');
      updateRoute(currentUrl + '?id=' + imageSlug);
    }
    else {
      var imageUrl = $(prevEl).attr('href');
      updateImageSrc(imageUrl);
      resetImageStoryMode();

      var imageSlug = $(prevEl).data('thumb-id');
      var currentUrl = window.location.pathname;
      //updateRoute('/');
      updateRoute(currentUrl + '?id=' + imageSlug);

      var imgAlt = ($(prevEl).find('img').attr('alt'));
      $('#single-image-story-text').html(imgAlt);
      var storyText = ($(prevEl).data('story-text'));
      if (storyText.length > 0) {
        $('#single-image-story-text').append(' - ' + storyText);
      }
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

    var currentUrl = window.location.pathname;
    //updateRoute('/');
    updateRoute(currentUrl);
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
    // $('.homepage-container').css('background-image', 'url(.img/bgs/white.jpg)');
    $('.story-link').addClass('dark');
    $('html, body, a').css({'color': '#333'});
    $('.single-image-container').addClass('hidden');
    $('.single-image-nav-container').addClass('hidden');
    var associatedGallery = $(this).prev();
    // console.log(associatedGallery);
    associatedGallery.trigger("click");

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
    if ($('.single-image-container').hasClass('hidden')) {
    }
    else {
      $('.single-image-nav-container').toggleClass('hidden');
    }
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
  $('.vimeo-wrapper iframe').attr("src", str);
};

// Click listener for clicking on a link within the gallery
// Prevents default, loads link in single-image div
// calculates imgUrl to direct user to proper full-size image
// closes the portfolio story div (if open)
// reveals the single-img-nav-container

// var showMedia = function(elm) {
//   var self = this;

//   GALLERY_COUNT = ($("#mygallery a").length - 1);
//   $('#mygallery a').each(function(i, el) {
//     if (el == self) {
//       CUR_GALLERY_INDEX = i;
//     }
//   });

//   $('#mygallery').toggleClass('hidden');
//   $('.single-image-container').toggleClass('hidden');
//   $('.port-story').addClass('hidden');
//   $('.single-image-nav-container').removeClass('hidden');

//     if ($(elm).hasClass('vimeo-thumb')) {
//       $('#image-full').hide();
//       var currentUrl = window.location.pathname;
//       var id = $(elm).data('video-id');
//       var url = '//player.vimeo.com/video/' + id;
//       updateRoute(currentUrl + '?id=' + id);
//       updateVideoSrc(url);
//       $('#vimeo-full').show();
//       $(".vimeo-wrapper").show();
//       $(".vimeo-wrapper").fitVids();
//     }
//     else {
//       $('#vimeo-full').hide();
//       $('.vimeo-wrapper').hide();
//       var imageUrl = $(elm).attr('href');
//       updateImageSrc(imageUrl);
//       $('#image-full').show();
//       var imageSlug = $(elm).data('thumb-id');
//       var currentUrl = window.location.pathname;
//       //updateRoute('/');
//       updateRoute(currentUrl + '?id=' + imageSlug);

//       var imgAlt = ($(elm).find('img').attr('alt'));
//       $('#single-image-story-text').html(imgAlt);
//       var storyText = ($(elm).data('story-text'));
//       if (storyText.length > 0) {
//         $('#single-image-story-text').append(' - ' + storyText);
//      }
//     }
// };

var addGalleryThumbsListener = function() {
  $('#mygallery a').click(function(e) {
    e.preventDefault();
    showMedia($(this));
    });
  };

  $('body').keydown(function(e) {
    var singleImageView = null;
    if ($('.single-image-container').hasClass('hidden')) {
      singleImageView = false;
    }
    else {
      singleImageView = true;
    }
    if(e.which == 37 && singleImageView == true) { // left
      $('.image-nav-icon .previous').trigger("click");
    }
    else if(e.which == 39 && singleImageView == true) { // right
      $('.image-nav-icon .next').trigger("click");
    }
    else if (e.which == 27 && singleImageView == true) { // esc
      $('.image-nav-icon .index').trigger("click");
    }
  });

var whiteBackground = function () {
  $('.homepage-container').css('background-image', 'url(http://localhost:8000/media/home_bg/white.jpg)');
  WHITE_BACKGROUND = true;
}

var displayGallery = function() {
    WHITE_BACKGROUND = true;
    if (DARK_COLOR_SCHEME == true) {}
      else {
        DARK_COLOR_SCHEME = true;
        colorScheme();
      }
    $('.content-container').removeClass('hidden');
    whiteBackground();
    $('.single-image-container').addClass('hidden');
    $('.single-image-nav-container').addClass('hidden');
}

var fetchSecretGallery = function(i) {
  // This is hardcoded for now... it's prolly fine like this
  // But we'll wanna update it when we get things up on production
  var galleryId = i;


  var galleryContainer = $('#mygallery');

  // clear gallery container
  galleryContainer.empty();

  $.ajax({
    url: "/fetch-gallery/" + galleryId,
  }).done(function(response) {
    console.log(response)
    var photos = response['photos'];
    for (var i = 0, l = photos.length; i < l; i++) {
      var photo = photos[i];
      var src = photo['src'];
      var description = photo['description'];
      var title = photo['title'];
      var id = photo['id'];
// <a href="./img/full/2.jpg">
//            <img alt="Title 2" src="./img/thumbs/thumbs_2.jpg"/>
//          </a>

      var a = $('<a href="' + src + '"></a>');
      var img = $('<img src="' + src + '" alt="' + title + '" />');
      var caption = $('<div class="caption"><span class="caption-text">' +
      title + '</span></div>');
      a.data('story-text', description);
      a.data('thumb-id', id);
      a.append(img);
      a.append(caption);
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

}


// HTML5 History
var updateRoute = function(slug) {

  // Checks if HTML5 History is supported
  if (window.history && window.history.pushState) {
    // console.log('pushState')
    // console.log(window.location.pathname)
    // console.log('updated route ', slug)
    window.history.pushState(null, null, slug);

  }
  // If not, sorry!

};

// Routing on initial page load + add popstate listener


// Checks if HTML5 History is supported
var initRouter = function() {

  if (window.history && window.history.pushState) {
    var path = window.location.pathname.split("/");
    var params = window.location.search;
    var media_id;

    if (!!params) {
      media_id = params.split("=")[1];
    }
    // console.log(media_id);

    if (path[1] == 'about') {
      showAbout();
    }

    else if (path[1] == 'secret-gallery-1') {
      showSecretPhotoGallery(11);

      setTimeout(function() {
        if (!!media_id) {
          var media_links = $('#mygallery a');
          console.log(media_links);
          for (var j = 0, m = media_links.length; j < m; j++) {
            var thumb_id =($(media_links[j]).data('thumb-id'));
            if (thumb_id == media_id) {
              showMedia($(media_links[j]));
            }
          }
        }
      }, 1000);
      // showGallery();
    }

    else if (path[1] == 'secret-gallery-2') {
      showSecretVideoGallery(12);

      setTimeout(function() {
        if (!!media_id) {
          var media_links = $('#mygallery a');
          console.log(media_links);
          for (var j = 0, m = media_links.length; j < m; j++) {
            var thumb_id =($(media_links[j]).data('thumb-id'));
            if (thumb_id == media_id) {
              showMedia($(media_links[j]));
            }
          }
        }
      }, 1000);

    }

    else if (path.length == 2) {
      var nav_link_name = path[1];
      var nav_links = $('.nav-link');
      // console.log(slugify(nav_links.text()));
      if (nav_link_name == nav_links.text()) {
      }
      for (var i = 0, l = nav_links.length; i < l; i++) {
        var nav_link_label = ($(nav_links[i]).text());


        if (slugify(nav_link_name) == slugify(nav_link_label)) {
          var nav_link_elm = $(nav_links[i]);

          if ($(nav_link_elm).hasClass('expand-link')) {
            showNav($(nav_links[i]));
          }
          else {
            showGallery($(nav_links[i]));
          }

          setTimeout(function() {
            if (!!media_id) {
              var media_links = $('#mygallery a');
              console.log(media_links);
              for (var j = 0, m = media_links.length; j < m; j++) {
                var thumb_id =($(media_links[j]).data('thumb-id'));
                if (thumb_id == media_id) {
                  showMedia($(media_links[j]));
                }
              }
            }
          }, 1000);

        }
      }
    }
    else if (path.length == 3) {
      var nav_link_name = path[1];
      var nav_links = $('.nav-link');
      for (var i = 0, l = nav_links.length; i < l; i++) {
        var nav_link_label = ($(nav_links[i]).text());
        if (slugify(nav_link_name) == slugify(nav_link_label)) {
          var gallery_link_name = path[2];
          var gallery_links = $(nav_links[i]).next().find('.port-link')
          for (var i = 0, l = gallery_links.length; i < l; i++) {
            var gallery_link_label = ($(gallery_links[i]).text());
            if (slugify(gallery_link_name) == slugify(gallery_link_label)) {
              showGallery($(gallery_links[i]));
              // $(gallery_links[i]).trigger('click');

            setTimeout(function() {
            if (!!media_id) {
              var media_links = $('#mygallery a');
              console.log(media_links);
              for (var j = 0, m = media_links.length; j < m; j++) {
                var thumb_id =($(media_links[j]).data('thumb-id'));
                if (thumb_id == media_id) {
                  showMedia($(media_links[j]));
                }
              }
            }
          }, 1000);

            }
          }
        }
      }
    }

    window.addEventListener("popstate", function(e) {
    var path = window.location.pathname.split("/");
    var params = window.location.search;
    var media_id;
    if (!!params) {
      media_id = params.split("=")[1];
    }
    // console.log(media_id);

    if (path[1] == 'about') {
      showAbout();
    }

    else if (path[1] == 'secret-gallery-1') {
      showSecretPhotoGallery(11);

      setTimeout(function() {
        if (!!media_id) {
          var media_links = $('#mygallery a');
          console.log(media_links);
          for (var j = 0, m = media_links.length; j < m; j++) {
            var thumb_id =($(media_links[j]).data('thumb-id'));
            if (thumb_id == media_id) {
              showMedia($(media_links[j]));
            }
          }
        }
      }, 1000);
      // showGallery();
    }

    else if (path[1] == 'secret-gallery-2') {
      showSecretVideoGallery(12);

      setTimeout(function() {
        if (!!media_id) {
          var media_links = $('#mygallery a');
          console.log(media_links);
          for (var j = 0, m = media_links.length; j < m; j++) {
            var thumb_id =($(media_links[j]).data('thumb-id'));
            if (thumb_id == media_id) {
              showMedia($(media_links[j]));
            }
          }
        }
      }, 1000);

    }

    else if (path.length == 2) {
      var nav_link_name = path[1];
      var nav_links = $('.nav-link');
      console.log(slugify(nav_links.text()));
      if (nav_link_name == nav_links.text()) {
      }
      for (var i = 0, l = nav_links.length; i < l; i++) {
        var nav_link_label = ($(nav_links[i]).text());


        if (slugify(nav_link_name) == slugify(nav_link_label)) {
          var nav_link_elm = $(nav_links[i]);

          if ($(nav_link_elm).hasClass('expand-link')) {
            showNav($(nav_links[i]));
          }
          else {
            showGallery($(nav_links[i]));
          }

          setTimeout(function() {
            if (!!media_id) {
              var media_links = $('#mygallery a');
              console.log(media_links);
              for (var j = 0, m = media_links.length; j < m; j++) {
                var thumb_id =($(media_links[j]).data('thumb-id'));
                if (thumb_id == media_id) {
                  showMedia($(media_links[j]));
                }
              }
            }
          }, 1000);

        }
      }
    }
    else if (path.length == 3) {
      var nav_link_name = path[1];
      var nav_links = $('.nav-link');
      for (var i = 0, l = nav_links.length; i < l; i++) {
        var nav_link_label = ($(nav_links[i]).text());
        if (slugify(nav_link_name) == slugify(nav_link_label)) {
          var gallery_link_name = path[2];
          var gallery_links = $(nav_links[i]).next().find('.port-link')
          for (var i = 0, l = gallery_links.length; i < l; i++) {
            var gallery_link_label = ($(gallery_links[i]).text());
            if (slugify(gallery_link_name) == slugify(gallery_link_label)) {
              showGallery($(gallery_links[i]));
              // $(gallery_links[i]).trigger('click');

            setTimeout(function() {
            if (!!media_id) {
              var media_links = $('#mygallery a');
              console.log(media_links);
              for (var j = 0, m = media_links.length; j < m; j++) {
                var thumb_id =($(media_links[j]).data('thumb-id'));
                if (thumb_id == media_id) {
                  showMedia($(media_links[j]));
                }
              }
            }
          }, 1000);

            }
          }
        }
      }
    }
    });

  }
  // If not, redirect to home landing.
  else {
    window.location = '/';
  }
};

// easter egg eventlisteners!

$('.easter-trigger.top').mouseover(function() {
  // $('.easter-trigger.top').css("margin-top", "-45px");
  $('.easter-egg.top').css("margin-top", "0px");
});

$('.easter-trigger.left').mouseover(function() {
  // $('.easter-trigger.left').css("margin-left", "-40px");
  $('.easter-egg.left').css("margin-left", "0px");
});

$('.easter-trigger.top').mouseout(function() {

  setTimeout(function() {
    $('.easter-trigger.top').css("margin-top", "0px")
    $('.easter-egg.top').css("margin-top", "-130px");
  }, 1500);

});

$('.easter-trigger.left').mouseout(function() {

  setTimeout(function() {
    $('.easter-trigger.left').css("margin-left", "0px");
    $('.easter-egg.left').css("margin-left", "-112px");
  }, 1500);

});

// click listeners for THEM EASTER EGGS!
$('.easter-egg.top').click(function(e) {
  console.log('YOOO');
  e.preventDefault();
  showSecretPhotoGallery(11);
  updateRoute('/secret-gallery-1');
});

$('.easter-egg.left').click(function(e) {
  e.preventDefault();
  console.log('YOOO left!');
  showSecretVideoGallery(12);
  updateRoute('/secret-gallery-2');
});

// easter egg listeners for mobile devices!

$('.easter-trigger.top').click(function() {
  $('.easter-trigger.top').css("margin-top", "-45px");
  $('.easter-egg.top').css("margin-top", "0px");
});

$('.easter-trigger.left').click(function() {
  $('.easter-trigger.left').css("margin-left", "-40px");
  $('.easter-egg.left').css("margin-left", "0px");
});




