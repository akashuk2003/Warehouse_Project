# warehouse/management/commands/recalculate_totals.py

from django.core.management.base import BaseCommand
from django.db import transaction
from main.models import Item

class Command(BaseCommand):
    help = 'Recalculates the total_quantity for all items based on the Inventory table.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Starting recalculation of item totals...")
        
        items_to_update = Item.objects.all()
        updated_count = 0
        
        for item in items_to_update:
            old_total = item.total_quantity
            item.update_total_quantity() # This calls the correct logic from your model
            if old_total != item.total_quantity:
                updated_count += 1
                self.stdout.write(f"Updated {item.sku}: {old_total} -> {item.total_quantity}")

        if updated_count == 0:
            self.stdout.write(self.style.SUCCESS('All item totals were already correct. No changes made.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Successfully recalculated totals for {updated_count} items.'))