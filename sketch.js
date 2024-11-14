let character;
let obstacles = [];
let gameSpeed = 5;
let gravity = 0.6;
let score = 0;
let gameOver = false; // ゲームオーバー状態を示すフラグ

function resetGame() {
  gameOver = false;
  character = new Character();
  obstacles = [];
  score = 0;
  gameSpeed = 5;
  loop(); // ゲームを再開
}

function setup() {
  createCanvas(1200, 800);
  rectMode(CENTER);
  character = new Character();
}

function draw() {
  background(220);
  
  // スコアの表示
  score++;
  textSize(20);
  text("Score: " + score, width - 300, 50);
  
  if (!gameOver && frameCount % 100 === 0) {
    gameSpeed += 1; 
  }

  // キャラクターを更新、表示
  character.update();
  character.display();

  // 障害物を生成、表示、削除
  if (frameCount % 60 === 0 && !gameOver) {
    obstacles.push(new Obstacle());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();

    // キャラクターと障害物の衝突判定
    if (obstacles[i].hits(character)) {
      gameOver = true; // ゲームオーバー状態にする
      noLoop(); // ゲームループを停止
      textSize(32);
      fill(255, 0, 0);
      text('Game Over', width / 2 - 80, height / 2);
      textSize(20);
      fill(0);
      text('クリックして再開', width / 2 - 80, height / 2 + 40); // 再開メッセージ
    }

    // 画面外に出た障害物を削除
    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (gameOver) {
    resetGame(); // ゲームオーバー時にクリックで再開
  } else if (character.onGround()) {
    character.jump(); // 通常時のジャンプ
  }
}

class Character {
  constructor() {
    this.r = 50; // キャラクターのサイズ
    this.x = 50;
    this.y = height - this.r;
    this.velocity = 0;
    this.jumpForce = -15; // ジャンプの強さ
  }

  jump() {
    this.velocity += this.jumpForce; // ジャンプ時の上昇
  }

  update() {
    this.velocity += gravity; // 重力による加速
    this.y += this.velocity;

    // 地面に到達したら位置を固定し、速度をリセット
    if (this.y > height - this.r) {
      this.y = height - this.r;
      this.velocity = 0;
    }
  }

  display() {
    fill(0);
    rect(this.x, this.y, this.r, this.r);
  }

  onGround() {
    return this.y === height - this.r;
  }
}

class Obstacle {
  constructor() {
    this.w = random(20, 50); // 障害物の幅
    this.h = random(40, 80); // 障害物の高さ
    this.x = width;
    this.y = height - this.h;
  }

  update() {
    this.x -= gameSpeed;
  }

  display() {
    fill(0);
    rect(this.x, this.y, this.w, this.h);
  }

  offscreen() {
    return this.x < -this.w;
  }

  hits(character) {
    // キャラクターと障害物が衝突しているかを確認
    return (
      character.x < this.x + this.w &&
      character.x + character.r > this.x &&
      character.y + character.r > this.y
    );
  }
}


