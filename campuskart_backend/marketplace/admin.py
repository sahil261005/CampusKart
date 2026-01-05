from django.contrib import admin
from .models import Item, WantedItem

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'price', 'category', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('category',)

@admin.register(WantedItem)
class WantedItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'min_price', 'max_price', 'created_at')
    search_fields = ('title',)
