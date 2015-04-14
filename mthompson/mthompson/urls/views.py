# example/simple/views.py

from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template.context import RequestContext
from django.template import Context, Template
from django.db import models
from mthompson.models import *
from photologue.models import Gallery, Photo
from random import randint

import json


def fetch_home_bg(request):
    imgs = HomeBackgroundImage.objects.all()

    img_max = len(imgs) - 1
    index = randint(0,img_max)
    img = imgs[index]

    is_dark_color_scheme = False
    img_url = img.image.url

    if img.nav_appearance == 'dark':
        is_dark_color_scheme = True

    response_data = {
        'img_url': img_url,
        'is_dark_color_scheme': is_dark_color_scheme
    }
    return HttpResponse(json.dumps(response_data), content_type="application/json")


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

        if cat.image:
            cat_data['bg_img'] = cat.image.url

        cat_data['nav_appearance'] = cat.nav_appearance

        galleries = []
        for gallery in cat.mediacollection_set.all():
            print(gallery)

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


