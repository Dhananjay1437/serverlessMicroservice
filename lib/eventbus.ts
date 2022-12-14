import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";

import { IQueue } from "aws-cdk-lib/aws-sqs";
import { ExuberQueue } from "./queue";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
interface ExuberEventBusProps{
    publisherFunction:IFunction,
    targetQueue: IQueue;
}
export class ExuberEventBus extends Construct{

    
    constructor(scope:Construct,id:string,props:ExuberEventBusProps){
        super(scope,id);
      
        const bus=new EventBus(this,"ExuberEventBus",{
            eventBusName:"ExuberEventBus"
          })
          const checkoutBasketRule=new Rule(this,'CheckoutBasketRule',{
            eventBus:bus,
            enabled:true,
            description:"When basket microservice checkout the basket",
            eventPattern:{
              source:['com.exuber.basket.checkoutBasket'],
              detailType:['CheckoutBasket']
            },
            ruleName:'CheckoutBasketRule'
          });
         
          checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue));
          bus.grantPutEventsTo(props.publisherFunction);
    }
  
}