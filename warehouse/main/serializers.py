from rest_framework import serializers
from .models import Category, Inventory, Zone, Item, StockMovement

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'


        
class InventorySerializer(serializers.ModelSerializer):
    """
    This new serializer will represent the inventory details for an item in a zone.
    """
    zone_name = serializers.CharField(source='zone.name', read_only=True)

    class Meta:
        model = Inventory
        fields = ['zone', 'zone_name', 'quantity']
        
class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    inventory_levels = InventorySerializer(source='inventory_set', many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'sku', 'name', 'category', 'category_name', 'total_quantity', 'inventory_levels']
        read_only_fields = ['total_quantity']

class StockMovementSerializer(serializers.ModelSerializer):
    item_sku = serializers.CharField(source='item.sku', read_only=True)
    from_zone_name = serializers.CharField(source='from_zone.name', read_only=True, allow_null=True)
    to_zone_name = serializers.CharField(source='to_zone.name', read_only=True, allow_null=True)

    class Meta:
        model = StockMovement
        fields = [
            'id', 'item_sku', 'quantity', 'timestamp', 'movement_type', 
            'description', 'item', 'from_zone', 'to_zone', 
            'from_zone_name', 'to_zone_name'
        ]
        read_only_fields = ['timestamp']

    def validate(self, data):
        movement_type = data.get('movement_type')
        from_zone = data.get('from_zone')
        to_zone = data.get('to_zone')
        quantity = data.get('quantity')

        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be a positive number.")

        if movement_type == 'IN':
            if from_zone: raise serializers.ValidationError("Stock-In movements cannot have a 'from_zone'.")
            if not to_zone: raise serializers.ValidationError("Stock-In movements must have a 'to_zone'.")
        
        elif movement_type == 'OUT':
            if not from_zone: raise serializers.ValidationError("Stock-Out movements must have a 'from_zone'.")
            if to_zone: raise serializers.ValidationError("Stock-Out movements cannot have a 'to_zone'.")

        elif movement_type == 'MOVE':
            if not from_zone or not to_zone: raise serializers.ValidationError("Internal moves must have both a 'from_zone' and a 'to_zone'.")
            if from_zone == to_zone: raise serializers.ValidationError("'from_zone' and 'to_zone' cannot be the same.")
        
        return data
    
