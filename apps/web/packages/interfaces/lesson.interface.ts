export interface LessonAction {
  title: string;
  content: string;
  description?: string;
}

export interface LessonPrompt {
  title: string;
  prompt: string;
  description?: string;
}

export interface Lesson {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  videoId?: string;
  courseId: string;
  sortOrder: number;
  isPublished: boolean;
  isPreview: boolean;
  actions?: LessonAction[];
  prompts?: LessonPrompt[];
}
