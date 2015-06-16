from django.contrib import admin
from django.contrib.admin.widgets import AdminFileWidget
from django.conf import settings
from django.db import models
from models import *
from django.contrib.sessions.models import Session
from adminsortable.admin import SortableAdmin

class SortableAdminCategory(SortableAdmin):
    """Any admin options you need go here"""

class SortableAdminMediaCollection(SortableAdmin):
    """Any admin options you need go here"""
    class Media:
        js = (
            'http://code.jquery.com/jquery-2.1.4.min.js',
            'js/admin.js',
        )

admin.site.register(Category, SortableAdminCategory)
admin.site.register(MediaCollection, SortableAdminMediaCollection)
admin.site.register(HomeBackgroundImage)
admin.site.register(AboutPage)


from django import forms
from django.contrib import admin

from photologue.admin import GalleryAdmin as GalleryAdminDefault
from photologue.models import Gallery


class GalleryAdminForm(forms.ModelForm):
    """Users never need to enter a description on a gallery."""

    class Meta:
        model = Gallery


class GalleryAdmin(GalleryAdminDefault):
    form = GalleryAdminForm
    class Media:
        js = (
            'http://code.jquery.com/jquery-2.1.4.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash.min.js',
            'js/admin.js',
        )

admin.site.unregister(Gallery)
admin.site.register(Gallery, GalleryAdmin)
