'use strict';

function randomFromInterval(from, to) {
     return Math.floor(Math.random() * (to - from + 1) + from);
}

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

 });




var preloadImage = function (index, value) {
   var name = './img/bgs/' +
    $.trim(
      $(value).text().toLowerCase()
      ) + '_bg.jpg';

    console.log(name);

    var c = new Image();

    c.onload = function(){
        $("#Your Div ID").css("background-image", "url(" + name + ")");
    }

    c.src = name;

}
  $('.expand-link').each(preloadImage);


$('.expand-link').click(function(e) {
  e.preventDefault();
  var self = this;
  var liCount = $(this).next().children().length;
  var liHeight = $('.subnav-container li').height();
  console.log (liCount);
  console.log (liHeight);

  var curSubnav = $(self).next();

  // $('.expand-link').next().removeClass('active');
  var resetAllButClicked = function(index, elm) {

    // console.log(index);
    // console.log(self == elm)
    if ((self) == (elm)) {
      curSubnav.toggleClass('active');
    }
      else {
        $(elm).next().removeClass('active');
         $(elm).next().css({
          'max-height' : '0'
          });
      }
  }



  $('.expand-link').each(resetAllButClicked);

// write if statement to see if NOT active, set max-height to 0px: code code code
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

//  {
//   var calculateHeight = function(){
//     var activeHeight = $(self).children().length();
//     console.log (activeHeight);
//     $(self).next().css({
//       'max-height': activeHeight + 'px'
//     })
//   }
// }
// else{
//     $(self).next().css({
//     'max-height': "0px"
//     })
// }




  // $(this).next().toggleClass('active');

  // Change the background image and typeface color on menu click!

  var name = './img/bgs/' + $.trim($(this).text().toLowerCase()) + '_bg.jpg';


  $('.homepage-container').css({
    'background-image': "url('" + name + "')"
  });

  // $('html, body, a').css({
  //   'color': '#333'
  // });
// The stuff below changes the font color for the page based on the URL of the background image in CSS.
var fontColor = null;

switch (name) {
  case './img/bgs/musicians_bg.jpg':
  fontColor = '#ccc'
  break;
  case './img/bgs/comedy_bg.jpg':
  fontColor = '#333'
  break;
};
// Confused on this SO HARD. I am getting the right variable and I seem to be failing to apply it to the CSS. WTF!
  $('html, body, a').css({
    'color': ""+ fontColor +""
  });
// This concludes the stuff that changes the font color of the page based on the URL of the background image in CSS

var homepageBackgroundUrl = $(".homepage-container").css("background-image");

  console.log (name);
  console.log (fontColor);

});




