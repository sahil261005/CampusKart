from rest_framework import viewsets, permissions
from .models import Gig
from .serializers import GigSerializer
from .permissions import IsPosterOrReadOnly


class GigViewSet(viewsets.ModelViewSet):
    """
    Handles creating, listing, and deleting gigs.
    """
    queryset = Gig.objects.select_related('poster').all()
    serializer_class = GigSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsPosterOrReadOnly)

    def perform_create(self, serializer):
        serializer.save(poster=self.request.user)

    def get_queryset(self):
        queryset = Gig.objects.select_related('poster').all()
        if self.request.query_params.get('my_gigs'):
            return queryset.filter(poster=self.request.user)
        return queryset
