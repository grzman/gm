
/* GM Portfolio — monitoring zdarzeń GA4 przez GTM */
(function () {
  "use strict";

  const consentKey = "gm_portfolio_analytics_consent_v1";

  const projectNames = {
    "appsheet.html": "Google AppSheet",
    "analiza-danych.html": "Power BI Dashboard",
    "etl-elt.html": "ETL/ELT",
    "budzetowanie-controlling.html": "Budzetowanie i controlling",
    "nova-cfo.html": "NOVA Components CFO"
  };

  function hasConsent() {
    try {
      return localStorage.getItem(consentKey) === "granted";
    } catch (error) {
      return false;
    }
  }

  function track(eventName, properties = {}) {
    if (!hasConsent()) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...properties
    });
  }

  // Kliknięcia w projekty i dane kontaktowe
  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";

    if (/^mailto:/i.test(href)) {
      track("contact_click", {
        contact_method: "email"
      });
      return;
    }

    if (/^tel:/i.test(href)) {
      track("contact_click", {
        contact_method: "phone"
      });
      return;
    }

    if (link.matches(".project-link")) {
      const path = href
        .split(/[?#]/)[0]
        .split("/")
        .pop()
        .toLowerCase();

      if (Object.prototype.hasOwnProperty.call(
        projectNames, path
      )) {
        track("project_click", {
          project_name: projectNames[path],
          project_path: path
        });
      }
    }
  }, true);

  // Widoczność sekcji portfolio
  const sections = ["o-mnie", "projekty", "kontakt"];

  if ("IntersectionObserver" in window) {
    const observed = new Set();

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (entry.intersectionRatio < 0.3) return;

          const sectionId = entry.target.id;

          if (!hasConsent() || observed.has(sectionId)) {
            return;
          }

          observed.add(sectionId);

          track("section_view", {
            section_id: sectionId
          });
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(function (id) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
})();
