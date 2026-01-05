from rest_framework import serializers

from .models import Item, WantedItem


class ItemSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)
    seller_email = serializers.EmailField(source='seller.email', read_only=True)

    class Meta:
        model = Item
        fields = (
            'id',
            'seller',
            'seller_name',
            'seller_email',
            'title',
            'description',
            'price',
            'category',
            'image',
            'created_at',
        )
        read_only_fields = ('id', 'seller', 'created_at', 'seller_name', 'seller_email')


class WantedItemSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = WantedItem
        fields = (
            'id',
            'user',
            'user_email',
            'title',
            'min_price',
            'max_price',
            'created_at',
        )
        read_only_fields = ('id', 'user', 'created_at', 'user_email')
