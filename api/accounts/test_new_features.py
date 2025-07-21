from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Region, UserProfile, FarmerProfile

User = get_user_model()

class UserRoleTests(TestCase):

    def setUp(self):
        self.region = Region.objects.create(name='Test Region', code='TR')

    def test_create_buyer(self):
        user = User.objects.create_user(
            username='buyer',
            email='buyer@test.com',
            password='password',
            role='buyer',
            region=self.region
        )
        self.assertEqual(user.role, 'buyer')
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        self.assertFalse(FarmerProfile.objects.filter(user=user).exists())

    def test_create_farmer(self):
        user = User.objects.create_user(
            username='farmer',
            email='farmer@test.com',
            password='password',
            role='farmer',
            region=self.region
        )
        self.assertEqual(user.role, 'farmer')
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        self.assertTrue(FarmerProfile.objects.filter(user=user).exists())

