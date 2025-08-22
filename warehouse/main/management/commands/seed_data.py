import random
from faker import Faker
from django.core.management.base import BaseCommand
from django.db import transaction
from main.models import Category, Zone, Item, Inventory, StockMovement

class Command(BaseCommand):
    help = 'Seeds the database with a large amount of sample data'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")
        Category.objects.all().delete()
        Zone.objects.all().delete()
        Item.objects.all().delete()
        Inventory.objects.all().delete()
        StockMovement.objects.all().delete()

        fake = Faker()
        self.stdout.write("Seeding new data...")

        categories = [Category.objects.create(name=fake.word()) for _ in range(20)]
        zones = [Zone.objects.create(name=f"Aisle {i+1}") for i in range(50)]

        items = []
        for _ in range(1000): # Create 1,000 items
            item = Item.objects.create(
                sku=fake.unique.ean(length=13),
                name=fake.sentence(nb_words=3),
                category=random.choice(categories)
            )
            items.append(item)

        for i, item in enumerate(items):
            for _ in range(random.randint(1, 5)):
                zone = random.choice(zones)
                quantity = random.randint(50, 500)

                inv, created = Inventory.objects.get_or_create(item=item, zone=zone, defaults={'quantity': quantity})
                if not created:
                    inv.quantity += quantity
                    inv.save()

                StockMovement.objects.create(
                    item=item,
                    quantity=quantity,
                    to_zone=zone,
                    movement_type='IN'
                )
            item.update_total_quantity()

            if (i + 1) % 100 == 0:
                self.stdout.write(f"Seeded {i+1}/{len(items)} items...")

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database.'))