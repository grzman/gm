const showReport = document.getElementById("show-report");
const dashboard = document.getElementById("dashboard");
const reportFrame = dashboard.querySelector("iframe[data-src]");

showReport.addEventListener("click", () => {
  if (!reportFrame.src) {
    reportFrame.src = reportFrame.dataset.src;
  }
  dashboard.hidden = false;
  showReport.setAttribute("aria-expanded", "true");
  dashboard.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
