import { useEffect, useState } from "react";
import "./NumberGame.css";

const NumberGame = () => {
  const [inputValue, setInputValue] = useState("");
  const [points, setPoints] = useState([]);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(false);
  const [current, setCurrent] = useState(1);
  const [title, setTitle] = useState("LET'S PLAY");
  const [fadingPoints, setFadingPoints] = useState([]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    let interval = null;

    if (startTime) {
      interval = setInterval(() => {
        setTime((time) => time + 0.1);
      }, 100);
    } else if (!startTime && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTime, time]);

  const generatePoints = (num) => {
    const containerSize = 360;
    const pointSize = 50;
    const newPoints = [];
    for (let i = 1; i <= num; i++) {
      let x, y, overlap;
      do {
        overlap = false;
        x = Math.floor(Math.random() * (containerSize - pointSize));
        y = Math.floor(Math.random() * (containerSize - pointSize));

        for (let point of newPoints) {
          const distance = Math.sqrt(
            Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
          );
          if (distance < pointSize) {
            overlap = false;
            break;
          }
        }
      } while (overlap);

      newPoints.push({ id: i, x, y });
    }
    setPoints(newPoints);
    setCurrent(1);
    setStartTime(true);
    setTitle("LET'S PLAY");
    setTime(0);
    setFadingPoints([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(inputValue);
    if (!isNaN(num) && num > 0) {
      generatePoints(num);
    }
  };

  const handleClick = (id) => {
    if (startTime) {
      if (id === current) {
        setFadingPoints((prevFadingPoints) => [...prevFadingPoints, id]);
        setCurrent((prevCurrent) => prevCurrent + 1);

        if (current === points.length ) {
          
          setStartTime(false);
          setTitle("ALL CLEARED");
        }
      } else {
        setTitle("GAME OVER");
        setStartTime(false);
      }
    }
  };

  useEffect(() => {
    if (fadingPoints.length > 0) {
      const timeoutId = setTimeout(() => {
        setPoints((prevPoints) =>
          prevPoints.filter((point) => !fadingPoints.includes(point.id))
        );
        setFadingPoints([]);
      }, 2500); 

      return () => clearTimeout(timeoutId);
    }
  }, [fadingPoints]);

  return (
    <div className="container">
      <h1
        className={
          title === "ALL CLEARED"
            ? "game-success"
            : title === "GAME OVER"
            ? "game-over"
            : ""
        }
      >
        {title}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="infor">
          <label>
            Points:
            <input type="number" value={inputValue} onChange={handleChange} />
          </label>
          <label>
            Time:
            <span className="time">{time.toFixed(1)}s</span>
          </label>
          <button type="submit">{startTime ? "Restart" : "Play"}</button>
        </div>
      </form>
      <div className="Number">
        {points.map((point) => (
          <div
            key={point.id}
            className={`pointNumber ${
              fadingPoints.includes(point.id) ? "color-fade-out" : ""
            }`}
            style={{ top: `${point.y}px`, left: `${point.x}px` }}
            onClick={() => handleClick(point.id)}
          >
            {point.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumberGame;
