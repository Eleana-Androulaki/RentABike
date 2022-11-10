### **Set up the project**

**Run the front end**

In the frontend/ folder, run 

```plaintext
npm install
npm start
```

Frontend should be available on http://localhost:3000/

**Run the back end**

In order to run the back end, the database credentials and the JWT token secret are stored in a .env file. It is insecure to commit files containing credentials to the repositories, so in order for the backend to work, please contact me at [spiros.kodolatis@gmail.com](mailto:spiros.kodolatis@gmail.com) to send you the .env file.

After storing the .env file in the backend/folder ( it should be in the same folder as the server.js file), run

```plaintext
npm install
node server.js
```

Once the message that db is connected and the server is running appears, the backend will be running at http://localhost:5000/

**Dummy data**

As the current application is something that relies on time, in order to fully demonstrate its potential, I have created the following dummy data:  
 

*   A superuser with ‘Manager’ role in order to be able to handle all the CRUDs.
*   A user with ‘User’ role in order to store the below reservations.
*   A few bikes for storing reservations.
*   A few past reservations for some bikes.

The bikes and, subsequently, their reservations will be deleted and new ones will be created in their place during the presentation in order to fully showcase how the app would work over time.