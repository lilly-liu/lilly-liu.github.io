/* Shared navigation and interactions. Content remains in static HTML for GitHub Pages. */
(() => {
  document.querySelectorAll(".listening-preview").forEach((preview) => {
    preview.addEventListener("toggle", () => {
      const player = preview.querySelector("iframe[data-src]");
      if (preview.open && player && !player.hasAttribute("src")) {
        player.src = player.dataset.src;
        preview.querySelector(".listening-note").textContent =
          "A current rotation from my playlists.";
      }
    });
  });
  const pages = [
    ["Home", "/"],
    ["Work", "/work/"],
    ["About", "/about/"],
    ["Now", "/now/"],
    ["Contact", "/contact/"],
  ];
  const current =
    location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  // Keep the old one-page section links useful, including links from hobby pages.
  const legacySections = {
    "#education": "/about/#education",
    "#experience": "/about/#experience",
    "#hobbies": "/now/#hobbies",
    "#resume": "/resume.pdf",
  };
  if (current === "/" && legacySections[location.hash])
    location.replace(legacySections[location.hash]);
  const active = (href) => (href.replace(/\/$/, "") || "/") === current;
  const link = ([name, href]) =>
    `<a href="${href}" ${active(href) ? 'aria-current="page"' : ""}>${name}</a>`;
  const brand = '<span class="monogram">LL</span><span>Lilly Liu</span>';
  const plant =
    '<svg class="plant" viewBox="0 0 48 64" fill="none" aria-hidden="true"><path d="M24 62V10" stroke="currentColor" stroke-width="1.5"/><path d="M24 40c0-8-6-13-14-14 0 8 6 13 14 14Zm0 0c0-8 6-13 14-14 0 8-6 13-14 14Zm0-14c0-7-5-11-12-12 0 7 5 11 12 12Zm0 0c0-7 5-11 12-12 0 7-5 11-12 12Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.2"/><circle cx="24" cy="8" r="4" fill="currentColor" fill-opacity=".4"/></svg>';
  document.querySelector("#site-header").innerHTML = `
    <nav class="container nav-inner" aria-label="Main navigation">
      <a class="brand" href="/" aria-label="Lilly Liu — home">${brand}</a>
      <div class="nav-links">${pages.map(link).join("")}</div>
      <div class="nav-actions"><button class="command-trigger" aria-label="Open command menu" aria-keyshortcuts="Meta+k Control+k"><kbd>⌘ K</kbd></button><a class="button button-primary button-small" href="/resume.pdf" download>⇩ Resume</a></div>
      <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/></svg></button>
    </nav><nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden>${pages.map(link).join("")}<a href="/resume.pdf" download>Download résumé</a></nav>`;
  document.querySelector("#site-footer").innerHTML = `
    <div class="container footer-grid">
      <div class="footer-bio"><a href="/" class="brand">${brand}</a><p>A software engineer building thoughtful systems with AI — and a small corner of the internet that keeps growing.</p>${plant}</div>
      <nav class="footer-column" aria-label="Footer pages"><span class="eyebrow">Pages</span>${pages.slice(1).map(link).join("")}</nav>
      <nav class="footer-column" aria-label="Elsewhere"><span class="eyebrow">Elsewhere</span><a href="https://github.com/lilly-liu">GitHub ↗</a><a href="https://www.linkedin.com/in/lillyyliu/">LinkedIn ↗</a><a href="mailto:lillyliu@berkeley.edu">Email ↗</a><a href="/resume.pdf" download>Resume ⇩</a></nav>
      <div class="footer-column"><span class="eyebrow">Currently</span><p>Building AI-native tools at Cambridge Mobile Telematics.</p><span class="status"><span class="status-dot"></span>Open to good problems</span></div>
    </div><div class="container footer-bottom"><p>© ${new Date().getFullYear()} Lilly Liu. Grown with care.</p><p>Designed &amp; built as an evolving internet garden.</p></div>`;
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const closeMenu = () => {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };
  toggle.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    toggle.setAttribute("aria-expanded", String(!menu.hidden));
    toggle.setAttribute("aria-label", menu.hidden ? "Open menu" : "Close menu");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      closeMenu();
      toggle.focus();
    }
  });
  matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
  document
    .querySelector("#contact-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.querySelector("#contact-name").value.trim();
      const message = document.querySelector("#contact-message").value.trim();
      if (!name || !message) {
        document.querySelector("#contact-status").textContent =
          "Please add your name and a message.";
        return;
      }
      const subject = encodeURIComponent(`A note from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}`);
      location.href = `mailto:lillyliu@berkeley.edu?subject=${subject}&body=${body}`;
      document.querySelector("#contact-status").textContent =
        "Your email draft is ready to open. Review and send it in your email app, or email lillyliu@berkeley.edu directly.";
    });
  const filters = [...document.querySelectorAll("[data-filter]")];
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filters.forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button)),
      );
      let shown = 0;
      document.querySelectorAll("[data-categories]").forEach((card) => {
        card.hidden =
          button.dataset.filter !== "all" &&
          !card.dataset.categories.split("|").includes(button.dataset.filter);
        if (!card.hidden) shown++;
      });
      document.querySelector("#filter-status").textContent =
        `Showing ${shown} ${shown === 1 ? "project" : "projects"}`;
    }),
  );
  const revealCase = () => {
    const id = location.hash.slice(1);
    const section = document.getElementById(id);
    if (section?.matches("details.case-study")) {
      section.open = true;
      requestAnimationFrame(() => section.scrollIntoView({ block: "start" }));
    }
  };
  addEventListener("hashchange", revealCase);
  revealCase();
  const dialog = document.createElement("dialog");
  dialog.setAttribute("aria-labelledby", "command-title");
  dialog.innerHTML = `<div class="dialog-heading"><h2 id="command-title">Where to?</h2><button class="dialog-close" aria-label="Close command menu">Esc</button></div><label class="sr-only" for="command-search">Search pages</label><input id="command-search" type="search" placeholder="Search pages…" autocomplete="off"><nav class="command-list" aria-label="Quick navigation">${pages.map(link).join("")}<a href="/resume.pdf" download>Download résumé</a></nav><p id="command-empty" hidden>No matching pages.</p>`;
  document.body.append(dialog);
  const openCommand = () => {
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("input").focus();
  };
  document
    .querySelector(".command-trigger")
    .addEventListener("click", openCommand);
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      dialog.open ? dialog.close() : openCommand();
    }
  });
  dialog.querySelector("input").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    dialog.querySelectorAll(".command-list a").forEach((a) => {
      a.hidden = !a.textContent.toLowerCase().includes(query);
    });
    dialog.querySelector("#command-empty").hidden = Boolean(
      dialog.querySelector(".command-list a:not([hidden])"),
    );
  });
  dialog.querySelector("input").addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      dialog.querySelector(".command-list a:not([hidden])")?.focus();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      dialog.querySelector(".command-list a:not([hidden])")?.click();
    }
  });
})();
