# Votechain - A blockchain voting system with IBM Hyperledger.

## Project Model Layers
1. Hyperledger: platform for the blockchain technology
2. Fabric: framework for the architecture layer
3. Composer: toolset for the application

## Main Project Files
** votechain.bna ** is the business network to use when testing the project in the Hyperledger Composer [Playground](https://composer-playground.mybluemix.net/login). It combines the following three scripts.
** models/blockchain.wizards.votechain.cto ** is the model file, it contains the list of ressources.
** lib/logic.js ** defines the smart contracts for the voting transactions.
** permissions.acl ** is the access control file, it determines the CRUD functions for participants and users. 

Instructions on how to test the project in the Playground will be provided at a later date. 
See 'VoteChain_Report.pdf' for all details of the project.
