from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
import os
from mthompson.settings import base as settings

admin.autodiscover()

urlpatterns = patterns('',
    # Home Page -- Replace as you prefer
    (r'^assets/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_ROOT, 'assets')}),
    (r'^img/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_ROOT, 'assets/img')}),

    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
