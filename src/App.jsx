import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updateUserPlaces } from "./http.js";

// const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
// const storedPlaces = storedIds.map((id) =>
//   AVAILABLE_PLACES.find((place) => place.id === id)
// );

function App() {
  // const modal = useRef();
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [availablePlaces, setAvailablePlaces] = useState([]);
  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [error, setError] = useState(false);

  // useEffect is executed AFTER every component execution. avoiding infinite loop
  // second argument is dependencies. It determines whether useEffect will be executed again
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const sortedPlaces = sortPlacesByDistance(
  //       AVAILABLE_PLACES,
  //       position.coords.latitude,
  //       position.coords.longitude
  //     );

  //     setAvailablePlaces(sortedPlaces);
  //   });
  // }, []);

  function handleStartRemovePlace(place) {
    // modal.current.open();
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    // modal.current.close();
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    // const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    // if (storedIds.indexOf(id) === -1) {
    // //-1 means its not part of storedIds yet
    //   localStorage.setItem(
    //     "selectedPlaces",
    //     JSON.stringify([id, ...storedIds])
    //   );
    // }
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places.",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      // modal.current.close();

      // const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
      // localStorage.setItem(
      //   "selectedPlaces",
      //   JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
      // );

      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({
          message: error.message || "Failed to delete place",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occured"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        {modalIsOpen && (
          <DeleteConfirmation
            onCancel={handleStopRemovePlace}
            onConfirm={handleRemovePlace}
          />
        )}
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="Error Occured" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
            isLoading={isFetching}
            loadingText="Fetching user places..."
          />
        )}
        {/* <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        /> */}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
