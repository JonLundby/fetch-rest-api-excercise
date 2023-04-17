"use strict";

window.addEventListener("load", startApp);

const endpoint = "https://test01-6591a-default-rtdb.europe-west1.firebasedatabase.app";
const arrayExample = [2, 6, 2, 1];

async function startApp() {
  console.log("window loaded and startApp called...");

  const allPosts = await getPosts();

  console.log(allPosts);
  console.log(arrayExample);
}

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();

  return data;
}
