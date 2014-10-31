$( document ).ready(function() {

    function parseXML(xml) {
        console.log(wms_list);
        data.itemsOnPage = wms_config.maxrecords;
        data.startPosition = wms_config.startposition;
        data.currentPage = wms_config.currentpage;
        data.txt_search = wms_config.constraint;
        
        var service = {
            Service_Name: $(xml).find(xpaths.Service_Name).text(),
            Service_Title: $(xml).find(xpaths.Service_Title).text(),
            Service_Keywords: getServiceKeywords($(xml)),
            Service_OnlineResource: $(xml).find(xpaths.Service_OnlineResource).attr('xlink:href'),
            Service_ContactPerson: $(xml).find(xpaths.Service_ContactPerson).text(),
            Service_ContactOrganization: $(xml).find(xpaths.Service_ContactOrganization).text(),
            Service_ContactPosition: $(xml).find(xpaths.Service_ContactPosition).text(),
            Service_AddressType: $(xml).find(xpaths.Service_AddressType).text(),
            Service_Address: $(xml).find(xpaths.Service_Address).text(),
            Service_City: $(xml).find(xpaths.Service_City).text(),
            Service_StateOrProvince: $(xml).find(xpaths.Service_StateOrProvince).text(),
            Service_PostCode: $(xml).find(xpaths.Service_PostCode).text(),
            Service_Country: $(xml).find(xpaths.Service_Country).text(),
            Service_ContactVoiceTelephone: $(xml).find(xpaths.Service_ContactVoiceTelephone).text(),
            Service_ContactFacsimileTelephone: $(xml).find(xpaths.Service_ContactFacsimileTelephone).text(),
            Service_ContactElectronicMailAddress: $(xml).find(xpaths.Service_ContactElectronicMailAddress).text(),
            Service_Fees: $(xml).find(xpaths.Service_Fees).text(),
            Service_AccessConstraints: $(xml).find(xpaths.Service_AccessConstraints).text(),
        };
        data.service = service;
        
        var GetMapURL = $(xml).find(xpaths.Capability_GetMapURL).attr('xlink:href');
        if (!GetMapURL) { GetMapURL = wms_config.url+'?SERVICE=WMS&'; }
        var GetMapFormat = 'image/jpeg';
        
        var Capability_Extent = getExtent($(xml), 'capability');

        var layers = [];
        var nb_records_matched = 0;
        var nb_records_returned = 0;
        $(xml).find(xpaths.Layers).each(function() {
            var Name = $(this).find(xpaths.Layer_Name).text();
            var Title = $(this).find(xpaths.Layer_Title).text();
            var Abstract = $(this).find(xpaths.Layer_Abstract).text();
            if ((wms_config.constraint!="" && (Name.toLowerCase().indexOf(wms_config.constraint.toLowerCase())>-1 || Title.toLowerCase().indexOf(wms_config.constraint.toLowerCase())>-1 || Abstract.toLowerCase().indexOf(wms_config.constraint.toLowerCase())>-1)) || (wms_config.constraint=="")) {
                nb_records_matched++;
                if (nb_records_matched>=wms_config.startposition && nb_records_matched<wms_config.startposition+wms_config.maxrecords) {
                    nb_records_returned++;
                    // Layer Name
                    var truncatevalue = 87;
                    var short_Name = Name.substr(0,truncatevalue);
                    if (Name.length > short_Name.length) {
                        short_Name += "...";
                    }
                    // Layer Title
                    var truncatevalue = 87;
                    var short_Title = Title.substr(0,truncatevalue);
                    if (Title.length > short_Title.length) {
                        short_Title += "...";
                    }
                    // Layer Abstract
                    var truncatevalue = 397;
                    var short_Abstract = Abstract.substr(0,truncatevalue);
                    if (Abstract.length > short_Abstract.length) {
                        short_Abstract += "...";
                    }
                    // Layer Extent
                    var Layer_Extent = getExtent($(this), 'layer', Capability_Extent);
                    
                    // ImgURL
                    var ImgURL = GetMapURL + 'VERSION=1.3.0&REQUEST=GetMap&LAYERS=' + Name + '&STYLES=&SRS=CRS:84&BBOX=' +Layer_Extent.w+ ',' +Layer_Extent.s+ ',' +Layer_Extent.e+ ',' +Layer_Extent.n+ '&WIDTH=200&HEIGHT=200&FORMAT=' +GetMapFormat;
                    
                    layer = {
                        Name: short_Name,
                        Title: short_Title,
                        Abstract: short_Abstract,
                        Keywords: getLayerKeywords($(this)),
                        ImgURL: ImgURL,
                        CRS: getLayerCRS($(this)),
                        Extent: Layer_Extent,
                        MetadataURL: getLayerMetadataURL($(this)),
                        Layer_MinScaleDenominator: $(this).find(xpaths.Layer_MinScaleDenominator).text(),
                        Layer_MaxScaleDenominator: $(this).find(xpaths.Layer_MaxScaleDenominator).text(),
                        Layer_Attribution: getLayerAttribution($(this)),
                    }
                    console.log(layer.Keywords);
                    layers.push(layer);
                }
            }
        });
        data.layer = layers;
        data.nb_records_matched = nb_records_matched;
        data.nb_records_returned = nb_records_returned;
        data.next_record = data.startPosition +  data.nb_records_returned;
        return data;
    }

    function getServiceKeywords(xml) {
        var k = [];
        $(xml).find(xpaths.Service_Keyword).each(function() {
            kw = {
                Service_Keyword: $(this).text()
            }
            k.push(kw);
        });
        return k;
    }
       
    function getLayerKeywords(xml) {
        var k = [];
        $(xml).find(xpaths.Layer_Keyword).each(function() {
            kw = {
                Layer_Keyword: $(this).text()
            }
            k.push(kw);
        });
        return k;
    }
    
    function getExtent(xml, level, Capability_Extent) {
        var level = level || 'capability';
        var Capability_Extent = Capability_Extent || '';
        var Extent = {};
        if (level == 'layer') {
            Extent['w'] = $(xml).find(xpaths.Layer_westBoundLongitude).text();
            Extent['e'] = $(xml).find(xpaths.Layer_eastBoundLongitude).text();
            Extent['s'] = $(xml).find(xpaths.Layer_southBoundLatitude).text();
            Extent['n'] = $(xml).find(xpaths.Layer_northBoundLatitude).text();
            if (!Extent && Capability_Extent) {
                Extent = Capability_Extent;
            }
        } else {
            Extent['w'] = $(xml).find(xpaths.Capability_westBoundLongitude).text();
            Extent['e'] = $(xml).find(xpaths.Capability_eastBoundLongitude).text();
            Extent['s'] = $(xml).find(xpaths.Capability_southBoundLatitude).text();
            Extent['n'] = $(xml).find(xpaths.Capability_northBoundLatitude).text();
        }
        return Extent;
    }

    function getLayerCRS(xml) {
        var c = [];
        $(xml).find(xpaths.Layer_CRS).each(function() {
            crs = {
                crs: $(this).text()
            };
            c.push(crs);
        });
        return c;
    }
    function getLayerMetadataURL(xml) {
        var u = [];
        $(xml).find(xpaths.Layer_MetadataURL).each(function() {
            url = {
                url: $(this).find(xpaths.Layer_OnlineResource).attr('xlink:href'),
                format: $(this).find(xpaths.Layer_Format).text()
            };
            u.push(url);
        });
        return u;
    }
    function getLayerAttribution(xml) {
        var a = {
                title: $(xml).find(xpaths.Layer_AttributionTitle).text(),
                url: $(xml).find(xpaths.Layer_AttributionOnlineResource).attr('xlink:href'),
                logoURL: $(xml).find(xpaths.Layer_AttributionLogoURL_OnlineResource).attr('xlink:href')
            };
        return a;
    }
    
    function loadContent() {
        if (param_wms) {
            wms_config.url = param_wms;
            $('#txt_wmsurl').val(param_wms);
        }
        var wms_url = urlConstruct(wms_config.url, wms_config);
        
        if (server_url) {
            var url_page = server_url;
            var data_page = {url: wms_url};
        } else {
            var url_page = wms_url;
            data_page = '';
        }

        data['wms_url'] = wms_config.url;
        data['wms_url_complete'] = wms_url;
        
        $.ajax({
            type: "POST",
            url: url_page,
            data: data_page,
            dataType: "xml",
            success: function (xml) {
                data = parseXML(xml);
                if (data.service) {
                    $.Mustache.load('./templates/content.html')
                        .done(function () {
                            $('#content').empty().mustache('tpl_content', data);
                            if (data.view == 'listView') {
                                $('.switchView').toggleClass('uk-hidden');
                                $('.bt_onChangeView').toggleClass('uk-hidden');
                            }
                            on_changePage();
                            on_search();
                            on_changeCSW();
                            on_getCSW();
                            on_changeItemsOnPage();
                            on_changeView();
                        });
                }
                
            },
            error: function (res) {
                alert('Imossible de lire l\'url demandée.');
            }
        });
    }
    loadContent();
    
    function on_changePage() {
        $('#pagination').on('uk-select-page', function(e, pageIndex){
            wms_config.currentpage = pageIndex+1;
            wms_config.startposition = (wms_config.maxrecords * pageIndex) + 1;
            loadContent();
        });
    }
    function on_search() {
        $('.bt_onSearch').on('click', function(e){
            e.preventDefault();
            wms_config.currentpage = 1;
            wms_config.startposition = 1;
            wms_config.constraint = '';
            var txt_search = $('#txt_search').val();
            if (txt_search) {
                wms_config.constraint = txt_search;
            }
            // Réinitialisation des pages (se replacer sur la première page)
            loadContent();
        });
    }
    function on_changeCSW() {
        $('.bt_onChangeCSW').on('click', function(e){
            e.preventDefault();
            var href = $(this).attr('href');
            $('#txt_wmsurl').val(href);
            wms_config.url = href;
            loadContent();
        });
    }
    function on_getCSW() {
        $('.bt_onGetCSW').on('click', function(e){
            e.preventDefault();
            wms_config.url = $('#txt_wmsurl').val();
            loadContent();
        });
    }
    function on_changeItemsOnPage() {
        $('.bt_onChangeItemsOnPage').on('click', function(e){
            e.preventDefault()
            var itemsOnPage = $(this).attr('href');
            wms_config.maxrecords = itemsOnPage;
            wms_config.currentpage = 1;
            wms_config.startposition = 1;
            loadContent();
        });
    }
    function on_changeView() {
        $('.bt_onChangeView').on('click', function(e){
            e.preventDefault()
            var view = $(this).attr('href');
            data.view = view;
            $('.switchView').toggleClass('uk-hidden');
            $('.bt_onChangeView').toggleClass('uk-hidden');
        });
    }
    
});

