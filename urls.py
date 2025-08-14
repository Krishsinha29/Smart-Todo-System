from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, categories_list, ai_suggestions
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
urlpatterns = [
    path('', include(router.urls)),
    path('categories/', categories_list),
    path('ai/suggestions/', ai_suggestions),
]
