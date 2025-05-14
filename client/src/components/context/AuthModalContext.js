import { createContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const triggerAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthModalContext.Provider value={{ showAuthModal, triggerAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export default AuthModalContext;
