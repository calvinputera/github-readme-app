# GitHub Project Viewer

A modern, responsive web application for viewing GitHub user profiles, repositories, and README content with a beautiful UI inspired by modern mobile apps.

## Features

- 🔍 **Search GitHub Users**: Find any GitHub user by username
- 📊 **User Profiles**: View user information, stats, and avatar
- 📚 **Repository List**: Browse user's repositories with filtering and search
- 📖 **README Viewer**: View repository README content with markdown rendering
- 🎨 **Modern UI**: Clean, responsive design with pixel art accents
- 📱 **Mobile-First**: Optimized for all device sizes
- ⚡ **Fast Performance**: Built with Next.js 15 and React 19

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **State Management**: React Context API with useReducer
- **Markdown**: react-markdown
- **UI**: Custom modern design with pixel art elements

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd repopeek
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Configure GitHub Token (Optional but Recommended):

   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a name like "GitHub Project Viewer"
   - Select scopes: `public_repo` (for public repositories)
   - Copy the generated token
   - Edit `.env.local` and replace `your_github_token_here` with your actual token:

```env
GITHUB_TOKEN=ghp_your_actual_token_here
```

**Why use a GitHub token?**

- Higher API rate limits (5000 requests/hour vs 60 for unauthenticated)
- Better reliability and performance
- Access to more detailed repository information

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable              | Description                  | Default                  |
| --------------------- | ---------------------------- | ------------------------ |
| `GITHUB_TOKEN`        | GitHub Personal Access Token | None (unauthenticated)   |
| `GITHUB_API_BASE_URL` | GitHub API base URL          | `https://api.github.com` |

## Project Structure

```
app/
├── components/          # React components
│   ├── UserSearch.tsx
│   ├── UserProfile.tsx
│   ├── RepositoryList.tsx
│   └── ReadmeViewer.tsx
├── contexts/           # React Context for state management
│   └── GitHubContext.tsx
├── services/           # API services
│   └── githubService.ts
├── globals.css         # Global styles
├── page.module.css     # Page layout styles
└── page.tsx           # Main page component
```

## Component Architecture

- **UserSearch**: Handles GitHub username input and search
- **UserProfile**: Displays user information and statistics
- **RepositoryList**: Shows user's repositories with filtering
- **ReadmeViewer**: Renders repository README content
- **GitHubContext**: Global state management for the application

## API Integration

The application uses the GitHub REST API v3 to fetch:

- User profile information
- Repository lists
- README content

All API calls are handled through the `GitHubService` class with proper error handling and rate limiting.

## Responsive Design

The application is fully responsive with:

- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized typography for all screen sizes

## Custom Styling

Built with custom CSS Modules featuring:

- Modern color palette
- Subtle shadows and gradients
- Smooth animations and transitions
- Pixel art decorative elements
- Clean typography with Inter font

## Future Enhancements

- [ ] Dark mode support
- [ ] Repository search and filtering
- [ ] User activity timeline
- [ ] Repository analytics
- [ ] Export functionality
- [ ] PWA capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
# github-readme-app
