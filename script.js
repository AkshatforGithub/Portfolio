document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", () => {
    const dialog = document.getElementById(`case-${card.dataset.project}`);
    dialog?.showModal();
    requestAnimationFrame(() => {
      dialog?.querySelector(".case-shell")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  });
});

document.querySelectorAll("[data-slideshow]").forEach((slideshow) => {
  const slides = [...slideshow.querySelectorAll(".slideshow-frame img")];
  const caption = slideshow.querySelector(".slideshow-caption");
  const count = slideshow.querySelector(".slideshow-count");
  const dotsWrap = slideshow.querySelector(".slideshow-dots");
  const pad = (n) => String(n).padStart(2, "0");
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.dataset.slide = String(i);
    dot.setAttribute("aria-label", `Show slide ${i + 1}`);
    dotsWrap?.append(dot);
  });

  const dots = [...(dotsWrap?.querySelectorAll("button") ?? [])];

  const go = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    if (caption) caption.textContent = slides[index].dataset.caption || "";
    if (count) count.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
    slideshow.dataset.index = String(index);
  };

  slideshow.addEventListener("click", (e) => {
    const prev = e.target.closest("[data-slideshow-prev]");
    const next = e.target.closest("[data-slideshow-next]");
    const dot = e.target.closest("[data-slide]");
    if (!prev && !next && !dot) return;
    e.preventDefault();
    e.stopPropagation();
    if (prev) go(index - 1);
    else if (next) go(index + 1);
    else go(Number(dot.dataset.slide));
  });

  slideshow.go = go;
  go(0);
});

document.querySelectorAll(".case-study").forEach((dialog) => {
  dialog.addEventListener("toggle", () => {
    if (dialog.open) {
      dialog.querySelectorAll("[data-slideshow]").forEach((slideshow) => slideshow.go?.(0));
      requestAnimationFrame(() => {
        dialog.querySelector(".case-shell")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }
  });
  dialog.querySelector(".close-case")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelectorAll('a[href="#contact"]').forEach((link) => {
    link.addEventListener("click", () => dialog.close());
  });
});

document.addEventListener("keydown", (e) => {
  const slideshow = document.querySelector("dialog.case-study[open] [data-slideshow]");
  if (!slideshow?.go) return;
  if (e.key === "ArrowRight") slideshow.go(Number(slideshow.dataset.index || 0) + 1);
  if (e.key === "ArrowLeft") slideshow.go(Number(slideshow.dataset.index || 0) - 1);
});

const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = contactForm.querySelector(".form-status");
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const data = new FormData(contactForm);

  submitBtn.disabled = true;
  status.dataset.state = "pending";
  status.textContent = "Sending...";

  try {
    const res = await fetch(contactForm.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      contactForm.reset();
      status.dataset.state = "success";
      status.textContent = "Thanks — I'll get back to you soon.";
    } else {
      throw new Error("Form submission failed");
    }
  } catch (err) {
    status.dataset.state = "error";
    status.textContent = "Something went wrong sending that. Email me directly at akshat4work2004@gmail.com instead.";
  } finally {
    submitBtn.disabled = false;
  }
});
