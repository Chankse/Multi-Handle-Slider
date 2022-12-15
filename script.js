const snapPoints = [
  0, 11, 19.3, 26.5, 33.8, 40.9, 47.7, 50, 54.4, 60.5, 66.3, 72.2, 76, 80, 83.9,
  87.4, 90.4, 93.3, 96, 98.4, 100,
];
const inputs = [];
const thumbs = [];

const n = 5;

const sliderWrapper = document.querySelector(".slider-wrapper");
const slider = document.querySelector(".slider");
const snapPointsWrapper = document.querySelector(".snap-points");
const plusButtonLeft = document.querySelector(".plus-left");
const plusButtonRight = document.querySelector(".plus-right");
const toggleButton = document.querySelector(".toggle");

let buttonsDisabled = false;
let snapPointsShown = true;

function init() {
  for (let i = 0; i < n; i++) {
    const index = Math.ceil(((snapPoints.length - 1) * (i + 1)) / n) - 1;
    createInputAndHandler(index);
  }
}

function addInputListeners(input) {
  input.addEventListener("input", onMouseMove.bind(this));
  input.addEventListener("mousedown", onMouseDown.bind(this));
  input.addEventListener("mouseup", onMouseUp.bind(this));
}
function addPlusButtonListeners() {
  plusButtonLeft.addEventListener("click", onLeftPlusButtonClick.bind(this));
  plusButtonRight.addEventListener("click", onRightPlusButtonClick.bind(this));
  toggleButton.addEventListener("click", onToggleButtonClick.bind(this));
}

function addSnapPoints() {
  snapPoints.forEach((point, i) => {
    const el = document.createElement("span");
    const p = document.createElement("p");
    p.innerText = point;
    el.style.left = `${point}%`;
    el.appendChild(p);
    snapPointsWrapper.append(el);
  });
}

function onMouseMove(event) {
  updateThumb(event.currentTarget, event.currentTarget.thumb);
}

function onMouseDown(event) {
  slider.removeChild(event.currentTarget.thumb);
  slider.appendChild(event.currentTarget.thumb);
}

function onMouseUp(event) {
  const closest = snapPoints.reduce(function (prev, curr) {
    return Math.abs(curr - event.currentTarget.value) <
      Math.abs(prev - event.currentTarget.value)
      ? curr
      : prev;
  });
  const removeThumb = this.checkForThumbRemove(closest, event.currentTarget);
  if (removeThumb) {
    removeInputAndHandler(event);
  } else {
    event.currentTarget.value = closest;
    updateThumb(event.currentTarget, event.currentTarget.thumb);
  }
}

function updateThumb(input, thumb) {
  const percent = (
    ((input.value - input.min) / (input.max - input.min)) *
    100
  ).toFixed(1);
  thumb.style.left = `${percent}%`;
  thumb.innerText = percent;
}

function checkForThumbRemove(closest, input) {
  return inputs.some((el) => el !== input && el.value == closest);
}

function onLeftPlusButtonClick() {
  const index = snapPoints.findIndex(
    (point) => !inputs.some((input) => input.value == point)
  );
  console.log(index);
  if (index > -1) createInputAndHandler(index);
  updatePlusButtons();
}

function onRightPlusButtonClick() {
  const index = snapPoints.findLastIndex(
    (point) => !inputs.some((input) => input.value == point)
  );
  console.log(index);
  if (index > -1) createInputAndHandler(index);
  updatePlusButtons();
}

function createInputAndHandler(index) {
  const input = document.createElement("input");
  input.type = "range";
  input.step = 0.1;
  input.min = 0;
  input.max = 100;
  input.value = snapPoints[index];
  sliderWrapper.appendChild(input);
  inputs.push(input);

  const thumb = document.createElement("div");
  thumb.classList.add("thumb");
  updateThumb(input, thumb);
  console.log(thumb.style.left);
  slider.appendChild(thumb);
  thumbs.push(thumb);

  input.thumb = thumb;

  addInputListeners(input);
}

function removeInputAndHandler(event) {
    sliderWrapper.removeChild(event.currentTarget);
    slider.removeChild(event.currentTarget.thumb);
    inputs.splice(inputs.indexOf(event.currentTarget), 1);
    thumbs.splice(thumbs.indexOf(event.currentTarget.thumb), 1);
    updatePlusButtons();   
}

function updatePlusButtons() {
  if (inputs.length === snapPoints.length && !buttonsDisabled) {
    plusButtonLeft.classList.add("disabled");
    plusButtonRight.classList.add("disabled");
    buttonsDisabled = true;
  }

  if (buttonsDisabled && inputs.length < snapPoints.length) {
    plusButtonLeft.classList.remove("disabled");
    plusButtonRight.classList.remove("disabled");
    buttonsDisabled = false;
  }
}

function onToggleButtonClick() {
    snapPointsShown? snapPointsWrapper.classList.add('hide') : snapPointsWrapper.classList.remove('hide'); 
    snapPointsShown = !snapPointsShown;
}

init();
addPlusButtonListeners();
addSnapPoints();
