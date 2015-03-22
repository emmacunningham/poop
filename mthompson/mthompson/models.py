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

# class Feedback(models.Model):

# 	# video or image
# 	name = models.CharField(max_length=255, null=True, blank=True)
# 	email = models.CharField(max_length=255, null=True, blank=True)
# 	subject = models.CharField(max_length=255, null=True, blank=True)
# 	message = models.TextField(null=True, blank=True)

# 	def __unicode__(self):
# 		if self.subject is not None:
# 			return self.subject


