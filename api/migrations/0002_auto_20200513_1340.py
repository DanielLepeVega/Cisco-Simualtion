# Generated by Django 2.2.12 on 2020-05-13 19:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ticket',
            old_name='escalationDate',
            new_name='scalationDate',
        ),
    ]
