document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "https://intro-form.tommyhost.ing/";
    const newest = document.getElementById("newest");
    const newestHeading = document.getElementById("newest-heading");
    const classContainer = document.getElementById("class");
    const dataList = document.getElementById("data");

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) {
            node.className = className;
        }
        if (text !== undefined) {
            node.textContent = text;
        }
        return node;
    }

    function nameOf(record) {
        const data = record.introductionData || {};
        const nick = data.nickname ? '"' + data.nickname.replace(/"/g, "") + '" ' : "";
        return (data.firstName || record.username || "A classmate") + " " +
            (data.middleName || "") + " " + nick + (data.lastName || "");
    }

    function mascotOf(record) {
        const data = record.introductionData || {};
        const adjective = data.adjectives || "";
        const animal = data.animal || "";
        return (adjective + " " + animal).trim();
    }

    function quoteOf(record) {
        const data = record.introductionData || {};
        return { text: data.quote || "", author: data.quoteAuthor || "" };
    }

    function imgOf(record) {
        const data = record.introductionData || {};
        return data.img || "";
    }

    try {
        // 1. Grab all introductions live from the server
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const all = await response.json();

        // 2. Find the most recent submission (official assignment pattern)
        let newestUsername = null;
        let newestTime = "";

        for (const username in all) {
            const record = all[username];
            if (record && record.lastUpdated) {
                if (newestUsername === null || record.lastUpdated > newestTime) {
                    newestUsername = username;
                    newestTime = record.lastUpdated;
                }
            }
        }

        // Render the Newest Submission spotlight into <article id="newest">
        if (newestUsername && all[newestUsername]) {
            const record = all[newestUsername];
            const fullName = nameOf(record);
            const mascot = mascotOf(record);
            const quote = quoteOf(record);

            if (newestHeading) {
                newestHeading.textContent = fullName;
            }

            const detailsDiv = document.createElement("div");
            const imgSrc = imgOf(record);
            
            if (imgSrc) {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.alt = fullName;
                img.style.maxWidth = "180px";
                img.style.display = "block";
                img.style.marginBottom = "0.75rem";
                img.style.borderRadius = "6px";
                detailsDiv.appendChild(img);
            }

            if (mascot) {
                detailsDiv.appendChild(el("p", null, "Mascot: " + mascot));
            }

            if (quote.text) {
                const said = document.createElement("blockquote");
                said.appendChild(el("p", null, "“" + quote.text + "”"));
                said.appendChild(el("cite", null, "— " + (quote.author || "unknown")));
                detailsDiv.appendChild(said);
            }

            if (record.lastUpdated) {
                detailsDiv.appendChild(el("p", null, "Submitted: " + record.lastUpdated.slice(0, 10)));
            }

            newest.appendChild(detailsDiv);
        } else {
            if (newestHeading) newestHeading.textContent = "No recent submissions found.";
        }

        // 3. Render Class Submissions into <div id="class">
        classContainer.innerHTML = "";
        dataList.innerHTML = "";

        const sorted = Object.keys(all).map(function (username) {
            return all[username];
        }).sort(function (a, b) {
            const nameA = (a.introductionData || {}).lastName || a.username;
            const nameB = (b.introductionData || {}).lastName || b.username;
            return nameA.localeCompare(nameB);
        });

        sorted.forEach(function (record) {
            const card = el("article", "student-card");
            const fullName = nameOf(record);
            const quote = quoteOf(record);
            const imgSrc = imgOf(record);

            if (imgSrc) {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.alt = fullName;
                img.style.width = "100%";
                img.style.height = "160px";
                img.style.objectFit = "cover";
                img.style.borderRadius = "6px";
                img.style.marginBottom = "0.75rem";
                card.appendChild(img);
            }

            // Name heading
            card.appendChild(el("h4", null, fullName));

            // Quote & Author
            if (quote.text) {
                const quoteBlock = document.createElement("blockquote");
                quoteBlock.appendChild(el("p", null, "“" + quote.text + "”"));
                quoteBlock.appendChild(el("cite", null, "— " + (quote.author || "Unknown")));
                card.appendChild(quoteBlock);
            } else {
                card.appendChild(el("p", null, "No quote provided."));
            }

            // Date
            if (record.lastUpdated) {
                card.appendChild(el("p", "card-date", "Submitted: " + record.lastUpdated.slice(0, 10)));
            }

            classContainer.appendChild(card);
        });

        // 4. Populate Data Strip into <ul id="data">
        const entries = sorted.length;
        dataList.appendChild(el("li", null, entries + (entries === 1 ? " introduction" : " introductions") + " collected"));
        if (newestUsername && all[newestUsername].lastUpdated) {
            dataList.appendChild(el("li", null, "Newest submission: " + all[newestUsername].lastUpdated.slice(0, 10)));
        }

    } catch (error) {
        console.error("Error fetching class introductions:", error);
        if (newestHeading) newestHeading.textContent = "Error connecting to server.";
        classContainer.innerHTML = "<p>Could not load class submissions.</p>";
        dataList.innerHTML = "<li>API error.</li>";
    }
});