const { PutItemCommand, QueryCommand, ScanCommand }= require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } =require("@aws-sdk/util-dynamodb");
const { ddbClient } =require("./ddbClient");
exports.handler=async (event)=>{
  if(event.Records != null) {
    // SQS Invocation
    await sqsInvocation(event);
  }
  else if (event['detail-type'] !== undefined) { //this will not trigger anymore kept for old referance
    // EventBridge Invocation
    await eventBridgeInvocation(event);
  } else {
    // API Gateway Invocation -- return sync response
    return await apiGatewayInvocation(event);
  }
 }

 const sqsInvocation = async (event) => {
  console.log(`sqsInvocation function. event : "${event}"`);
  
  event.Records.forEach(async (record) => {
    console.log('Record: %j', record);
    
    // expected request : { "detail-type\":\"CheckoutBasket\",\"source\":\"com.swn.basket.checkoutbasket\", "detail\":{\"userName\":\"swn\",\"totalPrice\":1820, .. }
    const checkoutEventRequest = JSON.parse(record.body); 
    
    // create order item into db
    await createOrder(checkoutEventRequest.detail); 
    // detail object should be checkoutbasket json object
  });
}
 const eventBridgeInvocation=async (event)=>{
            await createOrder(event.detail);
 }

const createOrder = async (basketCheckoutEvent) => {
  try {
    console.log(`createOrder function. event : "${basketCheckoutEvent}"`);

    // set orderDate for SK of order dynamodb
    const orderDate = new Date().toISOString();
    basketCheckoutEvent.orderDate = orderDate;
    console.log(basketCheckoutEvent);
    
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(basketCheckoutEvent || {})
    };

    const createResult = await ddbClient.send(new PutItemCommand(params));
    console.log(createResult);
    return createResult;

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const apiGatewayInvocation = async (event) => {
  // GET /order	
	// GET /order/{userName}
  let body;

  try {
    switch (event.httpMethod) {
        case "GET":
            if (event.pathParameters != null) {
            body = await getOrder(event);
            } else {
            body = await getAllOrders();
            }
            break;
        default:
            throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }

    console.log(body);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Successfully finished operation: "${event.httpMethod}"`,
            body: body
        })
    };
  }
  catch(e) {
      console.error(e);
      return {
      statusCode: 500,
      body: JSON.stringify({
          message: "Failed to perform operation.",
          errorMsg: e.message,
          errorStack: e.stack,
        })
      };
  }
}

const getOrder = async (event) => {
  console.log("getOrder");
    
  try {
    // expected request : xxx/order/swn?orderDate=timestamp
    const userName = event.pathParameters.userName;  
    const orderDate = event.queryStringParameters.orderDate; 

    const params = {
      KeyConditionExpression: "userName = :userName and orderDate = :orderDate",
      ExpressionAttributeValues: {
        ":userName": { S: userName },
        ":orderDate": { S: orderDate }
      },
      TableName: process.env.DYNAMODB_TABLE_NAME
    };
 
    const { Items } = await ddbClient.send(new QueryCommand(params));

    console.log(Items);
    return Items.map((item) => unmarshall(item));
  } catch(e) {
    console.error(e);
    throw e;
  }
}

const getAllOrders = async () => {  
  console.log("getAllOrders");    
  try {
      const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME
      };
  
      const { Items } = await ddbClient.send(new ScanCommand(params));

      console.log(Items);
      return (Items) ? Items.map((item) => unmarshall(item)) : {};

  } catch(e) {
      console.error(e);
      throw e;
  }
}