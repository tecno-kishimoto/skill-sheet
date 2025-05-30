<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router' // コメントアウト解除
import { useUserStore, type User } from '../stores/userStore'
import UserAddModal from './UserAddModal.vue'
import UserEditModal from './UserEditModal.vue'

const userStore = useUserStore()
const router = useRouter() // コメントアウト解除

const users = computed(() => userStore.filteredUsers)

const isUserAddModalOpen = ref(false)
const isUserEditModalOpen = ref(false)
const selectedUser = ref<User | null>(null)

const openUserAddModal = () => {
  isUserAddModalOpen.value = true
}

const closeUserAddModal = () => {
  isUserAddModalOpen.value = false
}

const handleUserAdded = (newUser: Omit<User, 'id'>) => {
  userStore.addUser(newUser)
  closeUserAddModal()
}

const openUserEditModal = (user: User) => {
  selectedUser.value = user
  isUserEditModalOpen.value = true
}

const closeUserEditModal = () => {
  selectedUser.value = null
  isUserEditModalOpen.value = false
}

const handleUserUpdated = (updatedUser: User) => {
  userStore.updateUser(updatedUser)
  closeUserEditModal()
}

const handleUserDeleted = (userId: string) => {
  userStore.deleteUser(userId)
  closeUserEditModal()
}

const goToUserDetails = (userId: string) => {
  router.push({ name: 'UserDetails', params: { id: userId } })
}

</script>

<template>
  <div class="user-list-container">
    <h1>社員一覧</h1>
    <button @click="openUserAddModal">社員追加</button>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">社員番号</th>
          <th style="width: 35%;">氏名</th>
          <th style="width: 25%;">部署</th>
          <th style="width: 25%;">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.employeeId }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.department }}</td>
          <td>
            <button @click="goToUserDetails(user.id)">詳細</button> 
            <button @click="openUserEditModal(user)">編集</button>
          </td>
        </tr>
      </tbody>
    </table>

    <UserAddModal 
      :isOpen="isUserAddModalOpen" 
      @close="closeUserAddModal" 
      @user-added="handleUserAdded"
    />    <UserEditModal
      :isOpen="isUserEditModalOpen"
      :user="selectedUser"
      @close="closeUserEditModal"
      @user-updated="handleUserUpdated"
      @user-deleted="handleUserDeleted"
    />
  </div>
</template>

<style scoped>
.user-list-container {
  width: 90%; /* テーブルのコンテナの幅を調整 */
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  color: #333;
}

tr:nth-child(even) {background-color: #f9f9f9;}

tr:hover {background-color: #ddd;}
</style>
