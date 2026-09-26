# Contributing to Relay

First off, thank you for considering contributing to Relay. It is people like you that make Relay a great tool for everyone.

This document serves as a set of guidelines for contributing to the project.

## Code of Conduct
By participating in this project, you agree to abide by the Code of Conduct. Please read it before you begin.

## Getting Started
To get the project running locally on your machine, follow the setup instructions in the README file. You will need Node.js and Docker installed.

## How to Contribute

### Reporting Bugs
If you find a bug, please create an issue on GitHub. Include as much detail as possible to help us reproduce the problem. A good bug report includes:
* What you were doing.
* What you expected to happen.
* What actually happened.
* Logs or error messages if applicable.

### Suggesting Enhancements
We welcome ideas for new features or improvements. Open an issue and use the feature request template. Explain why this enhancement would be useful to most users.

### Pull Requests
1. Fork the repository and create your branch from main.
2. If you added code that should be tested, add tests.
3. If you changed APIs, update the documentation.
4. Ensure your code lints and compiles correctly.
5. Create a pull request with a clear title and description of your changes.

## Development Setup
Relay uses a monorepo structure.
* The core application is located in the root directory.
* The landing page is in the relay-landing directory.
* The LaTeX compilation service is in the latex-service directory.

Make sure to install dependencies and configure your environment variables before running the development servers.
