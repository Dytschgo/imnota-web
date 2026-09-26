// Record installer intent without delaying or changing the download link.
function trackDownload(event) {
  if (event.type === "auxclick" && event.button !== 1) return;
  const link = event.target.closest("a[data-download-os]");
  if (!link || typeof window.plausible !== "function") return;
  window.plausible("Download", { props: { os: link.dataset.downloadOs } });
}
document.addEventListener("click", trackDownload);
document.addEventListener("auxclick", trackDownload);

// Progressive enhancement: all installation instructions are readable without JS.
const tabs = [...document.querySelectorAll(".install-tabs a")];
const panels = [...document.querySelectorAll(".install-panel")];
const tabList = document.querySelector(".install-tabs");
function selectTab(tab, focus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.querySelector(item.hash).hidden = !selected;
  });
  if (focus) tab.focus();
}
if (tabList) {
  tabList.setAttribute("role", "tablist");
  tabList.parentElement.classList.add("tabs-enhanced");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", tab.hash.slice(1));
    panels[index].setAttribute("role", "tabpanel");
    panels[index].tabIndex = 0;
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      selectTab(tab);
    });
    tab.addEventListener("keydown", (event) => {
      let target;
      if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        target = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = tabs.length - 1;
      if (target !== undefined) {
        event.preventDefault();
        selectTab(tabs[target], true);
      }
      if (event.key === " ") {
        event.preventDefault();
        selectTab(tab);
      }
    });
  });
  const activateHash = () => {
    const tab = tabs.find((item) => item.hash === location.hash);
    if (tab) selectTab(tab);
  };
  selectTab(tabs.find((tab) => tab.hash === location.hash) || tabs[0]);
  window.addEventListener("hashchange", activateHash);
  document.querySelectorAll("[data-install-target]").forEach((link) => {
    link.addEventListener("click", () =>
      selectTab(document.querySelector(`#tab-${link.dataset.installTarget}`)),
    );
  });
}
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.hidden = false;
  let reset;
  button.addEventListener("click", async () => {
    const code = document.getElementById(button.dataset.copy);
    const status = document.getElementById("copy-status");
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = "Copied!";
      button.classList.add("copied");
      status.textContent = "Commands copied to clipboard.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      code.parentElement.focus();
      button.textContent = "Select & copy";
      status.textContent =
        "Clipboard access is unavailable. The command is selected. Press Ctrl+C or Command+C to copy.";
    }
    reset = setTimeout(() => {
      button.textContent = "Copy";
      button.classList.remove("copied");
    }, 3000);
  });
});
const menu = document.querySelector(".mobile-menu");
if (menu) {
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.open = false;
    }),
  );
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) menu.open = false;
  });
}

