'use strict';
var myPaypal = require('paypal-nvp-api');
let config = {
	mode: 'sandbox',
	track: 'https://www.sandbox.paypal.com',
	username: '...',
	password: '...',
	signature: '...'
};
let myPay = myPaypal(config);


// Routes

exports.index = function (req, res) {
  res.render('index');
};

exports.create = function (req, res) {

	console.log('I am on create');
/*
	myPay.request('GetBalance', {}).then(function (result) {
		console.log('log 01' + result);
	}).catch(function (err) {
		console.trace('log 01' + err);
	});
	*/

	var query = {
		'PAYMENTREQUEST_0_AMT': '20.00',
		'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
		'PAYMENTREQUEST_0_PAYMENTACTION': 'Sale',
		'RETURNURL': 'http://test-express-checkout.herokuapp.com/execute',
		'CANCELURL': 'http://test-express-checkout.herokuapp.com/cancel'
	};


	myPay.request('SetExpressCheckout', query).then(function (result) {
		console.log('log 02' + result);
		req.session.paymentId = result.id;
		res.render('viewDetail', { 'detail': result });
		var token = result.param('token');
		var query1 = { "TOKEN": token };

		myPay.request('GetExpressCheckoutDetails', query1).then(function (result) {
			console.log(result);
			var payerId = req.param('PayerID');
			var query2 = { "PAYERID": payerId };
			res.render('viewDetail', { 'detail': result });
		}).catch(function (err) {
			console.trace(err);
			res.render('error', { 'error': err });
		});
	}).catch(function (err) {
		console.trace('log 02' + err);
		res.render('error', { 'error': err });
	});

};
exports.execute = function (req, res) {
	var token = req.param('token');
	var query = { "TOKEN": token };

	myPay.request('DoExpressCheckoutPayment', query).then(function (result) {
		console.log(result);
		res.render('execute', { 'payment': result });
	}).catch(function (err) {
		console.trace(err);
		res.render('error', { 'error': err });
	});
};
exports.cancel = function (req, res) {
	res.render('cancel');
};