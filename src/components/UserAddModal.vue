<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>社員追加</h2>
      <form @submit.prevent="submitUser">        <div class="form-group">
          <label for="employeeId" class="required">社員番号:</label>
          <input type="text" id="employeeId" v-model="newUser.employeeId" required>
        </div>
        <div class="form-group">
          <label for="name" class="required">氏名:</label>
          <input type="text" id="name" v-model="newUser.name" required>
        </div>
        <div class="form-group">
          <label for="department">部署:</label>
          <input type="text" id="department" v-model="newUser.department">
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
import type { User } from '../stores/userStore';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'user-added', user: Omit<User, 'id'>): void;
}>();

const defaultNewUser = (): Omit<User, 'id'> => ({
  employeeId: '',
  name: '',
  department: '',
  nameKana: '',
  gender: 'other',
  birthDate: '',
  lastSchool: '',
  graduationYear: undefined,
  schoolName: '',
  address: '',
  nearestStation: '',
  qualifications: ''
});

const newUser = ref<Omit<User, 'id'>>(defaultNewUser());

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    newUser.value = defaultNewUser();
  }
});

const closeModal = () => {
  emit('close');
};

const submitUser = () => {
  if (newUser.value.employeeId && newUser.value.name) {
    emit('user-added', { ...newUser.value });
    closeModal();
  } else {
    alert('社員番号と氏名は必須です。');
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
  background-color: rgba(0, 0, 0, 0.5);
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
  width: 400px;
  max-width: 90%;
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

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group label.required::after {
  content: ' *';
  color: #dc3545;
  font-weight: bold;
}

.form-group input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
  color: #333; /* 文字色を明示的に指定 */
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
  background-color: #007bff;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background-color: #0056b3;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.form-actions button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
