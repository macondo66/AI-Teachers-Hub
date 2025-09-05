// This is a MOCK implementation of Supabase services to simulate a backend.
// In a real application, you would use the @supabase/supabase-js library.

import { Profile, Post, AICompetence, PostCategory, AIInterest } from '../types';

// Mock Database
const MOCK_PROFILES: Profile[] = [
    {
        id: '1',
        full_name: 'Maria Rossi',
        email: 'maria.rossi@example.com',
        bio: 'Insegnante di scuola primaria con la passione per le nuove tecnologie. Esploro l\'uso dell\'AI per rendere la matematica più divertente.',
        school_name: 'Scuola Primaria "G. Rodari"',
        subjects: ['Matematica', 'Scienze'],
        experience_years: 10,
        ai_competence: AICompetence.Intermedio,
        ai_interests: ['Personalizzazione dell\'apprendimento', 'Strumenti di valutazione AI'],
        ai_tools_used: 'ChatGPT, Khanmigo, MagicSchool AI',
        ai_projects: 'Ho creato un progetto di storytelling interattivo con l\'aiuto di un generatore di immagini AI per la mia classe di terza.',
        profile_image_url: 'https://picsum.photos/id/1027/200/200',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        full_name: 'Luca Bianchi',
        email: 'luca.bianchi@example.com',
        bio: 'Formatore ed educatore digitale. Credo che l\'AI possa supportare l\'inclusione e l\'accessibilità nella didattica quotidiana.',
        school_name: 'Istituto Comprensivo "Don Milani"',
        subjects: ['Italiano', 'Sostegno'],
        experience_years: 15,
        ai_competence: AICompetence.Avanzato,
        ai_interests: ['Accessibilità e inclusione', 'Chatbot educativi'],
        ai_tools_used: 'Curipod, Copilot, Diffit',
        ai_projects: 'Sviluppo di un chatbot per aiutare gli studenti con DSA a riassumere testi complessi.',
        profile_image_url: 'https://picsum.photos/id/1005/200/200',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        author_id: '2',
        title: 'Benvenuti in AI Teachers Hub!',
        content: 'Condividiamo esperienze sull\'uso di ChatGPT per creare schede didattiche personalizzate. Quali sono i vostri prompt preferiti?',
        category: PostCategory.Didattica,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'p2',
        author_id: '1',
        title: 'Generare storie matematiche coinvolgenti',
        content: 'Ho utilizzato un\'AI per generare storie matematiche coinvolgenti per i miei alunni di terza. I risultati sono stati sorprendenti! Gli studenti hanno mostrato un maggiore interesse e partecipazione. Lo strumento che ho usato è stato GPT-4 con un prompt molto specifico per creare scenari basati sui loro interessi.',
        category: PostCategory.Esperienze,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'p3',
        author_id: '2',
        content: 'Riflessioni etiche: come spiegare l\'AI ai bambini mantenendo il pensiero critico. È fondamentale non presentare l\'AI come una magia, ma come uno strumento creato dall\'uomo, con i suoi limiti e bias. Ne parliamo?',
        category: PostCategory.Formazione,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

const mockDelay = <T,>(data: T): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(data), 500));

// Mock Supabase Client
export const supabase = {
    auth: {
        signUp: async ({ email, password, options }: any) => {
            const existing = MOCK_PROFILES.find(p => p.email === email);
            if (existing) {
                return { data: null, error: { message: 'User already exists' } };
            }
            const newUser: Profile = {
                id: String(MOCK_PROFILES.length + 1),
                email,
                full_name: options.data.full_name,
                school_name: options.data.school_name,
                experience_years: options.data.experience_years,
                created_at: new Date().toISOString(),
            };
            MOCK_PROFILES.push(newUser);
            return mockDelay({ data: { user: newUser }, error: null });
        },
        signInWithPassword: async ({ email, password }: any) => {
            const user = MOCK_PROFILES.find(p => p.email === email);
            if (user) {
                return mockDelay({ data: { user, session: { access_token: 'mock_token' } }, error: null });
            }
            return mockDelay({ data: null, error: { message: 'Invalid credentials' } });
        },
        signOut: async () => {
            return mockDelay({ error: null });
        },
    },
    from: (tableName: string) => ({
        // FIX: The select method was refactored to handle different tables and query chains correctly.
        select: (query?: string) => {
            if (tableName === 'posts') {
                return {
                    order: (field: string, options: { ascending: boolean }) => ({
                        eq: (filterField: string, filterValue: any) => {
                             const posts = MOCK_POSTS
                                .map(post => ({
                                    ...post,
                                    profiles: MOCK_PROFILES.find(p => p.id === post.author_id)
                                }))
                                .filter(post => post.category === filterValue)
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                             return mockDelay({ data: posts, error: null });
                        }
                    }),
                    returns: () => {
                        const posts = MOCK_POSTS
                            .map(post => ({
                                ...post,
                                author: MOCK_PROFILES.find(p => p.id === post.author_id)
                            }))
                           .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                         return mockDelay({ data: posts, error: null });
                    }
                };
            }
            if (tableName === 'profiles') {
                 return {
                    eq: (field: string, value: string) => {
                         return {
                             single: () => {
                                 const profile = MOCK_PROFILES.find(p => p.id === value);
                                 return mockDelay({ data: profile, error: null });
                             }
                         }
                    }
                }
            }
            return { data: null, error: { message: 'Table not found' } } as any;
        },
        insert: (data: any[]) => {
            if (tableName === 'posts') {
                const newPost = { ...data[0], id: `p${MOCK_POSTS.length + 1}`, created_at: new Date().toISOString() };
                MOCK_POSTS.unshift(newPost);
                return mockDelay({ data: [newPost], error: null });
            }
            return { data: null, error: { message: 'Could not insert' } };
        },
        update: (data: any) => {
            if (tableName === 'profiles') {
                return {
                    eq: (field: string, value: string) => {
                        const index = MOCK_PROFILES.findIndex(p => p.id === value);
                        if (index !== -1) {
                            MOCK_PROFILES[index] = { ...MOCK_PROFILES[index], ...data };
                            return mockDelay({ data: [MOCK_PROFILES[index]], error: null });
                        }
                        return mockDelay({ data: null, error: { message: 'Profile not found' }});
                    }
                }
            }
            return { data: null, error: { message: 'Could not update' }};
        }
    }),
};