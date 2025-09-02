from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile


from django.core.exceptions import ObjectDoesNotExist



# This is a decorator that says: "every time a User object is saved, send a signal"
# The function below (the "receiver") will then run.
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    # 'created' is a boolean that is True only the first time the User is created.
    if created:
        # If a new user was created, also create a corresponding Profile object.
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except ObjectDoesNotExist:
        # If the user is being created, the create_user_profile signal below
        # will handle creating the profile. This just prevents a crash if
        # an old user without a profile is saved.
        pass