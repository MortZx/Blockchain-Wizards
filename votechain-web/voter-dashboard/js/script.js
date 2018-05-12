function submitBallot(form){

    let voterId = form.voterId.value;
    let voterPin = form.voterPin.value;
    let candidateId = form.candidateId.value;

    // check voterId exists
    if(voterExists(voterId)){
        if(checkPin(voterId, voterPin)){
            var ballotId = voterHasBallot(voterId);
            if(ballotId != ""){

                // cast vote
                var jsonBody = {};
                jsonBody['\$class'] = "powlett.luke.votechain.Vote";
                jsonBody['voteId'] = "t" + Math.abs(hash((new Date()).getTime().toString() + voterId));
                jsonBody['ballot'] = ballotId;
                jsonBody['newOwner'] = candidateId;
                console.log(jsonBody);

                $.ajax({
                        url: "http://localhost:3000/api/Vote",
                        type: 'POST',
                        data: jsonBody,
                        dataType: 'json',
                        async: false,
                        success: function(data) {
                            console.log("Vote submitted: \n" + data);
                            console.log("Ballot Receipt: \n" + "Thankyou for your vote.\n" + "Your Ballot ID: " + ballotId);
                        },
                        error: function(error) {
                            console.error("Error on vote submission: \n" + error);
                        }
                });
            } else {
                console.error("NO BALLOT FOR USER " + voterId);
            }
        } else {
            console.error("INVALID PIN");
        }
    } else {
        console.error("NO SUCH VOTER " + voterId);
    }
    console.log(form.voterId.value + " " + form.voterPin.value + " " + form.candidateId.value);
    location.reload();
}

function voterExists(voterId){
    var voterExists = false;

        /** TODO: SANITIZE! */
        let userId = voterId;
        let url = "http://localhost:3000/api/Voter/" + userId;

        $.ajax({
                url: url,
                dataType: 'json',
                async: false,
                success: function(data) {
                    voterExists = true;
                },
                error: function() {
                    console.error("Invalid user id");
                }
        });

    return voterExists;
}

// AUTHENTICATION NOT IMPLENTED FOR POC DEMO
function checkPin(voterId, voterPin){
    return true;
}

function voterHasBallot(voterId){
    var ballotId = "";

    // filter by json encoded string i.e. {"owner":"<user_id>"}

    // {   %7B
    // "   %22
    // :   %3A
    // }   %7D
    // #   %23

//    http://localhost:3000/api/Ballot?filter=%7B%22where%22  :   %7B%22owner%22  :   %22resource     :   powlett.luke.votechain.User     #       v388395547%22%7D%7D

//    http://localhost:3000/api/Ballot?filter=%7B%22where%22  %3A %7B%22owner%22  %3A %22resource     %3A powlett.luke.votechain.User     %23     v388395547%22%7D%7D

    let filter = '%7B%22where%22%3A%7B%22owner%22%3A%22resource%3Apowlett.luke.votechain.User%23' + voterId + '%22%7D%7D';

    // let filter = '{"where":{"owner":"resource:powlett.luke.votechain.User#' + voterId + '"}}';

//    let uriEncodeFilter = encodeURI(filter);
    let query = '?filter=' + filter;

    let url = 'http://localhost:3000/api/Ballot' + query;
    console.log(url);

    $.ajax({
            url: url,
            dataType: 'json',
            async: false,
            success: function(data) {
                let stringJson = JSON.stringify(data);
                let json = JSON.parse(stringJson);
                console.log(json);
                let numBallots = Object.keys(json).length;
                if(numBallots == 1){
                    ballotId = json[0].ballotId
                }
            },
            error: function() {
                console.error("No Ballot fot user " + voterId);
            }
    });

    return ballotId;
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

function getCandidates(){
    $.ajax({
            url: 'http://localhost:3000/api/Candidate',
            dataType: 'json',
            success: function(data) {
                var stringJson = JSON.stringify(data);
                var json = JSON.parse(stringJson);
                var len = Object.keys(json).length;

                for(i = 0; i < len; i++){
                //    $("#candidateResponse").append(JSON.stringify(json[i]));
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

function getUserBallotsNum(userId){
    // filter by json encoded string i.e. {"owner":"<user_id>"}
    let filter = '%7B%22where%22%3A%7B%22owner%22%3A%22resource%3Apowlett.luke.votechain.Voter%23' + userId + '%22%7D%7D';
    let uriEncodeFilter = encodeURI(filter);
    let query = '?filter=' + uriEncodeFilter;

    let url = 'http://localhost:3000/api/Ballot' + query;
    console.log(url);

    var numBallots = -1;

    let stringJson = JSON.stringify($.get(url));
    let json = JSON.parse(stringJson);
    numBallots = Object.keys(json).length;
    return numBallots;

}

function appendCandidate(userId, firstName, lastName, party){
    var candidateHtml = '<div class="well"><form><strong>Name: ' + firstName + ' ' + lastName + '</strong><br><strong>Party: ' + party + '</strong><br><strong>Candidate ID: <input name="candidateId" type="hidden" value="' + userId + '">' + userId + '</input></strong><br><br><div class="form-group"><label for="email">Voter ID:</label><input type="email" class="form-control" name="voterId"></div><div class="form-group"><label for="pwd">PIN:</label><input type="password" class="form-control" name="voterPin"></div><button id="voteSubmitButton type="submit" onclick="submitBallot(this.form)" class="voteSubmitButton btn btn-default">Submit</button></form></div>';
    $("#candidateResponse").append(candidateHtml);
}
