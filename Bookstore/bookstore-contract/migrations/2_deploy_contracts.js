const Bookstore = artifacts.require("Bookstore");

module.exports = function(deployer) {
  deployer.deploy(Bookstore);
};
