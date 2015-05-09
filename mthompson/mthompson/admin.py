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


admin.site.register(Category, SortableAdminCategory)
admin.site.register(MediaCollection, SortableAdminMediaCollection)
admin.site.register(HomeBackgroundImage)
admin.site.register(AboutPage)



