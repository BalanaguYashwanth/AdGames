"use client";

interface WalletDropdownProps {
  onLogout: () => void;
}

export const WalletDropdown = ({ onLogout }: WalletDropdownProps) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 transition-all duration-200 ease-out transform origin-top-right scale-95 opacity-0 animate-fade-in-up">
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Disconnect</span>
      </button>
    </div>
  );
};
