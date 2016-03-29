'use strict';

// HISTORY service
// Store product view


module.exports.handler = function(event, context) {

  var async = require('async');

  var write_product_history_event = function(callback) {

    var user_guid="34aba";
    var timestamp = "3424232244";
    var product_id = "111";
    var DYNAMODB_TABLE_NAME = "e-commerce-sample-product-history"

    var AWS = require('aws-sdk');
    var DOC = require('dynamodb-doc');
    var dynamo = new DOC.DynamoDB();

    var item = {
      "user_guid": user_guid,
      "timestamp": timestamp,
      "product_id": product_id
    };

    var mycallback = function(err, data) {
       if(err) {
           console.log(err);
           callback('unable to update DynamoDB table at this time');
       } else {
           console.log(data);
           callback(null);
       }
    };
    dynamo.putItem({TableName:DYNAMODB_TABLE_NAME, Item:item}, mycallback);
  };


  var step1 = function(callback) {
    console.log("yhello");
    callback(null, "one", "two");
  }

  var step2 = function(arg1, arg2, callback) {
    console.log("xthere" + arg1);
    console.log("xthere2" + arg2);
    callback(null, "three");
  }

  var step3 = function(arg3, callback) {
    console.log("all done" + arg3);
    callback(null, "done");
    //
  }

  async.waterfall([write_product_history_event, step2, step3], function(err, result){
    if (err) {
      console.log("Something went wrong!")
    } else {
      console.log("Function completed!")
      return context.done(null, {
        message: 'Hello world' +  result
      });
    }
  });
}

/*
  async.series([
      function(callback){ step1(callback); },
      function(callback){ step2(callback); },
      function(callback){ return step3(callback); }
  ]);
*/

  //var USER_GUID="34aba"
  //var DYNAMODB_TABLE_NAME = "e-commerce-sample-product-history"

  // Overall flow
  // 1. Write the product history event to ElastiCache
  // 2. Write the product history in DynamoDB
  // 3. Read prior product history event records from ElastiCache
  // 4. Read product data from ElastiCache
  // 5. Call ProductDetails service to populate any missing product detail records
  // 6. Merge product data with cached history
  // 7. Return result


  // 1. Write the product history event to ElastiCache
  //write_product_history_event()

  // 2. Write the product history in DynamoDB

