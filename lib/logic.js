/**
 * Votechain script
 */

/**
 * Submit vote
 * @param {blockchain.wizards.votechain.Vote} vote The vote to be submitted.
 * @transaction
 */

function Vote(vote) {

    /*
    var candidateNI = {
        "Trump": "1234",
        "Hilary": "451-638-8771",
        "Niranjan": "218-098-4151"
    } 
    //candidateName = vote.newOwner;
    //candidate_NI = candidateNI[candidateName];
    //vote.ballot.owner = candidate_NI;
    */
  
  	// create variables for voter, candidate and ballot
  	var voter = vote.ballot.owner;
    var candidate = vote.newOwner;
  	var ballot = vote.ballot;
  
    // Don't allow a user to vote twice or a ballot to be used twice
    if(vote.ballot.used) {
        return new Error(["Ballot Already Used!"]);
    } else if(voter.hasVoted) {
        return new Error(["User already voted!"]);
    }

  	// attribute the ballot to the newOwner, the candidate
  	ballot.owner = candidate;

	getAssetRegistry('blockchain.wizards.votechain.Ballot').then(function(assetRegistry) {
      ballot.used = true;			// Mark the ballot as used
      assetRegistry.update(ballot);	// update ballot info to blockchain
    }).catch(function(error) {
      // Add optional error handling here.
    });
  
  	return getParticipantRegistry('blockchain.wizards.votechain.Voter').then(function(participantRegistry) {
      voter.hasVoted = true;					// Mark voter as hasVoted
      return participantRegistry.update(voter);	// update voter info to blockchain
    }).catch(function(error) {
      // Add optional error handling here.
    });
}
