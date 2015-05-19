from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
import os
from mthompson.settings import base as settings
import views

admin.autodiscover()

urlpatterns = patterns('',
    # Home Page -- Replace as you prefer
    (r'^assets/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_ROOT, 'assets')}),
    (r'^img/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_ROOT, 'assets/img')}),
    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_ROOT, 'media')}),

    url(r'^fetch-categories/', views.fetch_categories),
    url(r'^fetch-about/', views.fetch_about),
    url(r'^fetch-home-bg/', views.fetch_home_bg),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^fetch-gallery/(\w*)', views.fetch_gallery, name='gallery'),
    (r'^photologue/', include('photologue.urls', namespace='photologue')),
    url(r'^.*', TemplateView.as_view(template_name='home.html'), name='home'),

)
