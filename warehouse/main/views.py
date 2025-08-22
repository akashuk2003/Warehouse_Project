from django.db import transaction
from rest_framework import generics, status,serializers
from rest_framework.response import Response
from .models import Category, Inventory, Zone, Item, StockMovement
from .serializers import CategorySerializer, ZoneSerializer, ItemSerializer, StockMovementSerializer
from django_filters.rest_framework import DjangoFilterBackend
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ZoneListCreateView(generics.ListCreateAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class ItemListCreateView(generics.ListCreateAPIView):
    queryset = Item.objects.all().select_related('category')
    serializer_class = ItemSerializer

class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all().select_related('category')
    serializer_class = ItemSerializer

class StockMovementListCreateView(generics.ListCreateAPIView):
    queryset = StockMovement.objects.all().select_related('item', 'from_zone', 'to_zone').order_by('-timestamp')
    serializer_class = StockMovementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['item', 'movement_type']

    def perform_create(self, serializer):
        with transaction.atomic():
            movement = serializer.save()
            item = movement.item
            quantity = movement.quantity

            if movement.movement_type == 'IN':
                to_zone = movement.to_zone
                inventory, created = Inventory.objects.select_for_update().get_or_create(
                    item=item, zone=to_zone, defaults={'quantity': 0}
                )
                inventory.quantity += quantity
                inventory.save()

            elif movement.movement_type == 'OUT':
                from_zone = movement.from_zone
                try:
                    inventory = Inventory.objects.select_for_update().get(item=item, zone=from_zone)
                    if inventory.quantity < quantity:
                        raise serializers.ValidationError(f"Not enough stock in zone '{from_zone.name}'. Available: {inventory.quantity}")
                    inventory.quantity -= quantity
                    inventory.save()
                except Inventory.DoesNotExist:
                    raise serializers.ValidationError(f"No stock for item '{item.sku}' found in zone '{from_zone.name}'.")

            elif movement.movement_type == 'MOVE':
                from_zone = movement.from_zone
                to_zone = movement.to_zone
                try:
                    from_inventory = Inventory.objects.select_for_update().get(item=item, zone=from_zone)
                    if from_inventory.quantity < quantity:
                        raise serializers.ValidationError(f"Not enough stock in zone '{from_zone.name}'. Available: {from_inventory.quantity}")
                    from_inventory.quantity -= quantity
                    from_inventory.save()
                except Inventory.DoesNotExist:
                    raise serializers.ValidationError(f"No stock for item '{item.sku}' found in zone '{from_zone.name}'.")

                to_inventory, created = Inventory.objects.select_for_update().get_or_create(
                    item=item, zone=to_zone, defaults={'quantity': 0}
                )
                to_inventory.quantity += quantity
                to_inventory.save()

            item.update_total_quantity()
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'inventory_updates',
            {'type': 'inventory.update', 'message': f'Stock updated for item {item.sku}'}
        )


class StockMovementDetailView(generics.RetrieveAPIView):
    """
    A read-only endpoint for viewing a single stock movement.
    Generally, historical movements should not be updated or deleted.
    """
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