// Homepage motion: a hero screen that settles flat as you scroll, a looping
// product film, words that light up as you read and the active workflow step.
// Everything is complete without JavaScript; reduced motion and Save-Data
// keep the static poster and the fully lit text.
const homeRoot = document.documentElement;
const homeReducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const homeConnection = navigator.connection;
const heroScreen = document.querySelector("[data-tilt]");
const heroVideo = document.querySelector("[data-autoplay-loop]");
const litText = document.querySelector("[data-lit]");
const steps = [...document.querySelectorAll("[data-steps] > .step")];
if (heroScreen || litText || steps.length) {
  let homeActive = false;
  let homeFrame;
  let heroVisible = false;
  const clamp = (value) => Math.min(1, Math.max(0, value));
  let words = [];
  if (litText) {
    const text = litText.textContent.trim().replace(/\s+/g, " ");
    litText.setAttribute("aria-label", text);
    litText.textContent = "";
    words = text.split(" ").map((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      if (index) litText.append(" ");
      litText.append(span);
      return span;
    });
  }
  const updateHome = () => {
    homeFrame = undefined;
    if (!homeActive) return;
    if (heroScreen) {
      const top = heroScreen.getBoundingClientRect().top;
      const tilt = clamp(1 - (top - innerHeight * 0.12) / (innerHeight * 0.6));
      heroScreen.style.setProperty("--tilt", tilt.toFixed(3));
    }
    if (litText) {
      const box = litText.getBoundingClientRect();
      const progress = clamp(
        (innerHeight * 0.82 - box.top) / (box.height + innerHeight * 0.3),
      );
      const lit = Math.round(progress * words.length);
      words.forEach((word, index) =>
        word.classList.toggle("is-lit", index < lit),
      );
      litText.dataset.litProgress = progress.toFixed(3);
    }
  };
  const requestHome = () => {
    if (homeActive && !homeFrame) homeFrame = requestAnimationFrame(updateHome);
  };
  const syncVideo = () => {
    if (!heroVideo) return;
    if (homeActive && heroVisible && !document.hidden) {
      if (heroVideo.preload !== "auto") heroVideo.preload = "auto";
      heroVideo.play().catch(() => {
        heroVideo.dataset.videoState = "unavailable";
      });
    } else if (!heroVideo.paused) heroVideo.pause();
    if (!homeActive) {
      heroVideo.classList.remove("is-playing");
      heroVideo.dataset.videoState = "static";
    }
  };
  if (heroVideo) {
    heroVideo.addEventListener("playing", () => {
      heroVideo.classList.add("is-playing");
      heroVideo.dataset.videoState = "playing";
    });
    heroVideo.addEventListener("pause", () => {
      if (homeActive) heroVideo.dataset.videoState = "paused";
    });
    heroVideo.addEventListener("error", () => {
      heroVideo.dataset.videoState = "unavailable";
    });
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      syncVideo();
    }).observe(heroVideo);
  }
  const setHomeMode = () => {
    homeActive = !homeReducedMotion.matches && !homeConnection?.saveData;
    homeRoot.classList.toggle("motion-enhanced", homeActive);
    if (!homeActive) {
      heroScreen?.style.setProperty("--tilt", "1");
      words.forEach((word) => word.classList.add("is-lit"));
      if (litText) litText.dataset.litProgress = "1";
      steps.forEach((step) => step.classList.add("is-active"));
    } else {
      steps.forEach((step) => step.classList.remove("is-active"));
      requestHome();
    }
    syncVideo();
  };
  if (steps.length) {
    const stepObserver = new IntersectionObserver(
      (entries) => {
        if (!homeActive) return;
        for (const entry of entries)
          entry.target.classList.toggle("is-active", entry.isIntersecting);
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    steps.forEach((step) => stepObserver.observe(step));
  }
  window.addEventListener("scroll", requestHome, { passive: true });
  window.addEventListener("resize", requestHome, { passive: true });
  document.addEventListener("visibilitychange", syncVideo);
  homeReducedMotion.addEventListener("change", setHomeMode);
  homeConnection?.addEventListener?.("change", setHomeMode);
  setHomeMode();
}

// Watch the film: jump to the player and start it with sound.
document.querySelectorAll("[data-play-film]").forEach((link) => {
  link.addEventListener("click", () => {
    const film = document.getElementById("film-video");
    if (film) film.play().catch(() => {});
  });
});

// Play short, finite scenes as they enter view. The underlying content is
// always visible; interrupted scenes settle immediately for reduced motion.
const motionScenes = [...document.querySelectorAll("[data-motion]")];
if (
  motionScenes.length &&
  "IntersectionObserver" in window &&
  Element.prototype.animate
) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  const scenes = motionScenes.map((element) => ({
    element,
    visible: false,
    played: false,
    animations: [],
  }));
  let enabled = false;
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
  const enter = [
    { opacity: 0.4, transform: "translateY(18px)" },
    { opacity: 1, transform: "translateY(0)" },
  ];

  function playScene(scene) {
    scene.played = true;
    scene.element.dataset.revealState = "playing";
    const animate = (element, keyframes, duration, delay = 0) => {
      scene.animations.push(
        element.animate(keyframes, {
          duration,
          delay,
          easing,
          fill: "backwards",
        }),
      );
    };
    switch (scene.element.dataset.motion) {
      case "annotation":
        animate(
          scene.element,
          [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
          1100,
        );
        break;
      case "steps":
        [...scene.element.children].forEach((item, index) => {
          animate(item, enter, 650, index * 100);
        });
        break;
      case "intro":
        animate(scene.element.querySelector("h1"), enter, 750);
        break;
      case "cards":
        [...scene.element.children].forEach((item, index) => {
          animate(
            item,
            [
              { opacity: 0.35, transform: "translateY(40px) scale(0.97)" },
              { opacity: 1, transform: "none" },
            ],
            1100,
            index * 120,
          );
        });
        break;
    }
    Promise.allSettled(
      scene.animations.map((animation) => animation.finished),
    ).then(() => {
      scene.animations = [];
      scene.element.dataset.revealState = enabled ? "complete" : "static";
    });
  }

  function reconcile(scene) {
    if (!enabled) {
      scene.animations.forEach((animation) => animation.cancel());
      scene.animations = [];
      scene.element.dataset.revealState = "static";
      return;
    }
    const visible = scene.visible && !document.hidden;
    if (visible && !scene.played) playScene(scene);
    else if (scene.animations.length) {
      scene.animations.forEach((animation) => {
        if (visible && animation.playState === "paused") animation.play();
        else if (!visible && animation.playState === "running")
          animation.pause();
      });
      scene.element.dataset.revealState = visible ? "playing" : "paused";
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const scene = scenes.find((item) => item.element === entry.target);
        scene.visible = entry.isIntersecting;
        reconcile(scene);
      }
    },
    { threshold: 0 },
  );
  scenes.forEach((scene) => observer.observe(scene.element));
  const setMode = () => {
    enabled = !reducedMotion.matches && !connection?.saveData;
    document.documentElement.dataset.motionMode = enabled ? "full" : "static";
    scenes.forEach(reconcile);
  };
  reducedMotion.addEventListener("change", setMode);
  connection?.addEventListener?.("change", setMode);
  document.addEventListener("visibilitychange", () =>
    scenes.forEach(reconcile),
  );
  setMode();
}
