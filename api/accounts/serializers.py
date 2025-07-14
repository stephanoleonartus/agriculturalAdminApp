from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Region, UserProfile, FarmerProfile, SupplierProfile

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'region']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        if user.role == 'farmer':
            FarmerProfile.objects.create(user=user)
        elif user.role == 'supplier':
            SupplierProfile.objects.create(user=user)
        return user

class UserSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'region']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    role = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            if user.role != data['role']:
                raise serializers.ValidationError("Invalid role for this user.")
            return user
        raise serializers.ValidationError("Invalid Credentials")