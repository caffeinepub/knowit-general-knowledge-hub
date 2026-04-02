import { useQuery } from "@tanstack/react-query";
import { Category, type FunFact, type TriviaQuestion } from "../backend";
import { useActor } from "./useActor";

export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDailyTrivia() {
  const { actor, isFetching } = useActor();
  return useQuery<TriviaQuestion | null>({
    queryKey: ["dailyTrivia"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyTrivia();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllFunFacts() {
  const { actor, isFetching } = useActor();
  return useQuery<FunFact[]>({
    queryKey: ["allFunFacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFunFacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useQuestionsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<TriviaQuestion[]>({
    queryKey: ["questions", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export { Category };
export type { FunFact, TriviaQuestion };
