import React, { useState, useEffect } from "react";
import "./style.css";

const App = () => {
  const size = 4; 
  const max = 6; 
  const [image, setImageURL] = useState(""); 
  const [correct, setCorrectBreed] = useState(""); 
  const [Breeds, setAllBreeds] = useState([]); 
  const [choice, setChoices] = useState([]); 
  const [Panels, setRevealedPanels] = useState([]); 
  const [Answer, setSelectedAnswer] = useState(""); 
  const [isCorrect, setIsCorrect] = useState(null); 
  const DogAPI = "https://dog.ceo/api/breeds/image/random";
  const allDogAPI = "https://dog.ceo/api/breeds/list/all";
  const initializeGame = async () => {
    try {
      const bResponse = await fetch(allDogAPI);
      const bData = await bResponse.json();
      const breeds = Object.keys(bData.message);
      setAllBreeds(breeds);
      const dResponse = await fetch(DogAPI);
      const dData = await dResponse.json();
      const image = dData.message;
      setImageURL(image);
      const breed = image.split("/")[4];
      setCorrectBreed(breed);
      generateChoices(breed, breeds);
    } catch (error) {
      console.error("Failed to initialize the game:", error);
    }
  };
  const generateChoices = (correct, Breeds) => {
    const shuffledBreeds = [...Breeds]
      .filter((breed) => breed !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setChoices([correct, ...shuffledBreeds].sort(() => 0.5 - Math.random()));
  };
  const handlePanelClick = (index) => {
    if (Panels.length < maxReveals && !Panels.includes(index)) {
      setRevealedPanels([...Panels, index]);
    }
  };
  const checkAnswer = () => {
    setIsCorrect(Answer === correct);
    const allIndexes = Array.from({ length: size * size }, (_, i) => i);
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
      <div className="image-background" style={{ backgroundImage: `url(${image})` }}>
        <div className="grid">
          {Array.from({ length: size * size }, (_, index) => (
            <div key={index} className={`panel ${Panels.includes(index) ? "revealed" : ""}`}　onClick={() => handlePanelClick(index)}>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="answer">犬種を選択しよう : </label>
        <select id="answer" value={Answer} onChange={(e) => setSelectedAnswer(e.target.value)}>
          <option value=""> 選択してね </option>
          {choices.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        <button onClick={checkAnswer}> 答える </button>
        <button onClick={resetGame}> リセット </button>
      </div>
        {isCorrect !== null && (<div> {isCorrect ? (<p>すごい！正解！！！</p>) : (<p> 残念不正解！！正解は <strong>{correctBreed}</strong> でした！！！</p>)}
      </div>
      )}
      <p>めくれるパネルは{max}枚までだよ</p>
    </div>
  );
};
export default App;










