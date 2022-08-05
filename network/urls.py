
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"), 
    path("user/<str:username>", views.profile_view, name="profile"),

    # API Routes
    path("posts", views.all_posts, name="all_posts"),
    path("posts/<str:username>", views.users_posts, name="users_posts"),
    path("following/posts", views.followed_posts, name="followed_posts"),
    path("following/<str:username>", views.following_reln, name="following_reln"),
    path("make_post", views.make_post, name="compose"),
    path("follower/add/<str:username>", views.add_follower, name="add_follower"),
    path("follower/remove/<str:username>", views.remove_follower, name="remove_follower")
    
]
