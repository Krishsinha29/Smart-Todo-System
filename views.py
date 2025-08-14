from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Task, Category
from .serializers import TaskSerializer, CategorySerializer
from rest_framework.decorators import api_view
from ai.utils import generate_ai_suggestions
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-priority_score','-created_at')
    serializer_class = TaskSerializer
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        cat_id = data.pop('category_id', None)
        if cat_id:
            try:
                category = Category.objects.get(id=cat_id)
            except Category.DoesNotExist:
                category = None
        else:
            category = None
        task = Task.objects.create(
            title=data.get('title'),
            description=data.get('description',''),
            category=category
        )
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
@api_view(['GET'])
def categories_list(request):
    cats = Category.objects.all().order_by('-usage_frequency')
    return Response(CategorySerializer(cats, many=True).data)
@api_view(['POST'])
def ai_suggestions(request):
    payload = request.data
    suggestions = generate_ai_suggestions(payload)
    return Response(suggestions)
