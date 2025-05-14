import { useContext, useEffect, useState } from 'react';
import AuthModalContext from '../context/AuthModalContext';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { showAuthModal, closeAuthModal } = useContext(AuthModalContext);
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (showAuthModal) {
      setVisible(true);
      setIsClosing(false);
    }
  }, [showAuthModal]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeAuthModal();
      setVisible(false);
    }, 300); 
  };

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${isClosing ? styles.overlayFadeOut : ''}`}>
      <div className={styles.modal}>
        <h2>You must be logged in</h2>
        <p>Log in to like songs, create playlists, and more.</p>
        <div className={styles.buttons}>
          <button className={styles.loginButton} onClick={() => (window.location.href = "/login")}>
            Log In
          </button>
          <button className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
