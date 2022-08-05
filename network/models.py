from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=280)
    # timestamp = models.DateField(null=False) 
    timestamp = models.DateTimeField(auto_now_add=True)
    # timestamp = models.IntegerField()
    likes = models.IntegerField()

    
    def __str__(self):
        return self.content

    def serialize(self):
        return {
            "user": self.user.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes
        }

class Follower(models.Model):
    # timestamp = models.DateTimeField(auto_now_add=True)
    # follower = models.ManyToManyField(User, related_name="follower")
    # following = models.ManyToManyField(User, related_name="following")

    follower = models.ForeignKey(User, on_delete=models.CASCADE)
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")


    def __str__(self):
        return self.follower.username

    def serialize(self):
        return {
            "follower": self.follower,
            "following": self.following
        }