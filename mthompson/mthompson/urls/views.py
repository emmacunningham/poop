# example/simple/views.py

from django.http import HttpResponse
from authomatic import Authomatic
from authomatic.adapters import DjangoAdapter
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.template import Context, Template
from django.db import models
from mthompson.models import *
import json




# def postfeedback(request):
#     json_str = request.body.decode()
#     json_obj = json.loads(json_str)

#     name = json_obj['name']
#     email = json_obj['email']
#     message = json_obj['message']
#     subject = json_obj['subject']

#     feedback = Feedback(name=name,
#                     email=email,
#                     subject=subject,
#                     message=message)
#     feedback.save()
#     response_data = {
#         'status': 'success'
#     }
#     return HttpResponse(json.dumps(response_data), content_type="application/json")


