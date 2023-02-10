document.getElementById("container").addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("main-container").style.display = "flex";
});

document.getElementById("menu-button").addEventListener("click", function () {
  document.getElementById("menu-container").style.display = "flex";
});

document.getElementById("menu-close-button").addEventListener("click", function () {
  document.getElementById("menu-container").style.display = "none";
});
