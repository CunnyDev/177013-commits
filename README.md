# 177013 Commits

Pin the commit count to be 177013 with

- Preserve all previous commits description
- Give credit to author
- Cursed

## Usage

```yml
name: 177013

on:
  push:
    branches:
      - main

jobs:
  bruh:
    name: Goragit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: 177013
        uses: CunnyDev/177013-commits@main
        with:
          commits: # number you want (default 177013)
          git-name: # author to blame (default github actions)
          git-email: # author email to blame (default github actions)
```

## Real World Example

- [CunnyDev/saltyaom](https://github.com/CunnyDev/saltyaom/blob/main/.github/workflows/177013.yml)
