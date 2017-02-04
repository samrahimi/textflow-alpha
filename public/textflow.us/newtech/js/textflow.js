   /* Core scripts for textflow app. This is a single page app
      with an AngularJS-llike architecture. Functions have been namespaced 
      window.fn is the global namespace, then window.fn.dashboard for 
      page-specific code, etc. */

    window.session={};

    
    /* Global Functions */
    window.fn = {};
    window.fn.navigate = function(page, parameters) {
      $("#kerouac")[0].pushPage(page, {data:parameters})
    };

    window.fn.isLoggedIn = function() {
      if (window.user && window.user != null) {
        return true
      }

      var userinfo = localStorage.getItem("textflow_user")
      if (userinfo && userinfo != null) {
        window.user = JSON.parse(userinfo)
        return true;
      } 
      return false;
    }

    window.fn.logout= function() {
      localStorage.removeItem("textflow_user")
      window.user = null
      fn.navigate('login.html')
    };


    /* Login page */
    window.fn.login = {}
    window.fn.login.initLogin = function() {
            $("#signup").on("click", function() {
                fn.navigate("signup.html")
            })
            $(".login-button").on("click", function() {
                var u = $("#email").val()
                var p = $("#password").val()
                $.get("/users/login?email="+u+"&password="+p, function(result){
                    if (result._id) {
                        localStorage.setItem("textflow_user", JSON.stringify(result))
                         fn.navigate("dashboard.html")
                    } else {
                        alert("Incorrect username or password")
                    }
                })
            })
    }

    /* Signup page */
    window.fn.signup = {}
    window.fn.signup.initSignup = function() {
                $("#signup-button").on("click", function() {
                var u = $("#signup #email").val()
                var p = $("#signup #password").val()
                var f = $("#signup #firstname").val()
                var l = $("#signup #lastname").val()

                $.get("/users/signup?email="+u+"&password="+p+"&first_name="+f+"&last_name="+l, function(result){
                    if (result._id) {
                        localStorage.setItem("textflow_user", JSON.stringify(result))
                        fn.navigate("dashboard.html")
                    } else {
                        alert("Something went wrong. Please try again")
                    }
                })
            })
    }

    /* Compose page */
    window.fn.compose = {}

    window.fn.compose.analyze = function() {
      var t = $("#message_text").val()
      var u = window.user._id
      $.post("/messages", {text: t, user_id: u}, function(results){
        window.session.latest = results      

        google.charts.load('current', {'packages':['gauge']});
        google.charts.setOnLoadCallback(drawChart);
        
        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                ['FloScore®', results.overall_score]
            ]);

            var options = {
            width: screen.width, height: screen.width,
            redFrom: 0, redTo: 40,
            yellowFrom:40, yellowTo: 60,
            greenFrom:60, greenTo:100,
            minorTicks: 5
            };

            var chart = new google.visualization.Gauge(document.getElementById('overall_score_chart'));

            chart.draw(data, options);
        }

        /*
        window.scores = results.user_scores
        window.raw_scores = results.raw_scores
        var emo, persona = ''
        if (window.scores[0].notes.length > 0) 
          emo = window.scores[0].notes.map(function(n) {return n.display_name}).join(',')
        else
          emo = window.scores[0].info[0].display_name //Just the first  one if its not noteworthy
      
        if (window.scores[1].notes.length > 0) 
          persona = window.scores[1].notes.map(function(n) {return n.display_name}).join(',')
        else
          persona = window.scores[1].info[0] //Just the first  one if its not noteworthy
          
         $("emotions-list").html(emo)
         $("personality-list").html(persona)
         $("#results_summary").show() */
      }) 
    };

    window.fn.dashboard = {}
    window.fn.dashboard.initDashboard = function(user) {
      $.get("/users/"+window.user._id+"/results/?format=dataset&group=0&chart=0", function(results) {
                    if (results.length > 0) {
                        window.session.user_history = results
                        google.charts.load('current', {packages: ['corechart', 'line']});
                        google.charts.setOnLoadCallback(drawChart);
                    }
      })

      function drawChart() {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Day');
                data.addColumn('number', 'Anger');
                data.addColumn('number', 'Disgust');
                data.addColumn('number', 'Fear');
                data.addColumn('number', 'Joy');
                data.addColumn('number', 'Sadness');
                //These are actualyl my emotions. weird.
                data.addRows(window.session.user_history);

                  var options = {
                    curveType: 'function',
                    legend: { position: 'none' }
                  }
                var chart = new google.visualization.LineChart(document.getElementById('emotion_chart'));
                chart.draw(data, options);

          }
    }

    ons.ready(function() {
      console.log("Onsen UI is ready!");
      console.log("Loading User");
      
      document.addEventListener('init', function(event){
        var page = event.target
        switch(page.id) {
           case 'dashboard':
            if (fn.isLoggedIn()) {
              fn.dashboard.initDashboard();
            } else
              fn.navigate('login.html')
            break
           case 'login-page':
            fn.login.initLogin()
            break;
          case 'signup':
            fn.signup.initSignup()
            break;
        }
      })
    });
