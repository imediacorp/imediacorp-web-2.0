#!/bin/bash
# Run portfolio dashboard tests with multiple scenarios

set -e

echo "🧪 Running Portfolio Dashboard Test Suite"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo ""
echo "🔍 Running Tab Functionality Tests..."
npm test -- --testPathPattern=portfolio-dashboard.test --verbose

echo ""
echo "🔗 Running Integration Tests..."
npm test -- --testPathPattern=portfolio-tabs-integration.test --verbose

echo ""
echo "✅ All tests completed!"
echo ""
echo "📊 Test Summary:"
npm test -- --testPathPattern=portfolio --coverage --coverageReporters=text-summary

