import './App.css';
import { useState } from 'react';
import axios from 'axios'

function App() {
  const [album, setAlbum] = useState(null)

  const updateAlbum = (e) => {
    setAlbum(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    
    await axios.post('http://localhost:8000/send_album', {
      title: album
    })
    /*
    const id = await get_album_id(album)
    const spotify_songs_list = await get_tracks(id)
    console.log(spotify_songs_list)
    */
  };
  return (
    <div className="App">
      <p>enter an album:</p>

      <form onSubmit={handleSubmit}>
        <input type="text" id="albumName" onChange={(e) => updateAlbum(e)} />
        <button onSubmit={handleSubmit}>
          submit
        </button>
      </form>
    </div>
  );
}

export default App;
