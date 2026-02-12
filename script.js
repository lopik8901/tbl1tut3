const textarea = document.getElementById("message");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const charLimitFlag = document.getElementById("charLimitFlag");
const charsOut = document.getElementById("charsOut");
const limitOut = document.getElementById("limitOut");
const manualOut = document.getElementById("manualOut");
const recursiveOut = document.getElementById("recursiveOut");
const traceList = document.getElementById("traceList");
const traceNote = document.getElementById("traceNote");

const sampleMessage =
  "When I present tomorrow I want a clear practical demo that shows how a chat app trims messages by words and characters while keeping the output readable and precise for users watching the walkthrough.";

function limitChars(message, limit = 160) {
  if (message.length <= limit) {
    return message;
  }
  return message.slice(0, limit);
}

function limit_words(message, limit = 20) {
  const trimmed = message.trim();
  if (!trimmed) {
    return "";
  }
  const words = trimmed.split(/\s+/);
  if (words.length <= limit) {
    return message;
  }
  return words.slice(0, limit).join(" ");
}

function manual(message, limit = 20) {
  let count = 0;
  let inWord = false;
  for (let i = 0; i < message.length; i += 1) {
    const isSpace = /\s/.test(message[i]);
    if (!isSpace && !inWord) {
      count += 1;
      if (count === limit + 1) {
        return message.slice(0, i).trimEnd();
      }
      inWord = true;
    }
    if (isSpace) {
      inWord = false;
    }
  }
  return message;
}

function recursiveLimit(message, limit = 20) {
  const trimmed = message.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];
  const steps = [];

  function helper(index, acc) {
    steps.push({
      index,
      accLen: acc.length,
      next: index < words.length ? words[index] : null,
    });
    if (index >= words.length || acc.length === limit) {
      return acc;
    }
    return helper(index + 1, acc.concat(words[index]));
  }

  const resultWords = helper(0, []);
  return {
    result: resultWords.join(" "),
    steps,
  };
}

function countWordsManual(message) {
  let count = 0;
  let inWord = false;
  for (let i = 0; i < message.length; i += 1) {
    const isSpace = /\s/.test(message[i]);
    if (!isSpace && !inWord) {
      count += 1;
      inWord = true;
    }
    if (isSpace) {
      inWord = false;
    }
  }
  return count;
}

function setResult(element, value) {
  if (value.length === 0) {
    element.textContent = "(empty)";
    element.classList.add("empty");
  } else {
    element.textContent = value;
    element.classList.remove("empty");
  }
}

function renderTrace(steps, limit) {
  traceList.innerHTML = "";
  const maxSteps = 12;
  const showSteps = steps.slice(0, maxSteps);

  showSteps.forEach((step, idx) => {
    const isStop = step.next === null || step.accLen >= limit;
    const item = document.createElement("div");
    item.className = `trace-item${isStop ? " stop" : ""}`;

    const stepEl = document.createElement("span");
    stepEl.className = "trace-step";
    stepEl.textContent = `#${idx + 1}`;

    const actionEl = document.createElement("span");
    actionEl.textContent = isStop
      ? "stop"
      : `take "${step.next}"`;

    const detailEl = document.createElement("span");
    detailEl.className = "muted";
    detailEl.textContent = isStop
      ? `${step.accLen} words kept`
      : `${step.accLen + 1} words kept`;

    item.append(stepEl, actionEl, detailEl);
    traceList.appendChild(item);
  });

  if (steps.length === 0) {
    traceNote.textContent = "0 calls";
  } else if (steps.length > maxSteps) {
    traceNote.textContent = `Showing first ${maxSteps} calls`;
  } else {
    traceNote.textContent = `${steps.length} calls`;
  }
}

function update() {
  const message = textarea.value;
  const wordTotal = countWordsManual(message);

  charCount.textContent = `${message.length} chars`;
  wordCount.textContent = `${wordTotal} words`;

  const overBy = message.length - 160;
  if (overBy > 0) {
    charLimitFlag.textContent = `over 160 by ${overBy}`;
    charLimitFlag.classList.add("warn");
    charLimitFlag.classList.remove("good");
  } else {
    charLimitFlag.textContent = "fits 160";
    charLimitFlag.classList.add("good");
    charLimitFlag.classList.remove("warn");
  }

  setResult(charsOut, limitChars(message, 160));
  setResult(limitOut, limit_words(message, 20));
  setResult(manualOut, manual(message, 20));

  const recursiveResult = recursiveLimit(message, 20);
  setResult(recursiveOut, recursiveResult.result);
  renderTrace(recursiveResult.steps, 20);
}

textarea.addEventListener("input", update);

document.getElementById("sampleBtn").addEventListener("click", () => {
  textarea.value = sampleMessage;
  update();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  textarea.value = "";
  update();
});

textarea.value = sampleMessage;
update();
