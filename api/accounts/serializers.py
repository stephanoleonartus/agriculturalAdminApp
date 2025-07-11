# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, FarmerProfile, SupplierProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    company_name = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    agreed_to_terms = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 
                 'last_name', 'user_type', 'region', 'phone_number', 'gender', # Added gender
                 'company_name', 'agreed_to_terms'] # Added company_name and agreed_to_terms
    
    def validate_agreed_to_terms(self, value):
        if not value:
            raise serializers.ValidationError("You must agree to the terms and policy to register.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords don't match"})
        # Ensure company_name is provided if user_type is supplier or customer (buyer)
        # This can be optional based on strictness of requirements
        user_type = attrs.get('user_type')
        company_name = attrs.get('company_name')
        if user_type in ['supplier', 'customer'] and not company_name:
            # Making it optional for now as per `required=False` on field
            # If it were mandatory:
            # raise serializers.ValidationError({"company_name": "Company name is required for this user type."})
            pass
        return attrs
    
    def create(self, validated_data):
        password_confirm = validated_data.pop('password_confirm')
        company_name = validated_data.pop('company_name', None)
        agreed_to_terms = validated_data.pop('agreed_to_terms') # We've validated it, now remove before User.create_user

        # Fields for User model
        user_fields = ['username', 'email', 'password', 'first_name', 'last_name', 'user_type', 'region', 'phone_number', 'gender']
        user_data = {field: validated_data[field] for field in user_fields if field in validated_data}

        user = User.objects.create_user(**user_data)

        # Create UserProfile, potentially with business_name
        user_profile_data = {'user': user}
        if user.user_type == 'customer' and company_name: # Buyer with company name
            user_profile_data['business_name'] = company_name
        UserProfile.objects.create(**user_profile_data)

        # Create FarmerProfile or SupplierProfile if applicable
        if user.user_type == 'farmer':
            # For now, creating an empty FarmerProfile. Registration might need more fields for this.
            FarmerProfile.objects.create(user=user, farm_name=company_name or f"{user.username}'s Farm") # Default farm name
        elif user.user_type == 'supplier':
            supplier_profile_data = {'user': user}
            if company_name:
                supplier_profile_data['business_name'] = company_name
            # For now, creating SupplierProfile with minimal data. Registration might need more.
            SupplierProfile.objects.create(**supplier_profile_data)

        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = '__all__'

class SupplierProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    farmer_profile = FarmerProfileSerializer(read_only=True)
    supplier_profile = SupplierProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'user_type', 'region', 'phone_number', 'profile_picture', 
                 'address', 'is_verified', 'created_at', 'profile', 
                 'farmer_profile', 'supplier_profile']
        read_only_fields = ['id', 'created_at', 'is_verified']