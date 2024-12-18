/*Project 5: Guessing Game
Name: Toni Ojeda
JS file for guess.html
Clien-side
*/

$(main);
//localStorage.clear();
function main() {
  $('#guessButton').click(guessHandler); //detects button click
  setRandomNumber(); //sets our random number to be compared to
  loadrecord();
}
function guessHandler() {
  let $guessInput = $('#guessInput').val(); //Guess provided by user
  let $guessCount = $('#guessCount'); //Count of guesses done
  let $userGuesses = $('#userGuesses'); //Will display user Guesses
  let $guessResponse = $('#guessResponse'); //Will display if guess is correct or not (higher or lower)
  let $guessesLeft = $('#guessesLeft'); //Will display count of guesses left
  let $errorMsg = $("#errorMsg") //Will display error message

  $('#guessContainer p').removeClass('hidden'); //displays user guess info
  if ($(this).text() != 'Guess') {
    //if button is not Guess then reset the game
    resetGame(); //resetting the game
  } else if ($guessInput.length > 0) {
    //true as long as there is user input

    if (parseInt($guessInput) > 0 && parseInt($guessInput) < 101) {
      //True if the guessInput ranges from 1-100
      $guessCount.text(parseInt($guessCount.text()) + 1); //Adding one to the guess count
      $guessesLeft.text(parseInt($guessesLeft.text()) - 1); //subtracting from guesses left count
      $userGuesses.text(`${$userGuesses.text()} | ${$guessInput} `); //displays user guesses
      $errorMsg.text(''); //hides the error message just in case
      $guessResponse.text(checkInput($guessInput, $guessCount.text())); //calls function to check if input is correct or not
    } else {
      $errorMsg.text('Numbers 1 - 100 only'); //displays error message fro when number is not between 1-100
    }
  } else {
    $errorMsg.text('A number must be entered'); //displays error message for when there is no user input
  }
}
function setRandomNumber() {
  $.get('http://augwebapps.com:5810/getRandom', function (res) { //sends request for the random number to the server
    sessionStorage.setItem('randomNumber', res); //sets new randomNumber in the storage
  }).fail(function (err) {
    //request failed
    console.log('error while sending request ');
  });
}
function resetGame() {
  $('#errorMsg').text(''); //resets error message
  $('#guessButton').text('Guess'); //changes button text back to Guess
  $('#guessInput').val(''); //Guess provided by user
  $('#guessCount').text('0'); //Count of guesses done
  $('#userGuesses').text(''); //Will display user Guesses
  $('#guessResponse').text(''); //Will display if guess is correct or not (higher or lower)
  $('#guessesLeft').text('7'); //Will display count of guesses left
  loadrecord(); //Will display record history of users
  setRandomNumber(); //Setting new random number for the next game
  //Adding previous game to the records
}
function loadrecord() {
  let user = sessionStorage.getItem('user'); //getting user name
  let $recordsContainer = $('#recordsContainer');
  let $recordsName = $('#recordsName'); //Will display the name of the user
  $recordsName.text(`${user}'s Record History`);
  if (localStorage.getItem(user)) {
    //if user is not null then get user records form local storage
    let userRecords = JSON.parse(localStorage.getItem(user));
    $recordsContainer.html(''); //resetting records container
    let attemptCount = 1; //number of attempts
    for (record of userRecords) {
      $recordsContainer.html($recordsContainer.html() + `<p> Attempt: ${attemptCount}, Guesses: ${record.guessCount}, Result: ${record.result} </p>`); //adding a user record to the records Container box
      attemptCount++;
    }
  } else {
    let newUser = []; //setting up newUser array of objects for later
    localStorage.setItem(user, JSON.stringify(newUser)); //adding new user to localStorage
  }
}
function addNewRecord(result) {
  let newRecord = {
    //setting up a new record for user
    guessCount: $('#guessCount').text(),
    result: result,
  };
  let userRecords = JSON.parse(localStorage.getItem(sessionStorage.getItem('user'))); //getting the user's records from the localStorage
  userRecords.push(newRecord);
  localStorage.setItem(sessionStorage.getItem('user'), JSON.stringify(userRecords)); //updating user's record in the localStorage
}

function checkInput(userInput, guessCount) {
  let randomNumber = JSON.parse(sessionStorage.getItem('randomNumber')); //getting random number from sessionStorage
  let $guessButton = $("#guessButton");
  if (guessCount < 7) {
    //Makes sure user has enough attempts
    if (userInput == randomNumber) {
      //true if user input is equal to desired number
      $guessButton.text('Play Again'); //Turns Guess button into Play Again button
      addNewRecord('Won'); //adds new record with result 'Won'
      loadrecord(); //reloads record container
      return 'Your guess was correct!'; //correct guess response $guessInput == randomNumber
    } else if (userInput > randomNumber) {
      return 'Too High'; //incorrect guess response $guessInput > randomNumber
    } else {
      return 'Too Low'; //incorrect guess response $guessInput < randomNumber
    }
  } else {
    $guessButton.text('Try Again'); //Turns Guess button into Try Again button
    addNewRecord('Lost'); //adds new record with result 'Lost'
    loadrecord(); //reloads record container
    return 'You lost, the number was: ' + randomNumber; //incorrect guess response $guessInput != randomNumber
  }
}
