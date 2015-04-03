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

MEDIA_CHOICES = (
    ('photo', 'Photo'),
    ('video', 'Video'),
)

class Category(models.Model):

	# video or image
	name = models.CharField(max_length=255, null=True, blank=True)
	order = models.IntegerField(max_length=255, null=True, blank=True)
	# gallery

	def __unicode__(self):
		if self.name is not None:
			return self.name



class MediaCollection(models.Model):
	name = models.CharField(max_length=255, null=True, blank=True)
	category = models.ForeignKey('Category', null=True, blank=True)
	gallery = models.ForeignKey(Gallery, blank=True, null=True)
	media_type = models.CharField(max_length=255, null=True, blank=True, choices=MEDIA_CHOICES, default="Photo")
	story = models.TextField(null=True, blank=True)

	def __unicode__(self):
		if self.name is not None:
			return self.name


