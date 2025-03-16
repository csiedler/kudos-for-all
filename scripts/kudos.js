// Erstellt den Kudos-Button
function createKudosButton() {
  const btn = document.createElement("button");
  btn.id = "k4ABtn";
  btn.type = "button";
  btn.className = "k4a__kudos_button";
  btn.innerText = "Kudos for";

  const btnSpan = document.createElement("span");
  btnSpan.className = "k4a__kudos_button_span";
  btnSpan.innerText = "all";

  btn.append(btnSpan);
  return btn;
}

// Erstellt das Kudos-Container-Element mit Dropdown
function createKudosContainer() {
  const container = document.createElement("div");
  container.classList.add("k4a__kudos_container");

  const dropDownHTML = `
      <button type="button" class="k4a__kudos_dropdowntrigger">
          <svg fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
              <path d="M14.384 5.5L8.796 11.09c-.44.44-1.152.44-1.591 0L1.616 5.5l.884-.884 5.5 5.5 5.5-5.5z"></path>
          </svg>
      </button> 
      <div class="k4a__kudos_dropdown">
          <label class="k4a__kudos_label">
              <input type="checkbox" id="k4a__kudos_check" checked> Club Posts
          </label>
      </div>`;

  container.insertAdjacentHTML("beforeend", dropDownHTML);
  container.prepend(createKudosButton());

  // Event-Listener direkt hier hinzufügen
  const dropDownBtn = container.querySelector(".k4a__kudos_dropdowntrigger");
  const dropDown = container.querySelector(".k4a__kudos_dropdown");
  const checkBoxClubPosts = container.querySelector("#k4a__kudos_check");

  dropDownBtn.addEventListener("click", () =>
    dropDown.classList.toggle("k4a__kudos_show")
  );

  checkBoxClubPosts.checked = localStorage.getItem("k4a-clubposts") !== "false";
  checkBoxClubPosts.addEventListener("change", () => {
    localStorage.setItem("k4a-clubposts", checkBoxClubPosts.checked);
  });

  return container;
}

// Fügt den Kudos-Button zum UI hinzu
function addKudosButton() {
  const stravaFeedUi = document.querySelector(".feature-feed");
  if (!stravaFeedUi) return;

  stravaFeedUi.prepend(createKudosContainer());

  document.getElementById("k4ABtn").addEventListener("click", giveKudos);
}

// Kudos-Funktion
function giveKudos() {
  const athletIdUrl = document
    .querySelector(".avatar.avatar-athlete")
    .closest(".nav-link").href;

  // get last part from URL - should be the ID
  const athletId = athletIdUrl.split("/").pop();
  const athletUrl = `/athletes/${athletId}`;
  //a[href=""]

  const checkBoxClubPosts = document.getElementById("k4a__kudos_check");
  const k4Btn = document.getElementById("k4ABtn");
  const k4BtnSpan = k4Btn.querySelector(".k4a__kudos_button_span");

  const clubPosts = checkBoxClubPosts.checked;

  let stravaButtons = document.querySelectorAll(
    clubPosts
      ? `[id*="feed-entry-"]:not(:has(a[href="${athletUrl}"])) button:has(svg[data-testid="unfilled_kudos"])`
      : `[id*="feed-entry-"]:not(:has(a[href^="/clubs/"])) button:has(svg[data-testid="unfilled_kudos"])`
  );

  let count = stravaButtons.length;

  if (count === 0) return;

  k4Btn.classList.add("k4a__kudos_button--active");
  k4BtnSpan.innerText = count;

  // Funktion zum rekursiven Klicken mit Delay
  function clickWithDelay(index) {
    if (index >= stravaButtons.length) {
      k4BtnSpan.innerText = "all";
      k4Btn.classList.remove("k4a__kudos_button--active");
      return;
    }

    k4BtnSpan.classList.remove("k4a__kudos_span--animate");
    stravaButtons[index].click();
    k4BtnSpan.classList.add("k4a__kudos_span--animate");
    k4BtnSpan.innerText = stravaButtons.length - (index + 1);

    setTimeout(() => clickWithDelay(index + 1), 326);
  }

  clickWithDelay(0);
}

// Überwacht Änderungen im DOM und fügt den Button hinzu, sobald das Strava-UI verfügbar ist
const observer = new MutationObserver((mutations, obs) => {
  if (document.querySelector(".feature-feed")) {
    addKudosButton();
    obs.disconnect();
  }
});

observer.observe(document, { childList: true, subtree: true });
