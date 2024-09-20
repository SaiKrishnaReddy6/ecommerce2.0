const bcrypt = require("bcrypt");
const { Advertiser_sql, Advertiser } = require("../models/advertiser");

exports.register = async (req, res) => {
  const {
    companyName,
    managerName,
    email,
    password,
    contact_number,
    location,
  } = req.body;

  try {
    // Check if Advertiser with the same email already exists
    const user = await Advertiser.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Advertiser with the same email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Advertiser in MongoDB
    const newAdvertiser = new Advertiser({
      email: email,
      password: hashedPassword,
    });
    await newAdvertiser.save();

    // Create new Advertiser in SQL
    const advertiser = await Advertiser_sql.create({
      companyName,
      managerName,
      email,
      contact_number,
      location,
    });
    console.log(advertiser);
    res.status(201).json({ message: "Advertiser created successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  // Find user with the given email
  Advertiser.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log("In !user")
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      console.log(user);
      // Compare password and pass both user and isMatch values
      return user.comparePassword(password, (err, isMatch) => {
        console.log(isMatch)
        if (err) {
          return res.status(500).json({ message: err });
        }

        if (!isMatch) {
          console.log("In !isMatch")
          return res.status(400).json({ message: 'Incorrect email or password' });
        }

        // Store user id in local storage
        // localStorage.setItem('userId', user.email);

        return res.status(200).json({ message: 'Login successful' });
      });
    })
    .catch(err => {
      console.log(isMatch)
      return res.status(500).json({ message: err });
    });
}

exports.update = async (req, res) => {
  const {
    companyName,
    managerName,
    email,
    password,
    contact_number,
    location,
  } = req.body;

  try {
    const advertiser = await Advertiser_sql.update(
      { companyName, managerName, contact_number, location },
      { where: { email } }
    );
    console.log(advertiser);
    res.status(200).json({ message: "Advertiser updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  const { email } = req.body;

  try {
    const advertiser = await Advertiser_sql.destroy({
      where: { email },
    });
    console.log(advertiser);
    res.status(200).json({ message: "Advertiser deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
