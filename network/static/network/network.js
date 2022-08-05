document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#all-posts').style.display = 'block';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'none';


  document.addEventListener('click', event => {
    const element = event.target;
    if (element.className === "profile-button") {
      load_profile(element.innerHTML)
    }
  })


  if (document.querySelector('#post-submit-btn') !== null) {
    document.querySelector('#post-submit-btn').addEventListener('click', () => make_post());
  }


  if (document.querySelector('#your-profile-btn') !== null) {
    document.querySelector('#your-profile-btn').addEventListener('click', () =>
      load_profile(document.querySelector('#user-name').innerHTML))
  }

  if (document.querySelector('#following-btn') !== null) {
    document.querySelector('#following-btn').addEventListener('click', () => load_following());
  }

  if (document.querySelector('#follow-btn') !== null) {
    document.querySelector('#follow-btn').addEventListener('click', () =>
      add_follower(document.querySelector('#username').innerHTML))
  }

  if (document.querySelector('#unfollow-btn') !== null) {
    document.querySelector('#unfollow-btn').addEventListener('click', () =>
      remove_follower(document.querySelector('#username').innerHTML))
  }

  document.querySelector('#page-btns').style.display = 'none';


  load_feed();
});

function print_posts(posts, page) {
  document.querySelector('#feed-posts').innerHTML = null;
  document.querySelector('#current-page').innerHTML = page;
  let max_posts = posts.length;
  if (10 * page < posts.length) {
    max_posts = 10 * page
  }

  for (let i = 10 * (page - 1); i < max_posts; i++) {

    tmp = posts[i];

    let post = document.createElement('div');

    user = document.createElement('button');
    user.innerHTML = tmp.user;
    user.className = "profile-button";
    user.style = "margin: 10px; border: none; background-color: none; color: none;";

    body = document.createElement('div');
    body.innerHTML = tmp.content;
    body.style = "margin: 10px";

    date = document.createElement('div');
    date.innerHTML = tmp.timestamp;
    date.style = "margin: 10px; color:grey";;

    likes = document.createElement('div');
    likes.innerHTML = "<3 \t" + tmp.likes;
    likes.style = "margin: 10px; color:grey";;

    comment = document.createElement('div');
    comment.innerHTML = "Comment"
    comment.style = "margin: 10px; color:grey";

    post.append(user);
    post.append(body);
    post.append(date);
    post.append(likes);
    post.append(comment);

    post.style = "border: 1px solid grey; border-radius: 4px; margin: 5px; padding: 5px";

    document.querySelector('#feed-posts').append(post);

  }
}

function pagination(posts) {
  let num_posts = posts.length;

  if (num_posts > 10) {
    let page = 1;

    for (i = 0; i <= num_posts; i += 10) {

      let pg_btn = document.createElement('li');
      pg_btn.className = "page-item";

      let a = document.createElement('a');
      a.className = "page-link";
      a.id = "numbered-page-link";
      a.href = "#";
      a.innerHTML = page;

      pg_btn.append(a);

      document.querySelector('#pg-number-btn').append(pg_btn);
      document.addEventListener('click', event => {
        const element = event.target;
        if (element.id === "numbered-page-link") {
          print_posts(posts, parseInt(element.innerHTML));
        }
      });
      page += 1;
    }

    document.querySelector('#page-btns').style.display = 'block';
    document.querySelector('#current-page').style.display = 'none';

    document.querySelector('#prev-btn').addEventListener('click', () => {
      let current_page = parseInt(document.querySelector('#current-page').innerHTML);
      if (current_page > 1) {
        let next_page = current_page - 1;
        print_posts(posts, next_page);
      }
    });

    document.querySelector('#next-btn').addEventListener('click', () => {
      let current_page = parseInt(document.querySelector('#current-page').innerHTML);
      if (current_page < page - 1) {
        let next_page = current_page + 1;
        print_posts(posts, next_page);
      }
    });
    print_posts(posts, 1);
  }
  else {
    print_posts(posts, parseInt(document.querySelector('#current-page').innerHTML));
  }


}

function load_feed() {

  document.querySelector('#all-posts').style.display = 'block';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'none';


  fetch('/posts')
    .then(response => response.json())
    .then(posts => {

      console.log(posts);

      pagination(posts);

    });
}

function make_post() {

  let body = document.querySelector('#post-text').value;

  fetch('/make_post', {
    method: 'POST',
    body: JSON.stringify({
      body: body
    })
  })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);

    });

  return false;

}

function load_profile(username) {
  document.querySelector('#all-posts').style.display = 'none';
  document.querySelector('#profile-view').style.display = 'block';
  document.querySelector('#following-view').style.display = 'none';
  document.querySelector('#page-btns').style.display = 'none';
  document.querySelector('#current-page').style.display = 'none';


  if (document.querySelector('#follow-btn') !== null) {
    document.querySelector('#follow-btn').style.display = 'none';
  }

  if (document.querySelector('#unfollow-btn') !== null) {
    document.querySelector('#unfollow-btn').style.display = 'none';
  }

  if ((document.querySelector('#follow-btn') !== null) || (document.querySelector('#unfollow-btn') !== null)) {
    fetch(`following/${username}`)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result["show_follow"]) {
          document.querySelector('#follow-btn').style.display = 'block';
        }
        else if (result["show_unfollow"]) {
          document.querySelector('#unfollow-btn').style.display = 'block';
        }
      });
  }
  document.querySelector(`#username`).innerHTML = username

  fetch(`user/${username}`)
    .then(response => response.json())
    .then(data => {
      num_followers = data["num_followers"]

      document.querySelector('#follower-count').innerHTML = `Followers: ${num_followers}`

      posts = data["posts"]

      console.log(posts);

      print_posts(posts, 1);
    });

}

function load_following() {
  document.querySelector('#all-posts').style.display = 'none';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'block';
  document.querySelector('#page-btns').style.display = 'none';

  fetch('/following/posts')
    .then(response => response.json())
    .then(posts => {

      console.log(posts);

      print_posts(posts, 1);
    });
}

function add_follower(user) {
  fetch(`follower/add/${user}`)
    .then(response => response.json())
    .then(() => {
      document.querySelector('#follow-btn').style.display = 'none';
      document.querySelector('#unfollow-btn').style.display = 'block';
      load_profile(user);
    });
}

function remove_follower(user) {
  fetch(`follower/remove/${user}`)
    .then(response => response.json())
    .then(() => {
      document.querySelector('#follow-btn').style.display = 'block';
      document.querySelector('#unfollow-btn').style.display = 'none';
      load_profile(user);
    });
}