import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string // UUID
  employeeId: string // 社員番号
  name: string
  nameKana?: string // 氏名フリガナ
  gender?: string // 性別
  birthDate?: string // 生年月日
  lastSchool?: string // 最終学歴
  graduationYear?: number // 卒業年度
  schoolName?: string // 学校名
  address?: string // 現住所
  nearestStation?: string // 最寄り駅
  qualifications?: string // 取得資格
  department?: string
  joinDate?: string
  // 必要に応じて他のプロパティを追加
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { id: uuidv4(), employeeId: 'EMP001', name: '山田 太郎', nameKana: 'ヤマダ タロウ', gender: 'male', birthDate: '1990-01-01', lastSchool: '〇〇大学', graduationYear: 2012, schoolName: '〇〇大学', address: '東京都新宿区', nearestStation: '新宿駅', qualifications: '基本情報技術者', department: '開発部', joinDate: '2020-04-01' },
      { id: uuidv4(), employeeId: 'EMP002', name: '佐藤 花子', nameKana: 'サトウ ハナコ', gender: 'female', birthDate: '1995-05-15', lastSchool: '△△専門学校', graduationYear: 2015, schoolName: '△△専門学校', address: '神奈川県横浜市', nearestStation: '横浜駅', qualifications: '応用情報技術者', department: '営業部', joinDate: '2021-04-01' },
      { id: uuidv4(), employeeId: 'EMP003', name: '鈴木 一郎', nameKana: 'スズキ イチロウ', gender: 'male', birthDate: '1988-11-30', lastSchool: '□□高校', graduationYear: 2007, schoolName: '□□高校', address: '埼玉県さいたま市', nearestStation: '大宮駅', qualifications: 'TOEIC 800点', department: '人事部', joinDate: '2019-08-15' },
    ] as User[],
    searchTerm: '',
  }),
  getters: {
    // filteredUsers は検索機能実装時に使用します。
    // searchTerm が空の場合は全ユーザーを返し、そうでなければフィルタリングします。
    filteredUsers(state): User[] {
      if (!state.searchTerm) {
        return state.users
      }
      const lowerSearchTerm = state.searchTerm.toLowerCase()
      return state.users.filter(user =>
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.employeeId.toLowerCase().includes(lowerSearchTerm) ||
        (user.department && user.department.toLowerCase().includes(lowerSearchTerm))
      )
    },
    // IDでユーザーを取得するgetter (詳細表示や編集時に使用)
    getUserById: (state) => (id: string): User | undefined => {
      return state.users.find(user => user.id === id);
    },
    // 社員番号でユーザーを取得するgetter (必要であれば)
    getUserByEmployeeId: (state) => (employeeId: string): User | undefined => {
      return state.users.find(user => user.employeeId === employeeId);
    }
  },
  actions: {
    addUser(user: Omit<User, 'id'>) {
      // employeeId の重複チェックなどをここで行うことも可能
      this.users.push({ ...user, id: uuidv4() })
    },
    updateUser(updatedUser: User) {
      const index = this.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = updatedUser
      }
    },
    deleteUser(userId: string) {
      this.users = this.users.filter(user => user.id !== userId)
    },
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
  },
})
