$(document).ready(function() {

  // Only do this on the media collection change form
  if ($('body').hasClass('mthompson-mediacollection change-form')) {
    var hideStoryField = function() {
      $('.field-story').hide();
    }

    var showStoryField = function() {
      $('.field-story').show();
    }

    if ($('#id_media_type').val() == 'photo') {
      hideStoryField();
    }

    $('#id_media_type').change(function() {

      if ($('#id_media_type').val() == 'photo') {
        hideStoryField();
      }
      else {
        showStoryField();
      }

    });

  }

  // Only do this on the photologue gallery change form
  if ($('body').hasClass('photologue-gallery change-form')) {

    $.ajax({
      url: "/fetch-all-thumbnail/",
    }).done(function(response) {

      var photoData = response['photo_data'];

      // Get each checkbox under photo field
      $('.field-photos').find('input:checkbox').each(function(i, el) {
        var id = Number($(el).val());
        var thumb_src = _.result(_.find(photoData, { 'id': id }), 'thumb');
        var thumb_el = $('<img src="' + thumb_src + '" />');
        $(thumb_el).insertAfter($(el));
      });

    });

  }

});