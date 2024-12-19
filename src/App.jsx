import React, { useState, useEffect } from "react";
import "./style.css";

const App = () => {
  const gridSize = 4; // Grid size (4x4)
  const maxReveals = 6; // Maximum panels that can be revealed
  const [imageURL, setImageURL] = useState(""); // Background image URL
  const [correctBreed, setCorrectBreed] = useState(""); // Correct breed
  const [allBreeds, setAllBreeds] = useState([]); // All available breeds
  const [choices, setChoices] = useState([]); // Options for user
  const [revealedPanels, setRevealedPanels] = useState([]); // Revealed panels
  const [selectedAnswer, setSelectedAnswer] = useState(""); // User's selected answer
  const [isCorrect, setIsCorrect] = useState(null); // Whether the answer is correct

  // API Endpoints
  const randomDogAPI = "https://dog.ceo/api/breeds/image/random";
  const allBreedsAPI = "https://dog.ceo/api/breeds/list/all";

  // Fetch all breeds and then fetch a random dog image
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

      // Extract breed from image URL
      const breed = imageUrl.split("/")[4];
      setCorrectBreed(breed);

      // Generate options
      generateChoices(breed, breeds);
    } catch (error) {
      console.error("Failed to initialize the game:", error);
    }
  };

  // Generate choices including the correct breed
  const generateChoices = (correctBreed, allBreeds) => {
    const shuffledBreeds = [...allBreeds]
      .filter((breed) => breed !== correctBreed)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setChoices([correctBreed, ...shuffledBreeds].sort(() => 0.5 - Math.random()));
  };

  // Handle panel click
  const handlePanelClick = (index) => {
    if (revealedPanels.length < maxReveals && !revealedPanels.includes(index)) {
      setRevealedPanels([...revealedPanels, index]);
    }
  };

  // Check the answer
  const checkAnswer = () => {
    setIsCorrect(selectedAnswer === correctBreed);
  };

  // Reset the game
  const resetGame = () => {
    setRevealedPanels([]);
    setSelectedAnswer("");
    setIsCorrect(null);
    initializeGame();
  };

  // Initialize the game on first render
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div id="game-container">
      <h1>犬種当てゲーム</h1>
      <div
        className="image-background"
        style={{ backgroundImage: `url(${imageURL})` }}
      >
        <div className="grid">
          {Array.from({ length: gridSize * gridSize }, (_, index) => (
            <div
              key={index}
              className={`panel ${revealedPanels.includes(index) ? "revealed" : ""}`}
              onClick={() => handlePanelClick(index)}
            ></div>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="answer">犬種を選択してください:</label>
        <select
          id="answer"
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
        >
          <option value="">選択してください</option>
          {choices.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        <button onClick={checkAnswer}>答える</button>
        <button onClick={resetGame}>リセット</button>
      </div>
      {isCorrect !== null && (
        <div>
          {isCorrect ? (
            <p>正解です！</p>
          ) : (
            <p>
              不正解です。正解は <strong>{correctBreed}</strong> でした。
            </p>
          )}
        </div>
      )}
      <p>めくれるパネルは最大 {maxReveals} 枚です。</p>
    </div>
  );
};

export default App;










