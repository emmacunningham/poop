# example/simple/views.py

from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.template import Context, Template
from django.db import models
from mthompson.models import *
import json




def fetch_categories(request):
    categories = []
    cats = Category.objects.all()

    for cat in cats:
        cat_data = {}
        cat_data['name'] = cat.name

        galleries = []
        for gallery in cat.gallery_set.all():
            galleries.append(gallery.name)

        cat_data['galleries'] = galleries
        categories.append(cat_data)

    response_data = {
        'categories': categories
    }
    return HttpResponse(json.dumps(response_data), content_type="application/json")


