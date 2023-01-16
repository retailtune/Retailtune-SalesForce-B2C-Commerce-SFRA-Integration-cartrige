'use strict';

var server = require('server');
var retailtuneHelpers = require('~/cartridge/scripts/retailtune/retailtuneHelpers');
var Logger = require('dw/system/Logger');
var URLUtils = require('dw/web/URLUtils');

server.get('Stores', function (req, res, next) { 
    
    Logger.getLogger("Retailtune", "Stores-GET").info("Retialtune Store Locator");
    
    var configObj = {}; 

    var rtPipeline = String(dw.system.Site.current.getCustomPreferenceValue('retailtune_pipeline_name')) || "stores";
    
    var locale = req.querystring.locale || "it"; 
    if (locale.indexOf("/") > -1){
        locale = locale.substring(0,locale.indexOf("/"));
    }
    var storepath = req.querystring.storepath || rtPipeline; 
    
    var urlRed = "/"+locale+"/"+(storepath != rtPipeline ? rtPipeline + "/" + storepath : storepath);
    try {
    configObj = {
        currency: req.session.currency.currencyCode,
        locale: locale,
        apiKey: String(dw.system.Site.current.getCustomPreferenceValue('retailtune_apiKey_services')),
        result: retailtuneHelpers.getHtmlCodeFromAPI("head", urlRed,locale),
        urlred: urlRed
    };
    } catch (e) {
        Logger.getLogger("Retailtune", "Stores").error("Error occurred", e);
    }    res.render('retailtune/stores/stores', { config: configObj });  
    next();
});



module.exports = server.exports();
