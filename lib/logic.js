/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.blockwiz.voting.SubmitVote} SubmitVote
 * @transaction
 */
function SubmitVote(vote) 
{
    // get voter ID
    var voter = vote.voter
    
    // get candidate for whom voter is voting for
    var candidate = vote.candidate

    // check if voter already voted
    if (voter.hasVoted)
    {
        throw new Error('Voter has already voted.');
    }

    // if voter hasn't already voted, update accordingly
    candidate.totalVotes += 1;

    // get candidate asset, FullyQualifiedIdentifier: org.blockwiz.voting.Candidate
    return getAssetRegistry('org.blockwiz.voting.Candidate').then(function(CandidateRegistry)
    {
        // get voter participant, FullyQualifiedIdentifier: org.blockwiz.voting.Voter
        getParticipantRegistry('org.blockwiz.voting.Voter').then(function(getParticipantRegistry)
        {
            // edit voter info
            voter.hasVoted = true;

            // update voter info
            return participantRegistry.update(voter);
        }).catch(funcion(error) 
        ,{      // !!! The ',' shows up as an error if it is not there but does this make sens? !!!!
            // add error handling function here
        });
    // update candidate registry
    return CandidateRegistry.update(candidate);
    });
}