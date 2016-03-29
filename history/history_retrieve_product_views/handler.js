'use strict';

module.exports.handler = function(event, context) {
  return context.done(null, {
    message: 'Way to Go Serverless! Your Lambda function executed successfully!'
  });
};
