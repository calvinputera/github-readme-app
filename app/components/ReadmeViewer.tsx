"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { useGitHub } from "../contexts/GitHubContext";
import styles from "./ReadmeViewer.module.css";
import Image from "next/image";

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
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className={styles.markdownH1}>{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className={styles.markdownH2}>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className={styles.markdownH3}>{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className={styles.markdownH4}>{children}</h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className={styles.markdownH5}>{children}</h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className={styles.markdownH6}>{children}</h6>
                  ),
                  p: ({ children }) => (
                    <p className={styles.markdownP}>{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className={styles.markdownUl}>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className={styles.markdownOl}>{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className={styles.markdownLi}>{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className={styles.markdownBlockquote}>
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => (
                    <code
                      className={`${styles.markdownCode} ${className || ""}`}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className={styles.markdownPre}>{children}</pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.markdownLink}
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <Image
                      src={src as string}
                      alt={alt || ""}
                      className={styles.markdownImg}
                      width={100}
                      height={100}
                    />
                  ),
                  table: ({ children }) => (
                    <table className={styles.markdownTable}>{children}</table>
                  ),
                  th: ({ children }) => (
                    <th className={styles.markdownTh}>{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className={styles.markdownTd}>{children}</td>
                  ),
                }}
              >
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
