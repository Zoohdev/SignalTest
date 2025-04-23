from rest_framework import viewsets
from .models import Wallet
from .serializers import WalletSerializer
from rest_framework.permissions import IsAuthenticated

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]
