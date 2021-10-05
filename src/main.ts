import "./styles.css";

const counterEl = document.getElementById("timer")!;
const mainButton = document.getElementById("mainButton")!;
const secondaryButton = document.getElementById("secondaryButton")!;
const lapTable = document.getElementById("lapTable")!;
let interval: number = 0;
let start = new Date(); // start time
let lap = 1;
let paused = 0;
let running = 0;
let difference = 0;
let savedTime = 0;
let updatedTime = 0;
const pad = (value: number) => {
  return value.toString().padStart(2, "0");
};

const calculateTime = (timeDifference: number, scale = 60) => {
  const total = Math.floor(timeDifference / scale);
  const time = timeDifference - total * scale;

  return { time, total };
};

const movingTime = () => {
  if (savedTime) {
    difference = updatedTime - start.valueOf() + savedTime;
  } else {
    difference = updatedTime - start.valueOf();
  }
  const timeDifference = new Date().valueOf() - start.valueOf();
  const milliseconds = calculateTime(timeDifference);
  const seconds = calculateTime(milliseconds.total);
  const minutes = calculateTime(seconds.total, 1000);

  return `${pad(minutes.time)}:${pad(seconds.time)}.${pad(milliseconds.time)}`;
};

const startStopwatch = () => {
  paused = 0;
  running = 1;
  counterEl.innerHTML = movingTime();
};

const stopStopwatch = () => {
  if (!paused) {
    clearInterval(interval);
    savedTime = difference;
    paused = 1;
    running = 0;
  } else {
    interval = setInterval(startStopwatch, 1000);
  }
};

const LapTime = () => {
  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");

  tr.id = `tr-${lap}`;
  td1.textContent = `Lap ${lap}`;
  td2.textContent = counterEl.textContent;

  tr.append(td1, td2);
  lapTable.appendChild(tr);
  lap++;
};

mainButton.onclick = () => {
  if (mainButton.className == "started") {
    mainButton.childNodes[0].replaceWith("Start");
    mainButton.className = "stopped";
    secondaryButton.className = "reset";
    secondaryButton.childNodes[0].replaceWith("Reset");

    stopStopwatch();
  } else {
    mainButton.childNodes[0].replaceWith("Stop");
    mainButton.className = "started";
    secondaryButton.className = "";
    secondaryButton.childNodes[0].replaceWith("Lap");
    interval = setInterval(startStopwatch, 1);
  }
};

secondaryButton.onclick = () => {
  if (secondaryButton.className == "reset") {
    clearInterval(interval);
    paused = 0;
    running = 0;
    start = new Date();
    counterEl.innerHTML = "00:00.00";
    lapTable.innerHTML = "";
  } else {
    LapTime();
  }
};
