"use strict";

//calling startApp function as soon as the window loads
window.addEventListener("load", startApp);

//creating a global variable that contains the url for the database
const endpoint = "https://test01-6591a-default-rtdb.europe-west1.firebasedatabase.app";

//creating a global variable which gets updated when calling the updatePostsGrid
let posts;

//startApp, first funtion called on loading window
async function startApp() {
  //Updating post and user grid
  updatePostsGrid();
  updateUsersGrid();

  //setting eventlisteners for creating post btns (showmodal & submit post creation)
  document.querySelector("#create-new-post-btn").addEventListener("click", showCreatePostDialog);
  document.querySelector("#create-new-post-form").addEventListener("submit", createPostClicked);

  //Setting evenlisteners for showing update post form submit btn (showing the update modal is called within the displayPost function since the element that contains the update btn is created there)
  document.querySelector("#update-post-form").addEventListener("submit", updatePostForm);

  //setting eventlistener for delete post form submit btn and for cancel btn
  document.querySelector("#delete-post-form").addEventListener("submit", deletePostFormClicked);
  document.querySelector("#delete-btn-cancel").addEventListener("click", closeDeleteDialog);
}

//    -------- EVENT FUNCTIONS --------    \\

//CREATE NEW POST
function showCreatePostDialog(event) {
  event.preventDefault(); // prevents page from being reloaded

  document.querySelector("#create-new-post-dialog").showModal();
}

function createPostClicked(event) {
  const form = event.target;

  const title = form.title.value;
  const image = form.image.value;
  const body = form.body.value;

  createPost(title, image, body);

  form.reset();
  document.querySelector("#create-new-post-dialog").close();
}

async function createPost(title, image, body) {
  //creating a new object/post based on the arguments given to the parameters
  const newPost = {
    title: title,
    image: image,
    body: body,
  };

  //converting the new object/post to json before "POST" to database
  const newPostAsJson = JSON.stringify(newPost);
  console.log(newPostAsJson);

  //posting the new object/post to the database via fetch function with the "POST" method
  const response = await fetch(`${endpoint}/posts.json`, {
    method: "Post",
    body: newPostAsJson,
  });

  //Checking if response is `ok` and if it is then the grid of posts is updated
  if (response.ok) {
    updatePostsGrid();
  }
}

//UPDATE POST
async function updatePostForm(event) {
  //preventing page from reloading
  event.preventDefault();

  //creating a variable that points to the event that lead here (event = form)
  const form = event.target;

  //creating variables
  const title = form.title.value;
  const image = form.image.value;
  const body = form.body.value;

  const id = form.getAttribute("data-id");

  //calling the updatePost function with the parameters from form-variables
  updatePost(id, title, image, body);

  //closing the dialog view
  document.querySelector("#update-post-dialog").close();
}

async function updatePost(id, title, image, body) {
  //creating a JavaScript object with the passed parameters title, body, image
  const postToUpdate = { title, body, image };

  //converting the JS object to a JSON string-syntax
  const postUpdateToJson = JSON.stringify(postToUpdate);

  //Using fetch to "PUT"/update the database with the new post
  const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "PUT", body: postUpdateToJson });

  //checking if the fetch response is `ok` and if true then call updatePostGrid
  if (response.ok) {
    console.log("post has been updated!");
    updatePostsGrid();
  }
}

//DELETE POST
function deletePostFormClicked(event) {
  //creating a variable that holds the data id and passes as an argument when calling deletePost
  const id = event.target.getAttribute("data-id");

  //calling deletePost
  deletePost(id);
}

async function deletePost(id) {
  //fetching database to delete specific post id
  const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "DELETE" });

  //checking the response delete fetch request is ok and calling updatePostGrid
  if (response.ok) {
    updatePostsGrid();
  }
}

function closeDeleteDialog() {
  document.querySelector("#delete-post-dialog").close();
}

//    -------- POST FUNCTIONS --------    \\

//GETTING POSTS
async function getPosts() {
  //fetching database
  const response = await fetch(`${endpoint}/posts.json`);
  //creating a variable that holds the database objects converted to json
  const data = await response.json();
  //console.log(data);

  //creating a variable that holds the database objects which has now each gotten an id
  const allPostsArray = preparePostData(data);

  return allPostsArray;
}

//giving each dataobject an id??
function preparePostData(dataObject) {
  const postArray = [];

  for (const key in dataObject) {
    const post = dataObject[key];
    //console.log("post is:" + post);
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

  //document.querySelector("#create-new-post-btn").addEventListener("click", createPostClicked);
  document.querySelector("#post:last-child .update").addEventListener("click", updatePostClicked);
  document.querySelector("#post:last-child .delete").addEventListener("click", deletePostClicked);

  //UPDATE POST
  function updatePostClicked() {
    //console.log("post update btn clicked...");
    // const title = "Dostojevskij";
    // const image = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Dostoevsky_140-190_for_collage.jpg";
    // const body = "A great writer!";
    // updatePost(post.id, title, image, body);

    //creating a variable that points to the form element
    const form = document.querySelector("#update-post-form");

    //the dialog inputs are set to the equivalent of the last-child post
    form.title.value = post.title;
    form.image.value = post.image;
    form.body.value = post.body; //the post fetched from database has a property called body and here it is set as the body value in the update form (beware of change from "body" to "body")

    //the last-child post is given an id
    form.setAttribute("data-id", post.id);

    //Showing the update dialog window
    document.querySelector("#update-post-dialog").showModal();
  }

  // async function updatePost(id, title, image, body) {
  //   console.log("updating post...");
  //   const postToUpdate = { title, body, image };
  //   const postUpdateToJson = JSON.stringify(postToUpdate);

  //   const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "PUT", body: postUpdateToJson });

  //   if (response.ok) {
  //     console.log("post has been updated!");
  //     updatePostsGrid();
  //   }
  // }

  //DELETE POST
  function deletePostClicked() {
    //setting the paragraph #dialog-delete-title to the last-child post clicked
    document.querySelector("#dialog-delete-title").textContent = post.title;

    //setting an id...??
    document.querySelector("#delete-post-form").setAttribute("data-id", post.id);

    //showing the dialog window
    document.querySelector("#delete-post-dialog").showModal();
  }

  // async function deletePost(id) {
  //   const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "DELETE" });
  //   if (response.ok) {
  //     console.log("post deleted!");
  //     updatePostsGrid();
  //   }
  // }
}

async function updatePostsGrid() {
  posts = await getPosts();
  //displayPost(posts);
  displayPosts(posts);
}

//DISPLAY POSTS
function displayPosts(posts) {
  document.querySelector("#posts-container").innerHTML = "";
  for (const element of posts) {
    displayPost(element);
  }
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

function displayUser(allUsers) {
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

async function updateUsersGrid() {
  const users = await getUsers();
  displayUsers(users);
}

function displayUsers(allUsers) {
  document.querySelector("#users-container").innerHTML = "";
  for (const user of allUsers) {
    displayUser(user);
  }
}

function userDetailView() {
  console.log("user clicked for detailed view...");
}
