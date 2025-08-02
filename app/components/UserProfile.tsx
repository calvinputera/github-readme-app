"use client";

import React from "react";
import { useGitHub } from "../contexts/GitHubContext";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const { state } = useGitHub();

  if (!state.user) return null;

  const { user } = state;

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <img
          src={user.avatar_url}
          alt={`${user.name || user.login} avatar`}
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h2 className={styles.name}>{user.name || user.login}</h2>
          {user.name && <p className={styles.username}>@{user.login}</p>}
          {user.bio && <p className={styles.bio}>{user.bio}</p>}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{user.public_repos}</span>
              <span className={styles.statLabel}>Repositories</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{user.followers}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{user.following}</span>
              <span className={styles.statLabel}>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
