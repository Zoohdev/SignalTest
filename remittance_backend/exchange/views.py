from rest_framework import viewsets
from .models import ExchangeRate
from .serializers import ExchangeRateSerializer
from rest_framework.permissions import IsAuthenticated

class ExchangeRateViewSet(viewsets.ModelViewSet):
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    permission_classes = [IsAuthenticated]
