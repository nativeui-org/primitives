# Roadmaps

This directory contains monthly roadmaps for NativeUI Primitives.

## Structure

Each roadmap is a separate JSON file named `{month}-{year}.json` (e.g., `november-2025.json`).

## File Format

```json
{
  "id": "november-2025",
  "title": "November 2025",
  "period": "November 2025",
  "deadline": "End of November 2025",
  "active": true,
  "components": [
    {
      "name": "Component Name",
      "description": "Component description",
      "status": "pending"
    }
  ]
}
```

### Fields

- **id**: Unique identifier (format: `month-year`)
- **title**: Display title
- **period**: Short period description
- **deadline**: Deadline text
- **active**: `true` for current roadmap, `false` for archives
- **components**: Array of components/tasks

### Component Status

- `pending`: Not started
- `in-progress`: Currently being worked on
- `done`: Completed

## Adding a New Roadmap

1. Create a new file: `{month}-{year}.json`
2. Import it in `src/lib/roadmaps.ts`:
   ```typescript
   import decemberRoadmap from '@/data/roadmaps/december-2025.json';
   ```
3. Add to the roadmaps array:
   ```typescript
   const roadmaps: Roadmap[] = [
     octoberRoadmap as Roadmap,
     novemberRoadmap as Roadmap,
     decemberRoadmap as Roadmap, // New roadmap
   ];
   ```
4. Set the new roadmap's `active` to `true` and previous ones to `false`

## Updating Component Status

Simply edit the JSON file and change the `status` field:

```json
{
  "name": "Separator",
  "status": "done"  // Changed from "pending"
}
```

The website will automatically reflect the changes.

