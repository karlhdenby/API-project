import { useDispatch, useSelector } from "react-redux";
import { editSpot, getSpot } from "../../store/spots";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateSpot.css";

export default function UpdateSpot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);


  const [errors, setErrors] = useState({});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!country.trim()) validationErrors.country = "Country is required.";
    if (!address.trim()) validationErrors.address = "Address is required.";
    if (!city.trim()) validationErrors.city = "City is required.";
    if (!state.trim()) validationErrors.state = "State is required.";
    if (description.length < 30) validationErrors.description = "Description must be at least 30 characters long.";
    if (!name.trim()) validationErrors.name = "Name is required.";
    if (price <= 0) validationErrors.price = "Price must be greater than 0.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
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

      const result = await dispatch(editSpot(updatedSpot));
      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      navigate(`/spots/${id}`);
    } catch (error) {
      setErrors({ general: "An unexpected error occurred." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-spot-form">
      <h1>Update Your Spot</h1>
      {errors.general && <p className="error">{errors.general}</p>}

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
          {errors.country && <p className="error">{errors.country}</p>}
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
          {errors.address && <p className="error">{errors.address}</p>}
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            required
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            required
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>

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
      </section>

      <section>
        <h2>Describe your place to guests</h2>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            required
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
      </section>

      <section>
        <h2>Update the title for your spot</h2>
        <div className="form-group">
          <label>Spot Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
      </section>

      <section>
        <h2>Set a base price for your spot</h2>
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
            {errors.price && <p className="error">{errors.price}</p>}
          </div>
        </div>
      </section>

      <button type="submit" className="submit-button">Update Spot</button>
    </form>
  );
}
