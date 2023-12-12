import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const CLIENT_ID = "502fe45471834cac8b83dc331948d7fe"
  const REDIRECT_URI = 'http://localhost:3000/'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = "token"
  const SPACE_DELIM = "%20"
  const SCOPES = ["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing", "playlist-read-private", "playlist-read-collaborative", "playlist-modify-private", "playlist-modify-public", "user-library-modify", "user-library-read"]
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIM)

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if(!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
      
    }

    setToken(token)
  })

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })

    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
        <div key={artist.id}>
            {artist.name}
            {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
        </div>
    ))
  }

  const getPlaylists = async (e) => {
    //e.preventDefault()
    const userId = 'niravbarman';
    const url = `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`;
    const {data} = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const playlists = data.items
    
    setPlaylists(playlists.filter((playlist) => {
      return playlist.owner.id === userId}))
  }

  const renderPlaylists = () => {
    return playlists.map(playlist => (
      <a href={playlist.external_urls["spotify"]}>
        <div key={playlist.id}>
            {playlist.name}
            {playlist.images.length ? <img width={"100%"} src={playlist.images[0].url} alt=""/> : <div>No Image</div>}
        </div>
      </a>
    ))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Playlist Curator: Spotify</h1>
          {!token ?
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES_URL_PARAM}`}>Login to Spotify</a>
            : <button onClick={logout}>Logout</button>
          }

          {token ?
            <button onClick={getPlaylists}>Get Playlists</button>
            : <h2>Please Login</h2>
          }

          {renderPlaylists()}
      </header>
    </div>
  );
}

export default App;


/*
{token ?
          <form onSubmit={searchArtists}>
              <input type="text" onChange={e => setSearchKey(e.target.value)}/>
              <button type={"submit"}>Search</button>
          </form>
          : <h2>Please Login</h2>
        }

        {renderArtists()}
        */