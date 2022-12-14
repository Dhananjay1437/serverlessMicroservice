import { Construct } from "constructs";
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

import { IFunction } from "aws-cdk-lib/aws-lambda";
interface ExuberApiGatewayeProps{
    productFunction: IFunction;
   basketFunction: IFunction;
   orderFunction: IFunction;
}
export class ExuberApiGateway extends Construct{
    public readonly productApiGateway: LambdaRestApi;
    public readonly basketApiGateway: LambdaRestApi;
    public readonly orderApiGateway: LambdaRestApi;
    constructor(scope:Construct,id:string,props:ExuberApiGatewayeProps){
        super(scope,id);
       //product
     this.productApiGateway=this.createProductApiGateway(props.productFunction);
    //basket
     this.basketApiGateway=this.createBasketApiGateway(props.basketFunction);
 //order
     this.orderApiGateway=this.createOrderApiGateway(props.orderFunction);
    }
   private createProductApiGateway(productFunction: IFunction):LambdaRestApi{
    //GET /product
//POST /product
//GET /product/{id}
//PUT /product/{id}
//DELETE /product/{id}
const apiGateway=new LambdaRestApi(this,'productApi',{
    restApiName:'Product Service',
    handler:productFunction,
    proxy:false
  });
  const product=apiGateway.root.addResource('product')
  product.addMethod("GET");
  product.addMethod("POST");
  const singProduct=product.addResource('{id}');// /product/{id}
  singProduct.addMethod("GET");
  singProduct.addMethod("PUT");
  singProduct.addMethod("DELETE");
  return apiGateway;
   }


   private createBasketApiGateway(basketFunction: IFunction):LambdaRestApi{
    //GET /basket
//POST /basket

//resourse name=basket/{username}
//GET /basket/{userName}
//DELETE /basket/{userName}

const apiGateway=new LambdaRestApi(this,'basketApi',{
    restApiName:'Basket Service',
    handler:basketFunction,
    proxy:false
  });
  const basket=apiGateway.root.addResource('basket')
  basket.addMethod("GET");
  basket.addMethod("POST");
  const checkout=basket.addResource('checkout');
  checkout.addMethod("POST");
  const singBasket=basket.addResource('{userName}');// /basket/{userName}
  singBasket.addMethod("GET");
 singBasket.addMethod("DELETE");
  return apiGateway;
   }

   private createOrderApiGateway(orderFunction: IFunction):LambdaRestApi{
    //GET /order


//resourse name=order/{username}
//GET /order/{userName}

const apiGateway=new LambdaRestApi(this,'orderApi',{
    restApiName:'Order Service',
    handler:orderFunction,
    proxy:false
  });
  const order=apiGateway.root.addResource('order')
  order.addMethod("GET");
const singBasket=order.addResource('{userName}');// /order/{userName}
  singBasket.addMethod("GET");
 return apiGateway;
   }
}