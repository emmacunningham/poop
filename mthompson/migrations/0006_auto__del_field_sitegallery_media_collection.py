# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'SiteGallery.media_collection'
        db.delete_column(u'mthompson_sitegallery', 'media_collection_id')


    def backwards(self, orm):
        # Adding field 'SiteGallery.media_collection'
        db.add_column(u'mthompson_sitegallery', 'media_collection',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['photologue.Gallery'], null=True, blank=True),
                      keep_default=False)


    models = {
        u'mthompson.category': {
            'Meta': {'object_name': 'Category'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'order': ('django.db.models.fields.IntegerField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        },
        u'mthompson.sitegallery': {
            'Meta': {'object_name': 'SiteGallery'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['mthompson.Category']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['mthompson']