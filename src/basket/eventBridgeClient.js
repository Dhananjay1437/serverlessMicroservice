const { EventBridgeClient} =require("@aws-sdk/client-eventbridge");
// Create an Amazon EventBridge service client object.
const ebClient = new EventBridgeClient();
module.exports = ebClient;