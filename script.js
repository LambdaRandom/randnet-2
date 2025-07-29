const songs = [
    { path: "music/Starlight.mp3", artist: "ELO", title: "Starlight" },
    { path: "music/Across the Border.mp3", artist: "ELO", title: "Across the Border" },
    { path: "music/Last Train to London.mp3", artist: "ELO", title: "Last Train to London" },
    { path: "music/Rockin' All Over The World.mp3", artist: "Status Quo", title: "Rockin' All Over The World"},
    { path: "music/Walls Come Tumbling Down.mp3", artist: "Style Council", title: "Walls Come Tumbling Down"},
    { path: "music/Town Called Malice.mp3", artist: "The Jam", title: "Town Called Malice"},
    { path: "music/Going Underground.mp3", artist: "The Jam", title: "Going Underground"},
    { path: "music/I Saw the Light.mp3", artist: "Todd Rundgren", title: "I Saw the Light"},
    { path: "music/For Once In My Life.mp3", artist: "Stevie Wonder", title: "For Once In My Life"},
    { path: "music/All Over The World.mp3", artist: "ELO", title: "All Over The World"},
    { path: "music/Wham Bam Shang-A-Lang.mp3", artist: "Silver", title: "Wham Bam Shang-A-Lang"},
];

let musicPlaying = false;
let currentSongID = 0;
let isSeeking = false;

const playlistLength = songs.length;
const audio = document.getElementById("audioPlayer");
const playButton = document.getElementById("play_button");
const titleDisplay = document.getElementById("song_title");
const seekContainer = document.getElementById("seekContainer");
const seekFill = document.getElementById("seekFill");

audio.addEventListener("timeupdate", () => {
    if (!isSeeking && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        seekFill.style.width = `${percent}%`;
    }
});

seekContainer.addEventListener("click", (e) => {
    const rect = seekContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

seekContainer.addEventListener("mousedown", (e) => {
    isSeeking = true;
    seekAtEvent(e);

    document.addEventListener("mousemove", seekAtEvent);
    document.addEventListener("mouseup", () => {
        isSeeking = false;
        document.removeEventListener("mousemove", seekAtEvent);
    }, { once: true });
});

function seekAtEvent(e) {
    const rect = seekContainer.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));

    const percent = offsetX / rect.width;
    seekFill.style.width = `${percent * 100}%`;

    if (audio.duration) {
        audio.currentTime = percent * audio.duration;
    }
}

audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    seekFill.style.width = `${percent}%`;
});

let loadedSongPath = "";

function loadSong(index) {
    currentSongID = index;
    const song = songs[currentSongID];
    audio.src = song.path;
    loadedSongPath = song.path;
    titleDisplay.innerText = song.title + " - " + song.artist;
    highlightCurrentSong(index); 
}


function playMusic() {
    audio.play();
    playButton.src = "images/pause_button.png";
    musicPlaying = true;
}

function pauseMusic() {
    audio.pause();
    playButton.src = "images/play_button.png";
    musicPlaying = false;
}

function toggleMusic() {
    const song = songs[currentSongID];

    if (!musicPlaying) {
        if (loadedSongPath !== song.path) {
            loadSong(currentSongID);
        }
        playMusic();
    } else {
        pauseMusic();
    }
}

function skipForward() {
    currentSongID = (currentSongID + 1) % playlistLength;
    const song = songs[currentSongID];
    loadSong(currentSongID);
    if (musicPlaying) {
        playMusic();
    }
}

function skipBackward() {
    currentSongID = (currentSongID - 1 + playlistLength) % playlistLength;
    const song = songs[currentSongID];
    loadSong(currentSongID);
    if (musicPlaying) {
        playMusic();
    }
}

audio.addEventListener("ended", () => {
    skipForward();
});

const songListContainer = document.getElementById("playlist_titles");

function populateSongList() {
    songListContainer.innerHTML = "";

    songs.forEach((song, index) => {
        const songItem = document.createElement("div");
        songItem.innerText = song.title + " - " + song.artist;
        songItem.classList.add("song-list-item");
        songItem.id = `song-${index}`;

        songItem.addEventListener("click", () => {
            loadSong(index);
            playMusic();
            highlightCurrentSong(index);
        });

        songListContainer.appendChild(songItem);
    });

    highlightCurrentSong(currentSongID);
}

function highlightCurrentSong(activeIndex) {
    songs.forEach((_, i) => {
        const el = document.getElementById(`song-${i}`);
        if (el) {
            el.classList.toggle("active", i === activeIndex);
        }
    });
}

populateSongList();

loadSong(currentSongID);
