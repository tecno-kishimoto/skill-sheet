export interface Project {
  id: string; // UUID
  userId: string; // 紐づくユーザーのID
  projectName: string;
  projectOverview: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  developmentLanguage: string;
  db: string;
  tools: string;
  workDetails: string;
  notes?: string; // 補足 (任意)
}
