"use strict";

window.addEventListener("load", startApp);

const endpoint = "https://test01-6591a-default-rtdb.europe-west1.firebasedatabase.app";
//const arrayExample = [2, 6, 2, 1];

async function startApp() {
  const allPosts = await getPosts();
  const allusers = await getUsers();

  console.log(allPosts);

  for (const element of allPosts) {
    displayPosts(element);
  }

  for (const element of allusers) {
    displayUsers(element);
  }

  createPost("some title", null, "some body text...");
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

function displayPosts(allPosts) {
  const postsGridItem = /*html*/ `
                    <div id="post">
                      <p id="post-title">${allPosts.title}</p>
                      <div id="post-image"><img src="${allPosts.image}"></div>
                      <p id="post-body">${allPosts.body}</p>
                    </div>`;

  document.querySelector("#posts-container").insertAdjacentHTML("beforeend", postsGridItem);
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
}
