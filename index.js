var request = require('request')
var cheerio = require('cheerio');

request('http://pest.vakvarju.com/hu/napimenu', function(err, resp, body){
  $ = cheerio.load(body);
  allDays = $('#etlapfelsorol .item');
  currentDay = $( allDays[ (new Date()).getDay()-1 ] );

  var commentText = '![' + currentDay.find('.nev').text() + '](' + currentDay.find('.image').attr('style').match(/url\('(.*)'\)/i)[1] + ')';
  commentText += '\n' + currentDay.find('.text h2').text();

  request.post('https://api.github.com/repos/Airborn22/vakvarju/commits/95eb1cebeddb484d31dc4338917a1c66155ae3a6/comments', {
    headers: {
      'User-Agent': 'Varju-Scanner',
    },
    auth: {
      user: process.argv[2],
      pass: process.argv[3]
    },
    json: {
      body: commentText
    }
  }, function(err) {
    if (err) {
      console.log('Error: ', err.message);
      return;
    }
    
    console.log('Done:');
    console.log(commentText);
  });
});
