let gameBoard = document.getElementById("gameBoard");
let songCover = document.getElementById("songCover");
let audioPreview = document.getElementById("trackPreview");
let preGameInformation = document.getElementById("preGameInformation");
let guessInput = document.getElementById("guessInput");
let answer = document.getElementById("answer");

fadeInWrapper();

function fadeOutGameBoard(){
    anime({
        targets: [gameBoard, preGameInformation, songCover, answer],
        opacity: 0,
        translateX: -600,
        easing: 'easeInQuart',
        duration: 300,
        complete: () => {
            gameBoard.style.transform = "translateX(600px)";
            songCover.style.transform = "translateX(600px)";
            answer.style.transform = "translateY(0px)";
            answer.style.transform = "translateX(0px)";
            answer.style.display = "none";
            gameBoard.style.display = "flex";
            preGameInformation.style.display = "none";
            guessInput.value = "";
        }
    })
}

function fadeInGameBoard(imageLink, trackId, songNumber){
    songCover.src = imageLink;
    audioPreview.src = `https://open.spotify.com/embed/track/${trackId}`;
    document.getElementById("songNumber").innerHTML = `SONG ${songNumber} OF 5`;
    
    anime({
        targets: [gameBoard, songCover],
        opacity: 1,
        translateX: 0,
        duration: 300,
        delay: 400,
        easing: "easeOutQuart"
    })
}

function displayScore(guess, correctGuess, score){
    document.getElementById("playerGuess").innerHTML = `Your guess was ${guess}`;
    document.getElementById("correctAnswer").innerHTML = `Correct answer was ${Math.round(correctGuess)}`;
    document.getElementById("scoreGained").innerHTML = `Points gained: ${score}`;
    answer.style.display = "flex";

    anime({
        targets: answer,
        opacity: 1,
        translateY: 750,
        duration: 2200
    })
}

function fadeInGameOverScreen(finalScore){
    let gameOverScreen = document.getElementById("gameOverScreen");
    gameOverScreen.style.display = "flex";
    gameOverScreen.style.transform = "translateX(600px)";
    gameOverScreen.style.opacity = "0";

    document.getElementById("playerScore").innerHTML = `Your final score was: ${finalScore}`;

    anime({
        targets: gameOverScreen,
        translateX: 0,
        opacity: 1,
        duration: 600,
        easing: "easeOutQuart"
    })
}

function fadeOutGameOverScreen(){
    let gameOverScreen = document.getElementById("gameOverScreen");
    anime({
        targets: gameOverScreen,
        opacity: 0,
        duration: 500,
        easing: "linear",
        complete: () => {
            gameOverScreen.style.display = "none";
            gameOverScreen.style.transform = "translateX(600px)";
        }
    })
}

function fadeInWrapper(){
    let wrapper = document.getElementById("wrapper");
    wrapper.style.opacity = 0;

    anime({
        targets: wrapper,
        opacity: 1,
        duration: 1000,
        easing: "linear"
    })
}

function fadeInErrorScreen(){
    let errorScreen = document.getElementById("errorScreen");
    let preGameInformation = document.getElementById("preGameInformation");

    preGameInformation.style.display = "none";
    gameBoard.style.display = "none";
    errorScreen.style.display = "flex";

    anime({
        targets: errorScreen,
        opacity: 1,
        duration: 500,
        easing: "linear"
    })
}