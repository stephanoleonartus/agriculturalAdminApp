// Signup.jsx
import React, { useState } from "react";
import axios from "../api/axios"; // Import axios
import { useNavigate } from "react-router-dom"; // For redirection after signup
import "../styles/Signup.css";

// Matches REGIONS from backend (api/accounts/models.py)
const regionOptions = [
    { value: "", label: "Select Region" },
    { value: "arusha", label: "Arusha" },
    { value: "dar_es_salaam", label: "Dar es Salaam" },
    { value: "dodoma", label: "Dodoma" },
    { value: "geita", label: "Geita" },
    { value: "iringa", label: "Iringa" },
    { value: "kagera", label: "Kagera" },
    { value: "katavi", label: "Katavi" },
    { value: "kigoma", label: "Kigoma" },
    { value: "kilimanjaro", label: "Kilimanjaro" },
    { value: "lindi", label: "Lindi" },
    { value: "manyara", label: "Manyara" },
    { value: "mara", label: "Mara" },
    { value: "mbeya", label: "Mbeya" },
    { value: "morogoro", label: "Morogoro" },
    { value: "mtwara", label: "Mtwara" },
    { value: "mwanza", label: "Mwanza" },
    { value: "njombe", label: "Njombe" },
    { value: "pwani", label: "Pwani" },
    { value: "rukwa", label: "Rukwa" },
    { value: "ruvuma", label: "Ruvuma" },
    { value: "shinyanga", label: "Shinyanga" },
    { value: "simiyu", label: "Simiyu" },
    { value: "singida", label: "Singida" },
    { value: "songwe", label: "Songwe" },
    { value: "tabora", label: "Tabora" },
    { value: "tanga", label: "Tanga" },
    { value: "zanzibar", label: "Zanzibar" },
];

const tradeRoleOptions = [
    { value: "", label: "Select Trade Role" },
    { value: "customer", label: "Buyer (Customer)" },
    { value: "farmer", label: "Farmer" },
    { value: "supplier", label: "Supplier" },
];

const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
];

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", // Added username
    email: "",
    firstName: "", // Changed from fullName
    lastName: "",  // Changed from fullName
    password: "",
    confirmPassword: "",
    tradeRole: "", // user_type
    region: "",
    gender: "",
    companyName: "",
    telephoneNumber: "", // phone_number (includes country code)
    agreedToTerms: false,
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    if (!formData.agreedToTerms) {
      setErrors({ agreedToTerms: "You must agree to the terms and policy." });
      return;
    }

    const backendData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        user_type: formData.tradeRole,
        region: formData.region,
        gender: formData.gender,
        company_name: formData.companyName,
        phone_number: formData.telephoneNumber,
        agreed_to_terms: formData.agreedToTerms, // Serializer expects this
    };

    try {
      const response = await axios.post("http://localhost:8000/api/auth/register/", backendData);

      console.log("Signup Response:", response.data);
      setMessage("✅ Signup successful! Redirecting to login...");

      // Store tokens and user info
      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));

      // For now, just navigating to login page
      setTimeout(() => {
        navigate("/login"); // Assuming a login route exists
      }, 2000);

    } catch (error) {
      console.error("Signup Error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        const backendErrors = error.response.data;
        let flatErrors = {};
        for (const key in backendErrors) {
            if (Array.isArray(backendErrors[key])) {
                flatErrors[key] = backendErrors[key].join(" ");
            } else {
                flatErrors[key] = backendErrors[key];
            }
        }
        setErrors(flatErrors);
        setMessage("❌ Signup failed. Please check the form for errors.");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        setMessage("❌ Signup failed. No response from server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        setMessage("❌ Signup failed. An unexpected error occurred.");
      }
    }
  };

  // Helper to display field errors
  const FieldError = ({ fieldName }) => {
    return errors[fieldName] ? <p className="error-message">{errors[fieldName]}</p> : null;
  }

  return (
    <div className="signup-page">
      <h1>📝 Sign Up for Agrilink</h1>
      {message && <p className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="signup-form">

        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <FieldError fieldName="username" />

        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <FieldError fieldName="email" />

        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <FieldError fieldName="first_name" /> {/* Backend uses first_name */}

        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <FieldError fieldName="last_name" /> {/* Backend uses last_name */}

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <FieldError fieldName="password" />

        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <FieldError fieldName="confirmPassword" />
        <FieldError fieldName="non_field_errors" /> {/* For general errors like password mismatch */}


        <select name="tradeRole" value={formData.tradeRole} onChange={handleChange} required>
          {tradeRoleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <FieldError fieldName="user_type" /> {/* Backend uses user_type */}

        <select name="region" value={formData.region} onChange={handleChange} required>
          {regionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <FieldError fieldName="region" />

        <select name="gender" value={formData.gender} onChange={handleChange}>
            {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <FieldError fieldName="gender" />

        { (formData.tradeRole === 'supplier' || formData.tradeRole === 'customer') && (
            <>
                <input type="text" name="companyName" placeholder="Company Name (Optional)" value={formData.companyName} onChange={handleChange} />
                <FieldError fieldName="company_name" />
            </>
        )}

        <input type="tel" name="telephoneNumber" placeholder="Telephone (e.g., +255712345678)" value={formData.telephoneNumber} onChange={handleChange} required />
        <FieldError fieldName="phone_number" /> {/* Backend uses phone_number */}
        <FieldError fieldName="telephoneNumber" />

        <div className="terms-agreement">
          <input type="checkbox" id="agreedToTerms" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} />
          <label htmlFor="agreedToTerms">I agree to the <a href="/terms" target="_blank">Terms of Use</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</label>
        </div>
        <FieldError fieldName="agreed_to_terms" />
        <FieldError fieldName="agreedToTerms" />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Signup;
