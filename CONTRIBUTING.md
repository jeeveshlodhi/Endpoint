# CONTRIBUTING.md

Thank you for your interest in contributing to our API Tester project! This document provides guidelines and information to help you get started with contributing to our project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Environment Setup](#development-environment-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Community](#community)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the project maintainers.

## Getting Started

Before you begin:

1. Ensure you have a [GitHub account](https://github.com/signup/free)
2. Familiarize yourself with [Git](https://git-scm.com/) and [GitHub Flow](https://guides.github.com/introduction/flow/)
3. Read the project documentation
4. Check out existing issues to see what needs help

## How to Contribute

There are many ways to contribute to our project:

- **Report bugs**: Submit issues for any bugs you encounter
- **Suggest features**: Submit issues for new features you'd like to see
- **Improve documentation**: Help us make our documentation better, clearer, and more comprehensive
- **Write code**: Contribute bug fixes or implement new features
- **Review code**: Review pull requests from other contributors

### Issues

- Search existing issues before creating a new one
- Use clear and descriptive titles
- Include as much relevant information as possible
- For bug reports, include steps to reproduce, expected behavior, and actual behavior

## Development Environment Setup

Follow these steps to set up your development environment:

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/jeeveshlodhi/Endpoint.git
   cd Endpoint
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/jeeveshlodhi/Endpoint.git
   ```
4. Install dependencies:
   - For Tauri and React frontend:
     ```bash
     npm install
     ```
   - For Python server:
     ```bash
     cd server
     python3 -m venv venv
     source venv/bin/activatex
     pip install -r requirements.txt
     ```
5. Make the utility scripts executable:
   ```bash
   chmod +x run_servers.sh monitor_logs.sh stop_servers.sh
   ```

6. Run the development server:
   ```bash
   ./run_servers.sh
   ```

## Pull Request Process

1. Create a new branch from `main` for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes, following our coding standards
3. Add tests for your changes where applicable
4. Update documentation as needed
5. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "Add feature: brief description of what you did"
   ```
6. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Submit a pull request to the `main` branch of the original repository
8. Wait for review and address any feedback
9. Your PR will be merged once approved

## Coding Standards

### General Guidelines

- Write clean, readable, and well-documented code
- Follow the existing code style of the project
- Keep commits focused and atomic
- Write meaningful commit messages

### Frontend (React/TypeScript)

- Follow the [React Hooks guidelines](https://reactjs.org/docs/hooks-rules.html)
- Use TypeScript types appropriately
- Use functional components and hooks instead of class components
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

### Backend (Rust/Tauri)

- Follow the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Document public APIs using Rust doc comments
- Use proper error handling and propagation

### Python Server

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) guidelines
- Use docstrings to document functions and classes
- Write type annotations when appropriate

## Testing

- Write tests for new features and bug fixes
- Ensure all tests pass before submitting a pull request
- For frontend: Use Jest and React Testing Library
- For Rust: Write unit tests using the built-in testing framework
- For Python: Use pytest for testing

To run tests:
- Frontend: `npm test`
- Rust: `cargo test`
- Python: `pytest`

## Community

Join our community to get help, share ideas, and collaborate:

- [Discord Server](https://discord.gg/pMhTMcE3kS)
- [GitHub Discussions](https://github.com/ORIGINAL_OWNER/api_tester/discussions)

We look forward to your contributions!

---

This document is subject to change. Contributors are welcome to propose improvements to this guide.
