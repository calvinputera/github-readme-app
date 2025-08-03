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
                  h1: ({ children, ...props }) => (
                    <h1 className={styles.markdownH1} {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className={styles.markdownH2} {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className={styles.markdownH3} {...props}>
                      {children}
                    </h3>
                  ),
                  h4: ({ children, ...props }) => (
                    <h4 className={styles.markdownH4} {...props}>
                      {children}
                    </h4>
                  ),
                  h5: ({ children, ...props }) => (
                    <h5 className={styles.markdownH5} {...props}>
                      {children}
                    </h5>
                  ),
                  h6: ({ children, ...props }) => (
                    <h6 className={styles.markdownH6} {...props}>
                      {children}
                    </h6>
                  ),
                  p: ({ children, ...props }) => (
                    <p className={styles.markdownP} {...props}>
                      {children}
                    </p>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className={styles.markdownUl} {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className={styles.markdownOl} {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className={styles.markdownLi} {...props}>
                      {children}
                    </li>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote
                      className={styles.markdownBlockquote}
                      {...props}
                    >
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className, ...props }) => (
                    <code
                      className={`${styles.markdownCode} ${className || ""}`}
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children, ...props }) => (
                    <pre className={styles.markdownPre} {...props}>
                      {children}
                    </pre>
                  ),
                  a: ({ href, children, ...props }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.markdownLink}
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt, ...props }) => (
                    <Image
                      src={src as string}
                      alt={alt || ""}
                      className={styles.markdownImg}
                      width={100}
                      height={100}
                    />
                  ),
                  table: ({ children, ...props }) => (
                    <table className={styles.markdownTable} {...props}>
                      {children}
                    </table>
                  ),
                  th: ({ children, ...props }) => (
                    <th className={styles.markdownTh} {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className={styles.markdownTd} {...props}>
                      {children}
                    </td>
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
