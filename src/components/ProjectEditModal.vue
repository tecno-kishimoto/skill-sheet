<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>案件編集</h2>
      <form @submit.prevent="submitProject">
        <div class="form-group">
          <label for="editProjectName" class="required">案件名:</label>
          <input type="text" id="editProjectName" v-model="editableProject.projectName" required>
        </div>
        <div class="form-group">
          <label for="editProjectOverview" class="required">案件概要:</label>
          <textarea id="editProjectOverview" v-model="editableProject.projectOverview" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="editStartDate" class="required">開始日:</label>
            <input 
              type="date" 
              id="editStartDate" 
              v-model="editableProject.startDate" 
              required
              :style="{ colorScheme: 'light' }"
            >
          </div>
          <div class="form-group">
            <label for="editEndDate" class="required">終了日:</label>
            <input 
              type="date" 
              id="editEndDate" 
              v-model="editableProject.endDate" 
              required
              :style="{ colorScheme: 'light' }"
            >
          </div>
        </div>
        <div class="form-group">
          <label for="editDevelopmentLanguage" class="required">開発言語:</label>
          <input type="text" id="editDevelopmentLanguage" v-model="editableProject.developmentLanguage" required>
        </div>
        <div class="form-group">
          <label for="editDb">DB:</label>
          <input type="text" id="editDb" v-model="editableProject.db">
        </div>
        <div class="form-group">
          <label for="editTools">使用ツール:</label>
          <input type="text" id="editTools" v-model="editableProject.tools">
        </div>
        <div class="form-group">
          <label for="editWorkDetails" class="required">作業内容:</label>
          <textarea id="editWorkDetails" v-model="editableProject.workDetails" required></textarea>
        </div>
        <div class="form-group">
          <label for="editNotes">補足:</label>
          <textarea id="editNotes" v-model="editableProject.notes"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="update-btn">更新</button>
          <button type="button" @click="deleteProject" class="delete-btn">削除</button>
          <button type="button" @click="closeModal" class="cancel-btn">キャンセル</button>
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
  project: Project | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'project-updated', project: Project): void;
  (e: 'project-deleted', projectId: string): void;
}>();

const editableProject = ref<Project>({
  id: '',
  userId: '',
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

watch(() => props.project, (newProject) => {
  if (newProject) {
    editableProject.value = { ...newProject };
  }
}, { immediate: true });

const closeModal = () => {
  emit('close');
};

const submitProject = () => {
  if (editableProject.value.projectName && 
      editableProject.value.projectOverview && 
      editableProject.value.startDate && 
      editableProject.value.endDate && 
      editableProject.value.developmentLanguage && 
      editableProject.value.workDetails) {
    emit('project-updated', { ...editableProject.value });
    closeModal();
  } else {
    alert('必須項目を入力してください。');
  }
};

const deleteProject = () => {
  if (confirm('この案件を削除しますか？')) {
    emit('project-deleted', editableProject.value.id);
    closeModal();
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

.update-btn {
  background-color: #28a745;
  color: white;
}

.update-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}
</style>
