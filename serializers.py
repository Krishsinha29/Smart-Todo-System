from rest_framework import serializers
from .models import Task, Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name','usage_frequency']
class TaskSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    class Meta:
        model = Task
        fields = ['id','title','description','category','category_id','priority_score','deadline','status','created_at','updated_at']
