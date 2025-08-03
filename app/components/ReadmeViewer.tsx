"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { useGitHub } from "../contexts/GitHubContext";
import styles from "./ReadmeViewer.module.css";
// import Image from "next/image";

export default function ReadmeViewer() {
  const { state, dispatch } = useGitHub();
  const { selectedRepo, readmeContent, loading } = state;

  if (!selectedRepo) return null;

  const handleClose = () => {
    dispatch({ type: "SET_SELECTED_REPO", payload: null });
    dispatch({ type: "SET_README_CONTENT", payload: "" });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{selectedRepo.name} - README</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close README"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading README...</p>
            </div>
          ) : readmeContent ? (
            <div className={styles.readmeContent}>
              <ReactMarkdown className={styles.markdown}>
                {readmeContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className={styles.noReadme}>
              <p>No README found for this repository.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
