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
  "Our world today faces two intertwined problems: the depletion of fossil fuels and widespread environmental degradation. They branch from how our economy is built. In our linear “take-make-waste” economy, we extract materials from the Earth, turn them into products, and then throw them away. This one-way model relies heavily on fossil fuels and leaves behind mountains of waste. The chemical industry sits right at the center of this system: powering it, supplying it, and amplifying both problems. In its current state, it is unsustainable.";

function limitChars(message, limit = 160) {
  if (message.length <= limit) {
    return message;
  }
  return message.slice(0, limit);
}

function limit_words(msg, limit = 20) {
  const trimmed = msg.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];
  const first = words.slice(0, limit).join(" ");
  const rest = words.slice(limit).join(" ");
  return [first, rest];
}

function manual(msg, limit = 20) {
  const words = [];
  let current = "";

  for (let i = 0; i < msg.length; i += 1) {
    const char = msg[i];
    if (/\s/.test(char)) {
      if (current) {
        words.push(current);
        current = "";
        if (words.length === limit) {
          break;
        }
      }
    } else {
      current += char;
    }
  }
  return words.join(" ");
}

function limit_words_recursive(words, limit, steps = null) {
  if (steps) {
    steps.push({
      remaining: words.length,
      next: words.length ? words[0] : null,
      limit,
    });
  }
  if (!words.length || limit === 0) {
    return [];
  }
  return [words[0]].concat(limit_words_recursive(words.slice(1), limit - 1, steps));
}

function wrapper(text, limit = 20) {
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  return limit_words_recursive(words, limit).join(" ");
}

function wrapperWithTrace(text, limit = 20) {
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const steps = [];
  const result = limit_words_recursive(words, limit, steps).join(" ");
  return { result, steps };
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
    const isStop = step.next === null || step.limit === 0 || step.remaining === 0;
    const item = document.createElement("div");
    item.className = `trace-item${isStop ? " stop" : ""}`;

    const stepEl = document.createElement("span");
    stepEl.className = "trace-step";
    stepEl.textContent = `#${idx + 1}`;

    const actionEl = document.createElement("span");
    actionEl.textContent = isStop ? "stop" : `take "${step.next}"`;

    const detailEl = document.createElement("span");
    detailEl.className = "muted";
    detailEl.textContent = isStop
      ? `${Math.max(limit - step.limit, 0)} words kept`
      : `${Math.max(limit - step.limit + 1, 1)} words kept`;

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
  const [first, rest] = limit_words(message, 20);
  const limitText = `Allowed: ${first || "(empty)"}\n\nRemainder: ${rest || "(none)"}`;
  setResult(limitOut, limitText);
  setResult(manualOut, manual(message, 20));

  const recursiveResult = wrapperWithTrace(message, 20);
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
