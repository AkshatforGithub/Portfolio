document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", () => {
    document.getElementById(`case-${card.dataset.project}`)?.showModal();
  });
});

document.querySelectorAll(".case-study").forEach((dialog) => {
  dialog.querySelector(".close-case")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelectorAll('a[href="#contact"]').forEach((link) => {
    link.addEventListener("click", () => dialog.close());
  });
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
