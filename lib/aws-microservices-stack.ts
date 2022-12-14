import * as cdk from 'aws-cdk-lib';
//import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { ExuberApiGateway } from './apiGateway';

import { ExuberDatabase } from './database';
import { ExuberEventBus } from './eventbus';
import { ExuberMicroservice } from './microservice';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const database = new ExuberDatabase(this, 'Database');

    const microservice = new ExuberMicroservice(this, 'Microservice', 
    { productTable: database.productTable, 
      basketTable: database.basketTable,
      orderTable:database.orderTable
    });
    const apiGateway = new ExuberApiGateway(this, 'ApiGateway',
     { productFunction: microservice.productFunction ,
      basketFunction: microservice.basketFunction,
      orderFunction:microservice.orderFunction
    });

 const eventBus=new ExuberEventBus(this,'EventBus',{
  publisherFunction:microservice.basketFunction,
    targetFunction:microservice.orderFunction
 })

  }
}
