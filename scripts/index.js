let zoom = false;

document.getElementById("lawnmower").addEventListener("click", function () {
  zoom = true;
  backButton();
  document.getElementById("background").style.transform = "scale(3)";
  document.getElementById("lawnmower").style.opacity = 1;
  document
    .getElementById("lawnmower")
    .scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
});

const backButton = () => {
  document.getElementById("back-button").style.display = "block";
  document.getElementById("back-button").addEventListener("click", function () {
    zoom = false;
    document.getElementById("background").style.transform = "scale(1)";
    document.getElementById("lawnmower").style.opacity = 0;
    document.getElementById("back-button").style.display = "none";
  });
};
