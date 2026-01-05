
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Item, WantedItem
from .serializers import ItemSerializer, WantedItemSerializer
from .permissions import IsSellerOrReadOnly
from .services import analyze_image_with_gemini # Import our simple function

class ItemViewSet(viewsets.ModelViewSet):
    # This ViewSet handles GET, POST, PUT, DELETE for Items
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
    # Only logged in users can post. Owners can edit/delete.
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly)
    
    # Allow image uploads
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # Set the seller to the current user
        serializer.save(seller=self.request.user)

    def get_queryset(self):
        # Allow filtering: /items/?my_items=true
        queryset = Item.objects.all()
        if self.request.query_params.get('my_items'):
            return queryset.filter(seller=self.request.user)
        return queryset


class WantedItemViewSet(viewsets.ModelViewSet):
    # Handles Wanted Board items
    queryset = WantedItem.objects.all()
    serializer_class = WantedItemSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AnalyzeItemImageView(APIView):
    # Custom API to handle Image Analysis
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # 1. Check for image
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided'}, status=400)
        
        # 2. Call our simple helper function
        image_file = request.FILES['image']
        result = analyze_image_with_gemini(image_file)
        
        # 3. Return result
        if 'error' in result:
             return Response(result, status=400)

        return Response(result, status=200)
