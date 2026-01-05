from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, AnalyzeItemImageView, WantedItemViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'wanted-items', WantedItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('analyze-image/', AnalyzeItemImageView.as_view(), name='analyze-image'),
]
