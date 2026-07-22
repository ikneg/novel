let data = null;
let images = {};
let loading = true;

// ゲーム状態管理
let gameState = {
  currentScene: 0,
  scenes: [
    {
      text: "ここはどこだろう...",
      character: "normal",
      choices: [
        { text: "周りを見回す", nextScene: 1 },
        { text: "ここに留まる", nextScene: 2 }
      ]
    },
    {
      text: "暗い廊下が見える。何かが動いている...",
      character: "normal",
      choices: [
        { text: "近づく", nextScene: 3 },
        { text: "逃げる", nextScene: 0 }
      ]
    },
    {
      text: "静寂だけが支配している。",
      character: null,
      choices: [
        { text: "動く", nextScene: 1 }
      ]
    },
    {
      text: "それは...私だった。",
      character: "normal",
      choices: [
        { text: "はじめから", nextScene: 0 }
      ]
    }
  ]
};

// UI要素
let choiceButtons = [];

function setup() {
  createCanvas(800, 600);

  fetch("charactorImageData.json")
    .then((res) => res.json())
    .then((loadedData) => {
      data = loadedData;
      console.log("loaded JSON:", data);

      const keys = Object.keys(data);
      if (keys.length === 0) {
        throw new Error("JSON にデータがありません");
      }

      keys.forEach((key) => {
        loadImage(
          data[key],
          (img) => {
            images[key] = img;
            console.log(`loaded image ${key}`);
            if (Object.keys(images).length === keys.length) {
              loading = false;
            }
          },
          (err) => {
            console.error(`loadImage error ${key}`, err);
            loading = false;
          }
        );
      });
    })
    .catch((err) => {
      console.error("fetch JSON error", err);
      loading = false;
    });
}

function draw() {
  background(10, 10, 15);

  if (loading) {
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text("Loading...", width / 2, height / 2);
    return;
  }

  // 背景
  drawBackgroundPanel();

  // キャラクター表示
  drawCharacter();

  // テキストボックス
  drawTextBox();

  // 選択肢ボタン
  drawChoiceButtons();
}

function drawBackgroundPanel() {
  fill(20, 20, 30);
  rect(0, 0, width, height);
}

function drawCharacter() {
  const scene = gameState.scenes[gameState.currentScene];
  if (scene.character && images[scene.character]) {
    image(images[scene.character], width / 2 - 80, 50, 160, 280);
  }
}

function drawTextBox() {
  const scene = gameState.scenes[gameState.currentScene];

  // テキストボックス背景
  fill(40, 40, 60);
  stroke(100, 100, 120);
  strokeWeight(2);
  rect(30, 350, width - 60, 150, 10);

  // テキスト描画
  fill(230);
  textSize(18);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  text(scene.text, 50, 370, width - 100, 120);
}

function drawChoiceButtons() {
  const scene = gameState.scenes[gameState.currentScene];
  choiceButtons = [];

  const buttonWidth = 280;
  const buttonHeight = 40;
  const startY = 520;
  const spacing = 10;

  scene.choices.forEach((choice, index) => {
    const y = startY + index * (buttonHeight + spacing);
    const x = (width - buttonWidth) / 2;

    // ボタン描画
    fill(70, 70, 100);
    stroke(120, 120, 160);
    strokeWeight(2);
    rect(x, y, buttonWidth, buttonHeight, 5);

    // テキスト
    fill(220);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(choice.text, x + buttonWidth / 2, y + buttonHeight / 2);

    // ボタン情報を保存
    choiceButtons.push({
      x: x,
      y: y,
      width: buttonWidth,
      height: buttonHeight,
      nextScene: choice.nextScene
    });
  });
}

function mousePressed() {
  choiceButtons.forEach((button) => {
    if (
      mouseX > button.x &&
      mouseX < button.x + button.width &&
      mouseY > button.y &&
      mouseY < button.y + button.height
    ) {
      gameState.currentScene = button.nextScene;
    }
  });
}
