# Assets Folder

This folder contains static assets like images, JSON request templates, etc.

## How to add the image:

1. Save the "IT WORKS on my machine" image as: `src/assets/it-works-meme.png`
2. The image will be imported and displayed above the API Request section

## Request JSON Templates:

Create JSON files under `src/assets/request/` for POST API request bodies:

1. **`carport-model.json`** - JSON template for carport model data
2. **`shed-model.json`** - JSON template for shed model data

**Note:** These JSON files are imported as modules in React, so they need to be valid JSON format.
