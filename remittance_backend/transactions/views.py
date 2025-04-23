from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Transaction
from .serializers import TransactionSerializer
from wallets.models import Wallet
from users.models import CustomUser
from exchange.models import ExchangeRate
from rest_framework.permissions import IsAuthenticated
from django.db import transaction as db_transaction

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='send')
    def send_money(self, request):
        sender = request.user
        receiver_id = request.data.get('receiver_id')
        amount = float(request.data.get('amount'))
        currency = request.data.get('currency')
        narration = request.data.get('narration', '')
        reference = request.data.get('reference', '')

        try:
            receiver = CustomUser.objects.get(id=receiver_id)
            if sender.id == receiver.id:
                return Response({'error': 'Cannot send money to yourself.'}, status=status.HTTP_400_BAD_REQUEST)

            sender_wallet = Wallet.objects.get(user=sender, currency=currency)
            try:
                receiver_wallet = Wallet.objects.get(user=receiver, currency=currency)
                exchange_rate = 1
            except Wallet.DoesNotExist:
                # Handle currency conversion if needed
                receiver_wallet = Wallet.objects.get(user=receiver)
                fx = ExchangeRate.objects.get(base_currency=currency, quote_currency=receiver_wallet.currency)
                exchange_rate = fx.rate
        except (CustomUser.DoesNotExist, Wallet.DoesNotExist, ExchangeRate.DoesNotExist):
            return Response({'error': 'User, wallet or exchange rate not found.'}, status=status.HTTP_404_NOT_FOUND)

        if sender_wallet.balance < amount:
            return Response({'error': 'Insufficient funds.'}, status=status.HTTP_400_BAD_REQUEST)

        converted_amount = round(amount * exchange_rate, 2)

        with db_transaction.atomic():
            sender_wallet.balance -= amount
            receiver_wallet.balance += converted_amount
            sender_wallet.save()
            receiver_wallet.save()

            txn = Transaction.objects.create(
                sender=sender,
                receiver=receiver,
                amount=amount,
                currency=currency,
                status='completed'
            )

        return Response(TransactionSerializer(txn).data, status=status.HTTP_201_CREATED)
