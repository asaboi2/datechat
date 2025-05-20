# Dating Text Assistant

A custom dating conversation assistant powered by Anthropic's Claude Sonnet 3.5 that can be easily deployed to Netlify.

## Features

- Witty, engaging dating conversation assistant
- Specialized in creating engaging dating app conversations
- Support for Claude Sonnet 3.5 model
- Secure API key handling (stored as an environment variable on Netlify)
- Markdown formatting support for messages
- Responsive design that works on desktop and mobile
- Easy deployment to Netlify with serverless functions

## How It Works

This application uses a serverless function approach to securely communicate with Claude's API:

1. The frontend sends requests to a Netlify serverless function
2. The serverless function uses your API key (stored as an environment variable)
3. The function forwards the request to Claude's API and returns the response
4. The frontend displays Claude's responses in a chat-like interface
5. The system prompt is kept secure on the server side

### Special Features

- Type "opener" to get a creative conversation starter
- Get witty, brief responses that maintain frame control
- Learn effective dating conversation techniques through example
- No API key required from end users

## Setup and Deployment

### Prerequisites

1. Get a Claude API key from [Anthropic's Console](https://console.anthropic.com/)
2. Sign up for a [Netlify account](https://app.netlify.com/signup) if you don't have one

### Important Note About Functions

This project uses Netlify's default serverless function structure:
- The function is located at `/.netlify/functions/claude-proxy.js`
- The `netlify.toml` file has been simplified to use Netlify's default behavior

This simplified approach should ensure maximum compatibility with Netlify's serverless function infrastructure.

**Note:** Drag-and-drop ZIP deployments do not include serverless functions. To deploy your functions, use Git integration or the Netlify CLI.

### Local Development

To run the application locally with full functionality:

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Clone this repository and navigate to the project folder

3. Create a `.env` file in the root directory with your Claude API key:
   ```
   CLAUDE_API_KEY=your-api-key-here
   ```

4. Start the Netlify development server:
   ```bash
   netlify dev
   ```

5. Open the URL provided by the Netlify CLI (typically http://localhost:8888)

### Deploying to Netlify

#### Option 1: Deploy via Netlify Dashboard

1. Go to the Netlify dashboard and click "New site from Git"
2. Connect your Git provider and select this repository
3. Configure the build settings:
   - Build command: Leave empty (no build required)
   - Publish directory: `/`
4. Click "Show advanced" and add an environment variable:
   - Key: `CLAUDE_API_KEY`
   - Value: Your Claude API key
   - **Important**: Check the "Sensitive" checkbox to mark it as a secret value
5. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI

1. Install the Netlify CLI (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```
2. Authenticate and deploy from the project root directory:
   ```bash
   netlify login
   netlify deploy --prod
   ```
   This command deploys both your static assets and your serverless functions.
3. In the Netlify dashboard, go to Site settings > Environment variables.
4. Add a new variable:
   - Key: `CLAUDE_API_KEY`
   - Value: Your Claude API key
   - **Important**: Mark it as "Sensitive"
5. To redeploy after changes, run:
   ```bash
   netlify deploy --prod
   ```

### Troubleshooting

If you encounter a 404 error when trying to use the application:

1. **Test the "Hello World" Function**:
   - A simple `hello.js` function has been added to `/.netlify/functions/`
   - After deploying, try accessing this function directly in your browser:
     `https://your-site-name.netlify.app/.netlify/functions/hello`
   - If this works, it means Netlify functions are generally working, and the issue is specific to the `claude-proxy` function.
   - If this also returns a 404, there's a more fundamental issue with function deployment.

2. **Check Environment Variable**:
   - Go to Site settings > Environment variables
   - Verify that `CLAUDE_API_KEY` is set and has the correct value
   - Make sure it's marked as "Sensitive"

3. **Verify Function Deployment**:
   - Go to the "Functions" tab in your Netlify dashboard
   - Check if both `claude-proxy` and `hello` functions are listed
   - If not, try redeploying the site

4. **Check Netlify Function Logs**:
   - Go to Functions in your Netlify dashboard
   - Look for any error messages related to the `claude-proxy` function

5. **Try a Direct Function URL**:
   - Your `claude-proxy` function should be available at: `https://your-site-name.netlify.app/.netlify/functions/claude-proxy`
   - Test this URL directly to see if it responds

## Using the Interface

1. Open the deployed application in your browser
2. Start chatting with the Dating Text Assistant!
3. Try typing "opener" to see a creative conversation starter

## Security Notes

- Your Claude API key is stored securely as an environment variable on Netlify
- The system prompt is kept on the server side and not exposed to users
- All communication between the frontend and Claude API is proxied through a serverless function
- The application uses HTTPS when deployed to Netlify
- Content Security Policy (CSP) headers are configured to enhance security

## Customization

You can customize the interface by modifying:

- `index.html` - Structure of the interface
- `css/styles.css` - Styling and appearance
- `js/app.js` - Frontend functionality
- `netlify/functions/claude-proxy.js` - Serverless function and system prompt

### System Prompt

The system prompt is now stored in the serverless function file (`netlify/functions/claude-proxy.js`). You can modify this prompt to customize the assistant's behavior if needed. Look for the `SYSTEM_PROMPT` constant at the top of the file.

### Monetization Options

Since the API key is now managed on the server side, you can potentially monetize this application by:

1. Setting up user authentication
2. Implementing usage tiers or subscription plans
3. Adding analytics to track usage patterns
4. Implementing rate limiting to control costs

## License

MIT License

## Disclaimer

This is an unofficial interface and is not affiliated with or endorsed by Anthropic. Use at your own risk and responsibility.
