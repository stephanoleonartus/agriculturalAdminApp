import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agrilink.settings")
django.setup()

from accounts.models import Region

for region in Region.objects.all():
    print(region.id, region.name)
