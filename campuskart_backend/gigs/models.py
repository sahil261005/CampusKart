from django.conf import settings
from django.db import models


class Gig(models.Model):
    """
    Represents a 'Gig' or task posted by any user (Student/Staff) that needs doing.
    """
    poster = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='posted_gigs', on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    contact_phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self) -> str:
        return f"{self.title} (₹{self.budget})"
