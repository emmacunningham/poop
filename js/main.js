'use strict';

$(document).ready( function() {

  $('.expand-link').each(function(index, value) {
    var name = './img/' + $.trim($(value).text().toLowerCase()) + '-bg.jpg';
    console.log(name);

    var c = new Image();

    c.onload = function(){
        $("#Your Div ID").css("background-image", "url(" + name + ")");
    }

    c.src = name;

  });

});

$('.expand-link').click(function(e) {
  e.preventDefault();

  $('.expand-link').next().removeClass('active');

  $(this).next().toggleClass('active');

  var name = './img/' + $.trim($(this).text().toLowerCase()) + '-bg.jpg';

  $('.homepage-container').css({
    'background-image': "url('" + name + "')"
  });

});

