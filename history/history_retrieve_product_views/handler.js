'use strict';

// HISTORY service
// Store product view

module.exports.handler = function(event, context) {

  var async = require('async');
  var redis = require("redis");

  var write_to_dynamodb = function(callback) {

    console.log("Entering: write_to_dynamodb()");
    var user_guid = event.user_guid;
    var timestamp = event.timestamp;
    var product_id = event.product_id;
    var DYNAMODB_TABLE_NAME = "e-commerce-sample-product-history"

    var AWS = require('aws-sdk');
    var DOC = require('dynamodb-doc');
    var dynamo = new DOC.DynamoDB();

    var item = {
      "user_guid": user_guid,
      "timestamp": parseInt(timestamp),
      "product_id": product_id
    };
    console.log("Item to store in DynamoDB");
    console.log(item);

    var mycallback = function(err, data) {
       if(err) {
           console.log("Issue writing to DynamoDB");
           console.log(err);
           callback('unable to update DynamoDB table at this time');
       } else {
          console.log("Successfully wrote to DynamoDB");
          console.log(data);
          callback(null, "one", "two");
       }
    };
    console.log("Initiating DynamoDB write");
    dynamo.putItem({TableName:DYNAMODB_TABLE_NAME, Item:item}, mycallback);
  };


  var write_to_cache = function(arg1, arg2, callback) {
    console.log("Entering write_to_cache()");
    console.log("Creating Redis client");

    var redis_client = redis.createClient(6379, "e-commerce-sample-rc.oydp69.0001.usw2.cache.amazonaws.com");

    console.log("Connecting to Redis");
    redis_client.on("error", function (err) {
      console.log("Error " + err);
    });
    console.log("Connected to Redis");
    redis_client.set("key_abc", "gogogadget", function(err, reply) {
      var status = 500;
      if (err === null) {
        if (reply === null) {
          console.log("Issue writing to Redis");
          console.log("Completed writing to cache");
          callback(null, "done");
        } else if (reply === "OK") {
          console.log("Successfully wrote to Redis");
          console.log("Completed writing to cache");
          callback(null, "done");
        }
      }
    });
  }

  // async.waterfall([write_to_cache], function(err, result){
  async.waterfall([write_to_dynamodb, write_to_cache], function(err, result){
    if (err) {
      console.log("Something went wrong!")
    } else {
      console.log("Function completed!")
      return context.done(null, {
        message: 'Hello world ' +  result
      });
    }
  });
}


  // Overall flow



  // 3. Read prior product history event records from ElastiCache
  // 4. Read product data from ElastiCache
  // 5. Call ProductDetails service to populate any missing product detail records
  // 6. Merge product data with cached history
  // 7. Return result
