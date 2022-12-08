import './App.css';
import { useState } from 'react';
import axios from 'axios'

function App() {
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(null)

  const updateAlbum = (e) => {
    setAlbum(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = 'http://localhost:8000/get_credits/' + album
    setLoading(true)
    const info = await axios.get(url)
    setLoading(false)

    console.log(info.data)
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
      {loading && (
        <p>Loading!</p>
      )}
    </div>
  );
}

export default App;
