const canvas = document.getElementById("imageCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingQuality = "high";

const image = new Image();
image.src = "./images/background.jpg";

let scaleFactor;

image.onload = () => {
  scaleFactor = canvas.height / image.height;
  ctx.drawImage(image, 0, 0, image.width * scaleFactor, canvas.height);
  squares.forEach((square) => {
    drawSquare(square);
  });
};

let isPanning = false;
let startX, startY;
let offsetX = 0;
let offsetY = 0;
let isZoomed = false;

function startPanning(e) {
  if (isZoomed) return;
  e.preventDefault();
  isPanning = true;
  if (e.type === "touchstart") {
    startX = e.touches[0].clientX - offsetX;
    startY = e.touches[0].clientY - offsetY;
  } else {
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }
}

function panImage(e) {
  e.preventDefault();
  if (!isPanning) return;
  let newOffsetX, newOffsetY;
  if (e.type === "touchmove") {
    newOffsetX = e.touches[0].clientX - startX;
    newOffsetY = e.touches[0].clientY - startY;
  } else {
    newOffsetX = e.clientX - startX;
    newOffsetY = e.clientY - startY;
  }

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

  redrawImage();
}

function stopPanning() {
  isPanning = false;
}

const squares = [
  { x: 100, y: 100, width: 50, height: 50 },
  { x: 200, y: 200, width: 50, height: 50 },
  { x: 1050, y: 1700, width: 50, height: 50 },
];

function drawSquare(square) {
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(
    offsetX + square.x * scaleFactor,
    offsetY + square.y * scaleFactor,
    square.width * scaleFactor,
    square.height * scaleFactor
  );
}

function getPointerCoordinates(e) {
  if (e.type === "touchstart") {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else {
    return { x: e.clientX, y: e.clientY };
  }
}

let zoomedSquareIndex = null;
const defaultScaleFactor = 1;

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
        zoomTo(defaultScaleFactor, canvas.width / 2, canvas.height / 2);
      } else {
        // Zoom in
        isZoomed = true;
        zoomedSquareIndex = index;
        const zoomCenterX = mouseX;
        const zoomCenterY = mouseY;
        const zoomLevel = 4; // Set desired zoom level
        zoomTo(zoomLevel, zoomCenterX, zoomCenterY);
      }
    }
  });
}


function zoomTo(targetScaleFactor, centerX, centerY) {
  const newScaleFactor = targetScaleFactor * (canvas.height / image.height);

  offsetX = centerX - ((centerX - offsetX) * newScaleFactor) / scaleFactor;
  offsetY = centerY - ((centerY - offsetY) * newScaleFactor) / scaleFactor;


  scaleFactor = newScaleFactor;

  const scaledWidth = image.width * scaleFactor;
  const scaledHeight = image.height * scaleFactor;

  if (offsetX > 0) offsetX = 0;
  if (offsetY > 0) offsetY = 0;
  if (offsetX < -(scaledWidth - canvas.width)) offsetX = -(scaledWidth - canvas.width);
  if (offsetY < -(scaledHeight - canvas.height)) offsetY = -(scaledHeight - canvas.height);

  redrawImage();
}

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

function redrawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    offsetX,
    offsetY,
    image.width * scaleFactor,
    image.height * scaleFactor
  );
  squares.forEach((square) => {
    drawSquare(square);
  });
}
