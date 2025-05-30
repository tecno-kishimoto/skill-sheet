import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Project } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([]);

  // 初期データを設定する関数
  const initializeProjects = (userIds: string[]) => {
    if (projects.value.length === 0 && userIds.length >= 2) {
      projects.value = [
        {
          id: uuidv4(),
          userId: userIds[0], // 最初のユーザー（山田 太郎）
          projectName: '大手ECサイト改修',
          projectOverview: '既存ECサイトの機能追加およびパフォーマンス改善',
          startDate: '2023-04-01',
          endDate: '2024-03-31',
          developmentLanguage: 'Java, Spring Boot',
          db: 'Oracle, MySQL',
          tools: 'Eclipse, Git, Jenkins',
          workDetails: '要件定義、設計、開発、テスト',
          notes: 'リーダーとして参画'
        },
        {
          id: uuidv4(),
          userId: userIds[0], // 最初のユーザー（山田 太郎）
          projectName: '金融システムフロントエンド開発',
          projectOverview: '新規金融商品の申込み画面開発',
          startDate: '2022-10-01',
          endDate: '2023-03-31',
          developmentLanguage: 'TypeScript, React',
          db: 'PostgreSQL',
          tools: 'VSCode, Docker, Storybook',
          workDetails: '画面設計、コンポーネント開発、API連携'
        },
        {
          id: uuidv4(),
          userId: userIds[1], // 2番目のユーザー（佐藤 花子）
          projectName: '社内勤怠管理システム開発',
          projectOverview: '既存システムのクラウド移行と機能改善',
          startDate: '2023-01-15',
          endDate: '2023-12-31',
          developmentLanguage: 'PHP, Laravel',
          db: 'MySQL',
          tools: 'PhpStorm, AWS, Jira',
          workDetails: '基本設計、詳細設計、実装、テスト、保守'
        }
      ];
    }
  };

  const getProjectsByUserId = (userId: string) => {
    return computed(() => projects.value.filter(p => p.userId === userId).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    projects.value.push({ ...project, id: uuidv4() });
  };

  const updateProject = (updatedProject: Project) => {
    const index = projects.value.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      projects.value[index] = updatedProject;
    }
  };

  const deleteProject = (projectId: string) => {
    projects.value = projects.value.filter(p => p.id !== projectId);
  };

  return {
    projects,
    initializeProjects,
    getProjectsByUserId,
    addProject,
    updateProject,
    deleteProject,
  };
});
