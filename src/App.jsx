import React, { useState, useEffect } from "react";
import "./style.css";

const App = () => {
  const gridSize = 4; 
  const maxReveals = 6; 
  const [imageURL, setImageURL] = useState(""); 
  const [correctBreed, setCorrectBreed] = useState(""); 
  const [allBreeds, setAllBreeds] = useState([]); 
  const [choices, setChoices] = useState([]); 
  const [revealedPanels, setRevealedPanels] = useState([]); 
  const [selectedAnswer, setSelectedAnswer] = useState(""); 
  const [isCorrect, setIsCorrect] = useState(null); 
  const randomDogAPI = "https://dog.ceo/api/breeds/image/random";
  const allBreedsAPI = "https://dog.ceo/api/breeds/list/all";
  const initializeGame = async () => {
    try {
      const breedResponse = await fetch(allBreedsAPI);
      const breedData = await breedResponse.json();
      const breeds = Object.keys(breedData.message);
      setAllBreeds(breeds);

      const dogResponse = await fetch(randomDogAPI);
      const dogData = await dogResponse.json();
      const imageUrl = dogData.message;
      setImageURL(imageUrl);
      const breed = imageUrl.split("/")[4];
      setCorrectBreed(breed);
      generateChoices(breed, breeds);
    } catch (error) {
      console.error("Failed to initialize the game:", error);
    }
  };
  const generateChoices = (correctBreed, allBreeds) => {
    const shuffledBreeds = [...allBreeds]
      .filter((breed) => breed !== correctBreed)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setChoices([correctBreed, ...shuffledBreeds].sort(() => 0.5 - Math.random()));
  };
  const handlePanelClick = (index) => {
    if (revealedPanels.length < maxReveals && !revealedPanels.includes(index)) {
      setRevealedPanels([...revealedPanels, index]);
    }
  };
  const checkAnswer = () => {
    setIsCorrect(selectedAnswer === correctBreed);
    const allIndexes = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    setRevealedPanels(allIndexes);
  };
  const resetGame = () => {
    setRevealedPanels([]);
    setSelectedAnswer("");
    setIsCorrect(null);
    initializeGame();
  };
  useEffect(() => {
    initializeGame();
  }, []);
  return (
    <div id="game-container">
      <h1>この犬の犬種は何かな？？</h1>
      <div　className="image-background"　style={{ backgroundImage: `url(${imageURL})` }}>
        <div className="grid">
          {Array.from({ length: gridSize * gridSize }, (_, index) => (
            <div　key={index}　className={`panel ${revealedPanels.includes(index) ? "revealed" : ""}`}　onClick={() => handlePanelClick(index)}>

            </div>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="answer">犬種を選択しよう:</label>
        <select　id="answer"　value={selectedAnswer}　onChange={(e) => setSelectedAnswer(e.target.value)}>
          <option value="">選択してね</option>
          {choices.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        <button onClick={checkAnswer}>答える</button>
        <button onClick={resetGame}>リセット</button>
      </div>
      {isCorrect !== null && (<div>　{isCorrect ? (
            <p>すごい！正解！！！</p>) : (<p> 残念不正解！！正解は <strong>{correctBreed}</strong> でした！！！</p>
          )}
        </div>
      )}
      <p>めくれるパネルは{maxReveals} 枚までだよ</p>
    </div>
  );
};
export default App;










