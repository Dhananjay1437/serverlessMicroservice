import { Construct } from "constructs";
import { Code, Function, Runtime,FunctionProps, IFunction } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { ITable } from "aws-cdk-lib/aws-dynamodb";
interface ExuberMicroserviceProps{
    productTable: ITable;
    basketTable: ITable;
    orderTable: ITable;
}
export class ExuberMicroservice extends Construct{
    public readonly productFunction: Function;
    public readonly basketFunction: Function;
    public readonly orderFunction: Function;
    constructor(scope:Construct,id:string,props:ExuberMicroserviceProps){
        super(scope,id);
      
          this.productFunction=this.createProductFunction(props.productTable);
          this.basketFunction=this.createBasketFunction(props.basketTable);
          this.orderFunction=this.createOrderingFunction(props.orderTable);
    }
  private createProductFunction( productTable: ITable):Function{
    const nodejsFunProps:FunctionProps={
        environment: {
            PRIMARY_KEY: "id",
            DYNAMODB_TABLE_NAME:productTable.tableName
          },
          runtime: Runtime.NODEJS_16_X,
          code:Code.fromAsset(join(__dirname,"/../src/product")),
          handler:'index.handler'
        }
        const productFunction=new Function(this,"productLambdaFunction",{
        ...nodejsFunProps
        })
       productTable.grantReadWriteData(productFunction);
        return productFunction;
  } 
  private createBasketFunction(basketTable: ITable):Function{
    const nodejsFunProps:FunctionProps={
        environment: {
            PRIMARY_KEY: "userName",
            DYNAMODB_TABLE_NAME: basketTable.tableName,
            EVENT_SOURCE:'com.exuber.basket.checkoutBasket',
            EVENT_DETAILTYPE:'CheckoutBasket',
            EVENT_BUSNAME:'ExuberEventBus'
          },
          runtime: Runtime.NODEJS_16_X,
          code:Code.fromAsset(join(__dirname,"/../src/basket")),
          handler:'index.handler'
        }
        const basketFunction=new Function(this,"basketLambdaFunction",{
        ...nodejsFunProps
        })
        basketTable.grantReadWriteData(basketFunction);
        return basketFunction;
  } 

  private createOrderingFunction(orderTable: ITable):Function{
    const nodejsFunProps:FunctionProps={
        environment: {
            PRIMARY_KEY: "userName",
            SORT_KEY:"orderDate",
            DYNAMODB_TABLE_NAME: orderTable.tableName
          },
          runtime: Runtime.NODEJS_16_X,
          code:Code.fromAsset(join(__dirname,"/../src/ordering")),
          handler:'index.handler'
        }
        const orderFunction=new Function(this,"orderLambdaFunction",{
        ...nodejsFunProps
        });
        orderTable.grantReadWriteData(orderFunction);
        return orderFunction;
  } 
}