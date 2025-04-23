# remittance_backend/remittance_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from wallets.views import WalletViewSet
from transactions.views import TransactionViewSet
from exchange.views import ExchangeRateViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'wallets', WalletViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'exchange', ExchangeRateViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
