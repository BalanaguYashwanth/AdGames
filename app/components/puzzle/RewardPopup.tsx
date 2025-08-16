import { useEffect } from "react";
import { RewardPopupProps } from "@/app/types/puzzle";

export const RewardPopup = ({ rewardName, onClose }: RewardPopupProps) => {
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  
  const handleClickOutside = (e: MouseEvent) => {
    const popup = document.getElementById("reward-popup");
    if (popup && !popup.contains(e.target as Node)) {
      onClose();
    }
  };
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div
        id="reward-popup"
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full text-center shadow-lg border border-white/20"
      >
        <h2 className="text-2xl font-bold mb-2">🎁 Reward Claimed!</h2>
        <p className="text-lg mb-4 text-yellow-300">
          You’ve successfully claimed: {rewardName}
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};