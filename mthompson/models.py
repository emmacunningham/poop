from django.db import models
from django.contrib.auth.models import User
from django.core.files import File
from django.core.files.storage import default_storage
from mthompson.settings import base as settings
import os
import time
import urllib2
import json
from urllib2 import HTTPError

from photologue.models import Gallery, Photo
from adminsortable.models import Sortable

MEDIA_CHOICES = (
    ('photo', 'Photo'),
    ('video', 'Video'),
)

NAV_APPEARARNCE_CHOICES = (
    ('light', 'Light'),
    ('dark', 'Dark'),
)

class PhotoDisplay(models.Model):

  # Link back to Photologue's Gallery model.
  photo = models.OneToOneField(Photo, related_name='extended')

  # Display title to show on front-end
  display_title = models.CharField(max_length=255, null=True, blank=True)

  # Boilerplate code to make a prettier display in the admin interface.
  class Meta:
    verbose_name = u'PhotoDisplay'
    verbose_name_plural = u'PhotosDisplay'

  def __str__(self):
    return self.gallery.title


class Category(Sortable):
	class Meta(Sortable.Meta):
		pass

	# video or image
	name = models.CharField(max_length=255, null=True, blank=True)
	image = models.ImageField(upload_to='./home_bg', null=True, blank=True)
	nav_appearance = models.CharField(max_length=255, null=True, blank=True, choices=NAV_APPEARARNCE_CHOICES, default="Light")

	def __unicode__(self):
		if self.name is not None:
			return self.name



class MediaCollection(Sortable):
	class Meta(Sortable.Meta):
		pass

	name = models.CharField(max_length=255, null=True, blank=True)
	category = models.ForeignKey('Category', null=True, blank=True)
	gallery = models.ForeignKey(Gallery, blank=True, null=True)
	media_type = models.CharField(max_length=255, null=True, blank=True, choices=MEDIA_CHOICES, default="Photo")
	story = models.TextField(null=True, blank=True)

	def __unicode__(self):
		if self.name is not None:
			return self.name


class HomeBackgroundImage(models.Model):

	name = models.CharField(max_length=255, null=True, blank=True)
	nav_appearance = models.CharField(max_length=255, null=True, blank=True, choices=NAV_APPEARARNCE_CHOICES, default="Light")
	image = models.ImageField(upload_to='./home_bg', null=True, blank=True)

	def __unicode__(self):
		if self.name is not None:
			return self.name

class AboutPage(models.Model):
	details = models.TextField(null=True, blank=True)



