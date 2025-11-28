import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <UIContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);