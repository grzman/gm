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

const projectGallery = document.getElementById("project-gallery");

if (projectGallery) {
  const projectCards = projectGallery.querySelectorAll(".project-card");
  const previousButton = document.getElementById("project-previous");
  const nextButton = document.getElementById("project-next");

  const updateGalleryButtons = () => {
    previousButton.disabled = projectGallery.scrollLeft <= 1;
    nextButton.disabled = projectGallery.scrollLeft + projectGallery.clientWidth >= projectGallery.scrollWidth - 1;
  };

  const scrollGallery = (direction) => {
    const gap = Number.parseFloat(getComputedStyle(projectGallery).columnGap) || 0;
    const distance = projectCards[0].getBoundingClientRect().width + gap;
    projectGallery.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  previousButton.addEventListener("click", () => scrollGallery(-1));
  nextButton.addEventListener("click", () => scrollGallery(1));
  projectGallery.addEventListener("scroll", updateGalleryButtons, { passive: true });
  window.addEventListener("resize", updateGalleryButtons);
  updateGalleryButtons();
}
