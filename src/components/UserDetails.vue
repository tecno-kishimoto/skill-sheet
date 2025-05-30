<template>  <div v-if="user" class="user-details-container">    <div class="header-section">
      <button @click="goBack" class="back-btn-top">← 戻る</button>
      <h2>社員詳細情報</h2>
      <button @click="downloadExcel" class="excel-btn">📊 Excelダウンロード</button>
    </div>
    <div class="details-grid">
      <div class="detail-item">
        <span class="label">社員番号:</span>
        <span class="value">{{ user.employeeId }}</span>
      </div>
      <div class="detail-item">
        <span class="label">氏名:</span>
        <span class="value">{{ user.name }}</span>
      </div>
      <div class="detail-item">
        <span class="label">部署:</span>
        <span class="value">{{ user.department || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">氏名フリガナ:</span>
        <span class="value">{{ user.nameKana || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">性別:</span>
        <span class="value">{{ formatGender(user.gender) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">生年月日:</span>
        <span class="value">{{ user.birthDate || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">最終学歴:</span>
        <span class="value">{{ user.lastSchool || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">卒業年度:</span>
        <span class="value">{{ user.graduationYear || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">学校名:</span>
        <span class="value">{{ user.schoolName || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">現住所:</span>
        <span class="value">{{ user.address || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">最寄り駅:</span>
        <span class="value">{{ user.nearestStation || '-' }}</span>
      </div>
      <div class="detail-item detail-item-full">
        <span class="label">取得資格:</span>
        <span class="value">{{ user.qualifications || '-' }}</span>
      </div>
    </div>

    <!-- 案件一覧セクションを追加 -->
    <div class="projects-section">
      <div class="projects-header">
        <h3>案件実績</h3>
        <button @click="openProjectAddModal" class="add-project-btn">案件追加</button>
      </div>
      
      <div v-if="userProjects.length > 0" class="projects-table-container">
        <table class="projects-table">
          <thead>
            <tr>
              <th style="width: 25%;">案件名</th>
              <th style="width: 12%;">開始日</th>
              <th style="width: 12%;">終了日</th>
              <th style="width: 20%;">開発言語</th>
              <th style="width: 20%;">作業内容</th>
              <th style="width: 11%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in userProjects" :key="project.id">
              <td>{{ project.projectName }}</td>
              <td>{{ project.startDate }}</td>
              <td>{{ project.endDate }}</td>
              <td>{{ project.developmentLanguage }}</td>
              <td>{{ project.workDetails }}</td>
              <td>
                <button @click="openProjectEditModal(project)" class="edit-btn">編集</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="no-projects">
        <p>案件実績がありません</p>
      </div>
    </div>

    <div class="actions">
      <button @click="goBack">戻る</button>
    </div>    <!-- ProjectAddModal を追加 -->
    <ProjectAddModal 
      :isOpen="isProjectAddModalOpen"
      :userId="userId"
      @close="closeProjectAddModal"
      @project-added="handleProjectAdded"
    />

    <!-- ProjectEditModal を追加 -->
    <ProjectEditModal 
      :isOpen="isProjectEditModalOpen"
      :project="selectedProject"
      @close="closeProjectEditModal"
      @project-updated="handleProjectUpdated"
      @project-deleted="handleProjectDeleted"
    />
  </div>
  <div v-else class="loading">
    <p>ユーザー情報を読み込んでいます...</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useProjectStore } from '../stores/projectStore';
import type { Project } from '../types/project';
import ProjectAddModal from './ProjectAddModal.vue'; // ProjectAddModal をインポート
import ProjectEditModal from './ProjectEditModal.vue'; // ProjectEditModal をインポート
import * as XLSX from 'xlsx';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const projectStore = useProjectStore();

const userId = computed(() => route.params.id as string);
const user = computed(() => userStore.getUserById(userId.value));
const userProjects = computed(() => projectStore.getProjectsByUserId(userId.value).value);

// モーダル状態管理
const isProjectAddModalOpen = ref(false);
const isProjectEditModalOpen = ref(false);
const selectedProject = ref<Project | null>(null);

const formatGender = (genderCode?: string) => {
  if (genderCode === 'male') return '男性';
  if (genderCode === 'female') return '女性';
  if (genderCode === 'other') return 'その他';
  return '-';
};

const goBack = () => {
  router.push({ name: 'UserList' });
};

// 案件追加関連
const openProjectAddModal = () => {
  isProjectAddModalOpen.value = true;
};

const closeProjectAddModal = () => {
  isProjectAddModalOpen.value = false;
};

const handleProjectAdded = (newProject: Omit<Project, 'id'>) => {
  projectStore.addProject(newProject);
  closeProjectAddModal();
};

const openProjectEditModal = (project: Project) => {
  selectedProject.value = project;
  isProjectEditModalOpen.value = true;
};

const closeProjectEditModal = () => {
  isProjectEditModalOpen.value = false;
  selectedProject.value = null;
};

const handleProjectUpdated = (updatedProject: Project) => {
  projectStore.updateProject(updatedProject);
  closeProjectEditModal();
};

const handleProjectDeleted = (projectId: string) => {
  projectStore.deleteProject(projectId);
  closeProjectEditModal();
};

// Excelダウンロード機能
const downloadExcel = () => {
  if (!user.value) return;

  // 新しいワークブックを作成
  const workbook = XLSX.utils.book_new();

  // 社員基本情報シート
  const userInfoData = [
    ['項目', '内容'],
    ['社員番号', user.value.employeeId],
    ['氏名', user.value.name],
    ['部署', user.value.department || ''],
    ['氏名フリガナ', user.value.nameKana || ''],
    ['性別', formatGender(user.value.gender)],
    ['生年月日', user.value.birthDate || ''],
    ['最終学歴', user.value.lastSchool || ''],
    ['卒業年度', user.value.graduationYear || ''],
    ['学校名', user.value.schoolName || ''],
    ['現住所', user.value.address || ''],
    ['最寄り駅', user.value.nearestStation || ''],
    ['取得資格', user.value.qualifications || '']
  ];

  const userInfoSheet = XLSX.utils.aoa_to_sheet(userInfoData);

  // 列幅を設定
  userInfoSheet['!cols'] = [
    { width: 15 }, // 項目列
    { width: 40 }  // 内容列
  ];

  // 案件実績シート
  const projectData = [
    ['案件名', '案件概要', '開始日', '終了日', '開発言語', 'DB', '使用ツール', '作業内容', '補足']
  ];

  userProjects.value.forEach(project => {
    projectData.push([
      project.projectName,
      project.projectOverview,
      project.startDate,
      project.endDate,
      project.developmentLanguage,
      project.db || '',
      project.tools || '',
      project.workDetails,
      project.notes || ''
    ]);
  });

  const projectSheet = XLSX.utils.aoa_to_sheet(projectData);

  // 案件実績シートの列幅を設定
  projectSheet['!cols'] = [
    { width: 20 }, // 案件名
    { width: 30 }, // 案件概要
    { width: 12 }, // 開始日
    { width: 12 }, // 終了日
    { width: 20 }, // 開発言語
    { width: 15 }, // DB
    { width: 20 }, // 使用ツール
    { width: 30 }, // 作業内容
    { width: 20 }  // 補足
  ];

  // シートをワークブックに追加
  XLSX.utils.book_append_sheet(workbook, userInfoSheet, '社員基本情報');
  XLSX.utils.book_append_sheet(workbook, projectSheet, '案件実績');

  // ファイル名を生成（社員番号_氏名_年月日）
  const today = new Date();
  const dateStr = today.getFullYear() + 
    String(today.getMonth() + 1).padStart(2, '0') + 
    String(today.getDate()).padStart(2, '0');
  const fileName = `${user.value.employeeId}_${user.value.name}_${dateStr}.xlsx`;

  // ファイルをダウンロード
  XLSX.writeFile(workbook, fileName);
};

</script>

<style scoped>
.user-details-container {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px; /* 幅を広げて案件テーブルに対応 */
  margin: 30px auto;
  color: #333;
}

h2 {
  text-align: center;
  color: #007bff;
  margin: 0;
  font-size: 1.8rem;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 30px;
}

.back-btn-top {
  position: absolute;
  left: 0;
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-btn-top:hover {
  background-color: #5a6268;
}

.excel-btn {
  position: absolute;
  right: 0;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.excel-btn:hover {
  background-color: #218838;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.detail-item {
  background-color: #fff;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.detail-item .label {
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.detail-item .value {
  color: #333;
  font-size: 1rem;
  white-space: pre-wrap;
}

.detail-item-full {
  grid-column: 1 / -1;
}

/* 案件一覧のスタイル */
.projects-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.projects-header h3 {
  color: #007bff;
  margin: 0;
  font-size: 1.4rem;
}

.add-project-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-project-btn:hover {
  background-color: #218838;
}

.projects-table-container {
  overflow-x: auto;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.projects-table th,
.projects-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}

.projects-table th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: bold;
}

.projects-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.projects-table tr:hover {
  background-color: #e8f4f8;
}

.edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.no-projects {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.actions button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.actions button:hover {
  background-color: #5a6268;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #555;
}
</style>
