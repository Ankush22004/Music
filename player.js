const fileInput = document.getElementById('fileInput');
const songList = document.getElementById('songList');
const audioPlayer = document.getElementById('audioPlayer');
const categoryButtons = document.querySelectorAll('#categories button');

let songs = [];

fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const song = {
      name: file.name,
      url: URL.createObjectURL(file),
      category: detectCategory(file.name)
    };
    songs.push(song);
  });
  saveSongsToDB(songs);
  renderSongs();
});

songList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const index = e.target.getAttribute('data-index');
    if (songs[index]) {
      audioPlayer.src = songs[index].url;
      audioPlayer.play();
    }
  }
});

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    renderSongs(category);
  });
});

function renderSongs(filter = "All") {
  songList.innerHTML = "";
  const filtered = filter === "All" ? songs : songs.filter(s => s.category === filter);
  filtered.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.name;
    li.setAttribute('data-index', index);
    songList.appendChild(li);
  });
}

function detectCategory(filename) {
  const name = filename.toLowerCase();
  if (name.includes("bhajan")) return "Bhajan";
  if (name.includes("instrumental")) return "Instrumental";
  return "Songs";
}

window.onload = async () => {
  songs = await loadSongsFromDB();
  renderSongs();
};
