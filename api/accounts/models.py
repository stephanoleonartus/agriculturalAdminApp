# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from PIL import Image

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

    @classmethod
    def populate_tanzania_regions(cls):
        """Populate Tanzania regions - call this in a migration or management command"""
        tanzania_regions = [
            ('Arusha', 'ARU'),
            ('Dar es Salaam', 'DSM'),
            ('Dodoma', 'DOD'),
            ('Geita', 'GEI'),
            ('Iringa', 'IRI'),
            ('Kagera', 'KAG'),
            ('Katavi', 'KAT'),
            ('Kigoma', 'KIG'),
            ('Kilimanjaro', 'KIL'),
            ('Lindi', 'LIN'),
            ('Manyara', 'MAN'),
            ('Mara', 'MAR'),
            ('Mbeya', 'MBE'),
            ('Morogoro', 'MOR'),
            ('Mtwara', 'MTW'),
            ('Mwanza', 'MWA'),
            ('Njombe', 'NJO'),
            ('Pwani', 'PWA'),
            ('Rukwa', 'RUK'),
            ('Ruvuma', 'RUV'),
            ('Shinyanga', 'SHI'),
            ('Simiyu', 'SIM'),
            ('Singida', 'SIN'),
            ('Songwe', 'SON'),
            ('Tabora', 'TAB'),
            ('Tanga', 'TAN'),
            ('Pemba North', 'PEN'),
            ('Pemba South', 'PES'),
            ('Unguja North', 'UNN'),
            ('Unguja South', 'UNS'),
            ('Unguja West', 'UNW'),
        ]
        
        for name, code in tanzania_regions:
            cls.objects.get_or_create(name=name, code=code)

class User(AbstractUser):
    ROLE_CHOICES = [
        ('farmer', 'Farmer'),
        ('customer', 'Customer'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer_not_to_say', 'Prefer not to say'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=True, blank=True)
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')],
        null=True,
        blank=True
    )
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.profile_picture:
            try:
                img = Image.open(self.profile_picture.path)
                if img.height > 300 or img.width > 300:
                    output_size = (300, 300)
                    img.thumbnail(output_size)
                    img.save(self.profile_picture.path)
            except Exception:
                pass  # Handle cases where image processing fails

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    business_name = models.CharField(max_length=100, blank=True)
    business_license = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    social_media = models.JSONField(default=dict, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.PositiveIntegerField(default=0)
    is_premium = models.BooleanField(default=False)
    subscription_end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class FarmerProfile(models.Model):
    FARM_TYPES = [
        ('crop', 'Crop Farming'),
        ('livestock', 'Livestock'),
        ('mixed', 'Mixed Farming'),
        ('aquaculture', 'Aquaculture'),
        ('poultry', 'Poultry'),
    ]
    
    CERTIFICATION_TYPES = [
        ('organic', 'Organic'),
        ('fairtrade', 'Fair Trade'),
        ('gmp', 'Good Manufacturing Practice'),
        ('haccp', 'HACCP'),
        ('none', 'None'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    farm_name = models.CharField(max_length=100, blank=True, default='')  # Made optional
    farm_type = models.CharField(max_length=20, choices=FARM_TYPES, blank=True, default='crop')  # Made optional
    farm_size = models.DecimalField(max_digits=10, decimal_places=2, help_text="Size in acres", null=True, blank=True)  # Made optional
    certifications = models.CharField(max_length=20, choices=CERTIFICATION_TYPES, default='none')
    crops_grown = models.JSONField(default=list, blank=True)
    livestock_types = models.JSONField(default=list, blank=True)
    farming_experience = models.PositiveIntegerField(help_text="Years of experience", null=True, blank=True)  # Made optional
    seasonal_availability = models.JSONField(default=dict, blank=True)
    delivery_radius = models.PositiveIntegerField(default=50, help_text="Delivery radius in km")
    
    def __str__(self):
        return f"{self.farm_name} - {self.user.username}"

