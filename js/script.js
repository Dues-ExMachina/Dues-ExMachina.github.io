console.log("Lets write javascript");
let currentSong = new Audio;
let songs;
let currFolder;
// converting secons into 00:15 formate 
function formatSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Make sure it's a whole number
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
}

// currentSong.addEventListener("timeupdate", () => {
//     console.log(currentSong.currentTime, currentSong.duration);
//     document.querySelector(".songtime").innerHTML =
//         `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`;
// });


async function getSongs(folder) {

    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response);  // logs the html code in console
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as);

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // console.log(songs);
    // Geting song names from folder
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> <img src="img/music.svg" alt="music" class="invert">
                            <div class="info">

                                <div class="songName">${song.replaceAll("%20", " ")}</div>
                                <div class="artist">Anubhab</div>
                            </div>
                            <div class="playNow">
                                <span>Play</span>
                                <img class="invert" src="img/play.svg" alt="PlayNow">
                            </div>
                        </li>`;

    }

    //Attach a event listner to each song(Also selecting the song)
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());// there was a space comming in first to remove that used trim fn.
        });

    });
    return songs;
}

// getSongs(folder)

// Music play function
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track) // mustiple songs are playing so correct that in next line
    currentSong.src = `${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
//wrong code
// async function displayAlbum() {
//     let a = await fetch("http://127.0.0.1:8000/songs/")
//     let response = await a.text();
//     // console.log(response);  // logs the html code in console
//     let div = document.createElement("div")
//     let cardContainer = document.querySelector(".cardContainer")
//     div.innerHTML = response;
//     console.log(div)
//     let anchors = div.getElementsByTagName("a")
//     let array = Array.from(anchors)
//     // .forEach(async e => {
//         for (let index = 0; index < array.length; index++) {
//             const e = array[index];

//         }
//         if (e.href.includes("/songs")) {
//             let folder = (e.href.split("/").splice(-2)[0])
//             //get meta data of the folder
//             let a = await fetch(`http://127.0.0.1:8000/songs/${folder}/info.json`)
//             let response = await a.json();
//             console.log(response);
//             //inputing new cards
//             cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="Amv" class="card">
//                         <div class="play">
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                                 xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
//                                     stroke-linejoin="round" />
//                             </svg>
//                         </div>
//                         <img src="/songs/${folder}/cover.jpg" alt="song">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`

//         }
//     }
//     //Click on card to load new playlist
//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//         e.addEventListener("click", async item => {
//             songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}`);

//         })
//     })
// }
//corrected code
async function displayAlbum() {
    let a = await fetch("/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let cardContainer = document.querySelector(".cardContainer");
    let anchors = div.getElementsByTagName("a");
    let anchorArray = Array.from(anchors);

    for (let index = 0; index < anchorArray.length; index++) {
        const e = anchorArray[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").splice(-2)[0];

            try {
                let res = await fetch(`http://127.0.0.1:8000/songs/${folder}/info.json`);
                let metadata = await res.json();

                // Add new card
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="song">
                        <h2>${metadata.title}</h2>
                        <p>${metadata.description}</p>
                    </div>`;
            } catch (err) {
                console.error(`Failed to fetch info for ${folder}`, err);
            }
        }
    }

    // Add click listeners after cards are added to DOM
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async (item) => {
            let folder = item.currentTarget.dataset.folder;
            songs = await getSongs(`/songs/${folder}`);
            playMusic(songs[0])
        });
    });
}


async function main() {

    //get the list of all songs
    await getSongs("/songs/Amv");
    playMusic(songs[0], true)

    // Display all the albums
    displayAlbum()
    //Attach a event listner to play,next, previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg" //player/pause.svg
        } else {
            currentSong.pause()
            play.src = "img/play.svg" // player/play.svg
        }
    })
    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
    // add an event listner to seekbar to drag
    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;// getBoundingClientRect() it tells the width of the element
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add a event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    // Add a event listner to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })
    //Add a event Listner to previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);  //currentSong.src.split("/").slice(-1)[0] find the current song and splice its name only, then let index = songs.indexOf == looking its index value in all songs list
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    //Add a event Listner to next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);  //currentSong.src.split("/").slice(-1)[0] find the current song and splice its name only, then let index = songs.indexOf == looking its index value in all songs list
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })
    //Add event listner to mute audio
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // console.log(e.target);
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }


    }
    )


}
// last edited 115 line///4:34:50 video mnts//08042025
main();
