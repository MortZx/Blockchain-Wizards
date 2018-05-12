function updateHistorian(){
    $.ajax({
            url: 'http://localhost:3000/api/Vote',
            dataType: 'json',
            success: function(data) {
                let jsonString = JSON.stringify(data, null, 2);
                console.log(jsonString);
                $("#transactionHistorian").html('<pre><code>' + jsonString + '<\code><\pre>');
            },
            error: function() {
                $("#historian").append("error");
                alert('error');
            }
    });
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
                    let userId = json[i].userId;
                    let firstName = json[i].firstName;
                    let lastName = json[i].lastName;
                    let party = json[i].party;
                    let numBallots = getUserBallotsNum(userId);
                    appendCandidate(userId, firstName, lastName, party, numBallots);
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

function appendCandidate(userId, firstName, lastName, party, numBallots){
    var candidateHtml = '<p><strong>Name: </strong>' + firstName + ' ' + lastName + '<strong>  Party: </strong>' + party + '<strong>  ID: </strong>' + userId + '<strong>  Votes: </strong>' + numBallots + '</p>';
    $("#candidateResponse").append(candidateHtml);
}
