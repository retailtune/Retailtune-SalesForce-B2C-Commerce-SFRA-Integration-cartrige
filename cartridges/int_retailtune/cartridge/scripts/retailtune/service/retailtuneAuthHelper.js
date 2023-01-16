'use strict';
    
function getApiKeyAuthorizationToken() {
	return String(dw.system.Site.current.getCustomPreferenceValue('retailtune_apiKey_services'));
}

/*
 * Local methods
 */
module.exports = {
    getApiKeyAuthorizationToken: getApiKeyAuthorizationToken
}	

