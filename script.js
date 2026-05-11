const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("wenner-theme");
const currencySelect = document.getElementById("currencySelect");
const priceRanges = document.querySelectorAll(".price-range");

const currencies = {
  NGN: { symbol: "₦", rate: 1, locale: "en-NG", note: "Nigeria - Nigerian Naira" },
  USD: { symbol: "$", rate: 1395, locale: "en-US", note: "United States - US Dollar" },
  GBP: { symbol: "£", rate: 1885, locale: "en-GB", note: "United Kingdom - Pound Sterling" },
  EUR: { symbol: "€", rate: 1630, locale: "en-IE", note: "Europe - Euro" },
  CAD: { symbol: "CA$", rate: 1026, locale: "en-CA", note: "Canada - Canadian Dollar" },
  GHS: { symbol: "GH₵", rate: 122.681, locale: "en-GH", note: "Ghana - Ghana Cedi" },
  ZAR: { symbol: "R", rate: 82.368, locale: "en-ZA", note: "South Africa - Rand" },
  CNY: { symbol: "¥", rate: 201.072, locale: "zh-CN", note: "China - Yuan" },
  SAR: { symbol: "SR", rate: 366.111, locale: "ar-SA", note: "Saudi Arabia - Riyal" }
};

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

function updateThemeLabel() {
  if (!themeToggle) return;
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Light" : "Dark";
}

updateThemeLabel();

function formatCurrency(amount, currencyCode) {
  const currency = currencies[currencyCode] || currencies.NGN;
  const converted = amount / currency.rate;
  const rounded = converted >= 100 ? Math.round(converted) : Math.round(converted * 100) / 100;

  if (currencyCode === "NGN") {
    return `${currency.symbol}${Math.round(amount).toLocaleString(currency.locale)}`;
  }

  return `${currency.symbol}${rounded.toLocaleString(currency.locale)}`;
}

function updatePrices(currencyCode) {
  const selected = currencies[currencyCode] ? currencyCode : "NGN";
  priceRanges.forEach((price) => {
    const min = Number(price.dataset.min);
    const max = Number(price.dataset.max);
    const singlePrice = min === max;
    const baseText = singlePrice
      ? `Base: ₦${min.toLocaleString("en-NG")}`
      : `Base: ₦${min.toLocaleString("en-NG")} - ₦${max.toLocaleString("en-NG")}`;
    price.textContent = singlePrice
      ? formatCurrency(min, selected)
      : `${formatCurrency(min, selected)} - ${formatCurrency(max, selected)}`;
    price.setAttribute("title", baseText);

    const parent = price.closest(".price-card");
    if (parent && !parent.querySelector(".base-price-note")) {
      const note = document.createElement("small");
      note.className = "base-price-note";
      price.insertAdjacentElement("afterend", note);
    }

    const note = parent ? parent.querySelector(".base-price-note") : null;
    if (note) {
      note.textContent = selected === "NGN" ? "Official base price in Nigerian naira." : baseText;
    }
  });

  if (currencySelect && currencySelect.value !== selected) {
    currencySelect.value = selected;
  }
}

const savedCurrency = localStorage.getItem("wenner-currency") || "NGN";
updatePrices(savedCurrency);

if (currencySelect) {
  currencySelect.value = currencies[savedCurrency] ? savedCurrency : "NGN";
  currencySelect.addEventListener("change", () => {
    localStorage.setItem("wenner-currency", currencySelect.value);
    updatePrices(currencySelect.value);
  });
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("wenner-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeLabel();
  });
}

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("visitorName").value.trim();
    const phone = document.getElementById("visitorPhone").value.trim();
    const service = document.getElementById("serviceType").value;
    const message = document.getElementById("visitorMessage").value.trim();

    const serviceLabels = {
      tech: "Coding class or design work",
      venture: "SIM, NIN, POS machine sales/distribution, Moniepoint account creation or Moniepoint support",
      printery: "Printery work"
    };

    const numbers = {
      tech: "2349138995784",
      venture: "2349037124525",
      printery: "2349138995784"
    };

    const text = `Hello, my name is ${name}. My phone number is ${phone}. I want to book: ${serviceLabels[service]}. ${message}`;
    const url = `https://wa.me/${numbers[service]}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
}
