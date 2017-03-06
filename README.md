# tijuana-sunrise

This Repo Contains:

- TextFlow.us marketing site
- TextFlow beta webapp
- TextFlow alpha Slack integration
- TextFlow Android WebView container with interface to access SMS and Contacts DB.

# Installation and Deployment on a new server

The following assumes that the domain is textflow.us and that you're 
installing on a modern Debian-compatible flavor of Linux

# Installing Dependencies
- Clone the repository: git clone https://github.com/samrahimi/textflow-alpha.git && cd textflow-alpha
- Install NPM dependencies: 
  ```
  sudo npm install
  ```
- Install MongoDB 3.4 or higher or sign up for a hosted instance. Create an empty database (the example below assumes the DB name is textflow)
- Create an instance of Watson Tone Analyzer service on Bluemix and save the credentials. 
- Create a .env file and set the port, MongoDB connection string and Watson credentials to match your setup. If you want to use SSL, set PORT=80 and app will run on http:80 and https:443
  ```
  PORT=80 
  DB=mongodb://localhost:27017/textflow
  WATSON_PASSWORD='Password for your tone analyzer service'
  WATSON_USER = 'Username for your tone analyzer service'
  ```

# Generate your SSL Certificates (production only)

NOTE: this app is configured to use CERTBOT on Debian 8 and assumes certificate location and type based on that. If you wish to use a different SSL provider or server OS, edit /bin/www to load the appropriate certificate 

```
sudo apt-get install certbot -t jessie-backports
sudo certbot certonly
```

The CertBot UI will ask you some questions: enter your domain name where you're hosting and accept default settings for everything else

# Start The App (Testing / Development)
```
sudo npm start
```

# Running As A Service (Production)

If you want the site to stay up when you disconnect from the server, you need to run it as a service.
Assuming you're on Debian 8, you can edit the service definition in /service/test.service file and update the file locations and username as follows:

  1. Create a user with root privileges (e.g. node_service). This account should not be used by humans for security reasons!
  2. nano ./service/test.service and update paths, working directory, etc.
  2. sudo cp ./service/test.service /etc/systemd/system
  3. sudo systemctl start test
  4. check by going to textflow.us in your browser or use: sudo journalctl -u test



# Updating On The Remote Server
NOTE: Assumes a working installation as described above)

  1. SSH into remote.
  2. Stop the service: sudo systemctl stop test
  3. git pull
  4. Start the service sudo systemctl start test

# API Documentation (DEPRECATED)

TODO! 
