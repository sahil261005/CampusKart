from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Item, WantedItem
from django.conf import settings

@receiver(post_save, sender=Item)
def check_wanted_matches(sender, instance, created, **kwargs):
    if created:
        print(f"Checking matches for new item: {instance.title}")
        # Simple string matching
        # In production, use search vector or elasticsearch
        matches = WantedItem.objects.filter(title__icontains=instance.title)
        
        for match in matches:
            # Check price constraints if they exist
            if match.min_price and instance.price < match.min_price:
                continue
            if match.max_price and instance.price > match.max_price:
                continue
            
            # Match found logic
            print(f"MATCH FOUND! Seller {instance.seller.email} listed '{instance.title}' which Buyer {match.user.email} wanted.")
            
            # TODO: Integrate with Notification System (Email/Push/In-App)
            # For now, we just log it.
