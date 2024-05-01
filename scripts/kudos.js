// build button
const k4Btn = document.createElement("button");
const k4BtnSpan = document.createElement("span");
k4Btn.setAttribute("id", "k4ABtn");
k4Btn.setAttribute("type", "button");
k4Btn.classList.add("k4a__kudos_button");
k4BtnSpan.classList.add("k4a__kudos_button_span");
k4Btn.innerText = "Kudos for";
k4BtnSpan.innerText = "all";
k4Btn.append(k4BtnSpan);

const k4Container = document.createElement("div");
k4Container.classList.add("k4a__kudos_container");

const k4DropDown = `<button type="button" class="k4a__kudos_dropdowntrigger">
<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" class="">
<path d="M16 3.39V4.8l-8.02 8.03L0 4.81V3.39l7.98 8.02L16 3.39z" fill=""></path>
</svg>
</button> 
<div class="k4a__kudos_dropdown"><label class="k4a__kudos_label" for="k4a__kudos_check"><input type="checkbox" id="k4a__kudos_check" checked="true"/>Club Posts</label>`;

k4Container.innerHTML = k4DropDown;

k4Container.prepend(k4Btn);

function addKuddosButton() {
  // insert button over the dashboard
  const stravaFeedUi = document.querySelector(".feed-ui");
  //stravaFeedUi.prepend(k4Btn);
  stravaFeedUi.prepend(k4Container);

  // ---------------------

  const dropDownBtn = document.querySelector(".k4a__kudos_dropdowntrigger");
  const dropDown = document.querySelector(".k4a__kudos_dropdown");
  const checkBoxClubPosts = document.getElementById("k4a__kudos_check");

  function toggleDropDown() {
    dropDown.classList.toggle("k4a__kudos_show");
  }

  function storeClubPostsSelection() {
    localStorage.setItem("k4a-clubposts", checkBoxClubPosts.checked);
  }

  // read and set selection for Club Posts
  const valClubPosts = localStorage.getItem("k4a-clubposts");
  if (valClubPosts === "false") {
    checkBoxClubPosts.checked = false;
  }

  // EventListeners
  dropDownBtn.addEventListener("click", toggleDropDown);
  checkBoxClubPosts.addEventListener("change", storeClubPostsSelection);

  // -----------------------

  //
  function giveKudos() {
    const clubPosts = checkBoxClubPosts.checked;
    let stravaButtons;

    // select the kudos Butttons
    if (clubPosts) {
      stravaButtons = document.querySelectorAll(
        'button:has(svg[data-testid="unfilled_kudos"])'
      );
    } else {
      //except club posts
      stravaButtons = document.querySelectorAll(
        `[id*="feed-entry-"]:has([class*="Activity__entry-icon"]) button:has(svg[data-testid="unfilled_kudos"]), 
        [id*="feed-entry-"]:has([class*="GroupActivity__activity-icon"]) button:has(svg[data-testid="unfilled_kudos"])`
      );
    }

    let stravaButtonsCount = stravaButtons.length;

    // no kudos to give
    if (stravaButtonsCount === 0) return;

    k4Btn.classList.add("k4a__kudos_button--active");
    k4BtnSpan.innerText = stravaButtonsCount;

    // loop over every button with a little delay and click it
    stravaButtons.forEach((button, index) => {
      const dtime = 326 * index;

      setTimeout(function () {
        k4BtnSpan.classList.remove("k4a__kudos_span--animate");
        button.click();
        k4BtnSpan.classList.add("k4a__kudos_span--animate");
        stravaButtonsCount--;
        if (stravaButtonsCount !== 0) {
          k4BtnSpan.innerText = stravaButtonsCount;
        } else {
          k4BtnSpan.innerText = "all";
          k4Btn.classList.remove("k4a__kudos_button--active");
        }
      }, dtime);
    });
  }

  k4Btn.addEventListener("click", giveKudos);
}

// wait for strava ui
const observer = new MutationObserver((mutations, obs) => {
  const stravaFeedUi = document.querySelector(".feed-ui");
  if (stravaFeedUi) {
    addKuddosButton();
    obs.disconnect();
    return;
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});

// data-testid="unfilled_kudos"
