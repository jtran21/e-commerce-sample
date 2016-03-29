'use strict';

module.exports.handler = function(event, context) {
  return context.done(null, {
    message: 'Hello world. Go Serverless! Your Lambda function executed successfully!'
  });
};
