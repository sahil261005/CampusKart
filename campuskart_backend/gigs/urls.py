from rest_framework.routers import DefaultRouter
from .views import GigViewSet

router = DefaultRouter()
router.register('gigs', GigViewSet, basename='gig')

urlpatterns = router.urls
