'use strict';

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger');
var Site = require('dw/system/Site');

var __RetailtuneService = {
    SERVICE: {
        rtEndpoint: 'int_retailtune.RTEndpoint',
        rtSitemap: 'int_retailtune.RTSitemap',
    },

    getService: function (service) {
        var retailtuneAuthHelper = require('*/cartridge/scripts/retailtune/service/retailtuneAuthHelper');
        try {
            var apiKeyAuth = retailtuneAuthHelper.getApiKeyAuthorizationToken();
            var rtService = LocalServiceRegistry.createService(service, {
                createRequest: function (svc, args) {
                    var payload = {};
                    var httpHome = Site.getCurrent().getHttpsHostName().toString();
                    svc.addHeader('Content-Type', 'application/json');
                    svc.addHeader('Origin', "https://"+httpHome);
                    svc.addHeader('Authorization', 'Bearer ' + apiKeyAuth);

                    if (args.method) {
                        svc.setRequestMethod(args.method);
                    }

                    var serviceUrl = svc.getConfiguration().getCredential().getURL();

                    var qs = "?";
                    if (args.language) {
                        qs += 'language=' + args.language;
                        if (args.path) {
                            qs += '&path=' + args.path;
                        }
                        svc.URL = serviceUrl + qs;
                    }

                    if (args.body) {
                        payload = args.body;
                    }

                    return payload;
                },
                parseResponse: function (svc, client) {
                    return client;
                }
            });
        } catch (e) {
            Logger.getLogger('Retailtune', 'rt').error("Can't get service instance with name {0}", service);
        }
        return rtService;
    }
}

module.exports = __RetailtuneService;