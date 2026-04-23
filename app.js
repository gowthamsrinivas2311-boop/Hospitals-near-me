/* ============================================
   HOSPITALS NEAR ME — Application Logic
   ============================================ */

// ---- Disease-to-Specialty Mapping ----
const DISEASE_MAP = [
  { name: "Heart Disease", emoji: "❤️", specialties: ["Cardiology", "Cardiac Surgery"], keywords: ["heart", "cardiac", "chest pain", "cardiovascular", "angina", "arrhythmia", "heart attack", "heart failure"] },
  { name: "Diabetes", emoji: "🩸", specialties: ["Endocrinology", "Diabetology", "Internal Medicine"], keywords: ["diabetes", "blood sugar", "insulin", "diabetic", "hyperglycemia", "type 1", "type 2"] },
  { name: "Fracture", emoji: "🦴", specialties: ["Orthopedics", "Trauma Surgery"], keywords: ["fracture", "broken bone", "bone", "orthopedic", "sprain", "dislocation", "joint injury"] },
  { name: "Cancer", emoji: "🎗️", specialties: ["Oncology", "Radiation Oncology", "Surgical Oncology"], keywords: ["cancer", "tumor", "tumour", "oncology", "chemotherapy", "malignant", "carcinoma", "leukemia", "lymphoma"] },
  { name: "Kidney Disease", emoji: "🫘", specialties: ["Nephrology", "Urology"], keywords: ["kidney", "renal", "dialysis", "nephrology", "kidney stone", "urinary"] },
  { name: "Liver Disease", emoji: "🫁", specialties: ["Hepatology", "Gastroenterology"], keywords: ["liver", "hepatitis", "cirrhosis", "jaundice", "hepatology"] },
  { name: "Lung Disease", emoji: "🫁", specialties: ["Pulmonology", "Respiratory Medicine"], keywords: ["lung", "asthma", "bronchitis", "pneumonia", "copd", "respiratory", "breathing", "pulmonary", "cough", "tuberculosis", "tb"] },
  { name: "Brain / Neurological", emoji: "🧠", specialties: ["Neurology", "Neurosurgery"], keywords: ["brain", "neuro", "stroke", "epilepsy", "headache", "migraine", "seizure", "paralysis", "parkinson", "alzheimer", "nerve"] },
  { name: "Eye Problems", emoji: "👁️", specialties: ["Ophthalmology"], keywords: ["eye", "vision", "cataract", "glaucoma", "retina", "myopia", "blindness", "ophthalmology", "lasik"] },
  { name: "Dental Issues", emoji: "🦷", specialties: ["Dentistry", "Oral Surgery", "Orthodontics"], keywords: ["dental", "tooth", "teeth", "dentist", "cavity", "root canal", "gum", "oral", "orthodontic", "braces"] },
  { name: "Pregnancy", emoji: "🤰", specialties: ["Obstetrics", "Gynecology", "OB-GYN"], keywords: ["pregnancy", "pregnant", "obstetric", "gynecology", "maternity", "prenatal", "delivery", "cesarean", "labour", "labor"] },
  { name: "Skin Disease", emoji: "🧴", specialties: ["Dermatology"], keywords: ["skin", "rash", "acne", "eczema", "psoriasis", "dermatology", "fungal", "allergy skin", "dermatitis", "vitiligo"] },
  { name: "Mental Health", emoji: "🧠", specialties: ["Psychiatry", "Psychology"], keywords: ["mental", "depression", "anxiety", "psychiatric", "psychology", "bipolar", "schizophrenia", "stress", "insomnia", "ptsd", "ocd"] },
  { name: "ENT (Ear/Nose/Throat)", emoji: "👂", specialties: ["ENT", "Otolaryngology"], keywords: ["ear", "nose", "throat", "ent", "sinus", "tonsil", "hearing", "snoring", "sleep apnea", "otolaryngology"] },
  { name: "Stomach / Digestive", emoji: "🫃", specialties: ["Gastroenterology", "GI Surgery"], keywords: ["stomach", "digestive", "gastro", "ulcer", "acid reflux", "ibs", "ibd", "crohn", "colitis", "diarrhea", "constipation", "nausea", "vomiting", "abdomen", "abdominal"] },
  { name: "Back Pain / Spine", emoji: "🦴", specialties: ["Orthopedics", "Spine Surgery", "Pain Management"], keywords: ["back pain", "spine", "spinal", "disc", "scoliosis", "sciatica", "slipped disc", "neck pain"] },
  { name: "Arthritis / Joint Pain", emoji: "🦵", specialties: ["Rheumatology", "Orthopedics"], keywords: ["arthritis", "joint", "rheumatoid", "gout", "lupus", "rheumatology", "joint pain", "knee pain", "hip pain"] },
  { name: "Allergy", emoji: "🤧", specialties: ["Allergy & Immunology", "Pulmonology"], keywords: ["allergy", "allergic", "hay fever", "immunology", "hives", "anaphylaxis", "food allergy"] },
  { name: "Thyroid", emoji: "🦋", specialties: ["Endocrinology"], keywords: ["thyroid", "hypothyroid", "hyperthyroid", "goiter", "thyroiditis"] },
  { name: "Blood Disorder", emoji: "🩸", specialties: ["Hematology"], keywords: ["blood", "anemia", "hematology", "hemophilia", "blood clot", "thrombosis", "sickle cell", "platelet"] },
  { name: "Pediatric / Child Care", emoji: "👶", specialties: ["Pediatrics", "Neonatology"], keywords: ["child", "pediatric", "baby", "infant", "newborn", "neonatal", "kids", "children"] },
  { name: "Urology", emoji: "🚻", specialties: ["Urology"], keywords: ["urology", "prostate", "bladder", "urinary tract", "uti", "erectile", "kidney stone"] },
  { name: "General / Fever", emoji: "🤒", specialties: ["General Medicine", "Internal Medicine", "Family Medicine"], keywords: ["fever", "cold", "flu", "general", "infection", "viral", "weakness", "fatigue", "body pain", "malaria", "dengue", "typhoid", "covid"] },
];

