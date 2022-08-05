import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

import datetime

from .models import User, Post, Follower


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def make_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    body = data.get("body", "")

    if not body:
        return JsonResponse({"message": "Post submited unsuccessfully. Content Empty."}, status=201)

    post = Post(user=request.user, content=body, likes=0)
    post.save()
    return JsonResponse({"message": "Post submited successfully"}, status=201)


# @login_required
def all_posts(request):
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


def users_posts(request):
    posts = Post.objects.all().filter(user = request.user)
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


def profile_view(request, username):
    user = User.objects.get(username = username)

    followers = Follower.objects.all().filter(following = user)
    num_followers = len(followers)

    posts = Post.objects.all().filter(user = user)
    posts = posts.order_by("-timestamp").all()
    return JsonResponse ({
            "num_followers": num_followers, 
            "posts": [post.serialize() for post in posts]
        })

def followed_posts(request):
    follows = Follower.objects.filter(follower = request.user)
    users = []
    for i in range(len(follows)):
        users += [follows[i].following]
    posts = Post.objects.filter(user__in=users)
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

# username is the person who's page we are viewing
def following_reln(request, username):
    # person viewing the page
    requester = request.user
    user = User.objects.get(username = username)

    return_dict = {"show_unfollow": False, 
                "show_follow": True}

    if (requester.username == username):
        return_dict = {"show_unfollow": False, 
                "show_follow": False}
    else:
        match = Follower.objects.all().filter(follower = requester).filter(following = user)
        if len(match) > 0 :
            return_dict = {"show_unfollow": True, 
                    "show_follow": False}


    return JsonResponse(return_dict, safe=False)

def add_follower(request, username):
    following = User.objects.get(username = username)

    # follow = Follower.objects.create()
    # follow.follower.add(request.user)
    # follow.following.add(following)

    follow = Follower(follower = request.user, following=following)
    follow.save()

    return JsonResponse({"message": "Follower Added"})

def remove_follower(request, username):
    following = User.objects.get(username = username)

    follow = Follower.objects.all().filter(follower = request.user).filter(following = following)

    # follow = Follower(follower=request.user, following = following)
    
    follow.delete()

    return JsonResponse({"message": "Follower Removed"})
 