
export enum AICompetence {
    Principiante = 'Principiante',
    Intermedio = 'Intermedio',
    Avanzato = 'Avanzato',
}

export enum PostCategory {
    Formazione = 'Formazione',
    Didattica = 'Didattica',
    Strumenti = 'Strumenti',
    Esperienze = 'Esperienze',
    Ricerca = 'Ricerca',
}

export const AIInterests = [
    'Chatbot educativi',
    'Strumenti di valutazione AI',
    'Personalizzazione dell\'apprendimento',
    'Coding per bambini',
    'Creatività digitale',
    'Accessibilità e inclusione'
] as const;

export type AIInterest = typeof AIInterests[number];


export interface Profile {
  id: string;
  full_name: string;
  email: string;
  bio?: string;
  school_name?: string;
  subjects?: string[];
  experience_years?: number;
  ai_competence?: AICompetence;
  ai_interests?: AIInterest[];
  ai_tools_used?: string;
  ai_projects?: string;
  profile_image_url?: string;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author?: Profile;
  title?: string;
  content: string;
  category: PostCategory;
  created_at: string;
}
