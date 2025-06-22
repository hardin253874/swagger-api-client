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

## Updated Project Structure:
```
src/
├── assets/
│   ├── README.md
│   ├── it-works-meme.png        ← Meme image
│   └── request/                 ← JSON request templates
│       ├── carport-model.json   ← Carport POST request body
│       └── shed-model.json      ← Shed POST request body
├── components/
├── config/                      ← Configuration management
│   ├── index.ts                ← Main config (imports and exposes bimApiList)
│   └── bimApiList.ts           ← BIM API endpoints (with requestBody paths)
├── pages/
├── services/
├── types/
.env                            ← Environment variables (not in git)
.env.example                    ← Environment template (in git)
```

## BIM API Configuration with Request Bodies:
- **GET APIs** - No request body needed
- **POST APIs** - Automatically load JSON templates via ES6 imports
- **Auto-population** - Selecting POST API loads and formats JSON in request body field
- **Content-Type** - Automatically set to `application/json` for POST requests
- **Template mapping** - JSON files imported and mapped by filename

## How It Works:
1. JSON files are imported as ES6 modules in `ApiTestPage.tsx`
2. Template mapping object links filenames to imported JSON objects
3. When POST API selected, corresponding JSON template is loaded and formatted
4. No filesystem APIs needed - uses standard React import system