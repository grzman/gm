const showReport = document.getElementById("show-report");
const dashboard = document.getElementById("dashboard");
const reportContainer = dashboard.querySelector(".report-frame");
const reportFrame = dashboard.querySelector("iframe[data-src]");

const resizeReport = () => {
  const width = reportContainer.clientWidth;
  if (width > 0) {
    reportContainer.style.setProperty("--report-scale", String(Math.min(width / 1200, 1)));
  }
};

if ("ResizeObserver" in window) {
  new ResizeObserver(resizeReport).observe(reportContainer);
} else {
  window.addEventListener("resize", resizeReport);
}

showReport.addEventListener("click", () => {
  if (!reportFrame.src) {
    reportFrame.src = reportFrame.dataset.src;
  }
  dashboard.hidden = false;
  resizeReport();
  showReport.setAttribute("aria-expanded", "true");
  dashboard.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
