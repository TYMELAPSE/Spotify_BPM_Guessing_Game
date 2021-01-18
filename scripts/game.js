let bearerToken = null;
let songNumber = 0;
let pointSum = 0;

//ID of Spotifys trending tracks playlist. Replace with whatever playlist you want to use.
let trendingTracksId = "37i9dQZF1DX2L0iB23Enbq?si=VHeXoWvySsGB_FP8YUEtPg";
let tracksInPlaylist = [];
let activeTrack;
let trackAudioData;

const EVENT_DELAY = 600;

//Insert your Spotify client credentials. If deploying, do NOT carry these on frontend.
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

initializeButtons();

function startGame(){
    fadeOutGameBoard();
    if(bearerToken == null){
        generateAccessToken(getPlaylist, getRandomTrackFromPlaylist);
    }else{
        pointSum = 0;
        songNumber = 0;
        fadeOutGameOverScreen();
        getRandomTrackFromPlaylist(bearerToken);
    }
}

async function generateAccessToken(fetchPlaylist, fetchTrack){
    try{
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();

        bearerToken = data.access_token;
        fetchPlaylist(data.access_token, fetchTrack);
    }catch(error){
        console.log(error);
        fadeInErrorScreen();
    }
}

async function getPlaylist(token, fetchTrack){
    const fetchHeader = {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token
    }};
    
    try{     
        const playlistResult = await fetch(`https://api.spotify.com/v1/playlists/${trendingTracksId}`, fetchHeader);
        let playlistObject = await playlistResult.json();

        const tracksObject = await fetch(playlistObject.tracks.href, fetchHeader);
        tracksInPlaylist = await tracksObject.json();
        
        fetchTrack(token);
    }catch(error){
        console.log(error);
        fadeInErrorScreen();
    }
}

async function getRandomTrackFromPlaylist(token){
    fadeOutGameBoard();

    const fetchData = {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token
    }}

    let selectedTrackId = tracksInPlaylist.items[Math.floor(Math.random() * tracksInPlaylist.items.length)].track.id;

    try{
        const audioDataResult = await fetch(`https://api.spotify.com/v1/audio-features/${selectedTrackId}`, fetchData);
        const audioData = await audioDataResult.json();
        const trackResult = await fetch(`https://api.spotify.com/v1/tracks/${selectedTrackId}`, fetchData);
        const trackInfo = await trackResult.json();

        activeTrack = trackInfo;
        trackAudioData = audioData;
        songNumber++;

        if(songNumber > 5){
            fadeInGameOverScreen(pointSum);
            return;
        }

        setTimeout( () => {fadeInGameBoard(activeTrack.album.images[0].url, activeTrack.id, songNumber);}, EVENT_DELAY);
    }catch(error){
        console.log(error);
        fadeInErrorScreen();
    }
}

function makeGuess(){
    let guess = document.getElementById("guessInput").value;
    if(!guess){guess = 0};
    displayScore(guess, trackAudioData.tempo, calculateScore(Math.abs(Math.round(trackAudioData.tempo) - guess)));
}

function calculateScore(difference){

    let points = 0;

    if(difference >= 25){
        points = 0;
    }else if(difference <= 24 && difference >= 20){
        points = 2;
    }else if (difference <= 19 && difference >= 15){
        points = 4;
    }else if(difference <= 14 && difference >= 10){
        points = 6;
    }else if(difference <= 9 && difference >= 5){
        points = 8;
    }else if (difference <= 4 && difference >= 3){
        points = 12;
    }else if(difference <= 2 && difference >= 1){
        points = 16;
    }else if (difference == 0){
        points = 20;
    }

    pointSum += points;
    return points;
}

function initializeButtons() {
    document.getElementById("playButton").addEventListener("click", startGame);
    document.getElementById("guessButton").addEventListener("click", makeGuess);
    document.getElementById("nextSongButton").addEventListener("click", () => getRandomTrackFromPlaylist(bearerToken));
    document.getElementById("restartButton").addEventListener("click", startGame);
}