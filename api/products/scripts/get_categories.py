from products.models import Category

def run():
    for category in Category.objects.all():
        print(category.name)
