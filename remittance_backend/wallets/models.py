from django.db import models
from users.models import CustomUser

class Wallet(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    currency = models.CharField(max_length=5)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
