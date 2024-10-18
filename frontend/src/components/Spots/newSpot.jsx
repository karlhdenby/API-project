import { useDispatch } from "react-redux";
import { createSpot, createSpotImages } from "../../store/spots";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './CreateSpot.css';

export default function CreateSpot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [lat, setLat] = useState(10);
  const [lng, setLng] = useState(10);
  const sessionUser = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!country) validationErrors.country = "Country is required.";
    if (!address) validationErrors.address = "Address is required.";
    if (!city) validationErrors.city = "City is required.";
    if (!state) validationErrors.state = "State is required.";
    if (description.length < 30) validationErrors.description = "Description must be at least 30 characters long.";
    if (!name) validationErrors.name = "Name is required.";
    if (price <= 0) validationErrors.price = "Price must be greater than 0.";
    if (!previewImage) validationErrors.previewImage = "Preview image is required.";

    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (!sessionUser.id) throw new Error("Not logged in");

      const newSpot = {
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

      const createdSpot = await dispatch(createSpot(newSpot))
      console.log(createdSpot)

      if (createdSpot.errors) {
        setErrors(createdSpot.errors);
        setDisabled(true);
        return;
      }

      const newImages = [
        { url: previewImage, spotId: createdSpot, preview: true },
        { url: imageOne, spotId: createdSpot, preview: false },
        { url: imageTwo, spotId: createdSpot, preview: false },
        { url: imageThree, spotId: createdSpot, preview: false },
        { url: imageFour, spotId: createdSpot, preview: false },
      ].filter(image => image.url.trim() !== "");

      if (newImages.length > 0) {
        try {
          await dispatch(createSpotImages(newImages));
        } catch (imageError) {
          setErrors({ images: "An error occurred while uploading images. Please try again." });
          setDisabled(false);
          return;
        }
      }

     
      setCountry("");
      setAddress("");
      setCity("");
      setDescription("");
      setName("");
      setPrice(0);
      setLat(10);
      setLng(10);
      setImageOne("");
      setImageTwo("");
      setImageThree("");
      setImageFour("");
      setPreviewImage("");

      navigate(`/spots/${createdSpot.id}`)

    } catch (error) {
      setErrors({ general: error.message });
      setDisabled(false);
    }

    
  };


  return (
    <form onSubmit={handleSubmit} className="create-spot-form">
      <h1>Create a New Spot</h1>

      {errors.general && <p className="error">{errors.general}</p>}

      <section>
        <h2>Where is your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation.</p>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            
          />
          {errors.country && <p className="error">{errors.country}</p>}
        </div>
        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street Address"
            
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>
        <div className="form-inline-group">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              
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
              
            />
            {errors.state && <p className="error">{errors.state}</p>}
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
            {errors.lat && <p className="error">{errors.lat}</p>}
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              placeholder="Longitude"
            />
            {errors.lng && <p className="error">{errors.lng}</p>}
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
            
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
      </section>

      <section>
        <h2>Create a title for your spot</h2>
        <p>Catch guests attention with a spot title that highlights what makes your place special.</p>

        <div className="form-group">
          <label>Spot Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            
          />
          {errors.name && <p className="error">{errors.name}</p>}
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
              
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2>Liven up your spot with photos</h2>
        <p>Submit at least one photo to publish your spot.</p>

        <div className="form-group">
          <label>Preview Image URL</label>
          <input
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
          />
          {errors.previewImage && <p className="error">{errors.previewImage}</p>}
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={imageOne}
            onChange={(e) => setImageOne(e.target.value)}
            placeholder="Image URL"
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={imageTwo}
            onChange={(e) => setImageTwo(e.target.value)}
            placeholder="Image URL"
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={imageThree}
            onChange={(e) => setImageThree(e.target.value)}
            placeholder="Image URL"
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={imageFour}
            onChange={(e) => setImageFour(e.target.value)}
            placeholder="Image URL"
          />
        </div>
        {errors.images && <p className="error">{errors.images}</p>}
      </section>

      <button disabled={disabled} type="submit" className="submit-button">{disabled ? "Submitting..." : "Create Spot"}</button>
    </form>
  );
}
