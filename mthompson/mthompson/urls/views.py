# example/simple/views.py

from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template.context import RequestContext
from django.template import Context, Template
from django.db import models
from mthompson.models import *
from photologue.models import Gallery, Photo

import json


def fetch_gallery(request, id):
    gallery = get_object_or_404(Gallery, pk=id)

    photos = [];

    for photo in gallery.photos.all():
        src = photo.image.url
        p = {
            'title': photo.title,
            'description': photo.caption,
            'src': src
        }
        photos.append(p)

    response_data = {
        'photos': photos
    }
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def fetch_categories(request):
    categories = []
    cats = Category.objects.all()

    for cat in cats:
        cat_data = {}
        cat_data['name'] = cat.name

        galleries = []
        for gallery in cat.mediacollection_set.all():
            if gallery.media_type == 'photo':
                story = gallery.gallery.description
            else:
                story = gallery.story

            gallery = {
                'name': gallery.name,
                'type': gallery.media_type,
                'id': gallery.gallery.pk
            }
            if story:
                gallery.update({'story': story})
            galleries.append(gallery)

        cat_data['galleries'] = galleries
        categories.append(cat_data)

    response_data = {
        'categories': categories
    }
    return HttpResponse(json.dumps(response_data), content_type="application/json")


