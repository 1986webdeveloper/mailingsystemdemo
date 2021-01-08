module.exports = {
	port: 5050,
	name: 'mailing_system',
	dbHost: 'localhost',
	dbUserName: 'root',
	dbPassword: 'root',
	dbName: 'mailing_system',
	saltRounds: 2,
	jwtSecret: 'mailing_system@159*',
	domain: 'http://localhost:5050',
	getServerUrl(req) {
		var serverURL = 'http://localhost:5050/';
		return serverURL;
	}
}