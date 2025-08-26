import { useEffect } from "react";

const OAuthSuccess = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = JSON.parse(urlParams.get("user"));

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/home"; // redirect after login
    } else {
      window.location.href = "/login";
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
