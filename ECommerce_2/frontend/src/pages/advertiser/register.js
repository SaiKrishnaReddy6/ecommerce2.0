import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact_number, setContact_number] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    const newAdvertiser = {
      comapanyyName: companyName,
      managerName: managerName,
      email: email,
      password: password,
      contact_number: contact_number,
      location: location,
    };
    console.log("Were");
    console.log(newAdvertiser);
    axios.post("http://localhost:8800/api/advertisers/register", newAdvertiser).then((res,err) => console.log(err))
    // window.location.reload(true);
  };

  return (
    <div className="all">
      <h1>Advertiser Registration</h1>
      <div class="row mb-3">
        <label for="inputEmail3" class="col-sm-2 col-form-label">
          Company Name
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputEmail3"
            required
            onChange={(e) => {
              setCompanyName(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          Manager Name
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputPassword3"
            required
            onChange={(e) => {
              setManagerName(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          Email
        </label>
        <div class="col-sm-10">
          <input
            type="email"
            class="form-control"
            id="inputPassword3"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          Password
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputPassword3"
            value={password}
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
      </div>

      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          Contact Number
        </label>
        <div class="col-sm-10">
          <input
            type="email"
            class="form-control"
            id="inputPassword3"
            required
            onChange={(e) => {
              setContact_number(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          Location
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputPassword3"
            required
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>
      </div>
      
      <button type="submit" class="btn btn-primary" onClick={handleSubmit}>
        Register
      </button>
      <br />
      <label for="inputEmail3" class="col-sm-2 col-form-label">
        Already_a_user?
      </label>
      <button type="button" class="btn btn-link">
        Login
      </button>
    </div>
  );
}

export default Register;
