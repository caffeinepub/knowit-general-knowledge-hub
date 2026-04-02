import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FunFact {
    title: string;
    description: string;
    category: Category;
}
export interface TriviaQuestion {
    question: string;
    difficulty: Difficulty;
    correctAnswerIndex: bigint;
    category: Category;
    timesAttempted: bigint;
    options: Array<string>;
}
export enum Category {
    nature = "nature",
    history = "history",
    technology = "technology",
    geography = "geography",
    science = "science"
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export interface backendInterface {
    addFunFact(title: string, description: string, category: Category): Promise<bigint>;
    addTriviaQuestion(question: string, options: Array<string>, correctAnswerIndex: bigint, category: Category, difficulty: Difficulty): Promise<bigint>;
    getAllFunFacts(): Promise<Array<FunFact>>;
    getAllQuestions(): Promise<Array<TriviaQuestion>>;
    getAllQuestionsNoAnswers(): Promise<Array<TriviaQuestion>>;
    getCategories(): Promise<Array<string>>;
    getDailyTrivia(): Promise<TriviaQuestion | null>;
    getDifficulties(): Promise<Array<string>>;
    getFunFact(id: bigint): Promise<FunFact>;
    getFunFactsByCategory(category: Category): Promise<Array<FunFact>>;
    getQuestionsByCategory(category: Category): Promise<Array<TriviaQuestion>>;
    getQuestionsByDifficulty(difficulty: Difficulty): Promise<Array<TriviaQuestion>>;
    getRandomFunFact(): Promise<FunFact | null>;
    getTotalFunFactsCount(): Promise<bigint>;
    getTotalQuestionsCount(): Promise<bigint>;
    getTrivia(id: bigint): Promise<TriviaQuestion>;
    incrementQuestionAttempts(id: bigint): Promise<void>;
}
