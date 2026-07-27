#!/bin/bash
exec > /Users/danielvazquez/Proyectos/StreetBoss/audit_results.txt 2>&1
echo "=== LOCAL DIRECTORIES ==="
DIRS=("/Users/danielvazquez/Proyectos" "/Users/danielvazquez/.gemini/antigravity/scratch" "/Users/danielvazquez/Desktop" "/Users/danielvazquez/Documents")
for base in "${DIRS[@]}"; do
  if [ -d "$base" ]; then
    find "$base" -maxdepth 3 -type d -iname "*streetboss*" 2>/dev/null | while read d; do
      echo "Directory: $d"
      echo "Last modified: $(stat -f "%Sm" "$d")"
      if [ -f "$d/package.json" ]; then
        echo "Dependencies: $(grep -E '"(next|vite|react)"' "$d/package.json")"
      fi
      if [ -d "$d/.git" ]; then
        cd "$d"
        echo "Current branch: $(git branch --show-current)"
        echo "Remote origin: $(git remote get-url origin 2>/dev/null)"
        echo "Last commit: $(git log -1 --format="%h - %s (%ci)")"
        echo "Uncommitted files count: $(git status --porcelain | wc -l)"
      else
        echo "Git: No git repository"
      fi
      echo "--------------------------"
    done
  fi
done

echo "=== GITHUB REPOS ==="
if command -v gh &> /dev/null; then
  gh repo list --limit 100 | grep -i streetboss | awk '{print $1}' | while read repo; do
    echo "Repo: $repo"
    gh repo view "$repo" --json url,defaultBranchRef,updatedAt
    gh api repos/$repo/commits --jq '.[0] | {sha, date: .commit.author.date, message: .commit.message}' 2>/dev/null
    echo "--------------------------"
  done
else
  echo "gh CLI not found"
fi

echo "=== VERCEL PROJECTS ==="
if command -v vercel &> /dev/null; then
  echo "Vercel Projects matching streetboss:"
  vercel ls streetboss --yes
  vercel ls streetboss-web --yes
  echo "=== ENV VARS streetboss ==="
  vercel env ls --project streetboss --yes
  echo "=== ENV VARS streetboss-web ==="
  vercel env ls --project streetboss-web --yes
else
  echo "vercel CLI not found"
fi
