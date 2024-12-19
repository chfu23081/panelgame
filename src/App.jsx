import React, { useState, useEffect } from "react";
import "./style.css";
const App = () => {
  const gridSize = 4; // グリッドのサイズ（4×4）
  const maxReveals = 6; // 最大でめくれるパネルの数
  const [imageURL, setImageURL] = useState(""); // 背景画像URL
  const [correctBreed, setCorrectBreed] = useState(""); // 正しい犬種
  const [allBreeds, setAllBreeds] = useState([]); // すべての犬種
  const [choices, setChoices] = useState([]); // 選択肢
  const [revealedPanels, setRevealedPanels] = useState([]); // 表示されているパネルの管理
  const [selectedAnswer, setSelectedAnswer] = useState(""); // ユーザーの選択
  const [isCorrect, setIsCorrect] = useState(null); // 答えが正しいかどうかの状態
  // Dog CEO APIのエンドポイント
  const randomDogAPI = "https://dog.ceo/api/breeds/image/random";
  const allBreedsAPI = "https://dog.ceo/api/breeds/list/all";
  // 犬種リストを取得
  const fetchAllBreeds = async () => {
    try {
      const response = await fetch(allBreedsAPI);
      const data = await response.json();
      const breeds = Object.keys(data.message);
      setAllBreeds(breeds); // 犬種リストを設定
    } catch (error) {
      console.error("犬種リストの取得に失敗しました:", error);
    }
  };
  // ランダムな犬画像を取得
  const fetchRandomDog = async () => {
    try {
      const response = await fetch(randomDogAPI);
      const data = await response.json();
      const imageUrl = data.message;
      setImageURL(imageUrl); // 背景画像を設定
      // URLから犬種を抽出 (例: "https://images.dog.ceo/breeds/hound-afghan/n02105412_811.jpg")
      const breed = imageUrl.split("/")[4];
      setCorrectBreed(breed); // 正解の犬種を設定
      // 選択肢を作成
      generateChoices(breed);
    } catch (error) {
      console.error("ランダムな犬画像の取得に失敗しました:", error);
    }
  };
  // 選択肢を生成
  const generateChoices = (correctBreed) => {
    let options = [...allBreeds];
    if (!options.includes(correctBreed)) {
      options.push(correctBreed); // 正解の犬種をリストに追加
    }
    
    // シャッフルして、重複しない4つの選択肢を選ぶ
    const uniqueChoices = Array.from(new Set([correctBreed, ...options]))
      .sort(() => 0.5 - Math.random())
      .slice(0, 4); // 必ず4つ選択する
    
    setChoices(uniqueChoices.sort(() => 0.5 - Math.random())); // 再シャッフルして設定
  };
  
  // 最初のレンダリング時に犬種リストと画像を取得
  useEffect(() => {
    fetchAllBreeds();
    fetchRandomDog();
  }, []);
  // パネルをクリックした時の処理
  const handlePanelClick = (index) => {
    if (revealedPanels.length < maxReveals && !revealedPanels.includes(index)) {
      setRevealedPanels([...revealedPanels, index]);
    }
  };
  // 答えを確認する処理
  const checkAnswer = () => {
    if (selectedAnswer === correctBreed) {
      setIsCorrect(true); // 正解の場合
    } else {
      setIsCorrect(false); // 不正解の場合
    }
  };
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








