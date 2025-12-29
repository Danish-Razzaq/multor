# Contributing to Google Drive Image Upload Server

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/Danish-Razzaq/drive-image-uploader.git
   cd google-drive-image-upload
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your environment** by copying `.env.example` to `.env` and filling in your Google Drive credentials

## 🛠️ Development Process

### Making Changes

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes** thoroughly:
   - Test file uploads
   - Test image display
   - Test different user IDs
   - Test error scenarios

4. **Commit your changes** with a clear message:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Coding Standards

- **JavaScript Style**: Use ES6+ features where appropriate
- **Indentation**: 2 spaces
- **Semicolons**: Use them consistently
- **Comments**: Add comments for complex logic
- **Error Handling**: Always include proper error handling
- **Console Logs**: Use meaningful log messages with emojis for better readability

### Commit Message Format

Use clear, descriptive commit messages:
- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Remove: what was removed`
- `Refactor: what was refactored`

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Environment details**:
   - Node.js version
   - Operating system
   - Browser (if frontend issue)
5. **Error messages** or logs if available
6. **Screenshots** if applicable

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** - why is this needed?
4. **Provide examples** if possible
5. **Consider implementation** - how might this work?

## 🧪 Testing

Before submitting a PR:

- [ ] Test file upload functionality
- [ ] Test image display in the gallery
- [ ] Test with different user IDs
- [ ] Test error scenarios (invalid files, network issues)
- [ ] Test on different browsers (if frontend changes)
- [ ] Verify Google Drive integration works
- [ ] Check console for any errors

## 📝 Documentation

When adding features:

- Update the README.md if needed
- Add comments to complex code
- Update API documentation if endpoints change
- Include examples in your PR description

## 🔧 Areas for Contribution

We welcome contributions in these areas:

### Frontend Improvements
- Better UI/UX design
- Mobile responsiveness
- Drag & drop file upload
- Progress bars for uploads
- Image preview before upload

### Backend Features
- Image resizing/compression
- Multiple file upload
- File type validation improvements
- Rate limiting
- User authentication
- Image metadata extraction

### DevOps & Tools
- Docker containerization
- CI/CD pipeline setup
- Automated testing
- Performance monitoring
- Logging improvements

### Documentation
- Better setup instructions
- Video tutorials
- API documentation
- Troubleshooting guides

## 🚫 What Not to Include

Please avoid:
- Hardcoded credentials or API keys
- Large binary files
- Unnecessary dependencies
- Breaking changes without discussion
- Code that doesn't follow the project structure

## 📞 Getting Help

If you need help:

1. **Check the README** first
2. **Search existing issues** on GitHub
3. **Create a new issue** with the "question" label
4. **Be specific** about what you're trying to do

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Given credit in commit messages

Thank you for contributing to make this project better! 🙏