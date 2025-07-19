from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Region, UserProfile, FarmerProfile, SupplierProfile

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    region = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role', 'region')
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True}  # Ensure role is always provided
        }

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists.")
        
        # Validate role choice
        valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if data['role'] not in valid_roles:
            raise serializers.ValidationError(f"⚠️ role: '{data['role']}' is not a valid choice. Valid choices are: {', '.join(valid_roles)}")
        
        return data

    def create(self, validated_data):
        region_name = validated_data.pop('region')
        try:
            region = Region.objects.get(name=region_name)
        except Region.DoesNotExist:
            raise serializers.ValidationError(f"Region '{region_name}' does not exist.")

        user = User.objects.create_user(**validated_data, region=region)
        UserProfile.objects.create(user=user)
        
        # Handle profile creation based on role
        if user.role == 'farmer':
            FarmerProfile.objects.create(user=user)
        elif user.role == 'supplier':
            SupplierProfile.objects.create(
                user=user,
                business_name=f"{user.first_name} {user.last_name}'s Business",
                supplier_type='general'
            )
        elif user.role == 'customer':
            # For customers, a basic UserProfile is already created.
            # You can add customer-specific profile logic here if needed in the future.
            pass
        
        return user
class UserSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'region']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Credentials")

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)