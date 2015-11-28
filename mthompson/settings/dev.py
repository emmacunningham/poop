# Django project environment-specific settings

from mthompson.settings.base import *


DEBUG = True
TEMPLATE_DEBUG = DEBUG

SITE_ID = 1

PARENT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__),"../.."))

#TODO: replace localhost with the domain name of the site
DEFAULT_FROM_EMAIL = 'messenger@localhost'
SERVER_EMAIL = DEFAULT_FROM_EMAIL

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
#         'NAME': os.path.join(PARENT_DIR, 'data/mthompson'),                       # Or path to database file if using sqlite3.
#         # The following settings are not used with sqlite3:
#         'USER': '',
#         'PASSWORD': '',
#         'HOST': '',                       # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
#         'PORT': '',                       # Set to empty string for default.
#     }
# }


TIME_ZONE = 'Canada/Eastern'

INTERNAL_IPS = ('127.0.0.1', )

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Overwrite default ROOT_URLCONF to include static file serving by Django.
# In production, this should be handled separately by your webserver or CDN.
ROOT_URLCONF = 'mthompson.urls.dev'

## Heroku deploy stuff below
# Parse database configuration from $DATABASE_URL
import dj_database_url
DATABASES['default'] =  dj_database_url.config()

## Don't know if we also need the stuff below or if just above for postgres migration...
# # Honor the 'X-Forwarded-Proto' header for request.is_secure()
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# # Allow all host headers
# ALLOWED_HOSTS = ['*']

# # Static asset configuration
# import os
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# STATIC_ROOT = 'staticfiles'
# STATIC_URL = '/static/'

# STATICFILES_DIRS = (
#     os.path.join(BASE_DIR, 'static'),
# )