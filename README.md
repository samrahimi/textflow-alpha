# tijuana-sunrise
relationship analytics mvp - launch offering, the forever project
let's rephrase. it's text analytics to help you get your fucking point across lol

what this shit does (mMVP - alpha)

- write message (sms, email, facebook, okc/tinder)
- send to the hive mind
- display a summary prediction of how average human beings will emotionally respond to the message 
    - and suggestions for how to rewrite when one or more areas come off as severely out of balance.
- hand off to parent OS with generic "share" of (possibly rewritten) message.
(to the user it seems like a seamless integration :P)


what this shit does (MVP)
all of the above PLUS

- collects every text / email /gchat sent (and maybe fb if we can swing it)
- analyzes at time of collection
- if message is sufficiently emo / angry / hamsterish, user receives a push notification.

installation as a service running on port 80

1. create a new .service file for the environment based on /service/test.service (user specified should have root privileges)
2. (on the server) sudo cp ./service/ServiceName.service /etc/systemd/system
3. (on the server) sudo systemctl start ServiceName

check if service started / is running 
    sudo journalctl -u ServiceName

stop service
    sudo systemctl stop ServiceName



  API Documentation

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
  
 
