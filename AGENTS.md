# AGENTS.md

This file provides guidance for AI coding agents working with this repository.

## Project Overview

This is a **Frontend Framework Starter** repository demonstrating HERE Core (OpenFin) integration with multiple frontend frameworks. It contains starter templates and examples for building applications on the OpenFin platform using Angular, React, and Python.

## Repository Structure

```
/
├── frameworks/
│   ├── angular/          # Angular framework examples
│   │   ├── container/    # Container starter (Angular 19)
│   │   ├── workspace/    # Workspace starter (Angular 19)
│   │   └── web/          # Web project (Angular 19)
│   ├── react/            # React framework examples
│   │   ├── container/    # Container starter (React 18)
│   │   ├── workspace/    # Workspace starter (React 18)
│   │   ├── web/          # Web project (React 19, Webpack/Vite)
│   │   └── workspace-platform-starter/  # Advanced platform (React 19, Vite)
│   └── python/           # Python framework examples
│       ├── streamlit/    # Streamlit example
│       └── dash/         # Dash/Plotly example
├── components/
│   └── wc-fin/           # Stencil web components library
├── scripts/              # Automation scripts
├── assets/               # Documentation assets
└── .github/workflows/    # CI/CD configuration
```

## Sub-Projects Reference

### Angular Projects

| Project | Path | Build Command | Key Dependencies |
|---------|------|---------------|------------------|
| Container Starter | `frameworks/angular/container` | `npm run build` | Angular 19, @openfin/workspace, @openfin/core |
| Workspace Starter | `frameworks/angular/workspace` | `npm run build` | Angular 19, @openfin/workspace-platform |
| Web | `frameworks/angular/web` | `npm run build` | Angular 19, @openfin/core-web |

### React Projects

| Project | Path | Build Command | Key Dependencies |
|---------|------|---------------|------------------|
| Container Starter | `frameworks/react/container` | `npm run build` | React 18, react-scripts, @openfin/workspace |
| Workspace Starter | `frameworks/react/workspace` | `npm run build` | React 18, react-scripts, @openfin/workspace-platform |
| Web | `frameworks/react/web` | `npm run build` | React 19, Webpack/Vite, @openfin/core-web |
| Workspace Platform Starter | `frameworks/react/workspace-platform-starter` | `npm run build` | React 19, Vite, @openfin/workspace-platform |

### Python Projects

| Project | Path | Install Command | Key Dependencies |
|---------|------|-----------------|------------------|
| Streamlit | `frameworks/python/streamlit` | `uv pip install -e .` | Python 3.10+, Streamlit, Flask |
| Dash | `frameworks/python/dash` | `uv pip install -e .` | Python 3.10+, Dash |

### Web Components

| Project | Path | Build Command | Key Dependencies |
|---------|------|---------------|------------------|
| wc-fin | `components/wc-fin` | `npm run build` | Stencil 4.21 |

## Development Patterns

### Node.js Projects

- All Node.js projects use `npm` as the package manager
- Use `npm ci` for clean installs (CI) or `npm install` for development
- Each project is independent with its own `package.json`
- TypeScript is used across all projects

### Python Projects

- Python 3.10+ required
- Projects use `pyproject.toml` for configuration
- `uv` is the preferred package manager (faster alternative to pip)
- Each project has a `uv.lock` file for reproducible installs

### Version Management

- All projects share a common version (currently v23.0.x)
- Use `/scripts/upgrade-versions.mjs` to update versions across all projects
- OpenFin dependencies should be kept in sync across projects

## Build System Details

### Angular Projects
- Use Angular CLI (`ng build`)
- Output typically in `dist/` directory
- Configuration in `angular.json`

### React Projects (CRA-based)
- Container and Workspace use Create React App (`react-scripts`)
- Output in `build/` directory

### React Projects (Vite-based)
- Web and Workspace Platform Starter use Vite
- Output in `dist/` directory
- May have additional Rollup configuration for OpenFin platform builds

### Stencil Components
- Use Stencil CLI (`stencil build`)
- Generates web components with React wrappers
- Output in `dist/` and `loader/` directories

## CI/CD

The GitHub Actions workflow (`.github/workflows/build.yaml`) builds all projects:
- **build-node job**: Builds all Angular, React, and Web Component projects
- **build-python job**: Installs Python project dependencies

## Common Tasks

### Adding a new framework example
1. Create directory under `frameworks/<framework-name>/`
2. Initialize with appropriate build tooling
3. Add OpenFin dependencies (`@openfin/core`, `@openfin/workspace`, etc.)
4. Add build step to `.github/workflows/build.yaml`
5. Update version in `scripts/upgrade-versions.mjs` if needed

### Updating OpenFin dependencies
1. Update `@openfin/*` packages in each project's `package.json`
2. Run `npm install` in each project
3. Test builds across all projects

### Running a project locally
```bash
cd frameworks/<framework>/<project>
npm install
npm start
```

For Python projects:
```bash
cd frameworks/python/<project>
uv pip install -e .
# Then run the appropriate command (streamlit run, python app.py, etc.)
```

## Key Files

- `/package.json` - Root workspace configuration
- `/.github/workflows/build.yaml` - CI/CD pipeline
- `/scripts/upgrade-versions.mjs` - Version management script
- Each project's `package.json` or `pyproject.toml` - Project-specific config