/*
 * File: scripts/zone-quote-checker.js
 * Purpose: Validates mobile service inquiry fields, checks Charlotte-area ZIP eligibility,
 *          and dynamically renders a quote confirmation summary in the DOM.
 * Author: Malik Lawson (Lawson Enterprises / Mighty Lion)
 * Sources: Standard form validation and DOM element creation patterns (MDN Web Docs).
 */

const FREE_TRAVEL_ZIPS = new Set([
    "28202", "28203", "28204", "28205", "28206", "28207", "28208",
    "28209", "28210", "28211", "28212", "28213", "28214", "28215",
    "28216", "28217", "28226", "28227", "28262", "28269", "28270",
    "28273", "28277", "28278", "28078", "28031", "28105", "28025"
]);

/**
 * Determines mobile coverage status for a 5-digit ZIP code.
 * @param {string} zipCode
 * @returns {{ eligible: boolean, message: string }}
 */
function evaluateCharlotteCoverage(zipCode) {
    if (!/^\d{5}$/.test(zipCode)) {
        return { eligible: false, message: "Please enter a valid 5-digit ZIP code." };
    }

    if (FREE_TRAVEL_ZIPS.has(zipCode)) {
        return {
            eligible: true,
            message: `ZIP ${zipCode} qualifies for free mobile dispatch within the Charlotte service area.`
        };
    }

    if (zipCode.startsWith("280") || zipCode.startsWith("281") || zipCode.startsWith("282")) {
        return {
            eligible: true,
            message: `ZIP ${zipCode} is in the extended Carolina/Charlotte metro zone (travel fee may apply).`
        };
    }

    return {
        eligible: false,
        message: `ZIP ${zipCode} is outside standard mobile coverage; contact (704) 555-0194 to confirm availability.`
    };
}

/**
 * Validates form inputs and displays either error messages or a formatted request summary.
 * @param {Event} event
 */
function handleQuoteFormSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById("client-name");
    const emailInput = document.getElementById("client-email");
    const zipInput = document.getElementById("service-zip");
    const vehicleInput = document.getElementById("vehicle-info");
    const feedbackEl = document.getElementById("form-feedback");

    if (!nameInput || !emailInput || !zipInput || !vehicleInput || !feedbackEl) {
        return;
    }

    const clientName = nameInput.value.trim();
    const clientEmail = emailInput.value.trim();
    const serviceZip = zipInput.value.trim();
    const vehicleInfo = vehicleInput.value.trim();

    const errors = [];
    if (clientName.length < 2) {
        errors.push("Please enter your full name.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        errors.push("Please enter a valid email address.");
    }
    if (!/^\d{5}$/.test(serviceZip)) {
        errors.push("Please enter a valid 5-digit ZIP code.");
    }
    if (vehicleInfo.length < 3) {
        errors.push("Please enter your vehicle's year, make, and model.");
    }

    feedbackEl.innerHTML = "";

    if (errors.length > 0) {
        const errorList = document.createElement("ul");
        errors.forEach((errText) => {
            const li = document.createElement("li");
            li.textContent = errText;
            errorList.appendChild(li);
        });
        feedbackEl.appendChild(errorList);
        return;
    }

    const coverage = evaluateCharlotteCoverage(serviceZip);

    const summaryCard = document.createElement("div");
    summaryCard.className = "quote-confirmation";

    const titleEl = document.createElement("h4");
    titleEl.textContent = "Mobile Quote Request Ready";

    const coverageEl = document.createElement("p");
    coverageEl.textContent = coverage.message;

    const detailsEl = document.createElement("p");
    detailsEl.textContent = `Client: ${clientName} (${clientEmail}) | Vehicle: ${vehicleInfo} | ZIP: ${serviceZip}`;

    summaryCard.append(titleEl, coverageEl, detailsEl);
    feedbackEl.appendChild(summaryCard);
}

document.addEventListener("DOMContentLoaded", () => {
    const quoteForm = document.getElementById("mobile-quote-form");
    if (quoteForm) {
        quoteForm.addEventListener("submit", handleQuoteFormSubmit);
    }
});