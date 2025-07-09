# Project Object Format

Each project in `src/data/projects.json` should use the following format:

```json
{
  "title": "Project Title",
  "description": "Short project description.",
  "live": "https://live-site-url.com",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "github": "https://github.com/username/repo",           // (optional)
  "documentation": "https://docs.example.com/project",    // (optional)
  "images": ["/projects/image1.png", "/projects/image2.png"], // (optional)
  "gradientClass": "bg-gradient-to-br from-gray-700 to-gray-500"
}
```

**Field Descriptions:**

- `title` (string): Project name.
- `description` (string): Brief summary.
- `live` (string): URL to the live project.
- `tags` (array): Technologies or keywords.
- `github` (string, optional): Link to the GitHub repo.
- `documentation` (string, optional): Link to documentation.
- `images` (array, optional): Image paths for the project.
- `gradientClass` (string): Tailwind CSS gradient class for card background.
