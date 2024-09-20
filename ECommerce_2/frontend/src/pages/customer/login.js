import React, { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  //const [name, setName] = useState("");
  //const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [mobile_number, setMobile_number] = useState("");
//   const [address, setAddress] = useState("");

const handleSubmit=async(e)=>{
    const Login_Data={
      email: email,
      password: password,
    }
    e.preventDefault();
    await axios.post("http://localhost:8800/api/customers/login",Login_Data).then((res)=>{
     if(res.data.message){setError(true);console.log(loginStatus);console.log("You are not logged in");}
     else {setLoginStatus(res.data[0].email);console.log("Calling from alum_login POST Aprroved");console.log("Correct combination2");console.log(loginStatus);}
    });
    
 };

  return (
    <div className="all">
      <h1>Customer Login</h1>
      
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

      <button type="submit" class="btn btn-primary" onClick={handleSubmit}>
        Register
      </button>
      <br />
      <label for="inputEmail3" class="col-sm-2 col-form-label">
        Already a user?
      </label>
      <button type="button" class="btn btn-link">
        Login
      </button>
    </div>
  );
}

export default Login;
