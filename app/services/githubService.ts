import { GitHubUser, Repository } from "../contexts/GitHubContext";

const GITHUB_API_BASE =
  process.env.GITHUB_API_BASE_URL || "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

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

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function makeRequest<T>(endpoint: string): Promise<T> {
  const cacheKey = endpoint;

  const cached = getCachedData<T>(cacheKey);
  if (cached) {
    return cached;
  }

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
    let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;
    }

    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (response.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();

  setCachedData(cacheKey, data);

  return data;
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
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user data"
    );
  }
}

export async function fetchRepositories(
  username: string
): Promise<Repository[]> {
  try {
    const repos = await makeRequest<GitHubRepoResponse[]>(
      `/users/${username}/repos?sort=updated&per_page=50`
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
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch repositories"
    );
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
    throw new Error(
      error instanceof Error
        ? error.message
        : "README not found or failed to fetch"
    );
  }
}
