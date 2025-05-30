<template>
  <div v-if="isOpen && user" class="modal-overlay">
    <div class="modal-content">
      <h3>社員情報編集</h3>
      <form @submit.prevent="submitUpdate">        <div class="form-group">
          <label for="editEmployeeId" class="required">社員番号:</label>
          <input type="text" id="editEmployeeId" v-model="editableUser.employeeId" disabled>
        </div>
        <div class="form-group">
          <label for="editName" class="required">氏名:</label>
          <input type="text" id="editName" v-model="editableUser.name" disabled>
        </div>
        <div class="form-group">
          <label for="editDepartment">部署:</label>
          <input type="text" id="editDepartment" v-model="editableUser.department">
        </div>
        <div class="form-group">
          <label for="editNameKana">氏名フリガナ:</label>
          <input type="text" id="editNameKana" v-model="editableUser.nameKana">
        </div>
        <div class="form-group">
          <label for="editGender">性別:</label>
          <select id="editGender" v-model="editableUser.gender">
            <option value="">選択してください</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>        <div class="form-group">
          <label for="editBirthDate">生年月日:</label>
          <input 
            type="date" 
            id="editBirthDate" 
            v-model="editableUser.birthDate"
            :style="{ colorScheme: 'light' }"
          >
        </div>
        <div class="form-group">
          <label for="editLastSchool">最終学歴:</label>
          <input type="text" id="editLastSchool" v-model="editableUser.lastSchool">
        </div>
        <div class="form-group">
          <label for="editGraduationYear">卒業年度:</label>
          <input type="number" id="editGraduationYear" v-model.number="editableUser.graduationYear">
        </div>
        <div class="form-group">
          <label for="editSchoolName">学校名:</label>
          <input type="text" id="editSchoolName" v-model="editableUser.schoolName">
        </div>
        <div class="form-group">
          <label for="editAddress">現住所:</label>
          <input type="text" id="editAddress" v-model="editableUser.address">
        </div>
        <div class="form-group">
          <label for="editNearestStation">最寄り駅:</label>
          <input type="text" id="editNearestStation" v-model="editableUser.nearestStation">
        </div>
        <div class="form-group">
          <label for="editQualifications">取得資格:</label>
          <textarea id="editQualifications" v-model="editableUser.qualifications"></textarea>
        </div>

        <div class="modal-actions">
          <button type="submit">保存</button>
          <button type="button" @click="confirmDelete" class="delete-button">削除</button>
          <button type="button" @click="closeModal">キャンセル</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import type { User } from '../stores/userStore';

const props = defineProps({
  isOpen: Boolean,
  user: { // PropType を使用して型を明示
    type: Object as PropType<User | null>,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'user-updated', user: User): void;
  (e: 'user-deleted', userId: string): void;
}>();

// 編集用のローカルステートを作成し、props.user の変更を監視して同期する
const editableUser = ref<User>({ ...props.user } as User);

watch(() => props.user, (newUser) => {
  if (newUser) {
    editableUser.value = { ...newUser };
  } else {
    // ユーザーが null の場合はデフォルト値や空のオブジェクトを設定
    editableUser.value = {
      id: '',
      employeeId: '',
      name: '',
      // 他のプロパティも初期化
      nameKana: '',
      gender: '',
      birthDate: '',
      lastSchool: '',
      graduationYear: undefined,
      schoolName: '',
      address: '',
      nearestStation: '',
      qualifications: ''
    };
  }
}, { deep: true, immediate: true });

const submitUpdate = () => {
  if (editableUser.value) {
    emit('user-updated', { ...editableUser.value });
  }
};

const confirmDelete = () => {
  if (editableUser.value && window.confirm(`${editableUser.value.name}さんを削除しますか？`)) {
    emit('user-deleted', editableUser.value.id);
  }
};

const closeModal = () => {
  emit('close');
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
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  width: 500px;
  max-width: 95%;
  max-height: 90vh; /* 高さが画面を超えないように */
  overflow-y: auto; /* 内容が多い場合にスクロール可能に */
  color: #333; /* モーダル内の基本文字色 */
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
  font-size: 0.9rem;
}

.form-group label.required::after {
  content: ' *';
  color: #dc3545;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  width: calc(100% - 24px); /* paddingとborderを考慮 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff; 
  color: #333; 
  box-sizing: border-box;
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

.form-group input:disabled {
  background-color: #e9ecef; /* 非活性時の背景色 */
  color: #6c757d; /* 非活性時の文字色 */
  cursor: not-allowed;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.modal-actions button {
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  border: none;
  transition: background-color 0.2s ease;
}

.modal-actions button[type="submit"] {
  background-color: #007bff;
  color: white;
}
.modal-actions button[type="submit"]:hover {
  background-color: #0056b3;
}

.modal-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}
.modal-actions button[type="button"]:hover {
  background-color: #545b62;
}

.modal-actions button.delete-button {
  background-color: #dc3545;
  color: white;
  margin-right: auto; /* 削除ボタンを左寄せにする */
}
.modal-actions button.delete-button:hover {
  background-color: #c82333;
}
</style>
