'use strict';

let gameState = 0;
let pairs = 0;
let selectedCard;

const covid = {questions:[{
    id: "pair1",
    myth: "Cases are going up because we are doing more testing.",
    truth: "The total is rising, but the share that are positive is also rising.",
    source: "https://www.cbsnews.com/news/us-covid-19-cases-testing/",
  }, {
      id: "pair2",
      myth: "Herd Immunity works in the place of lockdowns.",
      truth: "Many deaths will occur before this is achieved.",
      source: "https://www.healthcentral.com/article/herd-immunity-and-covid-19",
  }, {
      id: "pair3",
      myth: "COVID-19 is just like the flu.",
      truth: "This is four to eight times as serious.",
      source: "https://www.cdc.gov/flu/about/burden/preliminary-in-season-estimates.html",
  }, {
      id: "pair4",
      myth: "Once you recover, you cannot spread Covid.",
      truth: "After symptoms subside, you might still spread Covid for up to eight days.",
      source: "https://www.webmd.com/lung/news/20200403/coronavirus-hangs-around-after-symptoms-subside",
  }]};

function makeCard(question, contentType) {
  let container = document.createElement("div");
  container.classList.add("col-md-6", "col-lg-4", "d-flex");
  let card = document.createElement("div");
  card.classList.add("card");
  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  let row = document.createElement("div");
  row.classList.add("col-md-6");
  let col = document.createElement("div");
  col.classList.add("col-sm", "card-content");
  col.classList.add("card-content");
  let text = document.createElement("p");
  text.classList.add("card-text");
  if(contentType=="myth") {
    text.textContent = question.myth;
  } else {
    text.textContent = question.truth;
  }
  //text.classList.add("d-none");
  card.classList.add(question.id);
  container.appendChild(card);
  card.appendChild(cardBody);
  cardBody.appendChild(row);
  row.appendChild(col);
  col.appendChild(text);
  card.addEventListener('click', flip);
  return container;
}

function flip() {
  if(!this.classList.contains("matched")) {
    hideText(this);
    if(this.classList.contains("selected")) {
      this.classList.remove("selected");
    } else if(gameState == 0) {
      this.classList.add("selected");
      selectedCard = this;
      gameState = 1;
    } else {
      let id = this.classList.item(1);
      selectedCard.classList.remove("selected");
      if(selectedCard.classList.contains(id)) {
        pairs = pairs - 1;
        this.classList.add("matched");
        selectedCard.classList.add("matched");
        if(pairs == 0) {
          printAnswers(covid);
        }
      } else {
        document.querySelector("#card-container").childNodes.forEach(card => {
          card.removeEventListener('click', flip);
        });
        setTimeout(unlock, 3000);
      }
      gameState = 0;
    }
  }
}

function hideText(card) {
  let text = card.firstChild.firstChild.firstChild.firstChild.firstChild;
  if(text.classList.contains("d-none")) {
    text.classList.remove("d-none");
  } else {
    text.classList.add("d-none");
  }
}

function unlock() {
  document.querySelector("#card-container").childNodes.forEach(card => {
    card.addEventListener('click', flip);
  });
}

function addCards(data) {
  let cardContainer = document.querySelector("#card-container");
  pairs = data.length;
  let cardCollection = [];
  data.questions.forEach(cardData => {
     cardCollection.push(makeCard(cardData, "myth"));
     cardCollection.push(makeCard(cardData, "truth"));
  });
  
  /*let randOrder = [];
  while (randOrder.length < pairs * 2) {
    let position = Math.floor((Math.random() * pairs * 2) + 1);
    if (typeof randOrder.find(position) === "undefined") {
      randOrder.push(position);
      console.log("DecideRand");
    }
  }
  randOrder.forEach(pos => {
    cardContainer.appendChild(cardCollection[pos]);
    console.log("AppendCard");
  });*/

  cardCollection.forEach(card => {
    cardContainer.appendChild(card);
    console.log("AppendCard");
  });
}

addCards(covid);

function printAnswers(data) {
  let answerBox = document.querySelector("answers-container");
  data.questions.forEach(cardData => {
    answerBox.appendChild(makeSource(cardData));
 });
  document.querySelector("#answers").classList.remove("d-none");
}

function makeSource() {

}

//Define a function `renderSearchResults()` that takes in an object with a
//`results` property containing an array of music tracks; the same format as
//the above `EXAMPLE_SEARCH_RESULTS` variable.
//The function should render each item in the argument's `results` array into 
//the DOM by calling the `renderTrack()` function you just defined. Be sure to 
//"clear" the previously displayed results first!
//
//You can test this function by passing it the `EXAMPLE_SEARCH_RESULTS` object.
function renderSearchResults(searchResults) {
  if(searchResults.results.length == 0) {
    renderError(new Error("No results found"));
  } else {
    document.querySelector("#records").innerHTML = "";
    searchResults.results.forEach(renderTrack);
  }
}


const URL_TEMPLATE = "https://itunes.apple.com/search?limit=25&term={searchTerm}";
function fetchTrackList(term) {
  toggleSpinner();
  let promise = fetch(URL_TEMPLATE.replace("{searchTerm}", term))
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      renderSearchResults(data);
    })
    .catch(function(error){
      renderError(error);
    })
    .then(toggleSpinner);
    return promise;
}