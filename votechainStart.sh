export FABRIC_VERSION="hlfv11"
echo "** STARTING FABRIC **"
../startFabric.sh
../createPeerAdminCard.sh
echo "** INSTALLING VOTECHAIN ** "
composer network install --archiveFile vote-network.bna --card PeerAdmin@hlfv1
echo "** STARTING VOTECHAIN **"
composer network start --networkName vote-network --networkVersion 0.0.1 --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw
composer card import --file networkadmin.card
echo "** DEPLOYING REST SERVER **"
composer-rest-server -c admin@vote-network -n never -w true