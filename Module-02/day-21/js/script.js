const form = document.querySelector("#signup-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();


  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!username) {
    alert("Username is required");
    return;
  }
  if (!password) {
    alert("Password is required");
    return;
  }
  if (!phone) {
    alert("Phone number is required");
    return;
  }

  
  if (username.length < 2) {
    alert("Username must be at least 2 characters long.");
    return;
  }

  

  const phoneRegex = /^(?:\+?251|0)[79]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    alert("Invalid phone number format. Please enter a valid Ethiopian phone number.");
    return;
  }


  const user = {
    Username: username,
    Password: password,
    Phonenumber: phone
  };

  localStorage.setItem("user", JSON.stringify(user));
  

  alert("Signup successful!");
  form.reset();
});

