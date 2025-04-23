from django.db import models

class ExchangeRate(models.Model):
    base_currency = models.CharField(max_length=5)
    quote_currency = models.CharField(max_length=5)
    rate = models.FloatField()
    timestamp = models.DateTimeField(auto_now=True)
