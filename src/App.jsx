import React, { useState, useEffect } from "react";
import "./style.css";
const App = () => {
  const gridSize = 4;
  const [imageURL, setImageURL] = useState(""); 
  const [revealedPanels, setRevealedPanels] = useState([]); 
  const [guess, setGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  
  const fetchImage = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();
      setImageURL(data.message); 
    } catch (error) {
      console.error("画像の取得に失敗しました:", error);
    }
  };
  
  useEffect(() => {
    fetchImage();
  }, []);
  
  const handlePanelClick = (index) => {
    if (!revealedPanels.includes(index)) {
      setRevealedPanels([...revealedPanels, index]);
    }
  };
  
  const checkAnswer = () => {
    if (guess.toLowerCase().includes("dog")) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };
  return (
    <div id="game-container">
      <h1>4x4 Image Reveal Game</h1>
      <div className="grid">
        {Array.from({ length: gridSize * gridSize }, (_, index) => (
          <div
            key={index}
            className={`panel ${revealedPanels.includes(index) ? "revealed" : ""}`}
            onClick={() => handlePanelClick(index)}
            style={
              revealedPanels.includes(index) && imageURL
                ? {
                    backgroundImage: `url(${imageURL})`,
                    backgroundPosition: `${-100 * (index % gridSize)}px ${
                      -100 * Math.floor(index / gridSize)
                    }px`,
                  }
                : {}
            }
          ></div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="画像の名前を入力 (dogなど)"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button onClick={checkAnswer}>答える</button>
      </div>
      {isCorrect !== null && (
        <p>{isCorrect ? "正解です！" : "不正解です。もう一度挑戦してね！"}</p>
      )}
    </div>
  );
};
export default App;






