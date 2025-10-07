"use client";

import { createContext, useContext, useState } from "react";

export const ClerkContext = createContext<IUser | null>(null);

export const ClerkContextProvider = ({
    user,
    children,
}: {
    user: IUser | null;
    children: React.ReactNode;
}) => {
    return (
        <ClerkContext.Provider value={user}>{children}</ClerkContext.Provider>
    );
};

export const useClerkContext = () => useContext(ClerkContext);
