import UserSearch from "./components/UserSearch";
import UserProfile from "./components/UserProfile";
import RepositoryList from "./components/RepositoryList";
import ReadmeViewer from "./components/ReadmeViewer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <UserSearch />
      <UserProfile />
      <div className={styles.content}>
        <RepositoryList />
      </div>
      <ReadmeViewer />
    </div>
  );
}
