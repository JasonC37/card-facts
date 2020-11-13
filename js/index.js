"use strict";

const noResultData = {
  name: "",
  description: "No Results Found"
};

function makeCard(quizData) {
  let container = document.createElement("div");
  container.classList.add("col-md-6", "col-lg-3", "d-flex");
  let card = document.createElement("div");
  card.classList.add("card", "mb-6");
  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  let row = document.createElement("div");
  row.classList.add("row");
  let col = document.createElement("div");
  col.classList.add("col-sm-auto", "card-content");
  let title = document.createElement("h3");
  title.classList.add("card-title");
  title.appendChild(document.createTextNode(quizData.name));
  let text = document.createElement("p");
  text.classList.add("card-text");
  text.textContent = quizData.description;
  container.appendChild(card);
  card.appendChild(cardBody);
  cardBody.appendChild(row);
  row.appendChild(col);
  col.appendChild(title);
  col.appendChild(text);
  if(quizData.availability == true) {
    let btn = document.createElement("a");
    btn.href = "quiz.html";
    btn.classList.add("btn", "btn-dark");
    btn.textContent = "Play";
    col.appendChild(btn);
  } else if(quizData.availability == false){
    let coming = document.createElement("p");
    coming.classList.add("card-text");
    coming.textContent = "Coming Soon!";
    coming.classList.add("font-weight-bold");
    col.appendChild(coming);
  }
  return container;
}

fetchFeatured();

function fetchFeatured() {
  toggleSpinner();
  let promise = fetch("quizList.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      document.querySelector("#featured").appendChild(makeCard(data.quizzes[0]));
    })
    .catch(function(error){
      alert("A data error has occurred, please reload the page and try again later.");
    })
    .then(toggleSpinner);
    return promise;
}

function fetchList(search) {
  let term = search.toLowerCase();
  let resultBox = document.querySelector("#result");
  resultBox.innerHTML = "";
  toggleSpinner();
  let promise = fetch("quizList.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      let cardsAdded = 0;
      data.quizzes.forEach((entry) => {
        if(entry.name.toLowerCase().includes(term) || term == "all") {
          resultBox.appendChild(makeCard(entry));
          cardsAdded = cardsAdded + 1;
        }
      });
      if(cardsAdded == 0) {
        let noResult = document.createElement("p");
        noResult.textContent = "No Results Found";
        resultBox.appendChild(makeCard(noResultData));
      }
    })
    .catch(function(error){
      alert("A data error has occurred, please reload the page and try again later.");
    })
    .then(toggleSpinner);
    return promise;
}

document.querySelector("button").addEventListener("click", e => {
  e.preventDefault();
  fetchList(document.querySelector("#searchQuery").value);
});

function toggleSpinner() {
  document.querySelector(".fa-spinner").classList.toggle("d-none");
}