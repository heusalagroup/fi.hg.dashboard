# @heusalagroup/fi.hg.dashboard

Common module for [@heusalagroup/hg-dashboard](https://github.com/heusalagroup/hg-dashboard-private).

### Install commands for frontend only project

These commands are meant if your frontend project is directly in the git directory and source code is in `./src`.

```shell
mkdir -p src/fi/hg
```

```shell
git submodule add git@github.com:heusalagroup/fi.hg.dashboard.git src/fi/hg/dashboard
git config -f .gitmodules submodule.src/fi/hg/dashboard.branch main
```

```shell
git submodule add git@github.com:heusalagroup/fi.hg.frontend.git src/fi/hg/frontend
git config -f .gitmodules submodule.src/fi/hg/frontend.branch main
```

```shell
git submodule add git@github.com:heusalagroup/fi.hg.core.git src/fi/hg/core
git config -f .gitmodules submodule.src/fi/hg/core.branch main
```

### Install commands for full stack project

These commands are meant if you have full stack project in the same git repository and source codes are in `./backend/src`, `./frontend/src` and `./testing/src`.

```shell
mkdir -p {backend,frontend,testing}/src/fi/hg
```

#### `fi.hg.dashboard` to backend project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.dashboard.git backend/src/fi/hg/dashboard
git config -f .gitmodules submodule.backend/src/fi/hg/dashboard.branch main
```

#### `fi.hg.dashboard` to frontend project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.dashboard.git frontend/src/fi/hg/dashboard
git config -f .gitmodules submodule.frontend/src/fi/hg/dashboard.branch main
```

#### `fi.hg.dashboard` to testing project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.dashboard.git testing/src/fi/hg/dashboard
git config -f .gitmodules submodule.testing/src/fi/hg/dashboard.branch main
```

#### `fi.hg.frontend` to frontend project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.frontend.git frontend/src/fi/hg/frontend
git config -f .gitmodules submodule.frontend/src/fi/hg/frontend.branch main
```

#### `fi.hg.frontend` to testing project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.frontend.git testing/src/fi/hg/frontend
git config -f .gitmodules submodule.testing/src/fi/hg/frontend.branch main
```

#### `fi.hg.core` to backend project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.core.git backend/src/fi/hg/core
git config -f .gitmodules submodule.backend/src/fi/hg/core.branch main
```

#### `fi.hg.core` to frontend project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.core.git frontend/src/fi/hg/core
git config -f .gitmodules submodule.frontend/src/fi/hg/core.branch main

```

#### `fi.hg.core` to testing project

```shell
git submodule add git@github.com:heusalagroup/fi.hg.core.git testing/src/fi/hg/core
git config -f .gitmodules submodule.testing/src/fi/hg/core.branch main
```

