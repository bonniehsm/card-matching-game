import React from 'react';
//import { render } from 'react-dom';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      score: 0,   //check if game won
      answerKey: Array(this.imagePairsCount).fill(null),     //answerKey and cardUrl can potentially be stored in a single object
      cardUrls: Array(12).fill(""),
      flippedCards: Array(12).fill(false),
    }
    this.handleClick = this.handleClick.bind(this);
    this.clearSettings = this.clearSettings.bind(this);
    this.setImagePairings = this.setImagePairings.bind(this);
    this.flipped = [];
	this.imagePairsCount = 6;
  }

  componentDidMount() {
    this.setImagePairings();
  }

  setImagePairings(){

    let imageUrls = [
      'https://static.pexels.com/photos/356378/pexels-photo-356378.jpeg',
      'https://static.pexels.com/photos/59523/pexels-photo-59523.jpeg',
      'https://static.pexels.com/photos/374906/pexels-photo-374906.jpeg',
      'https://static.pexels.com/photos/69372/pexels-photo-69372.jpeg',
      'https://static.pexels.com/photos/257540/pexels-photo-257540.jpeg',
      'https://static.pexels.com/photos/8700/wall-animal-dog-pet.jpg',
    ];

    /* var new_array = arr.map(function callback(currentValue[, index[, array]]) {
        // Return element for new_array
       }[, thisArg])
      - currentValue: The current element being processed in the array.
      - index: The index of the current element being processed in the array. */
    var start = 0, end = 11;
    const fillRange = (start, end) => {
      return Array(end - start + 1).fill().map((item, index) => start + index);
    };

    var cardsUrlIndices = fillRange(start, end);
    var cardsUrlStrings = Array(12).fill("");

    var answerKeyPairs = [];

    //iterate through urls object
    for (var i = 0; i < imageUrls.length; i++) {
      //console.log('LOOP #: ' + i);
      //console.log('Image url: ' + imageUrls[i]);

      const getIndex = () => {
        var index = Math.floor(Math.random() * cardsUrlIndices.length);
        //console.log('INDEX: ' + index + ' VALUE: ' + cardsUrl[index]); 
        return cardsUrlIndices.splice(index, 1)[0];
      }

      //console.log(cardsUrl);
      var match1 = getIndex();
      //console.log(cardsUrl);
      var match2 = getIndex();
      console.log('Match ' + i + ': ' + match1 + ',' + match2);

      answerKeyPairs[i] = [match1, match2];
      cardsUrlStrings[match1] = imageUrls[i];
      cardsUrlStrings[match2] = imageUrls[i];
      //console.log('answerKeyPairs ' + i + ': ' + answerKeyPairs[i]);
    }

    console.log(answerKeyPairs);
    //console.log(cardsUrlStrings);
    this.setState({
      answerKey: answerKeyPairs,
      cardUrls: cardsUrlStrings
    });
  }

  handleClick(i) {
    console.log('clicked ' + i);

    //check if player clicked a card yet
    var cards = document.getElementsByClassName('singleCard');
    console.log(cards[i]);

    if (document.getElementById('cardTwoSelect')) {
      console.log('return from handleclick event');
      return;
    }

    if (document.getElementById('cardOneSelect') == null) {
      //no card has been selected by the user
      console.log('null - no element w/ id cardOneSelect yet');
      this.flipped[0] = i;
      cards[i].setAttribute('id', 'cardOneSelect');
      cards[i].classList.add('flipped');

    } else {
      this.flipped[1] = i;
      //second card is selected by the user
      cards[i].setAttribute('id', 'cardTwoSelect');
      cards[i].classList.add('flipped');
      setTimeout(() => this.checkIfCardsMatch(cards), 1200);
    }

  }

  checkIfCardsMatch(cards) {
    console.log('checkIfCardsMatch');
    let matchFound;
    //findindex callback arg: 
    //element (current elem being processed), index(index of the current elem being processed), array(array findIndex was called upon)
    const checkAnswerKeyArr = (currElem, keyIndex, keyPairArr) => {
      //console.log('keyPairArr: ' + keyPairArr);
      ////console.log('answerKeyIndex ' + answerKeyIndex);
      //console.log('current element value: ' + currElem);
      if (matchFound) { return; }
      if (this.flipped[0] == currElem) {
        console.log('FIRST MATCH - ' + this.flipped[0] + ' == ' + currElem);
        console.log('Other index: ' + (keyIndex == 0 ? 1 : 0) + ' value: ' + keyPairArr[(keyIndex == 0 ? 1 : 0)]);
        matchFound = this.flipped[1] == keyPairArr[(keyIndex == 0 ? 1 : 0)];
      }
    }

    (this.state.answerKey).forEach((keyPair, index) => {
      console.log('keyPair: ' + keyPair);
      console.log('index: ' + index);
      //if any of the flipped cards matches the index of the first value of keyPair
      keyPair.findIndex(checkAnswerKeyArr);
    });

    console.log('match - ' + matchFound);
    if (matchFound) {
	/*
      //check if game won
      let score = this.state.score;
      score++; console.log('Score + 1: ' + score); console.log('this.state.answerKey.length: ' + this.state.answerKey.length);
      if (score == this.imagePairsCount) {
        //increase the final score
        this.setState(function(prevState, props){ 
          return{score: prevState.score + 1}; 
        });

		return;
      }
	*/
      //get copy of the flippedCards array. update the indices of flipped cards to true then set the state
      var flippedCardsCopy = this.state.flippedCards.slice();
      console.log(flippedCardsCopy);
      flippedCardsCopy[this.flipped[0]] = true;
      flippedCardsCopy[this.flipped[1]] = true;
      console.log(flippedCardsCopy);

      this.setState(function (prevState, props) {
        return {
          flippedCards: flippedCardsCopy,
          score: prevState.score + 1,
        };
      });
    } else {
      //cards do not match
      //remove class 'flipped' and id's added
      console.log('no match');
      console.log(cards[this.flipped[0]]); console.log(cards[this.flipped[1]]);
      cards[this.flipped[0]].classList.remove('flipped');
      cards[this.flipped[1]].classList.remove('flipped');
    }

    cards[this.flipped[0]].setAttribute('id', "");
    cards[this.flipped[1]].setAttribute('id', "");

  }

  clearSettings() {
    console.log('clear settings function');    
    var flippedCards = document.getElementsByClassName('flipped');
    console.log('length: ' + flippedCards.length);
    for(var i = flippedCards.length - 1; i >= 0; i--){
      console.log('index: ' + i);
      flippedCards[i].classList.remove('flipped');
    }
    
    this.setState({
      score: 0,
      moves: 0,
      //answerKey: Array(4).fill(null), 
      //cardUrls: Array(8).fill(""),
      flippedCards: Array(8).fill(false),
    });
    setTimeout(()=>this.setImagePairings(), 1000);
  }

  render() {
	let w = window.innerWidth,
		h = window.innerHeight;
	let resetDivW = 400,
		resetDivH = 60;
    return (
      <div>
        <h1 className="gameTitle">Card Matching Game</h1>
        <h2 className="gameScore">Score: {this.state.score}</h2>
        <Board
          imageUrls={this.state.cardUrls}
          onClick={i => this.handleClick(i)}
          progress={this.state.flippedCards}
        />
		<div id="resetModal" 
			style={ {display: this.state.score == this.imagePairsCount ? "block" : "none", 
					 height: h + "px",
					 width: w + "px"} } 
		>
          <button id="resetButton" onClick={this.clearSettings}
			style={ {top: (h - resetDivH)/2 + "px",
					 left: (w - resetDivW)/2 + "px"} }>All cards are matched. Click to play again!</button>
        </div>
      </div>
    );
  }

}


//receive the url and pass index and click event to the individual card component
class Board extends React.Component {

  renderCard() {
    var cards = [];
    for (let n = 0; n < this.props.imageUrls.length; n++) {
      //console.log('n: ' + n);
	  let cKey = 'card' + n; console.log(cKey);
      cards.push(
        <div className={this.props.flippedCards ? "singleCard flipped" : "singleCard"} key={cKey} onClick={() => this.props.onClick(n)}>
          <Card src={this.props.imageUrls[n]} />
          <div className="back"></div>
        </div>

      );
    }
    //console.log('cards');
    //console.log(cards);

    return (
      <div className="cards">{cards}</div>
    );
  }

  render() {
    return (
	<div>
      <div className="container">
        {this.renderCard()}
      </div>
	</div>
    );
  }

}


function Card(props) {

  return (
    <img className="front cardImage" src={props.src} />
  );

}

//render(<Game />, document.getElementById('root'));

export default Game;
