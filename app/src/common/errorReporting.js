import Raven from 'raven-js';

const sentryUrl = process.env.RG_SENTRY_URL;

export function initErrorReporting(){
	if(sentryUrl){
		Raven.config(sentryUrl).install();
	}
}