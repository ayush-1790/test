I have updated the `seedAdmin.js` file to give the admin user the correct permissions. To apply these changes, you need to re-seed the database.

**Instructions:**

1.  **Stop the backend server** if it is running.
2.  **Connect to your MongoDB database.**
3.  **Delete the data** from the `users`, `roles`, and `userroles` collections. You can use the following commands in the `mongo` shell:
    ```javascript
    use <your_database_name>;
    db.users.deleteMany({});
    db.roles.deleteMany({});
    db.userroles.deleteMany({});
    ```
4.  **Run the seed script:**
    ```bash
    node backend/seedAdmin.js
    ```
5.  **Start the backend server** again:
    ```bash
    node backend/server.js
    ```

After following these steps, the admin user will have the necessary permissions, and you should no longer see the 403 error.