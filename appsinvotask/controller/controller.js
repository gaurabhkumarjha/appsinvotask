const User = require("../modules/modules");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return token = jwt.sign({ _id }, 'your_secret_key_here', { expiresIn: '3h' });
}
exports.usersignupfunc = async (req, res) => { // Store a User Signup Details in DB.
  //console.log(req.body);

  try {
    const { name, email, address, latitude, longitude, status, password } = req.body;
    //console.log(email);
    // Check if the username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      email,
      name,
      address,
      latitude,
      longitude,
      status,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    const token = createToken(newUser._id)
    // Respond with success message
    res.status(201);
    res.status(201).json({ message: 'Registration successful', newUser, token });
  } catch (err) {
    console.error('Error during user signup:', err);
    res.status(500).json({ message: 'An error occurred', error: err });
  }
}

exports.changeuserstatus = async (req, res) => { // change user status


  const { id } = req.params;
  const { status } = req.body;
  console.log(status);
  try {

    const Userdata = await User.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );

    await Userdata.save();
    res.status(201).json({ message: 'Status Changed', Userdata });
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.signinuser = async (req, res) => { // User Signin.

  try {
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email });

    // If the user doesn't exist
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Wrong Password' });
    }

    // Create a JWT token for the user

    //const token = jwt.sign({ userId: user._id }, 'your_secret_key_here', { expiresIn: '1h' });
    const token = createToken(user._id)
    // Respond with the token
    res.status(200).json({ token, email });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err });
  }
}
// Function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers

  const toRadians = (degree) => (degree * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
};
exports.getDistance = async (req, res) => { // Get Distance using longitude and latitude

  var user_id;
  if (req.user) {
    user_id = req.user._id;
  } else {
    return res.status(400).json({ message: 'UserID Not found' });;
  }
  try {
    //console.log(user_id);
    const { destlongi, destlati } = req.body;
    console.log("Req.Body", req.body);
    const UserData = await User.findOne({ _id: user_id });
    console.log(UserData);
    const userLongitude = await UserData.longitude;
    console.log("User Longitude", userLongitude);
    const userLatitude = await UserData.latitude;
    console.log("User Latitude", userLatitude);

    const destinationLongitude = destlongi;   //123.456; // destination longitude
    const destinationLatitude = destlati;   // 789.012; //  destination latitude
    const distance = calculateDistance(
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude
    );
    res.status(200).json({ message: "Distance is: ", distance });
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getuserbyweeks = async (req, res) => { // Get User By Weeks
  try {

    const { day } = req.body;
    console.log(day);
    var weeknumber= -1;
    if (day === "monday") {
      weeknumber = 1;
    } else if (day === "tuesday") {
      weeknumber = 2;
    } else if (day === "wednesday") {
      weeknumber = 3;
    } else if (day === "thrusday") {
      weeknumber = 4;
    } else if (day === "friday") {
      weeknumber = 5;
    } else if (day === "staurday") {
      weeknumber = 6;
    } else if (day === "sunday") {
      weeknumber = 0;
    }
    const UserData = await User.find({ week: weeknumber });

    if (!UserData || UserData.length === 0) {
      return res.status(404).json({ message: "No users found for the specified week" });
    } else {
      res.status(200).json({ message: "On day" + " " + day + " " + "user details", UserData });
    }

  } catch (err) {
    res.status(500).json(err);
  }
}