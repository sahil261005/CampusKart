from django.conf import settings
from django.db import models


class Item(models.Model):
	"""
	Represents a product listed for sale in the marketplace.
	"""
	seller = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='items', on_delete=models.CASCADE)
	title = models.CharField(max_length=120)
	description = models.TextField()
	price = models.DecimalField(max_digits=10, decimal_places=2)
	category = models.CharField(max_length=60)
	image = models.ImageField(upload_to='item_images/', blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('-created_at',)

	def __str__(self) -> str:  # pragma: no cover - trivial string repr
		return f"{self.title} ({self.seller.email})"


class WantedItem(models.Model):
	"""
	Represents a request for an item that a buyer is looking for.
	"""
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wanted_items', on_delete=models.CASCADE)
	title = models.CharField(max_length=120)
	min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return f"Wanted: {self.title} by {self.user.email}"
