/*
 * File: scripts/service-explorer.js
 * Purpose: Dynamically renders filterable service cards and expandable care/spec panels
 *          for Mighty Lion's Mobile Ceramic Tint & Custom Wheels.
 * Author: Malik Lawson (Lawson Enterprises / Mighty Lion)
 * Sources: Standard DOM creation and ARIA state toggling patterns (MDN Web Docs).
 */

const SERVICE_CATALOG = [
    {
        id: "ceramic-tint",
        category: "tint",
        title: "Ceramic Window Tint",
        priceLabel: "Starting at $180",
        summary: "Blocks up to 99% of UV rays and up to 96% of infrared heat without signal interference.",
        careGuide: "Keep windows rolled up for 48-72 hours after mobile installation and clean only with ammonia-free glass cleaner and a soft microfiber towel."
    },
    {
        id: "wheel-install",
        category: "wheels",
        title: "Custom Wheel Installation & Balancing",
        priceLabel: "Starting at $140",
        summary: "Scratch-free mobile mounting, precision road-force balancing, and proper torque specs on site.",
        careGuide: "Re-check lug nut torque after 50-100 miles of driving and avoid harsh acidic wheel cleaners on bare or machined finishes."
    },
    {
        id: "wheel-coating",
        category: "care",
        title: "Ceramic Wheel Coating",
        priceLabel: "Starting at $180",
        summary: "Adds a hydrophobic protective barrier against brake dust, road grime, and salt buildup.",
        careGuide: "Allow initial curing in dry conditions for 24 hours and wash with pH-neutral car shampoo."
    },
    {
        id: "mobile-van",
        category: "care",
        title: "Climate-Controlled Mobile Van Dispatch",
        priceLabel: "Free within 25 miles of Charlotte",
        summary: "Self-powered mobile unit brings clean film-cutting and wheel tools directly to your home or office.",
        careGuide: "Ensure level parking space with enough room around the vehicle for safe door and wheel access."
    }
];

/**
 * Filters catalog items by category and renders matching cards into the DOM.
 * @param {string} selectedCategory
 */
function renderServiceCards(selectedCategory) {
    const containerEl = document.getElementById("service-cards-container");
    const statusEl = document.getElementById("filter-status");

    if (!containerEl) {
        return;
    }

    const filteredItems = selectedCategory === "all"
        ? SERVICE_CATALOG
        : SERVICE_CATALOG.filter((item) => item.category === selectedCategory);

    containerEl.innerHTML = "";

    filteredItems.forEach((item) => {
        const cardArticle = document.createElement("article");
        cardArticle.className = "service-card";

        const headingEl = document.createElement("h4");
        headingEl.textContent = `${item.title} (${item.priceLabel})`;

        const descEl = document.createElement("p");
        descEl.textContent = item.summary;

        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.textContent = "Show Care & Spec Details";
        toggleBtn.setAttribute("aria-expanded", "false");

        const detailsEl = document.createElement("p");
        detailsEl.textContent = item.careGuide;
        detailsEl.hidden = true;

        toggleBtn.addEventListener("click", () => {
            const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
            toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
            detailsEl.hidden = isExpanded;
            toggleBtn.textContent = isExpanded ? "Show Care & Spec Details" : "Hide Care & Spec Details";
        });

        cardArticle.append(headingEl, descEl, toggleBtn, detailsEl);
        containerEl.appendChild(cardArticle);
    });

    if (statusEl) {
        const label = selectedCategory === "all" ? "all" : selectedCategory;
        statusEl.textContent = `Showing ${filteredItems.length} package(s) for filter: ${label}.`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.category || "all";

            filterButtons.forEach((btn) => {
                btn.setAttribute("aria-pressed", String(btn === button));
            });

            renderServiceCards(category);
        });
    });

    renderServiceCards("all");
});