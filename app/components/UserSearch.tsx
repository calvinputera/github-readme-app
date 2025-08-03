"use client";

import React, { useState } from "react";
import { useGitHub } from "../contexts/GitHubContext";
import { fetchUser, fetchRepositories } from "../services/githubService";
import styles from "./UserSearch.module.css";

export default function UserSearch() {
  const { state, dispatch } = useGitHub();
  const [username, setUsername] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLocalLoading(true);
    dispatch({ type: "SET_LOADING", payload: true });

    dispatch({ type: "SET_ERROR", payload: null });

    dispatch({ type: "CLEAR_DATA" });

    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const [user, repositories] = await Promise.all([
        fetchUser(username),
        fetchRepositories(username),
      ]);

      dispatch({ type: "SET_USER", payload: user });

      dispatch({ type: "SET_REPOSITORIES", payload: repositories });
    } catch (error) {
      console.error("Error during search:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLocalLoading(false);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>GitHub Project Viewer</h1>
      <p className={styles.subtitle}>
        Search for a GitHub user to view their projects and README files
      </p>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username..."
            className={styles.input}
            disabled={state.loading || localLoading}
          />
          <button
            type="submit"
            className={`${styles.button} ${
              state.loading || localLoading ? styles.loading : ""
            }`}
            disabled={state.loading || localLoading || !username.trim()}
          >
            {state.loading || localLoading ? (
              <>
                <span className={styles.spinner}></span>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {state.error && <div className={styles.error}>{state.error}</div>}
    </div>
  );
}
