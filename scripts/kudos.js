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

function addKuddosButton() {
  // insert button over the dashboard
  const stravaFeedUi = document.querySelector(".feed-ui");
  stravaFeedUi.prepend(k4Btn);

  //
  function giveKudos() {
    stravaButtons = document.querySelectorAll(
      'button[title="Be the first to give kudos!"], button[title="Give kudos"]'
    );

    let stravaButtonsCount = stravaButtons.length;

    if (stravaButtonsCount === 0) return;

    k4Btn.classList.add("k4a__kudos_button--active");
    k4BtnSpan.innerText = stravaButtonsCount;

    stravaButtons.forEach((button, index) => {
      const dtime = 358 * index;

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

// wait for strave ui
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
