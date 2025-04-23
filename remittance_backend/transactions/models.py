from django.db import models
from users.models import CustomUser

class Transaction(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=5)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=[('pending','Pending'),('completed','Completed')])
