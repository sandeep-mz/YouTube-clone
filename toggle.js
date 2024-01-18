const themeToggle = document.getElementById("themetoggle");
const navElement = document.querySelector("nav");
const spanElement = document.querySelector("span");

themeToggle.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  navElement.classList.toggle("dark-mode");
  spanElement.classList.toggle("dark-mode");
});


