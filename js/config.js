// Configuration de l'application
var app = {
    title: 'wmsReaderJS',       // Titre de l'application
    name: 'wmsReaderJS',        // Nom de l'application
    version: 0.01               // Version de l'application
};

// Lien vers le serveur de récupération des flux (pb de cross domain)
var server_url = './server/index.php';  // "false" pour un accès directe à la page sans passer par le script serveur si l'application cswReader est hébergée sur le serveur du flux CSW.

// Liste des webservices disponibles
// Indiquer "wms: ''," pour désactiver la liste des lien et laisser uniquement le champs texte de saisie des URL
// id : Identifiant du webservice
// title : titre du webservice
// description : description du webservice
// url : URL du webservice (sans paramètre)
// service: type de service ('WMS' ou 'WFS')
// request: requête ('GetCapabilities')
// version: version du service (normalement '1.3.0')
var wms_list = {
    //wms: '',
    wms: [ {
        id: 0,
        title: 'WMS CIGAL',
        description: 'Flux WMS du serveur CIGAL.',
        url: 'http://www.cigalsace.org/geoserver/cigal/wms',
        service: 'WMS',
        request: 'GetCapabilities',
        version: '1.3.0'
    }, {
        id: 1,
        title: 'WFS CIGAL',
        description: 'Flux WFS du serveur CIGAL.',
        url: 'http://www.cigalsace.org/geoserver/cigal/wfs',
        service: 'WFS',
        request: 'GetCapabilities',
        version: '2.0.0'
    }, {
        id: 2,
        title: 'WMS Département du Bas-Rhin',
        description: 'Flux WMS du Département du Bas-Rhin.',
        url: 'http://www.cigalsace.org/geoserver/CG67/wms',
        service: 'WMS',
        request: 'GetCapabilities',
        version: '1.3.0'
    } ]
};

// Initialisation de la variable gloable envoyée au template pour construction de la page
var data = {
    //currentPage: 1,
    wms_list: wms_list,
    app: app,
    wms_url: '',
    view: 'gridView'    // Vue par défaut ('gridView' ou 'listView')
};

// Configuration par défaut de l'url du WMS
var wms_url = '';
if (wms_list.wms) {
    wms_url = wms_list.wms[0].url;
    wms_service = wms_list.wms[0].service;
    wms_request = wms_list.wms[0].request;
    wms_version = wms_list.wms[0].version;
}
var wms_config = {
    url: wms_url,
    service: wms_service,
    request: wms_request,
    version: wms_version,
    maxrecords: 10,
    startposition: 1,
    currentpage: 1,
    constraint: ''
};

/* Ne rien modifier en dessous de cette ligne */    
var params = getParamsURL(window.location.search.substring(1));
var param_wms = params['wms'];

