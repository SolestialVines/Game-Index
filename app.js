const app = document.getElementById("app");

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
    description: "Flowers, crops, cooking, insects and more"
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
          <div class="level-number">42</div>
          <p>220 contribution points required for Level 43</p>

          <div class="progress">
            <div class="progress-bar" style="width: 0%"></div>
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
            <div class="section-icon">${section.icon}</div>

            <div class="section-info">
              <h3>${section.title}</h3>
              <p>${section.description}</p>
            </div>

            <div class="arrow">›</div>
          </button>
        `).join("")}
      </div>

    </main>
  `;
}

function openSection(id) {
  const section = sections.find(section => section.id === id);

  app.innerHTML = `
    <header>
      <button class="back-button" onclick="renderHome()">
        ‹ Heartopia
      </button>

      <div class="eyebrow">${section.icon}</div>
      <h1>${section.title}</h1>
      <p class="subtitle">${section.description}</p>
    </header>

    <main>
      <div class="empty-section">
        <div class="empty-icon">${section.icon}</div>

        <h2>${section.title}</h2>

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

renderHome();
