<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>案件追加</h2>
      <form @submit.prevent="submitProject">        <div class="form-group">
          <label for="projectName" class="required">案件名:</label>
          <input type="text" id="projectName" v-model="newProject.projectName" required>
        </div>
        <div class="form-group">
          <label for="projectOverview" class="required">案件概要:</label>
          <textarea id="projectOverview" v-model="newProject.projectOverview" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="startDate" class="required">開始日:</label>
            <input 
              type="date" 
              id="startDate" 
              v-model="newProject.startDate" 
              required
              :style="{ colorScheme: 'light' }"
            >
          </div>
          <div class="form-group">
            <label for="endDate" class="required">終了日:</label>
            <input 
              type="date" 
              id="endDate" 
              v-model="newProject.endDate" 
              required
              :style="{ colorScheme: 'light' }"
            >
          </div>
        </div>
        <div class="form-group">
          <label for="developmentLanguage" class="required">開発言語:</label>
          <input type="text" id="developmentLanguage" v-model="newProject.developmentLanguage" required>
        </div>
        <div class="form-group">
          <label for="db">DB:</label>
          <input type="text" id="db" v-model="newProject.db">
        </div>
        <div class="form-group">
          <label for="tools">使用ツール:</label>
          <input type="text" id="tools" v-model="newProject.tools">
        </div>
        <div class="form-group">
          <label for="workDetails" class="required">作業内容:</label>
          <textarea id="workDetails" v-model="newProject.workDetails" required></textarea>
        </div>
        <div class="form-group">
          <label for="notes">補足:</label>
          <textarea id="notes" v-model="newProject.notes"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit">追加</button>
          <button type="button" @click="closeModal">キャンセル</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Project } from '../types/project';

const props = defineProps<{
  isOpen: boolean;
  userId: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'project-added', project: Omit<Project, 'id'>): void;
}>();

const defaultNewProject = (): Omit<Project, 'id'> => ({
  userId: props.userId,
  projectName: '',
  projectOverview: '',
  startDate: '',
  endDate: '',
  developmentLanguage: '',
  db: '',
  tools: '',
  workDetails: '',
  notes: ''
});

const newProject = ref<Omit<Project, 'id'>>(defaultNewProject());

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    newProject.value = defaultNewProject();
  }
});

watch(() => props.userId, (newUserId) => {
  newProject.value.userId = newUserId;
});

const closeModal = () => {
  emit('close');
};

const submitProject = () => {
  if (newProject.value.projectName && 
      newProject.value.projectOverview && 
      newProject.value.startDate && 
      newProject.value.endDate && 
      newProject.value.developmentLanguage && 
      newProject.value.workDetails) {
    emit('project-added', { ...newProject.value });
    closeModal();
  } else {
    alert('必須項目を入力してください。');
  }
};
</script>

<style scoped>
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group label.required::after {
  content: ' *';
  color: #dc3545;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  font-family: inherit;
}

.form-group input[type="date"] {
  color-scheme: light;
}

.form-group input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.7;
  filter: invert(0.5);
}

.form-group input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  border: none;
}

.form-actions button[type="submit"] {
  background-color: #28a745;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background-color: #218838;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.form-actions button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
