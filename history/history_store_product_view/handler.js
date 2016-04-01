'use strict';

// HISTORY service
// Store product view
// Flow:
//   1. Write the product history event to DynamoDB
//   2. Write the product history event to Redis

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
       if (err) {
           console.log("Issue writing to DynamoDB");
           console.log(err);
           callback('unable to update DynamoDB table at this time');
       } else {
          console.log("Successfully wrote to DynamoDB");
          callback(null, "one", "two");
       }
    };
    console.log("Initiating DynamoDB write");
    dynamo.putItem({TableName:DYNAMODB_TABLE_NAME, Item:item}, mycallback);
  };


  var write_to_cache = function(arg1, arg2, callback) {

    var user_guid = event.user_guid;
    var product_id = event.product_id;
    var MAX_ITEMS_TO_RETAIN_IN_CACHE = 5;

    console.log("Entering write_to_cache()");
    console.log("Creating Redis client");

    var redis_client = redis.createClient(6379, "e-commerce-sample-rc.oydp69.0001.usw2.cache.amazonaws.com");

    console.log("Connecting to Redis");
    redis_client.on("error", function (err) {
      console.log("Error " + err);
    });
    console.log("Connected to Redis");
    redis_client.lpush(user_guid, product_id, function(err, reply) {
      console.log("Redis: performing LPUSH");

      if (err === null) {
        if (reply === null) {
          console.log("Error: Issue appending item to list in Redis");
          callback(null, "error"); // fail silently

        } else {
          console.log("Successfully appended item to list in Redis");
          console.log("Redis: performing LTRIM");
          redis_client.ltrim(user_guid, 0, MAX_ITEMS_TO_RETAIN_IN_CACHE - 1, function(err2, reply2) {
            if (err2 === null) {
              if (reply2 === null) {
                console.log("Error: Issue trimming list in Redis");
                callback(null, "error"); // fail silently
              } else {
                console.log("Successfully trimmed list in Redis");
                console.log("Completed Redis interactions");
                callback(null, "done");
              }
            } else {
              console.log("Error: Issue trimming list in Redis - error 2");
              callback(null, "error"); // fail silently
            }
          });
        }
      } else {
        console.log("Error: Issue appending item to list in Redis - error 2");
        callback(null, "error"); // fail silently
      }
    });
  }

  async.waterfall([write_to_dynamodb, write_to_cache], function(err, result){
    if (err) {
      console.log("Something went wrong!")
    } else {
      console.log("Function completed!")
      return context.done(null, {
        message: 'Function completed! Result: ' +  result
      });
    }
  });
}
