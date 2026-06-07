# MongoDB Setup Guide

This project stores users and applications in MongoDB Atlas. Follow these steps to connect your own cluster.

## 1. Create a MongoDB Atlas account

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up (free tier is fine).
2. Create a new **Project** (e.g. `application-management`).

## 2. Create a cluster

1. Click **Build a Database** → choose **M0 Free**.
2. Pick a cloud provider/region close to you.
3. Name the cluster (e.g. `Cluster0`) and create it.

## 3. Create a database user

1. In Atlas, go to **Database Access** → **Add New Database User**.
2. Choose **Password** authentication.
3. Set a username and a strong password (save these — you need them for the connection string).
4. Grant **Read and write to any database**.
5. Create the user.

## 4. Allow network access

1. Go to **Network Access** → **Add IP Address**.
2. For local development, click **Allow Access from Anywhere** (`0.0.0.0/0`), or add your current IP.
3. Confirm.

## 5. Get your connection string

1. Go to **Database** → **Connect** on your cluster.
2. Choose **Drivers** → **Node.js**.
3. Copy the connection string. It looks like:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

4. Replace `<username>` and `<password>` with your database user credentials.
5. Add a database name and options:

   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/application-management?retryWrites=true&w=majority
   ```

## 6. Update this project

1. Copy the example env file:

   ```bash
   cp .env.example .env.local
   ```

2. Paste your connection string into `.env.local`:

   ```
   MONGO_DB_URI=mongodb+srv://...
   ```

3. Test the connection:

   ```bash
   npm run test:db
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

## Collections used by this app

Mongoose creates these automatically when you submit data:

| Collection     | Purpose                          |
|----------------|----------------------------------|
| `applications` | Job/application submissions      |
| `users`        | User records synced from Clerk   |

## MongoDB MCP Server (Cursor)

The MCP server lets Cursor query your database from chat. See `.cursor/mcp.json.example` and copy it to `.cursor/mcp.json`, then paste the same connection string.

**Requirements:** Node.js **20.19+** (or 22.12+, or 23+). Check with `node -v`.

After editing MCP config, restart Cursor and verify **MongoDB** appears under **Settings → Tools & MCP**.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MONGO_DB_URI` not defined | Create `.env.local` from `.env.example` |
| Connection timeout | Check Atlas **Network Access** includes your IP |
| Authentication failed | Verify username/password in the connection string |
| Status page error (admin) | Ensure MongoDB is connected; the app no longer calls `.populate('user')` on embedded data |
