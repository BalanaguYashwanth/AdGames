"use client";

import { useState, useEffect, useRef } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { WalletDropdown } from "./WalletDropdown";

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const WalletConnectButton = () => {
  const { login, logout, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const connectedWallet = wallets[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  if (!ready) return null;

  return (
    <div className="absolute top-4 right-6 z-10">
      {authenticated && connectedWallet ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <span>{formatAddress(connectedWallet.address)}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && <WalletDropdown onLogout={handleLogout} />}
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Select Wallet
        </button>
      )}
    </div>
  );
};
