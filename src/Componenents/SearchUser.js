import React from 'react'

export default function SearchUser(token) {
  return (
    <div>
        {!token ?
          <form onSubmit={searchArtists}>
              <input type="text" onChange={e => setSearchKey(e.target.value)}/>
              <button type={"submit"}>Search</button>
          </form>
          : <h2>Please Login</h2>
        }
    </div>
  )
}
