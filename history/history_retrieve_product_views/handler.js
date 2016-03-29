'use strict';

module.exports.handler = function(event, context) {
  return context.done(null, {
    message: 'Nice to Go Serverless! Your Lambda function executed successfully!'
  });
  //return context.done(null, {
  //  message: 'Nice to Go Serverless! Your Lambda function executed successfully!'
  //});
};
