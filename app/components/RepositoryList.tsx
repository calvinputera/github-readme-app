"use client";

import React, { useState } from "react";
import { useGitHub, Repository } from "../contexts/GitHubContext";
import { fetchReadmeContent } from "../services/githubService";
import styles from "./RepositoryList.module.css";

export default function RepositoryList() {
  const { state, dispatch } = useGitHub();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleRepoSelect = async (repo: Repository) => {
    dispatch({ type: "SET_SELECTED_REPO", payload: repo });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const readmeContent = await fetchReadmeContent(
        state.user!.login,
        repo.name
      );
      dispatch({ type: "SET_README_CONTENT", payload: readmeContent });
    } catch (error) {
      dispatch({
        type: "SET_README_CONTENT",
        payload: "README not found or could not be loaded.",
      });
      console.error("Error fetching README:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const filteredRepos = state.repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filter === "all") return matchesSearch;
    if (filter === "with-readme") return matchesSearch && repo.has_readme;
    if (filter === "without-readme") return matchesSearch && !repo.has_readme;

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!state.user || state.repositories.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Repositories ({state.repositories.length})
        </h2>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All repos</option>
            <option value="with-readme">With README</option>
            <option value="without-readme">Without README</option>
          </select>
        </div>
      </div>

      <div className={styles.repoGrid}>
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className={`${styles.repoCard} ${
              state.selectedRepo?.id === repo.id ? styles.selected : ""
            }`}
            onClick={() => handleRepoSelect(repo)}
          >
            <div className={styles.repoHeader}>
              <h3 className={styles.repoName}>{repo.name}</h3>
              {repo.has_readme && (
                <span className={styles.readmeBadge}>README</span>
              )}
            </div>

            {repo.description && (
              <p className={styles.repoDescription}>{repo.description}</p>
            )}

            <div className={styles.repoMeta}>
              {repo.language && (
                <span className={styles.language}>{repo.language}</span>
              )}
              <span className={styles.stars}>⭐ {repo.stargazers_count}</span>
              <span className={styles.forks}>🍴 {repo.forks_count}</span>
            </div>

            <div className={styles.repoFooter}>
              <span className={styles.updatedAt}>
                Updated {formatDate(repo.updated_at)}
              </span>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubLink}
                onClick={(e) => e.stopPropagation()}
              >
                View on GitHub
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && (
        <div className={styles.emptyState}>
          <p>No repositories found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
