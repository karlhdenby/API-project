import { useDispatch } from "react-redux";
import { createSpot } from "../../store/spots";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateSpot() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [lat, setLat] = useState(10)
  const [lng, setLng] = useState(10)
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots);
  const id = Math.max(...Object.keys(spots))

  //   const [url, setUrl] = useState("");
  
  const handleSubmit = async (e) => {
    console.log(id)
    try {
      
      e.preventDefault();
      if (!sessionUser.id) throw new Error("Not logged in")
      const newSpot = { country, address, city, lat, lng, state, description, name, price, ownerId: sessionUser.id };
      // const newImages = [{ ...url }];
      dispatch(createSpot(newSpot));
      // dispatch(createSpotImages(newImages));
  
      setCountry("");
      setAddress("");
      setCity("");
      setDescription("");
      setName("");
      setPrice(0);
      setLat(10);
      setLng(10);
      // setUrl("");
      
      
      navigate(`/spots/${id}`)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Country:</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>
      <div>
        <label>State:</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />
      </div>
      <button type="submit">Create Spot</button>
    </form>
  );
}
