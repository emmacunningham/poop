from django.contrib import admin
from django.contrib.admin.widgets import AdminFileWidget
from django.conf import settings
from django.db import models
from models import *
from django.contrib.sessions.models import Session


# class CarouselAssetInline(admin.TabularInline):
#     model = CarouselAsset

# class PhoneNumberInline(admin.TabularInline):
#     model = PhoneNumber

# def make_featured(modeladmin, request, queryset):
#     queryset.update(is_featured=True)
# make_featured.short_description = "Mark selected resources as featured"

# def make_unfeatured(modeladmin, request, queryset):
#     queryset.update(is_featured=False)
# make_unfeatured.short_description = "Mark selected resources as not featured"

# class ResourceAdmin(admin.ModelAdmin):
#     list_display = ('name', 'is_featured', 'resource_domains', 'resource_categories')
#     search_fields = ['name']

#     def resource_domains(self, obj):
#       return ", ".join([p.name for p in obj.domain.all()])

#     def resource_categories(self, obj):
#       return ", ".join([p.name for p in obj.category.all()])

#     actions = [make_featured, make_unfeatured]
#     exclude = ('address_full',)
#     inlines = [
#     	PhoneNumberInline,
#         CarouselAssetInline,
#     ]
#     filter_horizontal = ("domain","category")

# class VetroUserAdmin(admin.ModelAdmin):
#     list_display = ('name', 'email', 'user_type', 'account_provider', 'profile_picture_string')
#     search_fields = ['name', 'email']

# class SessionAdmin(admin.ModelAdmin):
#     def _session_data(self, obj):
#         return obj.get_decoded()
#     list_display = ['session_key', '_session_data', 'expire_date']


# class CommentAdmin(admin.ModelAdmin):
#     list_display = ('pub_date', 'get_resource', 'get_author', 'get_flags')

#     def get_author(self, obj):
#         return obj.user.name
#     get_author.short_description = 'User'

#     def get_resource(self, obj):
#         return obj.resource.name
#     get_resource.short_description = 'Resource'
#     get_resource.admin_order_field = 'resource'

#     def get_flags(self, obj):
#         return len(obj.resourceflag_set.all())
#     get_flags.short_description = 'Flags'

# admin.site.register(Session, SessionAdmin)

# admin.site.register(Resource, ResourceAdmin)

# admin.site.register(VetroUser, VetroUserAdmin)

# admin.site.register(Domain, SortableAdmin)
# admin.site.register(Category)
admin.site.register(Category)
admin.site.register(MediaCollection)

# admin.site.register(BannedWord)
# admin.site.register(RegistrationCredential)

# admin.site.register(ResourceComment, CommentAdmin)


