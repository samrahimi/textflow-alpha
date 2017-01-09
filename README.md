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

