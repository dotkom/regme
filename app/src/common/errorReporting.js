import Raven from 'raven-js';

const sentryUrl = process.env.RG_SENTRY_DSN;

export function initErrorReporting(){
	console.log(sentryUrl);
	if(sentryUrl){
		Raven.config(sentryUrl).install();
	}
}