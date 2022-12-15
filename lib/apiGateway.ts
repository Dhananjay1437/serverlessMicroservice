import { Construct } from "constructs";
import { EndpointType, LambdaIntegration,  RestApi } from 'aws-cdk-lib/aws-apigateway';

import { IFunction } from "aws-cdk-lib/aws-lambda";
interface ExuberApiGatewayeProps{
    productFunction: IFunction;
   basketFunction: IFunction;
   orderFunction: IFunction;
}
export class ExuberApiGateway extends Construct{
  
    private apiGateway:RestApi;
    constructor(scope:Construct,id:string,props:ExuberApiGatewayeProps){
        super(scope,id);
       //product
       this.apiGateway=this.createApiGateWay();
    this.createProductApiGateway(props.productFunction);
    //basket
   this.createBasketApiGateway(props.basketFunction);
 //order
   this.createOrderApiGateway(props.orderFunction);
    }

    private createApiGateWay(){
     return new RestApi(this,'ecomerceMicroServices',{
        restApiName:'EcomerceMicroServices',
       endpointTypes:[EndpointType.REGIONAL]
       
      });
    }
   private createProductApiGateway(productFunction: IFunction){
    //GET /product
//POST /product
//GET /product/{id}
//PUT /product/{id}
//DELETE /product/{id}
 const product=this.apiGateway.root.addResource('product')
 product.addMethod("GET",new LambdaIntegration(productFunction));
  product.addMethod("POST",new LambdaIntegration(productFunction));
  const singProduct=product.addResource('{id}');// /product/{id}
  singProduct.addMethod("GET",new LambdaIntegration(productFunction));
  singProduct.addMethod("PUT",new LambdaIntegration(productFunction));
  singProduct.addMethod("DELETE",new LambdaIntegration(productFunction));
  
   }


   private createBasketApiGateway(basketFunction: IFunction){
    //GET /basket
//POST /basket

//resourse name=basket/{username}
//GET /basket/{userName}
//DELETE /basket/{userName}

  const basket=this.apiGateway.root.addResource('basket')
  basket.addMethod("GET",new LambdaIntegration(basketFunction));
  basket.addMethod("POST",new LambdaIntegration(basketFunction));
  const checkout=basket.addResource('checkout');
  checkout.addMethod("POST",new LambdaIntegration(basketFunction));
  const singBasket=basket.addResource('{userName}');// /basket/{userName}
  singBasket.addMethod("GET",new LambdaIntegration(basketFunction));
 singBasket.addMethod("DELETE",new LambdaIntegration(basketFunction));
  
   }

   private createOrderApiGateway(orderFunction: IFunction){
    //GET /order


//resourse name=order/{username}
//GET /order/{userName}

  const order=this.apiGateway.root.addResource('order')
  order.addMethod("GET",new LambdaIntegration(orderFunction));
const singBasket=order.addResource('{userName}');// /order/{userName}
  singBasket.addMethod("GET",new LambdaIntegration(orderFunction));

   }
}