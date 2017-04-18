# Slack Bot for the DreamHouse Sample App

A Salesforce-Powered Slack Bot for the DreamHouse Sample Application.

Follow the instructions below to create your own instance of the bot:

### Step 1: Install the DreamHouse App

If you haven't already done so, follow [these instructions](http://dreamhouse-site.herokuapp.com/installation/) to install the DreamHouse sample application.

### Step 2: Create a Connected App

If you haven't already done so, follow the steps below to create a Salesforce connected app:

1. In Salesforce Setup, type **Apps** in the quick find box, and click the **Apps** link

1. In the **Connected Apps** section, click **New**, and define the Connected App as follows:

    - Connected App Name: MyConnectedApp (or any name you want)
    - API Name: MyConnectedApp
    - Contact Email: enter your email address
    - Enabled OAuth Settings: Checked
    - Callback URL: http://localhost:8200/oauthcallback.html (You'll change this later)
    - Selected OAuth Scopes: Full Access (full)
    - Click **Save**

## Step 3: Create the Bot User in Slack

Follow [these instructions](https://api.slack.com/bot-users) to create a bot user in Slack.

## Step 4: Install the Bot Implementation

1. Clone this repository
    ```
    git clone https://github.com/dreamhouseapp/dreamhouse-bot-slack
    ```

1. Install dependencies
    ```
    npm install
    ```

1. On the command line, define the environment variables used in your Node.js app. On a Mac:
    ```
    export SLACK_BOT_TOKEN=your_slack_bot_token
    export SF_CLIENT_ID=your_salesforce_connected_app_client_id
    export SF_CLIENT_SECRET=your_salesforce_connected_app_secret
    export SF_USER_NAME=salesforce_integration_user_name
    export SF_PASSWORD=salesforce_integration_user_password
    ```
    
1. Start the bot
    ```
    node server
    ```
    
1. In Slack, select your bot under Direct Messages, type Help to see what you can ask, and start chatting with your bot!