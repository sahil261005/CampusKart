from django.contrib import admin
from .models import Gig

@admin.register(Gig)
class GigAdmin(admin.ModelAdmin):
    list_display = ('title', 'poster', 'budget', 'contact_phone', 'created_at', 'is_active')
    search_fields = ('title', 'description')
    list_filter = ('is_active',)
