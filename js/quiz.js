'use strict';

let gameState = 0;
let pairs = 0;
let selectedCard;
//let fileData = loadData("json/covid.json");
let covid = {questions:[{
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
  container.classList.add("col-md-6", "col-lg-3", "d-flex");
  let card = document.createElement("div");
  card.classList.add("card", "mb-6", question.id);
  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  let row = document.createElement("div");
  let col = document.createElement("div");
  col.classList.add("col-sm-auto", "card-content");
  let text = document.createElement("p");
  text.classList.add("card-text", "d-none");
  if(contentType=="myth") {
    text.textContent = question.myth;
  } else {
    text.textContent = question.truth;
  }
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
      gameState = 0;
    } else if(gameState == 0) {
      this.classList.add("selected");
      selectedCard = this;
      gameState = 1;
    } else {
      let id;
      this.classList.forEach(className => {
        if(className.includes("pair")) {
          id = className;
        }
      });
      selectedCard.classList.remove("selected");
      gameState = 0;
      if(selectedCard.classList.contains(id)) {
        pairs = pairs - 1;
        this.classList.add("matched");
        selectedCard.classList.add("matched");
        if(pairs == 0) {
          printAnswers(fileData);
        }
      } else {
        console.log("wrong");
        document.querySelector("#card").forEach(card => {
          card.removeEventListener('click', flip);
        });
        setTimeout(unlock, 3000, this, selectedCard);
      }
    }
  }
}

function hideText(card) {
  let text = card.firstChild.firstChild.firstChild.firstChild;
  if(text.classList.contains("d-none")) {
    text.classList.remove("d-none");
  } else {
    text.classList.add("d-none");
  }
}

function unlock(thisCard, otherCard) {
  document.querySelector("#card-container").childNodes.forEach(card => {
    card.addEventListener('click', flip);
  });
  thisCard.classList.remove("selected");
  otherCard.classList.remove("selected");
  hideText(thisCard);
  hideText(otherCard);
}

function addCards(data) {
  let cardContainer = document.querySelector("#card-container");
  let cardCollection = [];
  data.questions.forEach(cardData => {
     cardCollection.push(makeCard(cardData, "myth"));
     cardCollection.push(makeCard(cardData, "truth"));
  });
  pairs = cardCollection.length/2;
  
  //Randomizing Code based on https://medium.com/@fyoiza/how-to-randomize-an-array-in-javascript-8505942e452
  let randOrder = [];
  cardCollection.forEach(card => {
    let position = Math.floor((Math.random() * pairs * 2));
    while (randOrder.includes(cardCollection[position])) {
      position = Math.floor((Math.random() * pairs * 2));
    }
    randOrder.push(cardCollection[position]);
  });
  randOrder.forEach(card => {
    cardContainer.appendChild(card);
  });
}

addCards(covid);

function printAnswers(data) {
  document.querySelector("#answers").classList.remove("d-none");
  let answerBox = document.querySelector("answers-container");
  data.questions.forEach(cardData => {
    answerBox.appendChild(makeSource(cardData));
  });
}

printAnswers(covid);

function makeSource(data) {
  let container = document.createElement("div");
  container.classList.add("container");
  let myth = document.createElement("p");
  myth.textContent = "Myth: " + data.myth;
  let truth = document.createElement("p");
  truth.textContent = "Truth: " + data.truth;
  let sourceLink = document.createElement("p");
  sourceLink.textContent = "Source: " + data.source;
  container.appendChild(myth);
  container.appendChild(truth);
  container.appendChild(sourceLink);
  return div;
}

function loadData() {
  let promise = fetch("json/covid.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    addCards(data);
  })
  .catch(function(error){
    console.log(error);
    alert("A fatal error has occurred, please reload the page and try again later.");
  });
  return promise;
}