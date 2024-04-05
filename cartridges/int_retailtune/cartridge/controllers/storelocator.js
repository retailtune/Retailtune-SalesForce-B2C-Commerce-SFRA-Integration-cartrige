'use strict';

var server = require('server');
var retailtuneHelpers = require('~/cartridge/scripts/retailtune/retailtuneHelpers');
var Logger = require('dw/system/Logger');
var URLUtils = require('dw/web/URLUtils');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');
var Locale = require('dw/util/Locale');

server.get('Stores', function (req, res, next) { 
    
    Logger.getLogger("Retailtune", "Stores-GET").info("Retailtune Store Locator");
    
    var configObj = {}; 

    var rtPipeline = String(dw.system.Site.current.getCustomPreferenceValue('retailtune_pipeline_name')) || "stores";

    var currentLocale = Locale.getLocale(req.locale.id);
    var locale = req.querystring.locale || currentLocale.ID; 
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

server.get('Sitemap', function (req, res, next) { 
    
    Logger.getLogger("Retailtune", "Sitemap-GET").info("Retailltune Store Locator - Sitemap request");
    
    var resultObj = null;   
    
    var language = req.querystring.locale || "it"; 
    if (language.indexOf("/") > -1){
        language = language.substring(0,language.indexOf("/"));
    }
    var locale = req.locale.id;
    
    try {
        resultObj = retailtuneHelpers.getSitemapFromAPI(language, locale);
    } catch (e) {
        Logger.getLogger("Retailtune", "Sitemap").error("Error occurred", e);
    }    

    var xmlSitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    xmlSitemap += resultObj.content;
    
    try {
        res.setContentType("text/xml")
        res.print(xmlSitemap);
    } catch (e) {
        throw new Error(e.message + '\n\r' + e.stack, e.fileName, e.lineNumber);
    }
    
    return next();
});



module.exports = server.exports();
