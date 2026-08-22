const app = document.getElementById("app");

/* -----------------------------
   HEARTOPIA DATA
----------------------------- */

let masteryData = JSON.parse(
  localStorage.getItem("heartopiaMastery")
) || [
  {
    category: "Insects",
    items: [
      {
        name: "Bagworm Moth",
        current: 0,
        required: 300
      }
    ]
  },
  {
    category: "Flowers",
    items: []
  },
  {
    category: "Crops",
    items: []
  },
  {
    category: "Cooking",
    items: []
  },
  {
    category: "Birds",
    items: []
  },
  {
    category: "Fish",
    items: []
  },
  {
    category: "Shells",
    items: []
  }
];

function saveMastery() {
  localStorage.setItem(
    "heartopiaMastery",
    JSON.stringify(masteryData)
  );
}

/* -----------------------------
   MAIN SECTIONS
----------------------------- */

const sections = [
  {
    id: "tasks",
    icon: "📅",
    title: "Daily & Weekly Tasks",
    description: "DG Level and contribution tasks"
  },
  {
    id: "hobbies",
    icon: "🌿",
    title: "Hobbies",
    description: "Levels, proficiency and unlocks"
  },
  {
    id: "collections",
    icon: "🗃️",
    title: "Collections",
    description: "Track everything you've obtained"
  },
  {
    id: "mastery",
    icon: "🏅",
    title: "Mastery Verifications",
    description: "Track mastery progress"
  },
  {
    id: "animals",
    icon: "🐾",
    title: "Animal Bonds",
    description: "Bond levels and rewards"
  },
  {
    id: "events",
    icon: "✨",
    title: "Events & Fashionwaves",
    description: "Limited-time collections and gacha"
  },
  {
    id: "wiki",
    icon: "📖",
    title: "Index / Wiki",
    description: "Your personal Heartopia reference"
  }
];

/* -----------------------------
   HOME
----------------------------- */

function renderHome() {
  app.innerHTML = `
    <header>
      <div class="eyebrow">GAME INDEX</div>
      <h1>Heartopia</h1>
      <p class="subtitle">Your personal game guide</p>
    </header>

    <main>

      <section class="hero">
        <div class="hero-icon">🌸</div>

        <div class="hero-content">
          <div class="eyebrow">DG LEVEL</div>

          <div class="level-number">
            42
          </div>

          <p>
            220 contribution points required for Level 43
          </p>

          <div class="progress">
            <div
              class="progress-bar"
              style="width: 0%"
            ></div>
          </div>

          <div class="progress-text">
            <span>0 / 220</span>
            <span>Level 43</span>
          </div>
        </div>
      </section>

      <div class="section-heading">
        <h2>Heartopia</h2>
        <span>7 sections</span>
      </div>

      <div class="section-list">

        ${sections.map(section => `
          <button
            class="section-card"
            onclick="openSection('${section.id}')"
          >

            <div class="section-icon">
              ${section.icon}
            </div>

            <div class="section-info">

              <h3>
                ${section.title}
              </h3>

              <p>
                ${section.description}
              </p>

            </div>

            <div class="arrow">
              ›
            </div>

          </button>
        `).join("")}

      </div>

    </main>
  `;
}

/* -----------------------------
   SECTION NAVIGATION
----------------------------- */

function openSection(id) {

  if (id === "mastery") {
    renderMastery();
    return;
  }

  const section = sections.find(
    section => section.id === id
  );

  app.innerHTML = `
    <header>

      <button
        class="back-button"
        onclick="renderHome()"
      >
        ‹ Heartopia
      </button>

      <div class="eyebrow">
        ${section.icon}
      </div>

      <h1>
        ${section.title}
      </h1>

      <p class="subtitle">
        ${section.description}
      </p>

    </header>

    <main>

      <div class="empty-section">

        <div class="empty-icon">
          ${section.icon}
        </div>

        <h2>
          ${section.title}
        </h2>

        <p>
          This section is ready to be built.
        </p>

        <button class="primary-button">
          ＋ Add
        </button>

      </div>

    </main>
  `;
}

/* -----------------------------
   MASTERY HOME
----------------------------- */

function renderMastery() {

  app.innerHTML = `
    <header>

      <button
        class="back-button"
        onclick="renderHome()"
      >
        ‹ Heartopia
      </button>

      <div class="eyebrow">
        🏅 MASTERY
      </div>

      <h1>
        Mastery Verifications
      </h1>

      <p class="subtitle">
        Track your progress towards mastery.
      </p>

    </header>

    <main>

      <div class="section-list">

        ${masteryData.map((category, index) => `

          <button
            class="section-card"
            onclick="openMasteryCategory(${index})"
          >

            <div class="section-icon">
              ${getCategoryIcon(category.category)}
            </div>

            <div class="section-info">

              <h3>
                ${category.category}
              </h3>

              <p>
                ${category.items.length}
                ${category.items.length === 1 ? "item" : "items"}
              </p>

            </div>

            <div class="arrow">
              ›
            </div>

          </button>

        `).join("")}

      </div>

    </main>
  `;
}

