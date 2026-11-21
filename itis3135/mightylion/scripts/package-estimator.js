/*
 * File: scripts/package-estimator.js
 * Purpose: Dynamically calculates estimated mobile service pricing, installation time,
 *          and ceramic protection details for Mighty Lion's Mobile Ceramic Tint & Custom Wheels.
 * Author: Malik Lawson (Lawson Enterprises / Mighty Lion)
 * Sources: Standard DOM Selection & Clipboard API patterns (MDN Web Docs).
 */

const VEHICLE_MULTIPLIERS = {
    sedan: 1.0,
    suv: 1.15,
    truck: 1.25
};

const TINT_BASE_PRICES = {
    none: 0,
    "front-two": 180,
    "full-cabin": 420
};

const WHEEL_BASE_PRICES = {
    none: 0,
    "mount-balance": 140,
    "wheel-coating": 320
};

const TRAVEL_FEES = {
    local: 0,
    extended: 45
};

const ESTIMATED_HOURS = {
    tint: {
        none: 0,
        "front-two": 1.0,
        "full-cabin": 2.0
    },
    wheels: {
        none: 0,
        "mount-balance": 1.0,
        "wheel-coating": 2.0
    }
};

/**
 * Computes total cost, hours, and summary text from current form selections.
 * @returns {{ totalCost: number, totalHours: number, summaryText: string }}
 */
function calculatePackageEstimate() {
    const vehicleClass = document.getElementById("vehicle-class").value;
    const tintPackage = document.getElementById("tint-package").value;
    const wheelPackage = document.getElementById("wheel-package").value;
    const travelZone = document.getElementById("travel-zone").value;

    const multiplier = VEHICLE_MULTIPLIERS[vehicleClass] || 1.0;
    const baseServiceSubtotal = (TINT_BASE_PRICES[tintPackage] || 0) + (WHEEL_BASE_PRICES[wheelPackage] || 0);
    const travelFee = TRAVEL_FEES[travelZone] || 0;

    const totalCost = Math.round(baseServiceSubtotal * multiplier) + travelFee;
    const totalHours = (ESTIMATED_HOURS.tint[tintPackage] || 0) + (ESTIMATED_HOURS.wheels[wheelPackage] || 0);

    const summaryText = `Vehicle: ${vehicleClass.toUpperCase()} | Tint: ${tintPackage} | Wheels: ${wheelPackage} | Est. Total: $${totalCost} (~${totalHours} hrs)`;

    return { totalCost, totalHours, summaryText };
}

/**
 * Updates the DOM elements displaying the estimate.
 */
function renderPackageEstimate() {
    const totalEl = document.getElementById("estimated-total");
    const timeEl = document.getElementById("estimated-time");
    const copyStatusEl = document.getElementById("copy-status");

    if (!totalEl || !timeEl) {
        return;
    }

    const { totalCost, totalHours } = calculatePackageEstimate();
    totalEl.textContent = `$${totalCost}`;
    timeEl.textContent = totalHours === 1 ? "1 hour" : `${totalHours} hours`;

    if (copyStatusEl) {
        copyStatusEl.textContent = "";
    }
}

/**
 * Copies the formatted quote summary to the user's clipboard with fallback feedback.
 */
async function copyQuoteSummary() {
    const statusEl = document.getElementById("copy-status");
    const { summaryText } = calculatePackageEstimate();

    if (!statusEl) {
        return;
    }

    try {
        await navigator.clipboard.writeText(summaryText);
        statusEl.textContent = ` ${summaryText}`;
    } catch (_error) {
        statusEl.textContent = `Summary ready: ${summaryText}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const formEl = document.getElementById("estimator-form");
    const copyBtn = document.getElementById("copy-quote-btn");

    if (formEl) {
        formEl.addEventListener("change", renderPackageEstimate);
    }

    if (copyBtn) {
        copyBtn.addEventListener("click", copyQuoteSummary);
    }

    renderPackageEstimate();
});