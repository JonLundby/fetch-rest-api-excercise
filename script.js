"use strict";

window.addEventListener("load", startApp);

const endpoint = "https://test01-6591a-default-rtdb.europe-west1.firebasedatabase.app";
//const arrayExample = [2, 6, 2, 1];

async function startApp() {
  // const allPosts = await getPosts();
  // const allusers = await getUsers();

  // console.log(allPosts);

  // for (const element of allPosts) {
  //   displayPost(element);
  // }

  // for (const element of allusers) {
  //   displayUsers(element);
  // }

  updatePostsGrid();

  //createPost("some title", null, "some body text...");
}

//    ---- POST FUNCTIONS ----    \\

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();
  console.log(data);

  const allPostsArray = preparePostData(data);

  return allPostsArray;
}

function preparePostData(dataObject) {
  const postArray = [];

  for (const key in dataObject) {
    const post = dataObject[key];
    post.id = key;
    postArray.push(post);
  }

  return postArray;
}

function displayPost(post) {
  const postsGridItem = /*html*/ `
                    <div id="post">
                      <p id="post-title">${post.title}</p>
                      <div id="post-image"><img src="${post.image}"></div>
                      <p id="post-body">${post.body}</p>
                      <span id="buttons">
                        <button class="update">UPDATE</button>
                        <button class="delete">DELETE</button>
                      </span>
                      
                    </div>`;

  document.querySelector("#posts-container").insertAdjacentHTML("beforeend", postsGridItem);

  document.querySelector("#post:last-child .update").addEventListener("click", updatePostClicked);
  document.querySelector("#post:last-child .delete").addEventListener("click", deletePostClicked);

  function updatePostClicked() {
    console.log("post update btn clicked...");
    const title = "Dostojevskij";
    const image = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Dostoevsky_140-190_for_collage.jpg";
    const body = "A great writer!";
    updatePost(post.id, title, image, body);
  }

  async function updatePost(id, title, image, body) {
    console.log("updating post...");
    const postToUpdate = { title, body, image };
    const postUpdateToJson = JSON.stringify(postToUpdate);

    const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "PUT", body: postUpdateToJson });
    
    if (response.ok) {
      console.log("post has been updated!");
      updatePostsGrid();
    }
  }

  function deletePostClicked() {
    deletePost(post.id);
  }

  async function deletePost(id) {
    const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "DELETE" });
    if (response.ok) {
      console.log("post deleted!");
      updatePostsGrid();
    }
  }
}

async function updatePostsGrid() {
  const posts = await getPosts();
  //displayPost(posts);
  displayPosts(posts);
}

function displayPosts(posts) {
  document.querySelector("#posts-container").innerHTML = "";
  for (const element of posts) {
    displayPost(element);
  }
}

async function createPost(title, image, body) {
  const newPost = {
    title: title,
    image: image,
    body: body,
  };

  const newPostAsJson = JSON.stringify(newPost);
  //console.log(newPostAsJson);

  const response = await fetch(`${endpoint}/posts.json`, {
    method: "POST",
    body: newPostAsJson,
  });
  //console.log(response);

  const data = response.json();
  console.log(data);
}

//    ---- USER FUNCTIONS ----    \\

async function getUsers() {
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  console.log(data);

  const allUsersArray = prepareUserData(data);

  return allUsersArray;
}

function prepareUserData(dataObject) {
  const userArray = [];

  for (const key in dataObject) {
    const user = dataObject[key];
    user.id = key;
    userArray.push(user);
  }

  return userArray;
}

function displayUsers(allUsers) {
  const usersGridItem = /*html*/ `
                    <div id="user">
                      <div id="user-image"><img src="${allUsers.image}"></div>
                      <p id="post-title">${allUsers.name}</p>
                      <p id="user-body">${allUsers.title}</p>
                      <p id="user-body">${allUsers.phone}</p>
                      <p id="user-body">${allUsers.mail}</p>
                    </div>`;

  document.querySelector("#users-container").insertAdjacentHTML("beforeend", usersGridItem);

  document.querySelector("#user:last-child").addEventListener("click", userDetailView);
}

function userDetailView() {
  console.log("user clicked for detailed view...");
}
