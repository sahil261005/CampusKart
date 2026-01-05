"""
URL configuration for campuskart_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

urlpatterns = [
    path('', lambda request: JsonResponse({
        'message': 'CampusKart API is running.',
        'endpoints': {
            'register': '/api/register/',
            'login': '/api/token/',
            'refresh': '/api/token/refresh/',
            'profile': '/api/profile/',
            'items': '/api/items/',
            'notes': '/api/notes/',
        },
    })),
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('marketplace.urls')),
    path('api/', include('gigs.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
