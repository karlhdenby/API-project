import { useDispatch, useSelector } from "react-redux";
import { editSpot, getSpot } from "../../store/spots";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './UpdateSpot.css'; // Import the CSS file

export default function UpdateSpot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots[id]); // Access the specific spot from the Redux store

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [lat, setLat] = useState(10);
  const [lng, setLng] = useState(10);

  useEffect(() => {
    // Fetch the spot data when the component mounts
    async function fetchSpot() {
      const spotData = await dispatch(getSpot(id));
      if (spotData) {
        setCountry(spotData.country || "");
        setAddress(spotData.address || "");
        setCity(spotData.city || "");
        setState(spotData.state || "");
        setDescription(spotData.description || "");
        setName(spotData.name || "");
        setPrice(spotData.price || 0);
        setLat(spotData.lat || 10);
        setLng(spotData.lng || 10);
      }
    }

    fetchSpot();
  }, [dispatch, id]);

  if (sessionUser.id !== spot?.ownerId) {
    return <p>You are not authorized to edit this spot.</p>;
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!sessionUser.id) throw new Error("Not logged in");
      const updatedSpot = {
        id,
        country,
        address,
        city,
        lat,
        lng,
        state,
        description,
        name,
        price,
        ownerId: sessionUser.id,
      };

      await dispatch(editSpot(updatedSpot));

      navigate(`/spots/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-spot-form">
      <h1>Update Your Spot</h1>
      
      <section>
        <h2>Wheres your place located?</h2>
        <p>Guests will only get your exact address once they book a reservation.</p>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            required
          />
        </div>
        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
          />
        </div>
        <div className="form-inline-group">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              required
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="STATE"
              required
            />
          </div>
        </div>
        <div className="form-inline-group">
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              placeholder="Latitude"
            />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              placeholder="Longitude"
            />
          </div>
        </div>
      </section>

      <section>
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            required
          />
        </div>
      </section>

      <section>
        <h2>Update the title for your spot</h2>
        <p>Catch guests attention with a spot title that highlights what makes your place special.</p>

        <div className="form-group">
          <label>Spot Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            required
          />
        </div>
      </section>

      <section>
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>

        <div className="form-group price-group">
          <label>Price per night (USD)</label>
          <div className="price-input">
            <span>$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Price per night (USD)"
              required
            />
          </div>
        </div>
      </section>
      
      <button type="submit" className="submit-button">Update Spot</button>
    </form>
  );
}
