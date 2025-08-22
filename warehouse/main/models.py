from django.db import models
from django.db.models import Sum

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, help_text="Name of the item category")
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Zone(models.Model):
    name = models.CharField(max_length=100, unique=True, help_text="Name of the warehouse zone")
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Item(models.Model):
    sku = models.CharField(max_length=50, unique=True, help_text="Stock Keeping Unit")
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, related_name="items", on_delete=models.CASCADE)
    total_quantity = models.IntegerField(default=0, help_text="Total quantity across all zones")

    def __str__(self):
        return f"{self.name} ({self.sku})"
    
    def update_total_quantity(self):
        inventories = self.inventory_set.select_for_update().all()
        total = inventories.aggregate(total=Sum('quantity'))['total'] or 0
        
        if self.total_quantity != total:
            self.total_quantity = total
            self.save(update_fields=['total_quantity'])


class StockMovement(models.Model):
    class MovementType(models.TextChoices):
        STOCK_IN = 'IN', 'Stock In'
        STOCK_OUT = 'OUT', 'Stock Out'
        MOVE = 'MOVE', 'Internal Move'

    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(help_text="The amount of stock being moved.")
    from_zone = models.ForeignKey(Zone, related_name='stock_moved_from', on_delete=models.CASCADE, null=True, blank=True)
    to_zone = models.ForeignKey(Zone, related_name='stock_moved_to', on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    movement_type = models.CharField(max_length=4, choices=MovementType.choices)
    description = models.CharField(max_length=255, blank=True, null=True, help_text="Reason for the movement")


    def __str__(self):
        return f"{self.movement_type}: {self.quantity} x {self.item.sku} @ {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
    
    
class Inventory(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('item', 'zone')
        verbose_name_plural = "Inventories"

    def __str__(self):
        return f"{self.item.sku} in {self.zone.name}: {self.quantity}"