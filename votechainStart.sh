export FABRIC_VERSION="hlfv1"

echo "** STARTING FABRIC **"
../startFabric.sh
../createPeerAdminCard.sh

echo "** CREATING .bna FILE **"
composer archive create -a votechain.bna -t dir -n .

echo "** INSTALLING VOTECHAIN ** "
composer network install --archiveFile votechain.bna --card PeerAdmin@hlfv1

echo "** STARTING VOTECHAIN **"
composer network start --networkName votechain --networkVersion 0.0.1 --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw
composer card import --file admin@votechain.card

echo "** DEPLOYING REST SERVER **"
composer-rest-server -c admin@votechain -n never -w true