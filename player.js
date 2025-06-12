const fileInput = document.getElementById('fileInput');
const songList = document.getElementById('songList');
const audioPlayer = document.getElementById('audioPlayer');
const categoryButtons = document.querySelectorAll('#categories button');

let songs = [];

fileInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const song = {
      name: file.name,
      blob: arrayBuffer,
      category: detectCategory(file.name),
      type: file.type
    };
    songs.push(song);
  }
  await saveSongsToDB(songs);
  renderSongs();
});

songList.addEventListener('click', async (e) => {
  if (e.target.tagName === 'LI') {
    const index = e.target.getAttribute('data-index');
    const song = songs[index];
    if (song) {
      const blob = new Blob([song.blob], { type: song.type });
      const url = URL.createObjectURL(blob);
      audioPlayer.src = url;
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
