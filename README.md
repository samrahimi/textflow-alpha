# tijuana-sunrise

This Repo Contains:

- TextFlow.us marketing site
- TextFlow beta webapp
- TextFlow alpha Slack integration

#Installation and Deployment on a new server

The following assumes that the domain is textflow.us and that you're 
installing on a modern Debian-compatible flavor of Linux

# Dependencies

MongoDB 3.4 or higher
- Refer to mongo docs

Secure your MongoDB (You may wish to use different credentials - if you do, update /lib/config.js)

mongo
use textflow
db.createUser({user:"singularityAdmin", pwd:"KillerApp123!", roles: [{role:"userAdminAnyDatabase", db: "textflow"}]})


Generate your SSL Certificates (good ones, for free)

sudo apt-get install certbot -t jessie-backports
sudo certbot certonly
- enter textflow.us for the domain and accept default settings for everything else

#Application - Install and Test
1. git clone https://github.com/samrahimi/tijuana-sunrise.git
2. sudo npm install
3. sudo npm start (For Testing - the site should come up on http and https)

#Running As A Service

If you want the site to stay up when you disconnect from the server, you need to run it as a service.
I did most of the work for you... the test.service file will be correct except for 
path names, which are probably obvious - and the username.


1. Create a user with root privileges (e.g. node_service). This account should not be used by humans for security reasons!
2. nano ./service/test.service and update paths, working directory, etc.
2. sudo cp ./service/test.service /etc/systemd/system
3. sudo systemctl start test
4. check by going to textflow.us in your browser or use: sudo journalctl -u test



#Deploying Updates

This part is easy as fuck. If someone takes the time to 
set up environment variables for host and port instead of 
hardcoding them in the config, that would rock ;)

1. Check that config.js is set to production values
2. git add / commit / push 
3. SSH into server
4. Stop the service: sudo systemctl stop test
5. git pull
6. Start the service sudo systemctl start test

#API Documentation

  POST /message Response Format:
 
  IMPACT: number, 0 to 100
  "intelligent motivational process analytics creation tool"
  Overall quality of the communication for it's intended purpose
  
  analysis: [
   ruleset: ruleset_id

   matched_rule_id: rule_id

   derived_from: ["emotions.anger", "emotions.disgust"]

   type: "positive||negative||neutral"

   result_confidence: "low||medium|high" (Jung's confidence in the accuracy / magnitude of the result)

   subscore: number, 0 to 100 - optional

   summary: "e.g. Beware The Four Horsemen"
  
   details: "Beware. This message seems to contain high levels of anger and disgust. This emotional combination is often perceived as 
   contempt, and is known to be a 'relationship killer' (regardless of the type of relationship)
  
   advice: "If your anger / disgust is directed towards the recipient of the message, tone it WAY down: Contempt is a toxic form of communication;
   there are other, more healthy ways to communicate anger or hurt. If you are simply venting your frustration with an external person or situation, 
   know that your attitude may be perceived as 'bitter' or 'negative' . A calmer, more descriptive approach will better communicate the nature 
   of the aggravation and it's effects on you, and others will perceive you as having a more positive attitude."
  ]

  user_id: the user id as defined in the request
  context: the context as defined in the request 
  
 
