import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from products.models import Product, Category, Region
from .models import Order, OrderItem

User = get_user_model()

class OrderAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.region = Region.objects.create(name='Test Region')
        self.buyer = User.objects.create_user(username='buyer', password='password123', role='buyer', region=self.region)
        self.farmer = User.objects.create_user(username='farmer', password='password123', role='farmer', region=self.region)
        self.staff = User.objects.create_user(username='staff', password='password123', is_staff=True, region=self.region)

        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=10.00,
            category=self.category,
            owner=self.farmer,
            region=self.region
        )
        self.order = Order.objects.create(buyer=self.buyer, total_amount=20.00)
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=2, price=10.00)

    def _get_token(self, user):
        response = self.client.post(reverse('auth_login'), {'username': user.username, 'password': 'password123'})
        return response.data['access']

    def test_create_order(self):
        token = self._get_token(self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-list')
        data = {'product_id': self.product.id, 'quantity': 2}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 2)
        self.assertEqual(OrderItem.objects.count(), 2)

    def test_list_orders_as_staff(self):
        token = self._get_token(self.staff)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_list_orders_as_buyer(self):
        token = self._get_token(self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_list_orders_as_farmer(self):
        token = self._get_token(self.farmer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_retrieve_order_as_owner(self):
        token = self._get_token(self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-detail', kwargs={'pk': self.order.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['order_id'], self.order.order_id)

    def test_retrieve_order_as_staff(self):
        token = self._get_token(self.staff)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-detail', kwargs={'pk': self.order.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['order_id'], self.order.order_id)

    def test_retrieve_order_unauthorized(self):
        token = self._get_token(self.farmer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-detail', kwargs={'pk': self.order.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cancel_order(self):
        token = self._get_token(self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-cancel', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'cancelled')
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'cancelled')

    def test_deliver_order(self):
        token = self._get_token(self.staff)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        self.order.status = 'shipped'
        self.order.save()
        url = reverse('order-deliver', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'delivered')
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'delivered')

    def test_get_my_orders(self):
        token = self._get_token(self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-mine')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_pending_orders(self):
        token = self._get_token(self.staff)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse('order-pending')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
