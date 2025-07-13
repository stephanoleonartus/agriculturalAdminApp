from django.core.management.base import BaseCommand
from products.models import Category

class Command(BaseCommand):
    help = 'Creates the initial product categories'

    def handle(self, *args, **options):
        categories = [
            'Grains',
            'Fruits',
            'Vegetables',
            'Fibers',
            'Services',
            'Equipment',
        ]

        for category_name in categories:
            category, created = Category.objects.get_or_create(name=category_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created category "{category_name}"'))
            else:
                self.stdout.write(self.style.WARNING(f'Category "{category_name}" already exists'))
