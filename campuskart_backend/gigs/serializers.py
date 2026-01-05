from rest_framework import serializers
from .models import Gig

class GigSerializer(serializers.ModelSerializer):
    poster_name = serializers.CharField(source='poster.get_full_name', read_only=True)
    poster_email = serializers.EmailField(source='poster.email', read_only=True)
    poster_verified = serializers.BooleanField(source='poster.is_verified', read_only=True)

    class Meta:
        model = Gig
        fields = (
            'id',
            'poster',
            'poster_name',
            'poster_email',
            'poster_verified',
            'title',
            'description',
            'budget',
            'contact_phone',
            'is_active',
            'created_at',
        )
        read_only_fields = ('id', 'poster', 'created_at', 'poster_name', 'poster_email', 'poster_verified')
