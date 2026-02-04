# Contributing to UtilityJS

If you're reading this, you're definitely awesome! <br /> The following is a set
of guidelines for contributing to ClientSocketManager, which are hosted in the
[GitHub](https://github.com/mimshins/utilityjs). These are mostly guidelines, not
rules. Use your best judgment, and feel free to propose changes to this document
in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](https://github.com/mimshins/utilityjs/blob/main/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

## A large spectrum of contributions

There are many ways to contribute, code contribution is one aspect of it. For
instance, documentation improvements are as important as code changes.

## Your first Pull Request

Working on your first Pull Request? You can learn how from this free video
series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

To help you get your feet wet and get you familiar with our contribution
process, we have a list of
[good first issues](https://github.com/mimshins/utilityjs/issues?q=is:open+is:issue+label:"good+first+issue")
that contain changes that have a relatively limited scope. This label means that
there is already a working solution to the issue in the discussion section.
Therefore, it is a great place to get started.

We also have a list of
[good to take issues](https://github.com/mimshins/utilityjs/issues?q=is:open+is:issue+label:"good+to+take").
This label is set when there has been already some discussion about the solution
and it is clear in which direction to go. These issues are good for developers
that want to reduce the chance of going down a rabbit hole.

You can also work on any other issue you choose to. The "good first" and "good
to take" issues are just issues where we have a clear picture about scope and
timeline. Pull requests working on other issues or completely new problems may
take a bit longer to review when they don't fit into our current development
cycle.

If you decide to fix an issue, please be sure to check the comment thread in
case somebody is already working on a fix. If nobody is working on it at the
moment, please leave a comment stating that you have started to work on it so
other people don't accidentally duplicate your effort.

If somebody claims an issue but doesn't follow up for more than a week, it's
fine to take it over but you should still leave a comment. If there has been no
activity on the issue for 7 to 14 days, it is safe to assume that nobody is
working on it.

## Sending a Pull Request

Pull Requests are always welcome, but, before working on a large change, it is
best to open an issue first to discuss it with the maintainers.

When in doubt, keep your Pull Requests small. To give a Pull Request the best
chance of getting accepted, don't bundle more than one feature or bug fix per
Pull Request. It's often best to create two smaller Pull Requests than one big
one.

1. Fork the repository.

2. Clone the fork to your local machine and add upstream remote:

   ```sh
   git clone https://github.com/<your username>/utilityjs.git
   cd utilityjs
   git remote add upstream https://github.com/mimshins/utilityjs.git
   ```

3. Synchronize your local `main` branch with the upstream one:

   ```sh
   git checkout main
   git pull upstream main
   ```

4. Install the dependencies with `pnpm` (`npm` and `yarn` aren't supported):

   ```sh
   pnpm install
   ```

5. Create a new topic branch:

   ```sh
   git switch -c my-topic-branch
   ```

6. Make changes, commit and push to your fork:

   ```sh
   git push -u origin HEAD
   ```

7. Go to [the repository](https://github.com/mimshins/utilityjs) and make a Pull
   Request.

The core team is monitoring for Pull Requests. We will review your Pull Request
and either merge it, request changes to it, or close it with an explanation.

## Development Workflow

### Project Structure

For a comprehensive understanding of the project architecture, features, and
design principles, see the
[AI Agent Documentation](https://github.com/mimshins/utilityjs/blob/main/AGENTS.md).

### Running the Playground

Start the development server to test the SDK in a browser environment:

```sh
pnpm dev
```

This runs the playground at `http://localhost:5173` with hot module replacement.

### Building

Build all packages:

```sh
pnpm build
```

### Testing

Run all unit tests:

```sh
pnpm test:unit
```

Run unit tests in watch mode:

```sh
pnpm test:unit:watch
```

Run tests for specific packages:

```sh
pnpm test:unit:workspace   # Test workspace packages only
pnpm test:unit:internals   # Test internals only
```

### Linting and Formatting

Check code quality:

```sh
pnpm check:lint     # Run all checks (TypeScript, ESLint, Prettier, circular dependencies)
pnpm check:format   # Check formatting only
```

Auto-fix formatting:

```sh
pnpm format
```

### Coding style

Please follow the coding style of the project. We use `prettier` and `eslint`,
so if possible, enable linting in your editor to get real-time feedback.

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Please use the following commit message conventions for consistent and
  informative commit history:
  - **feat**: A new feature
  - **fix**: A bug fix
  - **docs**: Documentation only changes
  - **style**: Changes that do not affect the meaning of the code (white-space,
    formatting, missing semi-colons, etc)
  - **refactor**: A code change that neither fixes a bug nor adds a feature
  - **perf**: A code change that improves performance
  - **test**: Adding missing or correcting existing tests
  - **build**: Changes that affect the build system or external dependencies
    (example scopes: gulp, broccoli, npm)
  - **ci**: Changes to our CI configuration files and scripts (example scopes:
    Travis, Circle, BrowserStack, SauceLabs)
  - **chore**: Other changes that don't modify src or test files
  - **revert**: Reverts a previous commit

## License

By contributing your code to the `UtilityJS` GitHub repository, you agree to
license your contribution under the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
