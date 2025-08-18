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
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 w-[320px] text-center flex flex-col items-center space-y-4"
      >
        <div className="text-6xl">🎁</div>

        <h2 className="text-2xl font-bold">Reward Claimed!</h2>

        <p className="text-lg text-yellow-300">
          🎉 Congratulations! You’ve successfully unlocked{" "}
          <span className="font-semibold">{rewardName}</span>.
        </p>

        <button
          onClick={onClose}
          className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};