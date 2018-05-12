export FABRIC_VERSION="hlfv11"
echo "** STARTING FABRIC **"
../fabric-tools/startFabric.sh
echo "** INSTALLING VOTECHAIN ** "
composer network install --archiveFile votechain-network@0.0.2.bna --card PeerAdmin@hlfv1
echo "** STARTING VOTECHAIN **"
composer network start --networkName votechain-network --networkVersion 0.0.2 --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw
echo "** DEPLOYING REST SERVER **"
composer-rest-server -c admin@votechain-network -n never -w true