var xpaths = {
    // Service
    Service_Name: 'WMS_Capabilities>Service>Name',
    Service_Title: 'WMS_Capabilities>Service>Title',
    Service_Abstract: 'WMS_Capabilities>Service>Abstract',
    // Service_KeywordList: 'WMS_Capabilities>Service>KeywordList',
    Service_Keyword: 'WMS_Capabilities>Service>KeywordList>Keyword',
    // Layer_vocabulary: 'WMS_Capabilities>Service>KeywordList>Keyword@vocabulary',
    Service_OnlineResource: 'WMS_Capabilities>Service>OnlineResource',
    // Contact
    Service_ContactPerson: 'WMS_Capabilities>Service>ContactInformation>ContactPersonPrimary>ContactPerson',
    Service_ContactOrganization: 'WMS_Capabilities>Service>ContactInformation>ContactPersonPrimary>ContactOrganization',
    Service_ContactPosition: 'WMS_Capabilities>Service>ContactInformation>ContactPosition',
    Service_AddressType: 'WMS_Capabilities>Service>ContactInformation>ContactAddress>AddressType',
    Service_Address: 'WMS_Capabilities>Service>ContactInformation>ContactAddress>Address',
    Service_City: 'WMS_Capabilities>Service>ContactInformation>ContactAddress>City',
    Service_StateOrProvince: 'WMS_Capabilities>Service>ContactInformation>ContactAddress>StateOrProvince',
    Service_PostCode: 'WMS_Capabilities>Service>ContactInformation>ContactAddress>PostCode',
    Service_Country: 'WMS_Capabilities>Service>ContactInformation>ContactAddress>Country',
    Service_ContactVoiceTelephone: 'WMS_Capabilities>Service>ContactInformation>ContactVoiceTelephone',
    Service_ContactFacsimileTelephone: 'WMS_Capabilities>Service>ContactInformation>ContactFacsimileTelephone',
    Service_ContactElectronicMailAddress: 'WMS_Capabilities>Service>ContactInformation>ContactElectronicMailAddress',
    Service_Fees: 'WMS_Capabilities>Service>Fees',
    Service_AccessConstraints: 'WMS_Capabilities>Service>AccessConstraints',
    
    Capability_GetMapFormat: 'WMS_Capabilities>Capability>Request>GetMap>Format', // image/png / image/gif / image/jpeg
    Capability_GetMapURL: 'Capability>Request>GetMap>DCPType>HTTP>Get>OnlineResource',
    
    Capability_Title: 'WMS_Capabilities>Capability>Layer>Title',
        Capability_Abstract: 'WMS_Capabilities>Capability>Layer>Abstract',
        Capability_CRS: 'WMS_Capabilities>Capability>Layer>CRS',
        Capability_EX_GeographicBoundingBox: 'WMS_Capabilities>Capability>Layer>EX_GeographicBoundingBox',
            Capability_westBoundLongitude: 'WMS_Capabilities>Capability>Layer>EX_GeographicBoundingBox>westBoundLongitude',
            Capability_eastBoundLongitude: 'WMS_Capabilities>Capability>Layer>EX_GeographicBoundingBox>eastBoundLongitude',
            Capability_southBoundLatitude: 'WMS_Capabilities>Capability>Layer>EX_GeographicBoundingBox>southBoundLatitude',
            Capability_northBoundLatitude: 'WMS_Capabilities>Capability>Layer>EX_GeographicBoundingBox>northBoundLatitude',
        //Capability_BoundingBox: 'Capability>Layer>BoundingBox@CRS / @minx / @miny / @maxx / @maxy',
        //Capability_AuthorityURL: 'Capability>Layer>AuthorityURL@name',
        //Capability_OnlineResource: 'Capability>Layer>AuthorityURL@name>OnlineResource@xlink:href',
        Layers: 'WMS_Capabilities>Capability>Layer>Layer',
            Layer_Name: 'Layer>Name',
            Layer_Title: 'Layer>Title',
            Layer_Abstract: 'Layer>Abstract',
            Layer_Keyword: 'Layer>KeywordList>Keyword',
            Layer_vocabulary: 'Layer>KeywordList>Keyword@vocabulary',
            Layer_CRS: 'Layer>CRS',
            //Layer_EX_GeographicBoundingBox: 'Layer>EX_GeographicBoundingBox',
                Layer_westBoundLongitude: 'Layer>EX_GeographicBoundingBox>westBoundLongitude',
                Layer_eastBoundLongitude: 'Layer>EX_GeographicBoundingBox>eastBoundLongitude',
                Layer_southBoundLatitude: 'Layer>EX_GeographicBoundingBox>southBoundLatitude',
                Layer_northBoundLatitude: 'Layer>EX_GeographicBoundingBox>northBoundLatitude',
            //Layer_BoundingBox: 'Capability>Layer>Layer>BoundingBox@CRS / @minx / @miny / @maxx / @maxy',
            Layer_MinScaleDenominator: 'Layer>MinScaleDenominator',
            Layer_MaxScaleDenominator: 'Layer>MaxScaleDenominator',

            // Liste
            Layer_MetadataURL: 'Layer>MetadataURL',
                Layer_Format: 'Layer>MetadataURL>Format',
                Layer_OnlineResource: 'Layer>MetadataURL>OnlineResource',
            Layer_AttributionTitle: 'Layer>Attribution>Title',
            Layer_AttributionOnlineResource: 'Layer>Attribution>OnlineResource',
            Layer_AttributionLogoURL_height: 'Layer>Attribution>LogoURL@height',
            Layer_AttributionLogoURL_width: 'Layer>Attribution>LogoURL@width',
            Layer_AttributionLogoURL_Format: 'Layer>Attribution>LogoURL>Format',
            Layer_AttributionLogoURL_OnlineResource: 'Layer>Attribution>LogoURL>OnlineResource',
            //liste
            AuthorityURL: 'Layer>AuthorityURL',
            //AuthorityURL_name: 'AuthorityURL@name',
            AuthorityURL_OnlineResource: 'Layer>AuthorityURL>OnlineResource@xlink:href',

};

