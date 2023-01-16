/*
 * Retailtune Helpers
 */

var Logger  = require('dw/system/Logger');

/**
 * get product ID from retailtune reference
 *
 * @param {string} ref product ref from frontend SDK
 * @returns {string} productId
 */
function getProductIdFromRef(ref) {
    var useUrlRegex = dw.system.Site.current
        .getCustomPreferenceValue('retailtune_extract_pid_url');
    if (useUrlRegex && /^http/i.test(ref)) {
        var QueryString = require('server').querystring;
        // check if PID was passed as a param (no storefront urls)
        var pidParam = new QueryString(ref).pid;
        if (pidParam) {
            return pidParam;
        }
        // check if PID was passed as path
        var pidPath = ref
            // remove params
            .replace(/\?.*$/, '')
            // remove fragment
            .replace(/#.*$/, '')
            // remove suffix
            .replace(/(\.html?)?\/?$/, '')
            // get last segment of path
            .replace(/^.*(\/|-)/, '');
        if (pidPath) {
            return pidPath;
        }
    }
    return ref;
}

/**
 * get Html code from RT API Service
 *
 * @param {string} part part of html page to retrieve
 * @returns {string} code
 */
function getHtmlCodeFromAPI(part, page, locale) {
    var retailtuneService = require('*/cartridge/scripts/retailtune/service/retailtuneService');
    var code = "<div>empty</div>";

    
    var rtRequestService;
    var servResponse;
    var requestBody = {};
    

    requestBody.method = "POST";
    requestBody.body = '{"language":"'+locale+'","path":"'+page+'"}';
    rtRequestService = retailtuneService.getService(retailtuneService.SERVICE.rtEndpoint);

    servResponse = rtRequestService.call(requestBody);

    if (!servResponse.isOk()) {
        Logger.getLogger('Retailtune', 'rt').error('retailtuneHelper-getHtmlCodeFromAPI: Call error code' + servResponse.getError().toString() + ' Error => ResponseStatus: ' + servResponse.getStatus() + ' | ResponseErrorText: ' + servResponse.getErrorMessage() + ' | ResponseText: ' + servResponse.getMsg());
        return "<div class=\"\">" + servResponse.getErrorMessage() + "</div>";
    }

    var jsonResp = JSON.parse(servResponse.object.text);

    if (part && part == "head") {
        //TODO
        code = jsonResp;
    } else if (part && part == "body") {
        //TODO
        code = jsonResp;
    }
   
    return code;

}

/**
 * @returns {boolean} feature enabled status
 */
function isFeatureEnabled() {
    return Boolean(dw.system.Site.current.getCustomPreferenceValue('retailtune_enabled'));
}
/**
 * @returns {boolean} codeByService enabled status
 */
function isCodeByServiceEnabled() {
    return Boolean(dw.system.Site.current.getCustomPreferenceValue('retailtune_codeByService_enabled'));
}

module.exports = {
    getProductIdFromRef: getProductIdFromRef,
    isFeatureEnabled: isFeatureEnabled,
    isCodeByServiceEnabled: isCodeByServiceEnabled,
    getHtmlCodeFromAPI:getHtmlCodeFromAPI
};
