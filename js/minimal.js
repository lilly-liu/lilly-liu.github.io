const typingName = document.querySelector("#typing-name");

if (typingName) {
  const phrases = ["Lilly", "刘丽达", "silly lilly", "lils"];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector(".typing-toggle");
  const greeting = document.querySelector(".typing-greeting");
  let index = 0;
  let length = Array.from(phrases[0]).length;
  let deleting = true;
  let paused = false;
  let timer;

  const schedule = (delay) => {
    clearTimeout(timer);
    if (!motion.matches && !paused && !document.hidden) {
      timer = setTimeout(step, delay);
    }
  };

  function step() {
    const letters = Array.from(phrases[index]);
    length += deleting ? -1 : 1;
    typingName.textContent = letters.slice(0, length).join("");

    if (length === 0 && deleting) {
      index = (index + 1) % phrases.length;
      deleting = false;
      schedule(350);
    } else if (length === letters.length && !deleting) {
      deleting = true;
      schedule(1700);
    } else {
      schedule(deleting ? 55 : 105);
    }
  }

  function sync() {
    clearTimeout(timer);
    toggle.hidden = motion.matches;
    greeting.classList.toggle(
      "typing-paused",
      paused || document.hidden || motion.matches,
    );

    if (motion.matches) {
      index = 0;
      length = Array.from(phrases[0]).length;
      deleting = true;
      typingName.textContent = phrases[0];
    } else {
      schedule(1700);
    }
  }

  toggle.addEventListener("click", () => {
    paused = !paused;
    toggle.textContent = paused ? "Resume animation" : "Pause animation";
    sync();
  });
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
}
