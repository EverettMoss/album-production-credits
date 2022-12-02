import './App.css';
import { useEffect, useState } from 'react';
import {get_albums} from './components/information'

function App() {
  const [album, setAlbum] = useState(null)

  const updateAlbum = (e) => {
    setAlbum(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("title: " + album)
    const token = await get_albums(album)
    console.log(token)
    //getTracks()
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
