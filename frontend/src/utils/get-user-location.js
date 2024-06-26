const getUserCoordinatesPromise = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      (err) => reject(err),
      { enableHighAccuracy: true }
    );
  });
};

const getAddressPromise = async (latitude, longitude) => {
  const getAddress = () => {
    return new Promise((resolve, reject) => {
      fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
        .then((res) => res.json())
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  };

  return await getAddress();
};

const getUserLocation = async () => {
  const coords = await getUserCoordinatesPromise();
  const res = await getAddressPromise(coords.latitude, coords.longitude);

  const location = {
    latitude: res.lat,
    longitude: res.lon,
    displayAddress: res.display_name,
    city: res.address?.county,
  };
  console.log(res);
  return location;
};

export default getUserLocation;
