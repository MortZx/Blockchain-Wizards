function setButtonListeners(){
    $('#voterSubmitButton').on('click', function() {
        console.log("Button Clicked");
        var jsonBody = {};
        jsonBody['\$class'] = "powlett.luke.votechain.Voter";
        let userId = "v" + Math.abs(hash((new Date()).getTime().toString() + $('#voterLastName').val()));
        jsonBody['userId'] = userId;
        jsonBody['firstName'] = $('#voterFirstName').val();
        jsonBody['lastName'] = $('#voterLastName').val();
    	jsonBody['address'] = $('#voterAddress').val();
        console.log(jsonBody);
        $.ajax({
            url: 'http://localhost:3000/api/Voter',
            type: 'POST',
            dataType: 'json',
            data: jsonBody,
            async: false,
            success: function(data) {
                console.log(voterId + " deleted");
                generateBallot(userId);
                getVoters();
            }
        });
    });
}

function getVoters(){
    $.ajax({
            url: 'http://localhost:3000/api/Voter',
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
                    let address = json[i].address;
                    appendVoter(userId, firstName, lastName, address);
                }
            },
            error: function() {
                $("#voterResponse").append("error");
                alert('error');
            }
    });
}

function appendVoter(userId, firstName, lastName, address){
    let numBallots = getUserBallotsNum(userId);
    var voterHtml = '<div class="well"><strong>Voter ID: ' + userId + '</strong><br><strong>Name: ' + firstName + ' ' + lastName + '</strong><br><strong>Address: ' + address + '</strong><br><strong>Ballots: ' + numBallots + '</strong>';
    $("#voterResponse").append(voterHtml);
}

function resetView(){
    $("#voterResponse").html("<br>");
}

function deleteVoter(){
    let voterId = $('#voterId').val();
    if(getUserBallotsNum(voterId) > 0){
        let ballotId = getUserBallot(voterId);
        deleteBallot(ballotId);
    }
    $.ajax({
        url: 'http://localhost:3000/api/Voter/' + voterId,
        type: 'DELETE',
        success: function(result) {
            console.log(voterId + " deleted");
            getVoters();
        }
    });
}

function deleteBallot(ballotId){
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

function getUserBallotsNum(userId){
    // filter by json encoded string i.e. {"owner":"<user_id>"}
    let filter = '%7B%22where%22%3A%7B%22owner%22%3A%22resource%3Apowlett.luke.votechain.User%23' + userId + '%22%7D%7D';
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

function generateBallot(voterId){
    var jsonBody = {};
    jsonBody['\$class'] = "powlett.luke.votechain.Ballot";
    jsonBody['ballotId'] = "b" + Math.abs(hash((new Date()).getTime().toString() + voterId));
    jsonBody['owner'] = voterId;
    // TO BE REMOVED AFTER NEXT BUILD
    jsonBody['used'] = "false";

    console.log(jsonBody);

    $.post("http://localhost:3000/api/Ballot", jsonBody);
}

// function updateHistorian(){
//     $.ajax({
//             url: 'http://localhost:3000/api/system/historian',
//             dataType: 'json',
//             success: function(data) {
//                 $("#historian").html(JSON.stringify(data));
//             },
//             error: function() {
//                 $("#historian").append("error");
//                 alert('error');
//             }
//     });
// }

function getUserBallot(userId){
    // filter by json encoded string i.e. {"owner":"<user_id>"}
    let filter = '%7B%22where%22%3A%7B%22owner%22%3A%22resource%3Apowlett.luke.votechain.User%23' + userId + '%22%7D%7D';
    // let uriEncodeFilter = encodeURI(filter);
    let query = '?filter=' + filter;

    let url = 'http://localhost:3000/api/Ballot' + query;
    console.log(url);

    var ballotId = "";

    $.ajax({
            url: url,
            dataType: 'json',
            async: false,
            success: function(data) {
                let stringJson = JSON.stringify(data);
                let json = JSON.parse(stringJson);
                console.log(json);

                ballotId = json[0].ballotId;
                console.log(ballotId);
            },
            error: function(error) {
                console.log(error);
            }
    });

    return ballotId;
}
