'use strict';

let gameState = 0;
let pairs = 0;
let selectedCard;
let fileData = loadData("covid.json");

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
  //text.classList.add("card-text", "d-none");
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
    //hideText(this);
    if(this.classList.contains("selected")) {
      this.classList.remove("selected");
      gameState = 0;
    } else if(gameState == 1) {
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
          document.querySelector("#answers").classList.remove("d-none");
        }
      } /* else {
        document.querySelector("#card").forEach(card => {
          card.removeEventListener('click', flip);
        });
        setTimeout(unlock, 3000, this, selectedCard);
      } */
    } else {
      this.classList.add("selected");
      selectedCard = this;
      gameState = 1;      
    }
  }
}

/*
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
} */

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

function printAnswers(data) {
  let answerBox = document.querySelector("#answers-list");
  let answerDiv = [];
  data.questions.forEach(cardData => {
    answerDiv.push(makeSource(cardData));
  });
  answerDiv.forEach(answer => {
    answerBox.appendChild(answer);
  });
}

function makeSource(data) {
  let container = document.createElement("li");
  container.classList.add("container");
  let myth = document.createElement("p");
  myth.textContent = "Myth: " + data.myth;
  let truth = document.createElement("p");
  truth.textContent = "Truth: " + data.truth;
  let sourceLink = document.createElement("a");
  sourceLink.href = data.source;
  sourceLink.target = "_blank"
  sourceLink.textContent = "(Source)";
  container.appendChild(myth);
  container.appendChild(truth);
  container.appendChild(sourceLink);
  return container;
}

function loadData(source) {
  toggleSpinner();
  let promise = fetch(source)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    addCards(data);
    printAnswers(data);
  })
  .catch(function(error) {
    console.log(error);
    alert("A data error has occurred, please reload the page and try again later.");
  })
  .then(toggleSpinner);
  return promise;
}

function toggleSpinner() {
  document.querySelector(".fa-spinner").classList.toggle("d-none");
}
