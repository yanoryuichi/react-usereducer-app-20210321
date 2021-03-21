import { useReducer, useState } from "react";

function App() {
  const [swid, setSwid] = useState(1);

  let [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SEARCHING": {
          return { ...state, searching: true, error: null, response: null };
        }
        case "RESOLVED": {
          return {
            ...state,
            searching: false,
            response: action.response,
            error: null,
          };
        }
        case "ERROR": {
          return {
            ...state,
            searching: false,
            response: null,
            error: action.error,
          };
        }
        default:
          return state;
      }
    },
    {
      searching: false,
      response: null,
      error: null,
    }
  );

  function handleSearch() {
    dispatch({ type: "SEARCHING" });
    fetch("https://swapi.dev/api/people/" + swid)
      .then((response) => {
        if (response.ok === false) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((json) => {
        dispatch({ type: "RESOLVED", response: json });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: "ERROR", error: error.message });
      });
  }

  let { searching, response, error } = state;

  return (
    <div>
      <input
        name="id"
        type="text"
        value={swid}
        onChange={(event) => {
          setSwid(event.target.value);
        }}
      />
      <button onClick={() => handleSearch()}>Search</button>
      <br />
      {error && <div>Error: {error}</div>}
      {searching && <div>Searching...</div>}
      {!searching && response && <>{response.name}</>}
    </div>
  );
}

export default App;
