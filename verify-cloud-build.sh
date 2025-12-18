#!/bin/bash
# Verify Cloud Build Prerequisites

echo "=========================================="
echo "Cloud Build Prerequisites Check"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Not in a git repository root directory"
    echo "   Please run this script from the repository root"
    exit 1
fi

echo "✓ In git repository"
echo ""

# Check current branch
echo "Checking git branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "copilot/fix-google-cloud-run-build" ]; then
    echo "  ❌ Wrong branch: $CURRENT_BRANCH"
    echo "     You need to be on: copilot/fix-google-cloud-run-build"
    echo ""
    echo "  Switch to the correct branch:"
    echo "     git checkout copilot/fix-google-cloud-run-build"
    echo "     git pull origin copilot/fix-google-cloud-run-build"
    exit 1
fi
echo "  ✓ On correct branch: $CURRENT_BRANCH"
echo ""

# Check for required files
echo "Checking required files..."
REQUIRED_FILES=(
    "Dockerfile"
    "nginx.conf"
    "cloudbuild.yaml"
    "package.json"
    "package-lock.json"
    "index.tsx"
    "vite.config.ts"
)

ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ❌ $file MISSING"
        ALL_PRESENT=false
    fi
done

echo ""

if [ "$ALL_PRESENT" = false ]; then
    echo "❌ Some required files are missing"
    echo "   Make sure you have pulled the latest changes:"
    echo "   git pull origin copilot/fix-google-cloud-run-build"
    exit 1
fi

# Check if files are committed
echo "Checking if files are committed to git..."
NOT_COMMITTED=()
for file in "${REQUIRED_FILES[@]}"; do
    if ! git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
        NOT_COMMITTED+=("$file")
    fi
done

if [ ${#NOT_COMMITTED[@]} -gt 0 ]; then
    echo "  ❌ The following files are not committed:"
    for file in "${NOT_COMMITTED[@]}"; do
        echo "     - $file"
    done
    echo ""
    echo "   Please commit and push these files first"
    exit 1
else
    echo "  ✓ All files are committed"
fi

echo ""

# Check gcloud configuration
echo "Checking gcloud configuration..."
if ! command -v gcloud &> /dev/null; then
    echo "  ❌ gcloud CLI not found"
    echo "     Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
echo "  ✓ gcloud CLI installed"

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "  ❌ No project configured"
    echo "     Run: gcloud config set project YOUR-PROJECT-ID"
    exit 1
fi
echo "  ✓ Project: $PROJECT_ID"

ACCOUNT=$(gcloud config get-value account 2>/dev/null)
if [ -z "$ACCOUNT" ]; then
    echo "  ❌ Not authenticated"
    echo "     Run: gcloud auth login"
    exit 1
fi
echo "  ✓ Account: $ACCOUNT"

echo ""
echo "=========================================="
echo "✓ All checks passed!"
echo "=========================================="
echo ""
echo "You can now deploy with:"
echo "  gcloud builds submit --config=cloudbuild.yaml"
echo ""