// ---- App State ----
const state = {
  userLat: null,
  userLng: null,
  locationName: "",
  searchedDisease: "",
  matchedSpecialties: [],
  hospitals: [],
  map: null,
  markers: [],
  currentView: "list",
};

// ---- DOM References ----
const $ = (id) => document.getElementById(id);
const detectBtn = $("detectBtn");
const locationText = $("locationText");
const diseaseInput = $("diseaseInput");
const dropdown = $("autocompleteDropdown");
const searchBtn = $("searchBtn");
const resultsSection = $("resultsSection");
const hospitalGrid = $("hospitalGrid");
const loadingState = $("loadingState");
const emptyState = $("emptyState");
const resultsTitle = $("resultsTitle");
const resultsSubtitle = $("resultsSubtitle");
const mapWrapper = $("mapWrapper");
const newSearchBtn = $("newSearchBtn");
const listViewBtn = $("listViewBtn");
const mapViewBtn = $("mapViewBtn");
const statusDot = document.querySelector(".status-dot");
const statusText = document.querySelector(".status-text");
const heroSection = $("hero");

// ---- Location Detection ----
detectBtn.addEventListener("click", detectLocation);
locationText.addEventListener("click", detectLocation);

function detectLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  detectBtn.classList.add("loading");
  locationText.textContent = "Detecting location...";
  locationText.classList.remove("detected");

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      state.userLat = pos.coords.latitude;
      state.userLng = pos.coords.longitude;

      detectBtn.classList.remove("loading");
      statusDot.classList.add("active");

      // Reverse geocode
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${state.userLat}&lon=${state.userLng}&zoom=16`
        );
        const data = await res.json();
        const addr = data.address;
        state.locationName =
          addr.suburb || addr.neighbourhood || addr.city_district || addr.city || addr.town || addr.village || "Your Location";
        const displayName = `${state.locationName}, ${addr.city || addr.town || addr.state || ""}`;
        locationText.textContent = displayName;
        statusText.textContent = displayName;
      } catch {
        locationText.textContent = `${state.userLat.toFixed(4)}, ${state.userLng.toFixed(4)}`;
        statusText.textContent = "Location detected";
      }

      locationText.classList.add("detected");
      updateSearchBtnState();
    },
    (err) => {
      detectBtn.classList.remove("loading");
      locationText.textContent = "Location denied — click to retry";
      console.error("Geolocation error:", err);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// ---- Disease Autocomplete ----
let activeDropdownIndex = -1;

diseaseInput.addEventListener("input", () => {
  const query = diseaseInput.value.trim().toLowerCase();
  if (query.length < 2) {
    closeDropdown();
    updateSearchBtnState();
    return;
  }

  const matches = DISEASE_MAP.filter(
    (d) =>
      d.name.toLowerCase().includes(query) ||
      d.keywords.some((k) => k.includes(query))
  ).slice(0, 8);

  if (matches.length === 0) {
    closeDropdown();
    updateSearchBtnState();
    return;
  }

  activeDropdownIndex = -1;
  dropdown.innerHTML = matches
    .map(
      (d, i) => `
    <div class="autocomplete-item" data-index="${i}" data-name="${d.name}">
      <span class="item-emoji">${d.emoji}</span>
      <div class="item-info">
        <div class="item-name">${highlightMatch(d.name, query)}</div>
        <div class="item-specialty">${d.specialties.join(", ")}</div>
      </div>
    </div>
  `
    )
    .join("");

  dropdown.classList.add("open");

  dropdown.querySelectorAll(".autocomplete-item").forEach((item) => {
    item.addEventListener("click", () => {
      selectDisease(item.dataset.name);
    });
  });

  updateSearchBtnState();
});

diseaseInput.addEventListener("keydown", (e) => {
  const items = dropdown.querySelectorAll(".autocomplete-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeDropdownIndex = Math.min(activeDropdownIndex + 1, items.length - 1);
    updateActiveItem(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeDropdownIndex = Math.max(activeDropdownIndex - 1, 0);
    updateActiveItem(items);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (activeDropdownIndex >= 0 && items[activeDropdownIndex]) {
      selectDisease(items[activeDropdownIndex].dataset.name);
    } else if (diseaseInput.value.trim().length >= 2) {
      performSearch();
    }
  } else if (e.key === "Escape") {
    closeDropdown();
  }
});

function updateActiveItem(items) {
  items.forEach((it, i) => {
    it.classList.toggle("active", i === activeDropdownIndex);
  });
}

function selectDisease(name) {
  diseaseInput.value = name;
  closeDropdown();
  updateSearchBtnState();
}

function closeDropdown() {
  dropdown.classList.remove("open");
  activeDropdownIndex = -1;
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query);
  if (idx < 0) return text;
  return (
    text.slice(0, idx) +
    `<span style="color:var(--accent-primary);font-weight:700">${text.slice(idx, idx + query.length)}</span>` +
    text.slice(idx + query.length)
  );
}

// Close dropdown on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest("#diseaseField")) closeDropdown();
});

// ---- Quick Tags ----
document.querySelectorAll(".quick-tag").forEach((tag) => {
  tag.addEventListener("click", () => {
    diseaseInput.value = tag.dataset.disease;
    closeDropdown();
    updateSearchBtnState();
    if (state.userLat) {
      performSearch();
    }
  });
});

// ---- Search Button ----
function updateSearchBtnState() {
  const hasLocation = state.userLat !== null;
  const hasDisease = diseaseInput.value.trim().length >= 2;
  searchBtn.disabled = !(hasLocation && hasDisease);
}

searchBtn.addEventListener("click", performSearch);

// ---- Perform Search ----
async function performSearch() {
  if (searchBtn.disabled) return;

  const query = diseaseInput.value.trim();
  state.searchedDisease = query;

  // Match the disease to specialties
  const queryLower = query.toLowerCase();
  const matched = DISEASE_MAP.find(
    (d) =>
      d.name.toLowerCase() === queryLower ||
      d.keywords.some((k) => queryLower.includes(k) || k.includes(queryLower))
  );
  state.matchedSpecialties = matched ? matched.specialties : ["General Medicine"];

  // Show results section, hide hero
  heroSection.style.display = "none";
  resultsSection.style.display = "block";
  hospitalGrid.style.display = "none";
  emptyState.style.display = "none";
  loadingState.style.display = "block";
  mapWrapper.classList.remove("visible");

  resultsTitle.textContent = `Hospitals for "${state.searchedDisease}"`;
  resultsSubtitle.textContent = `Searching near ${state.locationName || "your location"}...`;

  try {
    const hospitals = await fetchHospitals(state.userLat, state.userLng);
    state.hospitals = hospitals;

    loadingState.style.display = "none";

    if (hospitals.length === 0) {
      emptyState.style.display = "block";
      resultsSubtitle.textContent = "No hospitals found in this area";
    } else {
      hospitalGrid.style.display = "grid";
      resultsSubtitle.textContent = `${hospitals.length} hospital${hospitals.length > 1 ? "s" : ""} found near ${state.locationName || "you"} • Specialties: ${state.matchedSpecialties.join(", ")}`;
      renderHospitalCards(hospitals);
      initMap(hospitals);
    }
  } catch (err) {
    console.error("Search error:", err);
    loadingState.style.display = "none";
    emptyState.style.display = "block";
    emptyState.querySelector("h3").textContent = "Something went wrong";
    emptyState.querySelector("p").textContent = "Please check your internet connection and try again.";
  }
}

// ---- Fetch Hospitals from Overpass API ----
async function fetchHospitals(lat, lng) {
  const radius = 15000; // 15km
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      relation["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      way["amenity"="clinic"](around:${radius},${lat},${lng});
    );
    out center body;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const data = await res.json();
  const elements = data.elements || [];

  // Process and sort
  let hospitals = elements
    .map((el) => {
      const elLat = el.lat || (el.center && el.center.lat);
      const elLng = el.lon || (el.center && el.center.lon);
      if (!elLat || !elLng) return null;

      const tags = el.tags || {};
      const name = tags.name || tags["name:en"] || "Hospital";
      if (name === "Hospital" && !tags.amenity) return null;

      const distance = haversine(lat, lng, elLat, elLng);
      const specialtiesRaw = tags["healthcare:speciality"] || tags.speciality || tags.healthcare || "";
      const specialties = specialtiesRaw
        ? specialtiesRaw.split(";").map((s) => s.trim().replace(/_/g, " "))
        : [];

      const hasEmergency = tags.emergency === "yes" || tags["emergency"] === "yes";
      const phone = tags.phone || tags["contact:phone"] || "";
      const website = tags.website || tags["contact:website"] || "";
      const address = [tags["addr:street"], tags["addr:city"], tags["addr:postcode"]].filter(Boolean).join(", ");

      // Relevance score
      let relevance = 0;
      const nameLower = name.toLowerCase();
      const matchedLower = state.matchedSpecialties.map((s) => s.toLowerCase());

      // Check if hospital specialties match
      for (const spec of specialties) {
        if (matchedLower.some((ms) => spec.toLowerCase().includes(ms) || ms.includes(spec.toLowerCase()))) {
          relevance += 30;
        }
      }

      // Check if name contains specialty keywords
      for (const ms of matchedLower) {
        if (nameLower.includes(ms.split(" ")[0].toLowerCase())) {
          relevance += 20;
        }
      }

      // Check for specific disease-related keywords in name
      const diseaseKeywords = state.searchedDisease.toLowerCase().split(" ");
      for (const kw of diseaseKeywords) {
        if (kw.length > 3 && nameLower.includes(kw)) {
          relevance += 15;
        }
      }

      // Hospitals get higher base score than clinics
      if (tags.amenity === "hospital") relevance += 10;
      if (hasEmergency) relevance += 5;

      // Distance penalty (closer is better)
      relevance -= distance * 0.5;

      return {
        id: el.id,
        name,
        lat: elLat,
        lng: elLng,
        distance,
        specialties,
        hasEmergency,
        phone,
        website,
        address,
        relevance,
        type: tags.amenity || "hospital",
      };
    })
    .filter(Boolean);

  // Sort by relevance (higher is better), then distance
  hospitals.sort((a, b) => b.relevance - a.relevance || a.distance - b.distance);

  // Limit to top 20
  return hospitals.slice(0, 20);
}

// ---- Haversine Distance (km) ----
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---- Render Hospital Cards ----
function renderHospitalCards(hospitals) {
  hospitalGrid.innerHTML = hospitals
    .map((h, i) => {
      const dist =
        h.distance < 1 ? `${(h.distance * 1000).toFixed(0)}m` : `${h.distance.toFixed(1)} km`;

      const rankClass =
        i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-default";

      // Tags
      let tagsHtml = "";
      const matchedSpecs = state.matchedSpecialties;
      for (const spec of matchedSpecs) {
        tagsHtml += `<span class="specialty-tag tag-match">${spec}</span>`;
      }
      if (h.hasEmergency) {
        tagsHtml += `<span class="specialty-tag tag-emergency">Emergency</span>`;
      }
      if (h.specialties.length > 0) {
        for (const s of h.specialties.slice(0, 2)) {
          if (!matchedSpecs.some((ms) => ms.toLowerCase() === s.toLowerCase())) {
            tagsHtml += `<span class="specialty-tag tag-general">${capitalize(s)}</span>`;
          }
        }
      }

      const addressHtml = h.address
        ? `<div class="hospital-address">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            ${h.address}
          </div>`
        : "";

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`;

      const callBtn = h.phone
        ? `<a href="tel:${h.phone}" class="card-btn btn-call">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Call
          </a>`
        : "";

      return `
        <div class="hospital-card" style="animation-delay: ${i * 0.06}s" data-id="${h.id}">
          <div class="hospital-card-content">
            <div class="card-header">
              <div class="card-rank ${rankClass}">${i + 1}</div>
              <div class="card-distance">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                ${dist}
              </div>
            </div>
            <h3 class="hospital-name">${h.name}</h3>
            ${addressHtml}
            <div class="card-tags">${tagsHtml}</div>
            <div class="card-footer">
              <a href="${directionsUrl}" target="_blank" rel="noopener" class="card-btn btn-directions">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Directions
              </a>
              ${callBtn}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---- Map ----
function initMap(hospitals) {
  if (state.map) {
    state.map.remove();
    state.map = null;
  }

  const map = L.map("map", {
    zoomControl: true,
    attributionControl: false,
  }).setView([state.userLat, state.userLng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);

  // User marker
  const userIcon = L.divIcon({
    className: "user-marker",
    html: `<div style="
      width: 18px; height: 18px; border-radius: 50%;
      background: #00d4aa; border: 3px solid #fff;
      box-shadow: 0 0 12px rgba(0,212,170,0.5);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  L.marker([state.userLat, state.userLng], { icon: userIcon })
    .addTo(map)
    .bindPopup('<div class="popup-name">📍 You are here</div>');

  // Hospital markers
  state.markers = [];
  const bounds = L.latLngBounds([[state.userLat, state.userLng]]);

  hospitals.forEach((h, i) => {
    const dist =
      h.distance < 1 ? `${(h.distance * 1000).toFixed(0)}m away` : `${h.distance.toFixed(1)} km away`;

    const hospitalIcon = L.divIcon({
      className: "hospital-marker",
      html: `<div style="
        width: 28px; height: 28px; border-radius: 8px;
        background: ${i < 3 ? "linear-gradient(135deg, #7c5cfc, #00d4aa)" : "#1e293b"};
        border: 2px solid ${i < 3 ? "#fff" : "#475569"};
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 12px; font-weight: 700;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      ">${i + 1}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([h.lat, h.lng], { icon: hospitalIcon })
      .addTo(map)
      .bindPopup(`
        <div class="popup-name">${h.name}</div>
        <div class="popup-distance">${dist}</div>
      `);

    state.markers.push(marker);
    bounds.extend([h.lat, h.lng]);
  });

  map.fitBounds(bounds, { padding: [40, 40] });
  state.map = map;

  // Fix map rendering on delayed display
  setTimeout(() => map.invalidateSize(), 100);
}

// ---- View Toggles ----
listViewBtn.addEventListener("click", () => {
  state.currentView = "list";
  listViewBtn.classList.add("active");
  mapViewBtn.classList.remove("active");
  mapWrapper.classList.remove("visible");
  hospitalGrid.style.display = "grid";
});

mapViewBtn.addEventListener("click", () => {
  state.currentView = "map";
  mapViewBtn.classList.add("active");
  listViewBtn.classList.remove("active");
  mapWrapper.classList.add("visible");
  hospitalGrid.style.display = "none";

  if (state.map) {
    setTimeout(() => state.map.invalidateSize(), 150);
  }
});

// ---- New Search ----
newSearchBtn.addEventListener("click", () => {
  resultsSection.style.display = "none";
  heroSection.style.display = "flex";
  diseaseInput.value = "";
  updateSearchBtnState();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---- Auto-detect Location on Load ----
window.addEventListener("DOMContentLoaded", () => {
  // Slight delay for smoother UX
  setTimeout(() => detectLocation(), 800);
});
