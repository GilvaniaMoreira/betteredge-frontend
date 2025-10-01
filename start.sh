#!/bin/sh

# Create next-env.d.ts if it doesn't exist
if [ ! -f "/app/next-env.d.ts" ]; then
    touch /app/next-env.d.ts
fi

# Ensure proper permissions
chmod 644 /app/next-env.d.ts 2>/dev/null || true

# Start the application
npm run dev


