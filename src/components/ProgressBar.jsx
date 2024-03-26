import { useEffect, useState } from "react";

export default function ProgressBar({ timer }) {
  const [timeRemaining, setTimeRemaining] = useState(timer);

  // use useEffect to avoid infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      //   console.log("INTERVAL");
      setTimeRemaining((prevTime) => prevTime - 10);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return <progress value={timeRemaining} max={timer} />;
}
