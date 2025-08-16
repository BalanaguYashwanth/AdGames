export const CompletedScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 text-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 z-10">
        <h1 className="text-4xl font-bold mb-4">🏆 You're a Puzzle Master!</h1>
        <p className="text-lg">
          You have successfully completed all the levels.
        </p>
        <p className="text-lg mt-2">
          Stay tuned for future updates and new challenges!
        </p>
      </div>
    </div>
  );
};