# 🍇 Seed It — A DeFi-Powered Merge Puzzle Game

Welcome to **Seed It**, a whimsical HTML5 puzzle game built for the **Superseed** Ethereum Layer 2 community.  
Merge magical fruits, unlock powerful levels, and experience DeFi in a fun, interactive way.

---

## 🌱 Concept

Seed It is a gravity-based fruit merging game where players evolve seeds into powerful fruits.  
The game introduces **DeFi game mechanics** inspired by the **Superseed L2 chain**, making Web3 intuitive and fun.

Built for browser play (GitHub Pages ready), it runs entirely client-side.

---

## 🎮 Gameplay Overview

- **Drop fruits** by clicking or pressing spacebar
- **Control direction** of drop by moving the mouse
- **Merge identical fruits** to evolve into higher-level fruits
- **Stack carefully** — when the fruit pile hits the red line, it’s game over!
- **Combo chains** give bonus points

---

## 🧩 Fruit Evolution Tree

| Level | Fruit        | Emoji | Size(px) | Mass |
|-------|--------------|-------|----------|------|
| 0     | Cranberry    | 🫐    | 39       | 1    |
| 1     | Cherry       | 🍒    | ↑        | 1.2  |
| ...   | ...          | ...   | ...      | ...  |
| 13    | Superseed Essence | 🧬 | 220     | 25   |

Each fruit merge increases score exponentially and unlocks its icon in the evolution tracker.

---

## 🔁 Game Loop

1. Fruit drops from above  
2. If it lands on a same-level fruit → they **merge**  
3. Merging increases score, fills combo meter  
4. Game ends if the top red line is reached  

---

## 💡 Superseed DeFi Integration

Superpowers represent **DeFi mechanics** from the **Superseed L2 protocol**:

| Power            | Description |
|------------------|-------------|
| 🌀 **Supercollateral** | "Auto-repaying loan" – lets you clear all fruits of one type |
| 🌟 **Proof of Repayment** | Grants score multiplier for 10 seconds (simulates community-repay rewards) |
| 🍍 **SuperCDP** | Borrow one fruit and instantly upgrade it (like collateralized borrowing) |

These superpowers have 2 uses each and are visually tracked with badges.  
(They can be toggled on/off depending on contest version.)

---

## 🧠 Scoring System

- Each fruit level gives exponentially more points  
- Combos multiply score for quick successive merges  
- High scores are stored using `localStorage`

---

## 🧪 Technical Stack

- Vanilla JavaScript, HTML5, and CSS3  
- No frameworks, fully client-side  
- Responsive design for HD / 4K monitors  
- Assets loaded from `/assets/`

---

## ⚙️ How to Run

1. Open `index.html` in your browser  
2. Or upload to GitHub Pages or Vercel  
3. Play instantly — no install needed

---

## 🌐 About Superseed

[Superseed.xyz](https://superseed.xyz) is a Layer 2 Ethereum chain that enables **self-repaying scaling** for onchain users.  
It simplifies DeFi with repay-friendly infrastructure, empowering users through a gamified economic system.  
Seed It introduces these ideas in an intuitive, accessible format.

---

## ✨ Built With ❤️ for the Superseed Community
