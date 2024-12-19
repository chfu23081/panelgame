import React, { useState, useEffect } from "react";
import "./style.css";
const App = () => {
  const gridSize = 4; // グリッドのサイズ（4×4）
  const maxReveals = 4; // 最大でめくれるパネルの数
  const [imageURL, setImageURL] = useState(""); // 背景画像URL
  const [revealedPanels, setRevealedPanels] = useState([]); // 表示されているパネルの管理
  const [guess, setGuess] = useState(""); // ユーザーの答え
  const [isCorrect, setIsCorrect] = useState(null); // 答えが正しいかどうかの状態
  // Dog APIから画像を取得する
  const fetchImage = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();
      setImageURL(data.message); // 背景画像を設定
    } catch (error) {
      console.error("画像の取得に失敗しました:", error);
    }
  };
  // 最初のレンダリング時に画像を取得
  useEffect(() => {
    fetchImage();
  }, []);
  // パネルをクリックした時の処理
  const handlePanelClick = (index) => {
    if (revealedPanels.length < maxReveals && !revealedPanels.includes(index)) {
      setRevealedPanels([...revealedPanels, index]); // クリックしたパネルを表示リストに追加
    }
  };
  // 答えを確認する処理
  const checkAnswer = () => {
    if (guess.toLowerCase().includes("dog")) {
      setIsCorrect(true); // 正解の場合
    } else {
      setIsCorrect(false); // 不正解の場合
    }
  };
  return (
    <div id="game-container">
      <h1>4x4 Image Reveal Game</h1>
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
        <input
          type="text"
          placeholder="画像の名前を入力 (dog など)"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button onClick={checkAnswer}>答える</button>
      </div>
      {isCorrect !== null && (
        <p>{isCorrect ? "正解です！" : "不正解です。もう一度挑戦してね！"}</p>
      )}
      <p>めくれるパネルは最大 {maxReveals} 枚です。</p>
    </div>
  );
};
export default App;