/* -----------------------------
   CATEGORY
----------------------------- */

function openMasteryCategory(index) {

  const category = masteryData[index];

  app.innerHTML = `
    <header>

      <button
        class="back-button"
        onclick="renderMastery()"
      >
        ‹ Mastery
      </button>

      <div class="eyebrow">
        ${getCategoryIcon(category.category)}
      </div>

      <h1>
        ${category.category}
      </h1>

      <p class="subtitle">
        ${category.items.length} items
      </p>

    </header>

    <main>

      ${
        category.items.length === 0
          ? `
            <div class="empty-section">

              <div class="empty-icon">
                ${getCategoryIcon(category.category)}
              </div>

              <h2>
                Nothing here yet
              </h2>

              <p>
                Add your first mastery item.
              </p>

            </div>
          `
          : `
            <div class="mastery-list">

              ${category.items.map((item, itemIndex) =>
                masteryCard(
                  index,
                  itemIndex,
                  item
                )
              ).join("")}

            </div>
          `
      }

      <button
        class="primary-button add-mastery"
        onclick="addMasteryItem(${index})"
      >
        ＋ Add Mastery
      </button>

    </main>
  `;
}

/* -----------------------------
   MASTERY CARD
----------------------------- */

function masteryCard(
  categoryIndex,
  itemIndex,
  item
) {

  const percentage = Math.min(
    100,
    Math.round(
      (item.current / item.required) * 100
    )
  );

  const remaining = Math.max(
    0,
    item.required - item.current
  );

  const mastered =
    item.current >= item.required;

  return `
    <div class="mastery-card">

      <div class="mastery-top">

        <div>

          <h3>
            ${item.name}
          </h3>

          <p class="mastery-count">

            ${item.current}
            /
            ${item.required}

            ${
              mastered
                ? " • Mastered ✓"
                : ""
            }

          </p>

        </div>

        <div class="mastery-percent">
          ${percentage}%
        </div>

      </div>

      <div class="progress mastery-progress">

        <div
          class="progress-bar"
          style="width:${percentage}%"
        ></div>

      </div>

      <div class="mastery-bottom">

        <span>

          ${
            mastered
              ? "✓ Mastery complete"
              : `${remaining} remaining`
          }

        </span>

      </div>

      <div class="mastery-controls">

        <button
          class="quantity-button"
          onclick="changeMastery(
            ${categoryIndex},
            ${itemIndex},
            -1
          )"
        >
          −
        </button>

        <button
          class="quantity-button add"
          onclick="changeMastery(
            ${categoryIndex},
            ${itemIndex},
            1
          )"
        >
          +
        </button>

        <button
          class="quantity-button"
          onclick="setMasteryAmount(
            ${categoryIndex},
            ${itemIndex}
          )"
        >
          Set amount
        </button>

      </div>

    </div>
  `;
}

/* -----------------------------
   CHANGE AMOUNT
----------------------------- */

function changeMastery(
  categoryIndex,
  itemIndex,
  amount
) {

  const item =
    masteryData[categoryIndex].items[itemIndex];

  item.current = Math.max(
    0,
    Math.min(
      item.required,
      item.current + amount
    )
  );

  saveMastery();

  openMasteryCategory(categoryIndex);
}

/* -----------------------------
   SET AMOUNT
----------------------------- */

function setMasteryAmount(
  categoryIndex,
  itemIndex
) {

  const item =
    masteryData[categoryIndex].items[itemIndex];

  const amount = prompt(
    `How many ${item.name} have you collected?`,
    item.current
  );

  if (amount === null) {
    return;
  }

  const number = Number(amount);

  if (!Number.isFinite(number)) {
    alert("Please enter a number.");
    return;
  }

  item.current = Math.max(
    0,
    Math.min(
      item.required,
      Math.floor(number)
    )
  );

  saveMastery();

  openMasteryCategory(categoryIndex);
}

/* -----------------------------
   ADD MASTERY ITEM
----------------------------- */

function addMasteryItem(categoryIndex) {

  const name = prompt(
    "What are you mastering?"
  );

  if (!name) {
    return;
  }

  const required = prompt(
    `How many ${name} are required for mastery?`,
    "300"
  );

  if (required === null) {
    return;
  }

  const requiredNumber = Number(required);

  if (
    !Number.isFinite(requiredNumber) ||
    requiredNumber <= 0
  ) {
    alert("Please enter a valid number.");
    return;
  }

  masteryData[categoryIndex].items.push({
    name: name,
    current: 0,
    required: Math.floor(requiredNumber)
  });

  saveMastery();

  openMasteryCategory(categoryIndex);
}

/* -----------------------------
   CATEGORY ICONS
----------------------------- */

function getCategoryIcon(category) {

  const icons = {
    Flowers: "🌷",
    Crops: "🌱",
    Cooking: "🍳",
    Insects: "🦋",
    Birds: "🐦",
    Fish: "🐟",
    Shells: "🐚"
  };

  return icons[category] || "🏅";
}

/* -----------------------------
   START APP
----------------------------- */

renderHome();
