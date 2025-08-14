from django.db import models
class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    usage_frequency = models.IntegerField(default=0)
    def __str__(self):
        return self.name
class Task(models.Model):
    STATUS_CHOICES = [("pending","Pending"), ("completed","Completed")]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    priority_score = models.FloatField(default=0.0)
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
