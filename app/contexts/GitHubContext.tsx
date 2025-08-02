"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  has_readme: boolean;
}

export interface GitHubState {
  user: GitHubUser | null;
  repositories: Repository[];
  selectedRepo: Repository | null;
  readmeContent: string;
  loading: boolean;
  error: string | null;
}

type GitHubAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: GitHubUser }
  | { type: "SET_REPOSITORIES"; payload: Repository[] }
  | { type: "SET_SELECTED_REPO"; payload: Repository | null }
  | { type: "SET_README_CONTENT"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_DATA" };

const initialState: GitHubState = {
  user: null,
  repositories: [],
  selectedRepo: null,
  readmeContent: "",
  loading: false,
  error: null,
};

function githubReducer(state: GitHubState, action: GitHubAction): GitHubState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload, error: null };
    case "SET_REPOSITORIES":
      return { ...state, repositories: action.payload, error: null };
    case "SET_SELECTED_REPO":
      return { ...state, selectedRepo: action.payload };
    case "SET_README_CONTENT":
      return { ...state, readmeContent: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_DATA":
      return initialState;
    default:
      return state;
  }
}

interface GitHubContextType {
  state: GitHubState;
  dispatch: React.Dispatch<GitHubAction>;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(githubReducer, initialState);

  return (
    <GitHubContext.Provider value={{ state, dispatch }}>
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
}
