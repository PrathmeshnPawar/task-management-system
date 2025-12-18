import '../App.css';

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">✅</div>
        <h1 className="login-title">TaskFlow</h1>
        <p className="login-subtitle">
          Organize your work and life. Secure and synced with Google.
        </p>

        {/* OAuth must ALWAYS be top-level navigation */}
        <a
          href={`${backendUrl}/oauth2/authorization/google`}
          className="google-login-btn"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          <span>Sign in with Google</span>
        </a>
      </div>
    </div>
  );
};

export default Login;
