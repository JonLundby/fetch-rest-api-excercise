"use strict";

window.addEventListener("load", startApp);

const endpoint = "https://test01-6591a-default-rtdb.europe-west1.firebasedatabase.app";
//const arrayExample = [2, 6, 2, 1];

async function startApp() {
  console.log("window loaded and startApp called...");

  const allPosts = await getPosts();

  console.log(allPosts);
  for (const element of allPosts) {
    displayPosts(element);
  }
}

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
                      <div id="post-image"><img src="${allPosts.image}"></div>
                      <p id="post-title">${allPosts.title}</p>
                    </div>`;
  
  document.querySelector("#posts-container").insertAdjacentHTML("beforeend", postsGridItem);
}
