import { Construct } from "constructs";
import { Duration } from 'aws-cdk-lib';
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
interface ExuberQueueProps{
    consumer:IFunction
}
export class ExuberQueue extends Construct{
    public readonly orderQueue: IQueue;
   
    constructor(scope:Construct,id:string,props:ExuberQueueProps){
        super(scope,id);
       this.orderQueue=this.getOrderQueue();
   
           props.consumer.addEventSource(new SqsEventSource(this.orderQueue,{
            batchSize:1
           }))
    }
   private getOrderQueue=()=>{
       return new Queue(this,"OrderQueue",{
            queueName:"OrderQueue",
            visibilityTimeout:Duration.seconds(30)
           }) 
    }
    }
     