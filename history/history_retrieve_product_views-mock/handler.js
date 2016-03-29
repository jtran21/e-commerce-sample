'use strict';

module.exports.handler = function(event, context) {
  return context.done(null, {
    "user_guid" : "4124141111",
    "product_history" : [
      {
        "product_id": "0978739213",
        "product_name": "Release It!: Design and Deploy Production-Ready Software",
        "product_image_url": "http://t3.gstatic.com/images?q=tbn:ANd9GcQ6-PlWGZh3xnZYcK_uorrlgWhcrcSqlDd72nzKuzC9Ls58tz1j",
        "product_description": "Whether it's in Java, .NET, or Ruby on Rails, getting your application ready to ship is only half the battle. Did you design your system to survivef a sudden rush of visitors from Digg or Slashdot? Or an influx of real world customers from 100 different countries? Are you ready for a world filled with flakey networks, tangled databases, and impatient users?",
        "recorded_view_epoch_timestamp" : "1459176582"
      },
      {
        "product_id": "0374749801",
        "product_name": "Amazon Tap",
        "product_image_url": "http://ecx.images-amazon.com/images/I/61uaiTkIRSL._SL1000_.jpg",
        "product_description": "Discover and enjoy music, all in one place. Just tap the microphone button and ask for a song, artist, or genre.",
        "recorded_view_epoch_timestamp" : "1459276182"
      }
    ]
  }
  );
};
