import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [seller_organisation_name, setSeller_organisation_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile_number, setMobile_number] = useState("");
  const [address, setAddress] = useState("");
  const [gstIn, setgstIn] = useState("");

  const [date, setDate] = useState("");

//   const Navigate = useNavigate();

  const handleSubmit = () => {
    const newSeller = {
      name: name,
      seller_organisation_name: seller_organisation_name,
      email: email,
      password: password,
      mobile_number: mobile_number,
      address: address,
      gstIn: gstIn,
    };
    console.log("Were");
    console.log(newSeller);
    axios.post("http://localhost:8800/api/sellers/register", newSeller).then((res,err) => console.log(err))
    // window.location.reload(true);
  };

  return (
    <div className="all">
      <h1>Seller Registration</h1>
      <div class="row mb-3">
        <label for="inputEmail3" class="col-sm-2 col-form-label">
          Seller Name
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputEmail3"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          Seller's Organisation Name
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputPassword3"
            required
            onChange={(e) => {
              setSeller_organisation_name(e.target.value);
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
          Mobile Number
        </label>
        <div class="col-sm-10">
          <input
            type="email"
            class="form-control"
            id="inputPassword3"
            required
            onChange={(e) => {
              setMobile_number(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          Address
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputPassword3"
            required
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputPassword3" class="col-sm-2 col-form-label">
          GSTIN Number
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="inputPassword3"
            onChange={(e) => {
              setgstIn(e.target.value);
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
