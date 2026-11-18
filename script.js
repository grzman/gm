document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;

    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
    history.pushState(null, "", link.getAttribute("href"));
  });
});

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const subject = `Wiadomość ze strony — ${formData.get("name")}`;
    const body = [
      `Imię: ${formData.get("name")}`,
      `E-mail: ${formData.get("email")}`,
      "",
      formData.get("message"),
    ].join("\n");
    const mailto = new URLSearchParams({ subject, body });
    window.location.href = `mailto:g.manuszewski@gmail.com?${mailto.toString()}`;
  });
}

const projectGallery = document.getElementById("project-gallery");

if (projectGallery) {
  const gallery = projectGallery.closest(".project-gallery");
  const projectCards = projectGallery.querySelectorAll(".project-card");
  const previousButton = document.getElementById("project-previous");
  const nextButton = document.getElementById("project-next");
  const autoplayButton = document.getElementById("project-autoplay");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pausedByUser = false;
  let hovered = false;
  let focused = false;

  const updateGalleryButtons = () => {
    previousButton.disabled = projectGallery.scrollLeft <= 1;
    nextButton.disabled = projectGallery.scrollLeft + projectGallery.clientWidth >= projectGallery.scrollWidth - 1;
    autoplayButton.setAttribute("aria-label", pausedByUser ? "Wznów automatyczne przewijanie" : "Wstrzymaj automatyczne przewijanie");
    autoplayButton.setAttribute("aria-pressed", String(pausedByUser));
  };

  const scrollGallery = (direction) => {
    const gap = Number.parseFloat(getComputedStyle(projectGallery).columnGap) || 0;
    const distance = projectCards[0].getBoundingClientRect().width + gap;
    projectGallery.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const advanceGallery = () => {
    const atEnd = projectGallery.scrollLeft + projectGallery.clientWidth >= projectGallery.scrollWidth - 1;
    if (atEnd) {
      projectGallery.scrollTo({
        left: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
      return;
    }
    scrollGallery(1);
  };

  const autoplay = window.setInterval(() => {
    if (!pausedByUser && !hovered && !focused && !document.hidden && !reducedMotion.matches) {
      advanceGallery();
    }
  }, 5000);

  autoplayButton.addEventListener("click", () => {
    pausedByUser = !pausedByUser;
    updateGalleryButtons();
  });
  previousButton.addEventListener("click", () => scrollGallery(-1));
  nextButton.addEventListener("click", () => scrollGallery(1));
  projectGallery.addEventListener("scroll", updateGalleryButtons, { passive: true });
  window.addEventListener("resize", updateGalleryButtons);
  gallery.addEventListener("pointerenter", () => { hovered = true; });
  gallery.addEventListener("pointerleave", () => { hovered = false; });
  gallery.addEventListener("focusin", () => { focused = true; });
  gallery.addEventListener("focusout", (event) => {
    focused = gallery.contains(event.relatedTarget);
  });
  updateGalleryButtons();
}
