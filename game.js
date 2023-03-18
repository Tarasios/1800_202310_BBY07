// Get canvas element, set its dimensions to fill the window, and get its 2D context
const canvas = document.getElementById("imageCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingQuality = "high";

// Load an image and initialize its scale factor
const image = new Image();
image.src = "./images/background.jpg";
let scaleFactor;

let zoomedSquareIndex = null;
const defaultScaleFactor = 1;

// Define squares with their position and dimensions
const squares = [
  { x: 100, y: 100, width: 50, height: 50 },
  { x: 1200, y: 500, width: 50, height: 50 },
  { x: 1050, y: 1700, width: 50, height: 50 },
];

// Draw the image and squares on the canvas when the image has loaded
image.onload = () => {
  scaleFactor = canvas.height / image.height; // Set initial scale factor to fit the image height to the canvas height
  ctx.drawImage(image, 0, 0, image.width * scaleFactor, canvas.height); // Draw the image
  squares.forEach((square) => {
    drawSquare(square); // Draw each square
  });
};

// Variables for panning and zooming
let isPanning = false;
let startX, startY;
let offsetX = 0;
let offsetY = 0;
let isZoomed = false;

// Start panning when the pointer (mouse or touch) is pressed down on the canvas
function startPanning(e) {
  if (isZoomed) return; // Prevent panning when the image is zoomed in
  e.preventDefault(); // Prevent default behavior (e.g. scrolling on touch devices)
  isPanning = true;
  // Store the initial pointer position
  if (e.type === "touchstart") {
    startX = e.touches[0].clientX - offsetX;
    startY = e.touches[0].clientY - offsetY;
  } else {
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }
}

// Pan the image while the pointer is being moved
function panImage(e) {
  e.preventDefault();
  if (!isPanning) return; // Only pan when the pointer is pressed down
  let newOffsetX, newOffsetY;
  // Calculate new offsets based on the difference between the current and initial pointer positions
  if (e.type === "touchmove") {
    newOffsetX = e.touches[0].clientX - startX;
    newOffsetY = e.touches[0].clientY - startY;
  } else {
    newOffsetX = e.clientX - startX;
    newOffsetY = e.clientY - startY;
  }

  // Prevent panning the image beyond its edges
  const scaledWidth = image.width * scaleFactor;
  const scaledHeight = canvas.height; // Since we scale the image to the canvas height
  if (newOffsetX > 0) newOffsetX = 0;
  if (newOffsetY > 0) newOffsetY = 0;
  if (newOffsetX < -(scaledWidth - canvas.width))
    newOffsetX = -(scaledWidth - canvas.width);
  if (newOffsetY < -(scaledHeight - canvas.height))
    newOffsetY = -(scaledHeight - canvas.height);

  offsetX = newOffsetX;
  offsetY = newOffsetY;

  console.log("offsetX:", offsetX, "offsetY:", offsetY);
  //draw a square on the center of the canvas

  redrawImage(); // Redraw the image with the updated offsets
  ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
  console.log(offsetX + canvas.width / 2);
}

// Stop panning when the pointer is released or leaves the canvas
function stopPanning() {
  isPanning = false;
}

// Draw a square on the canvas
function drawSquare(square) {
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(
    offsetX + square.x * scaleFactor,
    offsetY + square.y * scaleFactor,
    square.width * scaleFactor,
    square.height * scaleFactor
  );
}

// Get pointer coordinates (mouse or touch)
function getPointerCoordinates(e) {
  if (e.type === "touchstart") {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else {
    return { x: e.clientX, y: e.clientY };
  }
}

// Zoom in on a square when clicked or tapped
function zoomOnSquareClick(e) {
  const { x: mouseX, y: mouseY } = getPointerCoordinates(e);

  squares.forEach((square, index) => {
    const left = offsetX + square.x * scaleFactor;
    const right = left + square.width * scaleFactor;
    const top = offsetY + square.y * scaleFactor;
    const bottom = top + square.height * scaleFactor;

    if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
      console.log(`Square ${index + 1} clicked.`, square);
      if (zoomedSquareIndex === index) {
        // Zoom out
        isZoomed = false;
        zoomedSquareIndex = null;
        zoomTo(defaultScaleFactor, square); // Pass the clicked square
      } else {
        // Zoom in
        isZoomed = true;
        zoomedSquareIndex = index;
        const zoomLevel = 3; // Set the desired zoom level
        zoomTo(zoomLevel, square); // Pass the clicked square
      }
    }
  });
}

// Zoom to a specific scale factor and center on a specific square
function zoomTo(targetScaleFactor, square) {
  const newScaleFactor = targetScaleFactor * (canvas.height / image.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const squareCenterX = square.x + square.width / 2;
  const squareCenterY = square.y + square.height / 2;

  offsetX = centerX - squareCenterX * newScaleFactor;
  offsetY = centerY - squareCenterY * newScaleFactor;

  scaleFactor = newScaleFactor;

  const scaledWidth = image.width * scaleFactor;
  const scaledHeight = image.height * scaleFactor;

  if (offsetX > 0) offsetX = 0;
  if (offsetY > 0) offsetY = 0;
  if (offsetX < -(scaledWidth - canvas.width)) offsetX = -(scaledWidth - canvas.width);
  if (offsetY < -(scaledHeight - canvas.height)) offsetY = -(scaledHeight - canvas.height);
  redrawImage(); // Redraw the image with the updated scale factor and offsets
}

// Add event listeners for panning and zooming
canvas.addEventListener("mousedown", (e) => {
  zoomOnSquareClick(e);
  startPanning(e);
});
canvas.addEventListener("mousemove", panImage);
canvas.addEventListener("mouseup", stopPanning);
canvas.addEventListener("mouseleave", stopPanning);

canvas.addEventListener("touchstart", (e) => {
  zoomOnSquareClick(e);
  startPanning(e);
});
canvas.addEventListener("touchmove", panImage);
canvas.addEventListener("touchend", stopPanning);
canvas.addEventListener("touchcancel", stopPanning);

// Redraw the image and squares on the canvas with the updated scale factor and offsets
function redrawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    offsetX,
    offsetY,
    image.width * scaleFactor,
    image.height * scaleFactor
  ); // Draw the image with the updated scale factor and offsets
  ctx.fillRect(canvas.width / 2, canvas.height / 2, 5, 5);
  squares.forEach((square) => {
    drawSquare(square); // Draw each square with the updated scale factor and offsets
  });
}
