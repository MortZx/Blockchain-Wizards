/**
 * Votechain script
 */

/**
 * Submit vote
 * @param {blockchain.wizards.votechain.Vote} vote The vote to be submitted.
 * @transaction
 */

function Vote(vote) {

  // create variables for voter, candidate and ballot
  var voter = vote.ballot.owner;
  var candidate = vote.newOwner;
  var ballot = vote.ballot;


  // Don't allow a user to vote twice or a ballot to be used twice
  if(vote.ballot.used) {
      throw new Error(["Ballot Already Used!"]);
  } else if(voter.hasVoted) {
      throw new Error(["User already voted!"]);
  }

  //Check if ballot used as a valid Voter
  getParticipantRegistry('blockchain.wizards.votechain.User').then((participantRegistry) => {
    if (participantRegistry.exists(voter)==false){
    throw new Error (["Voter does not exist"]);
  		}
  });

  // attribute the ballot to the newOwner, the candidate
  ballot.owner = candidate;

getAssetRegistry('blockchain.wizards.votechain.Ballot').then(function(assetRegistry) {
    ballot.used = true;			// Mark the ballot as used
    assetRegistry.update(ballot);	// update ballot info to blockchain
  }).catch(function(error) {
    // Add optional error handling here.
  });

  getParticipantRegistry('blockchain.wizards.votechain.Candidate').then(function(participantRegistry) {
    candidate.amountOfVotes += 1;				// update number of votes to the candidate
    participantRegistry.update(candidate);	// update candidate info to blockchain
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

