# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



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

## Vibe coding
1) Step 1: Now create a React project using TypeScript. Add structure with folders: components, pages, services, types. Keep styling simple and responsive using Tailwind. 

2) Step 2: BIM API Selection Dropdown
Add a smart API selection system to make testing BIM APIs effortless.
Requirements:

BIM API Configuration System:

Create a BimApiItem interface with 3 fields: name, url, method
Create separate config file src/config/bimApiList.ts for maintainability
Import into main config and expose as config.bimApiList
Include 10+ predefined BIM API endpoints (projects, models, metadata, etc.)


UI Enhancement:

Add "BIM API" dropdown above the URL/Method row
Load API list from configuration
Display format: "API Name (METHOD)" in dropdown options
Style consistent with dark theme (#0e0e0e background)


Smart Auto-Population:

Selecting API automatically fills URL and Method fields
Allow manual editing after selection (for parameterized URLs like /api/projects/{id})
Maintain state for selected API


Clean Architecture:

Single import pattern: components only import main config
Modular configuration: BIM APIs in separate file
TypeScript support with proper interfaces
Centralized configuration management



User Experience:

Developer selects BIM API from dropdown → URL/Method auto-populate → Customize if needed → Test API
Quick testing of common BIM operations without manual URL typing
Consistent, maintainable API endpoint definitions

Result: Streamlined BIM API testing with zero manual URL entry for common endpoints.

3) Step 3: Smart BIM API Dropdown Linking
Connect the BIM API dropdown with URL and Method fields for seamless auto-population and intelligent form synchronization.
Requirements:

Dropdown-to-Fields Auto-Population:

Add onChange event handler to BIM API dropdown
When API selected: automatically update URL and Method fields with selected object's properties
When "-- Select a BIM API --" chosen: reset to default values (/api/values, GET)


Bidirectional Synchronization:

Create handleUrlChange() and handleMethodChange() functions
Clear dropdown selection if user manually edits URL or Method fields
Prevent confusion between dropdown selection and manual field edits
Maintain state consistency across all form fields


Enhanced User Experience:

Add visual feedback: "✓ Selected: {API Name}" indicator when API chosen
Include helpful tooltip on dropdown explaining auto-population feature
Smart state management prevents conflicts between predefined and custom configurations


Intelligent Field Linking:

Scenario 1: Select predefined API → auto-fill → test immediately
Scenario 2: Select API → customize URL (e.g., replace {id} with actual ID) → dropdown clears
Scenario 3: Manual entry → dropdown stays clear → full custom control



Technical Implementation:

Enhanced handleBimApiSelection() with find/update logic
New field handlers that check and clear dropdown when manually edited
State synchronization between selectedBimApi and request object
Visual feedback components for selection status

4) Step 4:  Step 4: Smart JSON Request Body Loading
Enhance POST API testing with automatic JSON template loading from predefined request body files.
Requirements:

Extend BimApiItem Interface:

Add optional requestBody?: string field to store JSON file paths
Path references files under assets/request/ folder
Only applicable for POST/PUT methods that require request bodies


JSON Template System:

Create src/assets/request/ folder structure
Store JSON templates: carport-model.json, shed-model.json
Use ES6 imports (not filesystem APIs) for React compatibility
Create template mapping object linking filenames to imported JSON


Auto-Loading Logic:

When POST API selected from dropdown: automatically load corresponding JSON template
Parse and pretty-format JSON with 2-space indentation
Update request body field with formatted JSON content
Auto-set Content-Type: application/json header


Enhanced User Experience:

GET APIs: No request body changes
POST APIs: Smart template loading with realistic data
Error handling: Graceful fallback if template not found
Immediate testing: Ready-to-use request bodies for API testing



Technical Implementation:

Import JSON files as ES6 modules at build time
Template mapping: { 'filename.json': importedJsonObject }
Enhanced handleBimApiSelection() with template loading logic
Automatic header management for JSON content type
No additional dependencies required - uses React's built-in JSON import