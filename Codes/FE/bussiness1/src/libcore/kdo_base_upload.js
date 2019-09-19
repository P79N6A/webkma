(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window) {
    //系统业务相关
    var queryString = function (paraName) {
        var hrefString = location.href.substring(location.href.indexOf('?') + 1),
               paras = hrefString.split('&');
        for (var i = 0, ii = paras.length; i < ii; i++) {
            if (paras[i].split('=')[0] === paraName) return paras[i].split('=')[1] || null;
        }
        return null;
    },
    templateNumber = Kdo.data.config.site.get().templateNumber,
    openWindow = function () {
        Kdo.modal.create($.extend({
            title: '',
            template: '',
            width: 800,
            beforeClose: function () {

            }
        }, arguments[0] || {}));

        var callback = arguments[arguments.length - 1];
        if (typeof callback === 'function') {
            callback();
        }
    },
    inputValid = (function () {
        var formDom, options, inputs, rules = {
            required: {
                errorText: '该字段为必填。',
                mark: {
                    position: 'right',//暂时只支持left，right。
                    //html: '<span style="color:red;">*</span>'
                },
                cls: 'required',
                canValid: function (input) {
                    return $(input).hasClass(this.cls);
                },
                isValid: function (input) {
                    return !!$(input).val();
                }
            },
            stringCheck: {
                errorText: '只能输入中文、英文、数字、下划线等字符。',
                mark: {
                    position: 'right',//暂时只支持left，right。
                    // html: '<span style="color:red;">*</span>'
                    html:''
                },
                cls: 'stringCheck',
                canValid: function (input) {
                    return $(input).hasClass(this.cls);
                },
                isValid: function (input) {
                    return /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test($(input).val())
                }
            },
            custom: {
                errorText: '您输入的数据有误',
                cls: 'valid-',
                canValid: function (input) {
                    return !!$(input).attr('class') && $(input).attr('class').indexOf(this.cls) >= 0;
                },
                isValid: function (input) {
                    var self = this,
                        rulesText = ($(input).attr('class') || '').match(new RegExp(self.cls + '.+?\[[^\[\]]+\]', 'g')) || [],
                        val = $(input).val();

                    if (!(rulesText instanceof Array)) {
                        if (typeof rulesText === 'string') {
                            rulesText = [rulesText];
                        }
                    }
                    for (var i = 0, ii = rulesText.length; i < ii; i++) {
                        var ruleTextSplits = rulesText[i].split('-'),
                            ruleSplits = (ruleTextSplits[1] || '').split('['),
                            defaultValid = self.valid[ruleSplits[0]],
                            validResult = defaultValid('[' + ruleSplits[1], val);
                        if (validResult !== true && typeof validResult === 'string') {
                            self.errorText += validResult;
                            return false;
                        }
                        return !!validResult;
                    }
                },
                valid: {
                    suffix: function (ruleText, inputVal) {
                        var arr = eval(ruleText), suffixVal = inputVal.split('.')[1];
                        if (suffixVal && (arr[0] || '').split(',').indexOf(suffixVal) >= 0) {
                            return true;
                        }
                        return arr[1] || this.msg;
                    }
                }
            }
        };

        var validInput = function (rule) {
            //不符合该验证规则的就默认为通过
            if (!rule.canValid(this)) return true;
            var status = rule.isValid(this),
                errorLabel = $(this).parent().find('.valid-label-error');
            if (!status) {
                $(this).css('border', '1px solid red');
                if (!!rule.errorText) {
                    if (!errorLabel.length) {
                        errorLabel = $('<div class="valid-label-error" style="color:red;display:none;">' + rule.errorText + '</div>');
                        $(this).parent().append(errorLabel);
                    }
                    else {
                        errorLabel.html(rule.errorText);
                    }
                }
                if (errorLabel) errorLabel.show();
                return false;
            }
            else {
                $(this).css('border', '1px solid #ccc');
                $(this).parent().find('.valid-label-error').hide();
                return true;
            }
        }

        this.initValids = function () {
            for (var rul in rules) {
                var ruleCfg = rules[rul],
                    ruleInputs = $.grep(inputs, function (inputItem) { return ruleCfg.canValid(inputItem); });
                (function (rule) {
                    $(ruleInputs).each(function () {
                        if (!!rule.mark) {
                            $(this).parent().find('label').append($(rule.mark.html).css({ 'float': rule.mark.position }));
                        }

                        //TODO  linna
                        if (!!$(this).attr("id") && $(this).attr("id") == "video-name") {
                            $(this).on('input propertychange', function (event) {
                                var inputVal = $(this).val();
                                var rinputVal = inputVal;
                                var cr = rinputVal.match(/[\u4E00-\u9FA5]/gm);
                                if (cr && cr.length > 0) {
                                    var clen = cr.length;
                                    for (var i = 0; i < clen ; i++) {
                                        rinputVal = rinputVal.replace(cr[i], '');
                                    }
                                }

                                var sr = rinputVal.match(/[^\w\_]/gm);
                                if (sr && sr.length > 0) {
                                    var slen = sr.length;
                                    for (var i = 0; i < slen ; i++) {
                                        inputVal = inputVal.replace(sr[i], '')
                                    }
                                    $(this).val(inputVal)
                                }
                              
                            });
                        } else {
                            $(this).on('keyup blur', function (event) {
                                if (!validInput.call(this, rule)) {
                                    event.stopImmediatePropagation && event.stopImmediatePropagation();
                                    return false;
                                }
                            });
                        }

                    });
                })(ruleCfg);
            }
        }

        this.validAll = function () {
            var validStatus = true;
            $(inputs).each(function () {
                for (var rul in rules) {
                    validStatus = validInput.call(this, rules[rul]);
                    if (!validStatus) break;
                }
            });
            return validStatus;
        }


        this.init = function (form) {
            options = $.extend({}, arguments[0]);
            formDom = $(options.formEl);
            inputs = formDom.find('input').not('input[disabled],input[type="hidden"]');
            this.initValids();
        }

        return this;
    }).call({});;


    function FileUpload() {
        this.uploaderContext = null;
        this.dataContext = null;
        var self = this,
            options = $.extend(true, {
                window: false
            }, arguments[0]),
            ajaxLoad = function (callback) {
                $.get(options.window.url)
                .success(function (result) {
                    callback && callback(result);
                });
            },
            showWindow = function (htmlString) {
                openWindow({
                    title: options.window.title,
                    template: htmlString,
                    beforeClose: function () {
                        self.dataContext.clear();
                    }
                }, function () {
                    initEvent();
                })
            },
            initEvent = function () {
                if (self.dataContext.defaults.mediaType === "Audio") {
                    $("#upload-type").show();
                } else {
                    $("#upload-type").hide();
                }
                self.uploaderContext.init($(options.target).get(0));
                self.dataContext.init();
                self.dataContext.paged();
            };


        if (!!options.window) {
            this.dataContext = options.dataContext;
            if (!this.dataContext) this.dataContext = new MaterialUploadDataContext({ apply: options.submit, path: options.path });
        }

        if (!!options.target && !!this.uploaderContext) {
            this.uploaderContext.init(options.target);
        }




        this.open = function () {
            if (!!options.window) {
                if (options.window.ajax) {
                    ajaxLoad(function (result) {
                        showWindow(result);
                    });
                } else {
                    showWindow(options.window.htmlString);
                }
            }
            else {
                //TODO 不弹窗模式
            }
        }
    }


    FileUpload.prototype = {
        any: function () {
            var self = this;
            this.uploaderContext = new FlowUploaderContext($.extend(true, {
                singleFile: false,
                added: function (file, event) {
                    new FileEncode()
                   .encode(file)
                   .toBase64()
                   .loadImageSize()
                   .fail(function (fileData) {
                       _showLoading(file);
                       var fileObj = $.extend(true, {}, this);
                       $.extend(fileData, {
                           id: fileObj.uniqueIdentifier,
                           title: fileObj.nowName || fileObj.name,
                           suffix: fileObj.getExtension(),
                           obj: fileObj,
                           src: fileObj.nowSrc || fileData.src || ''
                       });
                       self.dataContext.add(fileData);
                   });
                },
                uploaded: function (addedFiles, message) {
                    var timer = setInterval(function () {
                        var queried = $.grep(self.dataContext.get(), function (fileItem) { return !fileItem.src; })
                        if (queried.length <= 0) {
                            clearInterval(timer);
                        }
                    });
                    _hideLoading();
                },
            }, arguments[0] || {}));

            this.open();

            return self;
        },
        image: function (singleFile, target, callback) {
            var self = this;
            this.uploaderContext = new FlowUploaderContext({
                singleFile: singleFile,
                autoUpload: true,
                target: lanh.apiHost + 'httpserver/kem/service/file/upload.html?type=image',
                headers: {
                    client_type: "web",
                    Token: false
                },
                ajaxLoadList: false,
                limit: {
                    size: 2097152,
                    filters: 'png,gif,jpg,bmp',

                },
                uploaded: function (data) {
                    callback(Kdo.utils.copy(data));
                }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
            });
            this.uploaderContext.init(target);
            return self;
        },
        audio: function (target) {
            var self = this;
            this.uploaderContext = new FlowUploaderContext({
                singleFile: false,
                limit: {
                    size: 5242880,
                    filters: 'mp3,wav'
                }
            });
            this.uploaderContext.init(target);

            return self;
        },
        video: function (target) {
            var self = this;
            this.uploaderContext = new LinkedUploaderContext({
                title: '添加视频',
                url: 'views/common/upload/video-add.tpl.html',
                uploaded: function (data) {
                    self.dataContext.reload(1);
                }
            });

            self.open();

            //多屏后台暂时只支持外链视频文件
            return self;
        }
    };


    //Abstractct Class（DataContext's Base Class）
    function DataContext() {
        var self = this;

        this.defaults = $.extend(true, {
            list: {
                selector: '',
                tmplHTML: '',
                popup: false
            },
            paged: {
                selector: '.material-container .material-pagination:last',      //TODO: 这里不应该从全局查找，后续需要改进。(added by Dyllon)
                index: 1,
                size: 15,
                total: 0
            }
        }, arguments[0] || {});

        this.dataList = [];
        //API Method
        this.init = function () {
            self.reload(1);
        }

        //API Method
        this.load = function () {

        }

        //API Method
        this.rendered = function (dom) {

        }

        this.apply = function () {

        }

        this.reload = function (index) {
            var options = self.defaults,
                dataList = self.dataList;
            //长度大于10，强行去掉10之后的数据（一次性只能上传10张图片）lina
            if (dataList.length > 10) dataList.length = 10;
            if (!options || !options.list) return false;
            $(options.list.selector).html('');
            if (!index) index = 1;
            if (options.ajaxLoadList !== false && !!options.list.url) {
                if (options.mediaType === "Video") {
                    var data = $.extend({}, options.list.getParas && options.list.getParas(index, options.paged.size) || {}).data;
                    data.pagesize = data.page_size;
                    $.ajax({
                        useToken: options.list.useToken,
                        url: options.list.url,
                        headers: {
                            client_type: 'web'
                        },
                        method: 'get',
                        data: data,
                        contentType: 'application/json',
                        dataType: 'json'
                    })
                    .success(function (result) {
                        dataList = result.dataList || result.data;
                        addContent(dataList, result);
                    });

                } else {
                    $.ajax({
                        useToken: options.list.useToken,
                        url: options.list.url,
                        headers: {
                            client_type: 'web'
                        },
                        method: 'post',
                        data: JSON.stringify($.extend({

                        }, options.list.getParas && options.list.getParas(index, options.paged.size) || {})),
                        contentType: 'application/json',
                        dataType: 'json'
                    })
                    .success(function (result) {
                        dataList = result.dataList || result.data;
                        addContent(dataList, result);
                    });
                }
            
                var addContent = function (dataList, result) {
                    for (var i = 0, ii = dataList.length; i < ii; i++) {
                        var dataItem = dataList[i];
                        if ((self.defaults.mediaType || '').toLowerCase() === 'audio') {
                            dataItem.bgImage = '/public/images/mobile/music.png';
                        }
                        else if ((self.defaults.mediaType || '').toLowerCase() === 'video') {
                            dataItem.bgImage = dataItem.src_image || '/public/images/mobile/mov.png';
                        }
                        else {
                            dataItem.bgImage = dataItem.src;
                        }
                        dataItem.name = !!dataItem.title ? dataItem.title : dataItem.src_name;
                        var renderDom = $.tmpl(options.list.tmplHTML, dataItem);
                        self.rendered(renderDom, dataList[i]);
                        renderDom.appendTo(options.list.selector);
                        if (i == dataList.length) _hideLoading();
                    }
                    if (result.data && result.data.page_info) {
                        $(options.paged.selector).pagination('updateItems', result.data.page_info.total);
                    } else if (!!result.paginated) {
                        $(options.paged.selector).pagination('updateItems', result.paginated.total);
                    }
                    else {
                        $(options.paged.selector).pagination('updateItems', result.totalCount);
                    }
                }
            }
            else {
                var start = (index - 1) * options.paged.size, end = start + options.paged.size;
                if (end > options.paged.total) end = options.paged.total || dataList.length;
                for (var i = start, ii = end; i < ii; i++) {
                    dataList[i].bgImage = dataList[i].src;
                    var renderDom = $.tmpl(options.list.tmplHTML, dataList[i]);
                    self.rendered(renderDom, dataList[i]);
                    renderDom.appendTo(options.list.selector);
                }
                if (!!dataList && dataList.length.length > 0) $(options.paged.selector).pagination('updateItems', dataList.length);
                _hideLoading();
            }
           
        }

        this.get = function () {
            return this.dataList;
        }

        this.add = function (item) {
            var self = this,
                timer = setInterval(function () {
                    if (!!item.src || self.defaults.mediaType === "Audio" || self.defaults.mediaType === "Video") {
                        clearInterval(timer);
                        self.dataList.push(item);
                        self.reload(self.defaults.paged.index);
                    }
                }, 500);
        }

        this.remove = function (id) {
            if (!!id) {
                var item = $.grep(this.dataList, function (dataItem) { return dataItem.id === id })[0];
                if (item) {
                    this.dataList.splice(this.dataList.indexOf(item), 1);
                    if (item.obj) item.obj.cancel();
                    this.reload();
                }
            }
        }

        this.clear = function (isDelete) {
            var _dataList = Kdo.utils.copy(this.dataList);
            for (var i = 0; i < _dataList.length;) {
                if (this.dataList[i].obj) {
                    this.dataList[i].obj.cancel();
                    if (isDelete) Kdo.upload.removeItem(_dataList[i].id);
                    i++
                }
                _dataList.length = this.dataList.length;
            }
            this.dataList = [];
            //ajax方式加载的列表不就不执行清除操作了
            if (!(this.defaults.list && this.defaults.list.url)) {
                this.reload();
            }
        }

        this.paged = function () {
            var self = this;
            $(this.defaults.paged.selector).pagination({
                items: 1,
                itemsOnPage: this.defaults.paged.size,
                displayedPages: 3,
                prevText: '上一页',
                nextText: '下一页',
                cssStyle: 'blue-theme',
                hrefTextPrefix: 'javascript:void(0)',
                ellipsePageSet: false,
                onPageClick: function (pageIndex) {
                    self.defaults.paged.index = pageIndex;
                    self.reload(pageIndex);
                    return false;
                }
            });
            return this;
        }

    }


    //Material Upload Data Context Class
    function MaterialUploadDataContext() {
        var self = this;

        DataContext.apply(this, [$.extend(true, {
            list: {
                popup: true,
                selector: '.image-upload .material-list',
                tmplHTML: Kdo.MATERIAL_CELL_TEMPLATE
            }
        }, arguments[0])]);


        this.init = function () {
            var $target = $(".lanh-modal:last");
            $target.find('.material-container.image-upload #btn_clearImage').on('click', function () {
                self.clear(true);
            });

            $target.find('.material-container.image-upload #btn_apply').on('click', function () {
                $(self.defaults.list.selector).parent().find("marquee").show();
                self.apply(this);
            });

            //暂时只有素材库才有目录
            if (!!self.defaults.path) {
                $target.find('.material-container .material-header #label-folder').html(self.defaults.path);
            }
        }

        this.apply = function () {
            var data = self.get(),
                options = self.defaults;
            if (!data || data.length <= 0) {
                Kdo.modal.cancel($(options.list.selector));
            }
            options.apply && options.apply(data, self);
            Kdo.modal.cancel($(options.list.selector));
        }


        var baseReload = this.reload;
        this.reload = function () {
            baseReload();

            $('.image-upload .material-list .data-popup').hide();
            $('.image-upload .material-list .search-icon').hide();
        }

        this.load = function () {
            this.reload(1);
            return this;
        }
    }

    //Simple Data Context Class
    function SimpleUploadDataContext() {
        var self = this,
            templateString = '<li>'
            + '<div class="data-item bg-contain" style="background-image:url(${bgImage})">'
            + '</div>'
            + '<div class="data-title" title="${name}">${name}</div>'
            +'<div class="qq-progress-bar-container-selector qq-progress-bar-container qq-hide">'
            +'<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div></div>'
            + '</li>';

        DataContext.apply(this, [$.extend(true, {
            list: {
                url: lanh.kdesignHost + 'resource/list',
                selector: '.material-container .material-list',
                tmplHTML: templateString,
                getParas: function (index, pageSize) {
                    var sortBy = $('#dropSortBy').val();
                    return {
                        'paging': {
                            'pageIndex': index || 1,
                            'pageSize': pageSize
                        },
                        'sort': [{
                            'sortField': sortBy.split('_')[0],
                            'sortDirection': sortBy.split('_')[1]
                        }],
                        'condition': {
                            'titleLike': $('#txtKeyWord').val(),
                            'resType': 'TemplateRes',
                            "resTypeNumber": Kdo.data.config.site.get().templateNumber,
                            //'templateNumber': templateNumber,
                            'mediaType': self.defaults.mediaType || 'Audio',
                        }
                    }
                }
            }
        }, arguments[0])]);

        this.init = function () {
            $('.material-container.common-manage #btn_confirm').on('click', function () {
                self.apply(this);
            });

            $('.material-container.common-manage #btn_search').on('click', function () {
                self.load();
            });

            $('.material-container.common-manage #dropSortBy').on('change', function () {
                self.load();
            });

            this.load();
        }

        this.apply = function () {
            var options = self.defaults;
            if (!self.selectedItem) {
                Kdo.modal.cancel($(options.list.selector));
                return false;
            }
            options.apply && options.apply(self.selectedItem, self);
            Kdo.modal.cancel($(options.list.selector));
        }


        this.load = function () {
            this.reload(1);
            return this;
        }

        this.selectedItem;
        var selectItem = function (data) {
            self.selectedItem = data;
            $(this).parent().find('li.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        this.rendered = function (dom, data) {
            $(dom).on('click', function () {
                selectItem.call(this, data);
            });
        }
    }

    function KCmsUploadDataContext() {
        var self = this;
        SimpleUploadDataContext.apply(this, [$.extend(true, {
            list: {
                url: lanh.apiHost + 'httpserver/kem/service/cms_video/list.html',
                useToken: false,
                getParas: function (index, pageSize) {
                    var sortBy = $('#dropSortBy').val(),
                        sortField = sortBy.split('_')[0];
                    if (sortField === 'createTime') sortField = 'src_id';
                    else if (sortField === 'title') sortField = 'src_name';

                    return {
                        data: {
                            'search_key': $('#txtKeyWord').val(),
                            'order_field': sortField,
                            'order_type': (sortBy.split('_')[1] || '').toLowerCase(),
                            'page': index,
                            'page_size': pageSize
                        }
                    }
                }
            }
        }, arguments[0])]);
    }

    //Async FileEncode Class
    function FileEncode() {
        this.file = null;
        var attrs = {};
        var self = this,
            fileCode = {
                base64: function (callback) {
                    if (!self.file) return false;
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(self.file.file);
                    fileReader.onload = function (event) {
                        self.src = attrs.src = event.target.result;
                        callback && callback(attrs.src, self.file, self)
                    }
                }
            };

        this.encode = function (file) {
            this.file = file;
            return this;
        }

        this.toBase64 = function (callback) {
            attrs.src = '';

            fileCode.base64(callback);
            return this;
        }

        this.loadImageSize = function (callback) {
            attrs.width = attrs.height = '';
            var timer = setInterval(function () {
                if (!!attrs.src) {
                    clearInterval(timer);
                    var img = new Image();
                    img.src = attrs.src;

                    // 如果图片被缓存，则直接返回缓存数据
                    if (img.complete) {
                        $.extend(attrs, {
                            width: img.width,
                            height: img.height
                        })
                        callback && callback(attrs);
                    } else {
                        // 完全加载完毕的事件
                        img.onload = function () {
                            $.extend(attrs, {
                                width: img.width,
                                height: img.height
                            });
                            callback && callback(attrs);
                        }
                    }
                }
            });
            return this;
        }

        this.fail = function (callback) {
            var complated = true,
                timer = setInterval(function () {
                    for (var prop in attrs) {
                        if (!attrs[prop]) { continue; }
                        complated = attrs[prop] && complated;
                    }
                    if (!!complated) {
                        callback && callback.call(self.file, attrs);
                        clearInterval(timer);
                    }
                });
        }
    }
    //Uploader Context Class
    function FlowUploaderContext() {
        var self = this,
            options = $.extend(true, {
                testChunks: false,
                autoUpload: false,
                target: lanh.kdesignHost + 'upload',
                query: {
                    mediaType: 'Audio',
                    resType: 'TemplateRes',
                    resTypeNumber: Kdo.data.config.site.get().templateNumber,
                    //templateNumber: templateNumber,
                },
                headers: {
                    Token: sessionStorage.getItem('lanhKdesignToken')
                }
            }, arguments[0]);
        if (options.headers && options.headers.Token === false) {
            delete options.headers.Token;
        }

        //目的：如果上传的文件没有超过（业务的）限制大小则一次性上传即可
        //TODO：这样设置后可以跳过Flowjs的分块上传功能（由于现在的WebAPI的实现暂时无法支持分块上传功能），FlowJS库默认的是1024×1024，即时：默认是1MB1MB的分批次上传.
        //如果服务端支持，则需要删除这段代码
        if (options.limit && options.limit.size) {
            options.chunkSize = options.limit.size;
        }

        this.uploader = new Flow(options);


        var limit = options.limit || {
            size: false,
            filters: ''
        };

        this.uploader.on('fileAdded', function (file, event) {
            if (!!limit.filters) {
                var filters = limit.filters;
                if (!Array.isArray(filters)) filters = limit.filters.split(',');
                var canExtension = $.grep(filters, function (n) { return n == file.getExtension() }).length > 0;
                if (!canExtension) {
                    window.Kdo.messageService.info('当前操作不允许上传' + file.getExtension() + '文件。');
                    return false;
                }
            }

            if (limit.size !== false && file.size > limit.size) {
                window.Kdo.messageService.info('文件[' + file.name + ']大小[' + (file.size / 1024 / 1024).toFixed(2) + 'MB]已经超过了限制：' + Math.ceil(limit.size / 1024 / 1024) + 'MB.');
                return false;
            }
            _showLoading(file);
            if (!options.autoUpload) {
                options.added && options.added(file, event);
            }
        });

        var addedCounter = 1;
        this.uploader.on('fileSuccess', function (file, message) {
            _showLoading(file);
            if (!!message) {
                var response = JSON.parse(message);
                if (response && response.data) {
                    file.nowName = response.data.name;
                    file.nowSrc = response.data.path;
                }
                file.responsedObj = response;
            }
         
            if (!!options.autoUpload) {
                options.added && options.added(file, event);
                if (addedCounter == self.uploader.files.length) {
                    options.uploaded && options.uploaded(self.uploader.files, message);
                    _hideLoading();
                }
            }
            else {
                if (addedCounter == self.uploader.files.length) {
                    options.success && options.success(self.uploader.files, message);
                    Kdo.messageService.success("上传成功");
                }
            }
            addedCounter++;
        });
        this.uploader.on('fileError', function (file, message) {
            window.Kdo.messageService.error(JSON.parse(message).message);
        });

        this.uploader.on('filesSubmitted', function (addedFiles, message) {
            var _uploader = this;
            //超出10，则强行去掉10之后的数据 lina
            if (_uploader.files.length > 10) {
                Kdo.messageService.info("一次性最多添加10张图片");
                _uploader.files.length = 10;
            }
            if (!!options.autoUpload) {
                self.uploader.upload();
            }
            else {
                options.uploaded && options.uploaded(addedFiles, message, self);
            }
        });

      

        this.uploader.on("complete", function () {
            var _uploader = this;
            _uploader.files = [];
            addedCounter = 1;
        });

        this.init = function (target) {
            this.uploader.assignBrowse(target);
        }
    }

    //Form Add Context Class
    function LinkedUploaderContext() {
        var self = this,
            options = $.extend({}, arguments[0]);
        this.confirm = function (data) {
            $.ajax({
                url: lanh.apiHost + 'httpserver/kem/service/cms_video/add.html',
                headers: {
                    client_type: 'web'
                },
                method: 'post',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: 'json'
            })
            .success(function (result) {
                if (result.status == 0) {
                    window.Kdo.messageService.success(result.msg);
                } else {
                    window.Kdo.messageService.error(result.msg);
                }
                
                var result = options.uploaded && options.uploaded(data);
                if (result !== false) {
                    Kdo.modal.cancel($('.material-container.video-added'));
                }
            });
        }

        this.init = function (target) {
            $(target).on('click', function () {
                $.get(options.url)
                .success(function (result) {
                    openWindow({ title: options.title, template: result, width: 300 }, function () {
                        var formDom = $('.material-container.video-added');
                        formDom.find('#btn_confirm')
                            .on('click', function () {
                                var name = formDom.find('input[name="videoName"]').val(),
                                    link = formDom.find('input[name="videoLink"]').val(),
                                    poster = formDom.find('input#video-poster').val();
                                if (!poster || poster == "/public/images/no_image.jpg") {
                                    Kdo.messageService.info("视频封面不能为空");
                                    return false;
                                }else if (!name) {
                                    Kdo.messageService.info("视频名称不能为空");
                                    return false;
                                } else if (/^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(name) == false) {
                                    Kdo.messageService.info("视频名称只能包含中文、英文、数字、下划线等字符");
                                    return false;
                                } else if (!link) {
                                    Kdo.messageService.info("视频链接不能为空");
                                    return false;
                                } else if (!link.match(/(.mp4|.ogg|.webm)$/i)) {
                                    Kdo.messageService.info("只能添加以.mp4、.ogg、.webm的视频");
                                    return false;
                                }
                               
                                var length = 0;
                                for (var i = 0; i < name.length; i++) {
                                    if (name.charCodeAt(i) > 127) {
                                        if (length + 2 > 40) {
                                            break;
                                        }
                                        length += 2;
                                    } else {
                                        if (length + 1 > 20) {
                                            break;
                                        }
                                        length++;
                                    }
                                }
                                if (length > 20) {
                                    Kdo.messageService.info("视频名称最多输入20个字节");
                                    return false;
                                }


                                if (inputValid.validAll()) {
                                    self.confirm({
                                        'data': {
                                            'src_parent_id': Kdo.data.config.site.get().templateNumber,
                                            'src_name': name,
                                            "src_image": poster,
                                            'src_url': link,
                                            'src_is_web_url': 1
                                        }
                                    });
                                }
                            });
                        Kdo.upload.kcmsImage(true, formDom.find("[name='btnSelectImages']"), function (file) {
                            if (!!file && file.length > 0) {
                                formDom.find('img[name="videoPoster"]').attr("src", file[0].nowSrc);
                                formDom.find("input#video-poster").val(file[0].nowName)
                            }
                        });

                        inputValid.init({
                            formEl: formDom
                        });
                    });
                });
            });
        }
    }

    window.Kdo = $.extend(true, window.Kdo || {}, {
        upload: (function () {
            var fileUploader;

            //这个方法需要优化
            var getCommonWindowParams = function () {
                var options = $.extend(true, {}, arguments[0] || {}),
                    callback = arguments[arguments.length - 1];
                return {
                    window: {
                        ajax: true,
                        title: options.title,
                        url: 'views/common/upload/manage-upload-common.tpl.html'
                    },
                    target: '#btn_upload',
                    dataContext: options.dataContext || new SimpleUploadDataContext({
                        ajaxLoadList: options.ajaxLoadList,
                        mediaType: options.mediaType,
                        apply: callback
                    })
                }
            },
            simpleFileAdded = function (file) {
                new FileEncode()
                    .encode(file)
                    .fail(function (fileData) {
                        $.extend(fileData, {
                            id: this.uniqueIdentifier,
                            title: this.nowName || this.name,
                            suffix: this.getExtension(),
                            obj: this,
                            src: this.nowSrc || fileData.src || ''
                        });
                        fileUploader.dataContext.add(fileData);
                    })
            };

            return {
                material: function (callback) {
                    var paras = arguments[arguments.length - 1];
                    fileUploader = new FileUpload({
                        window: {
                            ajax: true,
                            title: '上传图片',
                            url: 'views/common/upload/material-image.tpl.html'
                        },
                        target: '#btn_addImage',
                        path: paras.path,
                        submit: function () {
                            fileUploader.uploaderContext.uploader.upload();
                        }
                    })
                    .any($.extend(true, {
                        limit: {
                            size: 2097152,
                            filters: 'png,gif,jpg,jpeg,bmp'
                        },
                        query: {
                            resType: 'TemplateRes',
                            mediaType: 'Image'
                        },
                        //由于上传文件的动作是异步的，所以代码里的控制逻辑为：所以文件真正上传完之后再调用回调函数
                        success: function () {
                            callback && callback();
                        }
                    }, (function () { delete paras.path; return paras; })()));
                },
                image: function (callback) {
                    var self = this,
                        options = arguments[arguments.length - 1];
                    fileUploader = new FileUpload(getCommonWindowParams({
                        title: '选择图片',
                        mediaType: 'Image',
                        ajaxLoadList: options.ajaxLoadList
                    }, callback)).any($.extend(true, {
                        limit: {
                            size: 2097152,
                            filters: 'png,gif,jpg,bmp'
                        },
                        autoUpload: true,
                        added: simpleFileAdded,
                        query: {
                            resType: 'TemplateRes',
                            mediaType: 'Image'
                        }
                    }, options || {}));
                },
                audio: function (callback) {
                    var self = this;
                    fileUploader = new FileUpload(getCommonWindowParams({ title: '选择音频', mediaType: 'Audio' }, callback)).any({
                        limit: {
                            size: 5242880,
                            filters: 'mp3,wav'
                        },
                        autoUpload: true,
                        added: simpleFileAdded,
                        query: {
                            resType: 'TemplateRes',
                            mediaType: 'Audio'
                        }
                    });
                },
                video: function (callback) {
                    var self = this;
                    fileUploader = new FileUpload($.extend(getCommonWindowParams({
                        title: '选择视频', dataContext: new KCmsUploadDataContext({
                            apply: callback,
                            mediaType: 'Video'
                        })
                    }, callback))).video();
                },
                removeItem: function (id) {
                    if (fileUploader) {
                        fileUploader.dataContext.remove(id);
                        var _fileFlow = _.findWhere(fileUploader.uploaderContext.uploader.files, { uniqueIdentifier: id });
                        if (!!_fileFlow) fileUploader.uploaderContext.uploader.removeFile(_fileFlow);
                    }
                },
                kcmsImage: function (singleFile, button, callback) {
                    var self = this,
                        options = arguments[arguments.length - 1];
                    fileUploader = new FileUpload().image(singleFile, button, callback);
                }
            }
        })()
    });

    var _showLoading = function (file) {
        if ($(".loading-container").length == 0) {
            $("body").append("<div class=\"loading-container\"><div class=\"loading-loader\"><div class=\"loader\"><div class=\"loader-inner pacman\"><div></div><div></div><div></div><div></div><div></div></div></div></div></div>");
        }
        if (!!file) {
            $(document.body).css({
                overflow: 'hidden'
            });
            $('.loading-container').css({
                display: 'table-cell',
                height: '100%'
            }).show();
        }
    }
    var _hideLoading = function () {
        $(document.body).css({
            "overflow-y": 'scroll'
        });
        $('.loading-container').hide();
    }

});