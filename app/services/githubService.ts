import { GitHubUser, Repository } from "../contexts/GitHubContext";

const GITHUB_API_BASE =
  process.env.GITHUB_API_BASE_URL || "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

interface GitHubUserResponse {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GitHubReadmeResponse {
  content: string;
}

async function makeRequest<T>(endpoint: string): Promise<T> {
  const url = `${GITHUB_API_BASE}${endpoint}`;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitHub-Project-Viewer",
  };

  if (GITHUB_TOKEN) {
    headers["Authorization"] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  try {
    const user = await makeRequest<GitHubUserResponse>(`/users/${username}`);
    return {
      id: user.id,
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
      bio: user.bio || "",
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      html_url: user.html_url,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      throw error;
    }
    throw new Error("Failed to fetch user data");
  }
}

export async function fetchRepositories(
  username: string
): Promise<Repository[]> {
  try {
    const repos = await makeRequest<GitHubRepoResponse[]>(
      `/users/${username}/repos?sort=updated&per_page=100`
    );

    const reposWithReadme = await Promise.all(
      repos.map(async (repo: GitHubRepoResponse) => {
        try {
          await makeRequest<GitHubReadmeResponse>(
            `/repos/${username}/${repo.name}/readme`
          );
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description || "",
            language: repo.language || "Unknown",
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.updated_at,
            html_url: repo.html_url,
            has_readme: true,
          };
        } catch {
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description || "",
            language: repo.language || "Unknown",
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.updated_at,
            html_url: repo.html_url,
            has_readme: false,
          };
        }
      })
    );

    return reposWithReadme;
  } catch (error) {
    throw new Error("Failed to fetch repositories", { cause: error });
  }
}

export async function fetchReadmeContent(
  username: string,
  repoName: string
): Promise<string> {
  try {
    const readme = await makeRequest<GitHubReadmeResponse>(
      `/repos/${username}/${repoName}/readme`
    );

    const content = atob(readme.content.replace(/\n/g, ""));
    return content;
  } catch (error) {
    throw new Error("README not found or failed to fetch", { cause: error });
  }
}
