from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Region

class AccountsTests(APITestCase):
    def setUp(self):
        self.region = Region.objects.create(name='Test Region')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'buyer',
            'region': self.region,
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register(self):
        """
        Ensure we can create a new user.
        """
        url = reverse('auth_register')
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpassword',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'buyer',
            'region': self.region.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.get(username='newuser').email, 'new@example.com')

    def test_login(self):
        """
        Ensure we can login a user.
        """
        url = reverse('auth_login')
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'role': 'buyer',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        """
        Ensure we can't login with invalid credentials.
        """
        url = reverse('auth_login')
        data = {
            'username': 'testuser',
            'password': 'wrongpassword',
            'role': 'buyer',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_invalid_role(self):
        """
        Ensure we can't login with an invalid role.
        """
        url = reverse('auth_login')
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'role': 'farmer',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
