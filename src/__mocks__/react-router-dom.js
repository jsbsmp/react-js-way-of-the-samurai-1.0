import React from 'react';

// We mock NavLink to be a simple anchor tag. It will accept the props
// your real NavLink component uses, like `to` and `children`,
// preventing the test from crashing.
export const NavLink = ({ children, to, className }) => {
    // The className prop might be a function, so we handle that case.
    const appliedClassName = typeof className === 'function' ? className({ isActive: false }) : className;
    return <a href={to} className={appliedClassName}>{children}</a>;
};

// Mock other exports from react-router-dom if your tests need them.
// For now, NavLink is the one causing the failure.