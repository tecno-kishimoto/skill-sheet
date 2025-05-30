<template>
  <div id="app-container">
    <header>
      <h1>スキルシート管理</h1>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2025 スキルシート管理アプリ</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
})
</script>

<style>
/* グローバルスタイル */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  background-color: #f0f2f5;
  color: #333;
  line-height: 1.6;
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #007bff;
  color: white;
  padding: 1rem 0;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header h1 {
  margin: 0;
  font-size: 2rem;
}

main {
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: 1200px; /* コンテンツの最大幅を設定 */
  margin: 0 auto; /* 中央揃え */
  box-sizing: border-box;
}

footer {
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
}

/* 基本的なフォーム要素のスタイル */
input[type="text"],
input[type="date"],
input[type="number"],
textarea,
select {
  width: calc(100% - 22px); /* paddingとborderを考慮 */
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #0056b3;
}

button.secondary {
    background-color: #6c757d;
}

button.secondary:hover {
    background-color: #545b62;
}

button.danger {
    background-color: #dc3545;
}

button.danger:hover {
    background-color: #c82333;
}


/* モーダルスタイル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  z-index: 1001;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* ボタン間のスペース */
  margin-top: 20px;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: -10px;
  margin-bottom: 10px;
}

/* テーブルスタイル */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #e9ecef;
}

/* リンクやクリック可能な要素のスタイル */
.clickable {
  cursor: pointer;
  color: #007bff;
  text-decoration: none; /* 下線を削除 */
}

.clickable:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>
