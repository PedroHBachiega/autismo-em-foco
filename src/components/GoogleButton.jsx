import styles from "./GoogleButton.module.css";

function GoogleButton({ onClick, loading, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.googleBtn}
      disabled={loading}
    >
      <svg
        className={styles.googleIcon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.3 0 6.3 1.2 8.6 3.4l6.4-6.4C34.4 2.5 29.5 0 24 0 14.6 0 6.7 5.6 2.9 13.6l7.5 5.8C12 13 17.5 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.5 24.5c0-1.5-.1-3-.4-4.5H24v9h12.7c-.5 2.8-2 5.2-4.2 6.9l6.6 5.1c3.9-3.5 6.4-8.7 6.4-16.5z"
        />
        <path
          fill="#4A90E2"
          d="M10.4 28.9c-1.2-2.5-1.9-5.2-1.9-8.2s.7-5.7 1.9-8.2L2.9 6.6C.7 10.5 0 14.6 0 18.9c0 4.3.7 8.4 2.9 12.3l7.5-5.8z"
        />
        <path
          fill="#FBBC05"
          d="M24 48c6.5 0 11.9-2.1 15.8-5.7l-7.3-5.6c-2.1 1.4-4.7 2.2-8.5 2.2-6.5 0-12-4.3-14-10.2l-7.5 5.8C6.7 42.4 14.6 48 24 48z"
        />
      </svg>
      <span>{loading ? "Aguarde..." : text}</span>
    </button>
  );
}

export default GoogleButton;
