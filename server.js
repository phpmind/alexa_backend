var Hapi = require('hapi');
var jp = require('jsonpath');

var server = new Hapi.Server();
server.connection({ port: 3000 });
//server.connection({ port: process.env.PORT, host: process.env.IP});

server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply('Welcome Alexa!');
	}
});

server.route({
	method: 'GET',
	path: '/articledetail/keyword/{keyword}',
	handler: function (request, reply) {
		var keyword = request.params.keyword.toLowerCase();
		console.log("Query /articledetail/keyword/" + keyword);
		var result = jp.query(data, '$..articles[?(@.title.toLowerCase().indexOf("' + keyword + '") > -1)]');
		reply(result[0]);
	}
});

// number or order
server.route({
	method: 'GET',
	path: '/articledetail/number/{number}',
	handler: function (request, reply) {
		var number = parseInt(request.params.number) - 1;
		console.log("Query /articledetail/number/" + number);
		var result = jp.query(data, '$..articles[' + number + ']');
		reply(result);
	}
});

server.route({
	method: 'GET',
	path: '/articlelistontopic/{topic}/start/{start}/length/{length}',
	handler: function (request, reply) {
		articleListHandler(request, reply);
  }
});

server.route({
	method: 'GET',
	path: '/articlelistontopic/{topic}/start/{start}/length/{length}/date/{date}',
	handler: function (request, reply) {
		articleListHandler(request, reply);
  }
});

function articleListHandler(request, reply) {
	var topic = request.params.topic;

	var start = parseInt(request.params.start);
	if (start > 0) {
		start -= 1;
	}
	var end = parseInt(request.params.length) + start;
	var date = request.params.date;
	// if (date) {
	// 	response = response + ' and date ' + date;
	// }
	console.log('Query /articlelistontopic/' + topic + '/start/' + start + '/length/' + end + '/date/');
	var result = jp.query(data, '$..articles[' + start + ':' + end + ']');
	reply(result);
}

server.start(function () {
	console.log('Server running at:', server.info.uri);
});

var data =  {
	articles: [
		{
			id: "cnncom20151025usoklahomacarintocrowd",
			category: "us",
			title: "4 killed, 44 hurt when car hits crowd at Oklahoma State parade during the Weekend",
			keywords: "Oklahoma",
			timestamp: "2015/10/25 12:00 EST",
			body: "A woman suspected of drunken driving crashed a car into a crowd of spectators at Oklahoma State University's homecoming parade, killing four people -- including a 2-year-old -- authorities in Stillwater said Saturday.",
			url:"http://www.cnn.com/2015/10/25/us/oklahoma-car-into-crowd/"
		},
		{
			id: "bleacherreportcomarticles2582440celebratingcollegefootballsspoilerweekend",
			category: "sports",
			title: "Celebrating College Football's Spoiler Weekend",
			keywords: "College Football's",
			timestamp: "2015/10/23 12:00 EST",
			body: "It was an unassuming Saturday. In fact, up until 10:11 p.m. eastern time, one might have called it boring. Uneventful. Unsatisfying. An average slate of football games played out as such with few exceptions. Although we love football regardless of the parameters, the harsh, simple reality of an ordinary week was settling in.",
			url : "http://bleacherreport.com/articles/2582440-celebrating-college-footballs-spoiler-weekend"
		},
		{
			id: "moneycnncom20151023technologyballmeramazonapple",
			category: "technology",
			title: "Steve Ballmer just went off on Amazon and Apple",
			keywords: "Amazon Apple",
			timestamp: "2015/10/24 12:00 EST",
			body: "Steve Ballmer, electric fanboy owner of the Los Angeles Clippers and former Microsoft CEO, told Bloomberg TV's morning show what he really thinks about Amazon and Apple.",
			url : "http://money.cnn.com/2015/10/23/technology/ballmer-amazon-apple/"
		}
	]
}
