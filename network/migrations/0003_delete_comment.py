# Generated by Django 3.2.13 on 2022-07-24 17:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_comment_post'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Comment',
        ),
    ]
