const out = document.querySelector("#facts");
const searchForm = document.querySelector("#search-form");
const countryInput = document.querySelector("#country-input");

// Helper function to render a label/value pair using document.createElement
function render(parent, label, value) {
  const p = document.createElement("p");
  p.className = "fact-item";

  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;

  const span = document.createElement("span");
  span.textContent = value;

  p.appendChild(strong);
  p.appendChild(span);
  parent.appendChild(p);
}

async function showCountry(name) {
  if (!name.trim()) return;

  // 1. Show Loading indicator
  out.className = "facts-container loading";
  out.textContent = "Loading...";

  try {
    // 2. Fetch country data
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name.trim())}`);
    
    // Check res.ok for 404 or other HTTP errors
    if (!res.ok) {
      throw new Error("Country not found");
    }

    const [c] = await res.json();

    // Clear loading text
    out.textContent = "";
    out.className = "facts-container";

    // 3. Render Flag using createElement
    if (c.flags?.png || c.flags?.svg) {
      const img = document.createElement("img");
      img.src = c.flags.svg || c.flags.png;
      img.alt = c.flags.alt || `Flag of ${c.name?.common || name}`;
      img.className = "flag-img";
      out.appendChild(img);
    }

    // 4. Render facts using createElement helper
    render(out, "Capital", c.capital ? c.capital[0] : "N/A");
    render(out, "Population", c.population ? c.population.toLocaleString() : "N/A");
    render(out, "Region", c.region || "N/A");

    // Format Currencies (e.g. Ethiopian birr (Br))
    let currencyText = "N/A";
    if (c.currencies) {
      currencyText = Object.values(c.currencies)
        .map(curr => curr.symbol ? `${curr.name} (${curr.symbol})` : curr.name)
        .join(", ");
    }
    render(out, "Currencies", currencyText);

  } catch (err) {
    // 5. Handle errors with a friendly message
    out.className = "facts-container error";
    out.textContent = err.message;
  }
}

// Wire form submit event
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showCountry(countryInput.value);
});

// Default to showing Ethiopia's facts on load
showCountry("ethiopia");