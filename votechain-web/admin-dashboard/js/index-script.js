function setButtonListeners(){

    $('#candidateSubmitButton').on('click', function() {
        console.log("Button Clicked");
        var jsonBody = {};
        jsonBody['\$class'] = "blockchain.luke.votechain.Candidate";
        jsonBody['userId'] = "c" + Math.abs(hash((new Date()).getTime().toString() + $('#candidateLastName').val()));
        jsonBody['firstName'] = $('#candidateFirstName').val();
        jsonBody['lastName'] = $('#candidateLastName').val();
    	jsonBody['party'] = $('#candidateParty').val();
        console.log(jsonBody);
        $.post("http://localhost:3000/api/Candidate", jsonBody);
        getCandidates();
    });

}

function generateCandidate(firstName, lastName, party){
    var jsonBody = {};
    jsonBody['\$class'] = "powlett.luke.votechain.Candidate";
    jsonBody['userId'] = "c" + Math.abs(hash((new Date()).getTime().toString() + lastName));
    jsonBody['firstName'] = firstName;
    jsonBody['lastName'] = lastName;
    jsonBody['party'] = party;
    console.log(jsonBody);
    $.post("http://localhost:3000/api/Candidate", jsonBody);
}

function generateVoter(firstName, lastName, address){
    var jsonBody = {};
    jsonBody['\$class'] = "powlett.luke.votechain.Voter";
    let userId = "v" + Math.abs(hash((new Date()).getTime().toString() + lastName));
    jsonBody['userId'] = userId;
    jsonBody['firstName'] = firstName;
    jsonBody['lastName'] = lastName;
    jsonBody['address'] = address;
    console.log(jsonBody);

    $.post("http://localhost:3000/api/Voter", jsonBody);
    generateBallot(userId);
}

function generateBallot(voterId){
    var jsonBody = {};
    jsonBody['\$class'] = "powlett.luke.votechain.Ballot";
    jsonBody['ballotId'] = "b" + Math.abs(hash((new Date()).getTime().toString() + voterId));
    jsonBody['owner'] = voterId;
    console.log(jsonBody);

    $.post("http://localhost:3000/api/Ballot", jsonBody);
    console.log("Ballot created for " + voterId);
}

function getCandidates(){
    $.ajax({
            url: 'http://localhost:3000/api/Candidate',
            dataType: 'json',
            success: function(data) {
                var stringJson = JSON.stringify(data);
                var json = JSON.parse(stringJson);
                var len = Object.keys(json).length;
                resetView();

                for(i = 0; i < len; i++){
                    let userId = json[i].userId;
                    let firstName = json[i].firstName;
                    let lastName = json[i].lastName;
                    let party = json[i].party;
                    appendCandidate(userId, firstName, lastName, party);
                }
            },
            error: function() {
                $("#candidateResponse").append("error");
                alert('error');
            }
    });
}

function appendCandidate(userId, firstName, lastName, party){
    let candidateBallots = getUserBallotsNum(userId);
    var candidateHtml = '<div class="well"><strong>Candidate ID: ' + userId + '</strong><br><strong>Name: ' + firstName + ' ' + lastName + '</strong><br><strong>Party: ' + party + '</strong><br><strong>Votes: ' + candidateBallots + '</strong></div>';
    $("#candidateResponse").append(candidateHtml);
}

function resetView(){
    $("#candidateResponse").html("<br>");
}

function getUserBallotsNum(userId){
    // filter by json encoded string i.e. {"owner":"<user_id>"}
    let filter = '%7B%22where%22%3A%7B%22owner%22%3A%22resource%3Apowlett.luke.votechain.Candidate%23' + userId + '%22%7D%7D';
    // let uriEncodeFilter = encodeURI(filter);
    let query = '?filter=' + filter;

    let url = 'http://localhost:3000/api/Ballot' + query;
    console.log(url);

    var numBallots = -1;

    $.ajax({
            url: url,
            dataType: 'json',
            async: false,
            success: function(data) {
                let stringJson = JSON.stringify(data);
                let json = JSON.parse(stringJson);
                console.log(json);
                numBallots = Object.keys(json).length;
            },
            error: function(error) {
                console.log(error);
            }
    });

    return numBallots;

}

function deleteCandidate(){
    $.ajax({
        url: 'http://localhost:3000/api/Candidate/' + $('#candidateId').val(),
        type: 'DELETE',
        success: function(result) {
            getCandidates();
        }
    });
}

function hash(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function demo(){
    console.log("DEMO");
    deleteAll();

    generateCandidate("Alistar", "Brown", "Red");
    generateCandidate("June", "Craddock", "Blue");
    generateCandidate("Michael", "Fletcher", "Green");

    generateVoter("Anna", "Melbrook", "12 Owl Street");
    generateVoter("Nicholas", "West", "6a Hanley Avenue");
    generateVoter("Steven", "Colt", "33 Long Road");

    getCandidates();
}

function deleteAll(){
    deleteAllCandidates();
    deleteAllBallots();
    deleteAllVoters();
}

function deleteAllCandidates(){

    var len = -1;
    var json = "";

    $.ajax({
        url: 'http://localhost:3000/api/Candidate',
        async: false,
        success: function(data) {
            let jsonString = JSON.stringify(data);
            json = JSON.parse(jsonString);
            len = Object.keys(json).length;

            console.log(len);
            console.log(json);
        }
    });

    if(len > 0 ){
        for(i = 0; i < len; i++){
            let userId = json[i].userId;
            $.ajax({
                url: 'http://localhost:3000/api/Candidate/' + userId,
                type: 'DELETE',
                success: function(result) {
                    console.log(userId + " deleted");
                },
                error: function(error){
                    console.error(userId + " not deleted!\n" + error);
                }
            });
        }
    }
}

function deleteAllVoters(){

    var len = -1;
    var json = "";

    $.ajax({
        url: 'http://localhost:3000/api/Voter',
        async: false,
        success: function(data) {
            let jsonString = JSON.stringify(data);
            json = JSON.parse(jsonString);
            len = Object.keys(json).length;

            console.log(len);
            console.log(json);
        }
    });

    if(len > 0){
        for(i = 0; i < len; i++){
            let userId = json[i].userId;
            $.ajax({
                url: 'http://localhost:3000/api/Voter/' + userId,
                type: 'DELETE',
                success: function(result) {
                    console.log(userId + " deleted");
                },
                error: function(error){
                    console.error(userId + " not deleted!\n" + error);
                }
            });
        }
    }
}

function deleteAllBallots(){

    var len = -1;
    var json = "";

    $.ajax({
        url: 'http://localhost:3000/api/Ballot',
        async: false,
        success: function(data) {
            let jsonString = JSON.stringify(data);
            json = JSON.parse(jsonString);
            len = Object.keys(json).length;

            console.log(len);
            console.log(json);
        }
    });

    if(len > 0){
        for(i = 0; i < len; i++){
            let ballotId = json[i].ballotId;
            $.ajax({
                url: 'http://localhost:3000/api/Ballot/' + ballotId,
                type: 'DELETE',
                success: function(result) {
                    console.log(ballotId + " deleted");
                },
                error: function(error){
                    console.error(ballotId + " not deleted!\n" + error);
                }
            });
        }
    }
}
