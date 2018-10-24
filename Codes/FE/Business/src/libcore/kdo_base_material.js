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
    //素材库
    'use strict';
    var templateString = '<li>'
        + '<div class="data-item bg-contain" style="background-image:url(${src})">'
        + '<div class="data-popup">'
        + '</div>'
        + '<span class="search-icon"><i class="fa fa-search-plus"></i></span>'
        + '<div class="image-view"><img title="点击查看原图" id="${number}" alt="${name}" src="${src}" /><div class="label-image" ><p>${name}</p><p>${width} × ${height}</p></div></div>'
        + '<span class="delete-icon"><a href="javascript:void(0);" onclick="Kdo.upload.removeItem(\'${id}\')"><i class="fa fa-times-circle"></i></a></span>'
        + '</div>'
        + '<div class="data-title" title="${name}">${name}</div>'
        + '</li>',
        menuTemplateString = '<li class="${cls}">'
            + '<a href="javascript:void(0)" id="btn_menu_${id}">${name}</a></li>',
        addMenuTemplateSstring = '<div class="col-sm-12" style="padding:20px 15px;"><label>文件夹名称</label><input type="text" id="folderName" class="form-control" maxLength="20" /></div>'
            + '<div style="bottom:10px;text-align:center;height:10px;"><button type="button" class="btn-first" id="btn_apply">确 定</button></div>',
        confirmCallback,
        pageSize = 15;

    //对文件夹名称验证
    $(function () {
        var sizeOf = function (str) {
            var b = 0,
                len = str.length,
                index = 0;

            if (len) {
                for (var i = 0; i < len; i++) {
                    b += (str.charCodeAt(i) > 0xff ? 2 : 1);
                    if (b > 20 && index === 0) {
                        index = i;
                    }
                }
                return { len: b, index: index };
            } else {
                return { len: 0, index: 0 };
            }
        }
        var regSpecialChar = /[^A-Za-z0-9]/gm,
            regChinese = /[\u4E00-\u9FA5]/gm;
        //regPageWidth = /[0-9]*-[0-9]*/gm,
        //regPageWidthSpecialChar = /[^0-9]/gm;
        $(document).on('input', '#folderName', function () {
            var value = $(this).val();

            var cr = value.match(regChinese);
            if (cr && cr.length > 0) {
                var clen = cr.length;
                for (var i = 0; i < clen; i++) {
                    value = value.replace(cr[i], '');
                }
                //$(this).val(value);
            }
            var sr = value.match(regSpecialChar);
            if (sr && sr.length > 0) {
                var slen = sr.length;
                for (var i = 0; i < slen; i++) {
                    value = value.replace(sr[i], '')
                }
                $(this).val(value);
            }
        });
        $(document).on('blur', '#folderName', function () {
            var value = $(this).val();
            //setElementStyle(minLength > 0 && value === '');

            var size = sizeOf(value);
            if ($(this).val() !== '' && size.len > 0) {
                if (size.len > 20) {
                    var val = value.substr(0, size.index);
                    $(this).val(val);
                    //updateModel(val);
                }
            }
        });
    })

    var queryString = function (paraName) {
        var hrefString = location.href.substring(location.href.indexOf('?') + 1),
            paras = hrefString.split('&');
        for (var i = 0, ii = paras.length; i < ii; i++) {
            if (paras[i].split('=')[0] === paraName) return paras[i].split('=')[1] || null;
        }
        return null;
    },
        getNodes = function () {
            var tree;
            if (!!$(".material-container .material-menu .tree-container").fancytree('instance')) {
                tree = $(".material-container .material-menu .tree-container").fancytree('getTree');
            }
            return tree;
        },
        getActiveNode = function (realFolder) {
            var tree = getNodes(),
                activeNode = null;
            if (!!tree) {
                activeNode = tree.getActiveNode();
                var _key = "";
                if (!!activeNode && !!activeNode.key) {
                    _key = activeNode.key;
                }
                if (!!tree && !!realFolder) {
                    switch (_key) {
                        case "":
                        case "RecentUpload":
                        case "TemplateImage":
                        case "ComponentImage":
                            //转向可上传的顶级目录
                            activeNode = _.filter(tree.rootNode.children, function (node) { return /UID\d*/.test(node.key) })[0];
                            break;
                    }
                }
            }
            return activeNode;
        },
        getCurrentFolderPath = function (realFolder) {
            var folderPathArray = [], currentNode = getActiveNode(realFolder);
            while (!!currentNode && currentNode.title !== 'root') {
                folderPathArray.push('<span>' + currentNode.title + '</span>');
                currentNode = currentNode.parent;
            }
            return folderPathArray.reverse().join('<span style="color:#bbb;">/</span>')
        },
        initMenu = function () {
            var newFolderBtn = $('.material-container .material-menu #btn_menu_add'),
                defaultMenus = [];

            newFolderBtn.on('click', function () {
                if ($(this).hasClass('disabled')) return false;

                var activeNode = getActiveNode();
                if (!!activeNode) {
                    openNewFolderWindow();
                }
            });

            $.post(lanh.kdesignHost + 'user/directory/list')
                .success(function (result) {
                    //根据当前编辑类型，判断素材库显示的文件夹。（稿件编辑显示网站图片，组件编辑显示组件图片）
                    var _type = !!Kdo.utils.url.queryString("type") ? Kdo.utils.url.queryString("type").toLowerCase() : Kdo.utils.url.queryString("type");
                    switch (_type) {
                        case "template":
                            //过滤组件图片文件夹
                            result.dataList = _.filter(result.dataList, function (dataItem) { return dataItem.key != "ComponentImage" });
                            break;
                        case "component":
                            //过滤网站图片文件夹
                            result.dataList = _.filter(result.dataList, function (dataItem) { return dataItem.key != "TemplateImage" });
                            break;
                        default:
                            //过滤网站图片和组件图片
                            result.dataList = _.filter(result.dataList, function (dataItem) { return !(dataItem.key == "TemplateImage" || dataItem.key == "ComponentImage") });
                            break;
                    }
                    //默认选择第一个节点——“最近上传”的数据返回结构默认在第一个。
                    result.dataList[0].active = true;
                    result.dataList[0].focused = true;

                    $('.material-container .material-menu .tree-container').fancytree({
                        selectMode: 1,
                        autoActivate: true,
                        source: result.dataList,
                        select: function (event, data) {
                        },
                        activate: function (event, data) {
                            $(this).parents(".lanh-modal").find('.material-container .material-header #label-folder').html(getCurrentFolderPath());

                            var currentNode = getActiveNode(false);
                            if (currentNode.key !== "TemplateImage" && currentNode.key !== "ComponentImage" && currentNode.key !== "RecentUpload") {
                                $("#btn_menu_add").show();
                            } else {
                                $("#btn_menu_add").hide();
                            }

                            search();
                        }
                    });
                    search();
                });

            var openNewFolderWindow = function () {
                Kdo.modal.create({
                    title: '新建文件夹',
                    template: addMenuTemplateSstring,
                    width: 300,
                    height: 195
                });

                $('#btn_apply').on('click', function () {
                    var folderName = $('#folderName').val(),
                        activeNode = getActiveNode(),
                        queried = activeNode.children && activeNode.children.length && $.grep(activeNode.children, function (nodeItem) { return nodeItem.name === folderName });

                    if (!folderName) {
                        window.Kdo.messageService.info('请输入文件夹名称.');
                        return false;
                    }

                    if (queried && queried.length > 0) {
                        window.Kdo.messageService.info('文件夹名称重复.');
                        return false;
                    }

                    $.post(lanh.kdesignHost + 'user/directory', {
                        dirName: folderName,
                        parentDir: activeNode.key,
                    })
                        .success(function (result) {
                            if (!!result) {
                                activeNode.addChildren({
                                    key: result.number,
                                    title: result.dirName,
                                    folder: true
                                });
                            }
                        })
                        .error(function (result) {
                            window.Kdo.messageService.info(JSON.parse(result.responseText).message);
                            return false;
                        });

                    Kdo.modal.cancel($('#btn_apply'));
                });
            }
        },
        initEvent = function () {
            $('.material-container #btn_upload').on('click', openUploadWindow);
            $('.material-container #btn_confirm').on('click', confirm);
            $('.material-container #btn_search').on('click', search);
            $('.material-container #dropSortBy').on('change', search);

            //TODO: 这里不应该从全局查找，后续需要改进。(added by Dyllon)
            $('.material-container .material-pagination:last').pagination({
                items: 1,
                itemsOnPage: pageSize,
                displayedPages: 3,
                prevText: '上一页',
                nextText: '下一页',
                cssStyle: 'blue-theme',
                hrefTextPrefix: 'javascript:void(0)',
                ellipsePageSet: false,
                onPageClick: function (pageIndex) {
                    load(pageIndex, getCondition());
                    return false;
                }
            });
        },
        getOffsetDate = function (date, day, zeroTime) {
            var timeVal = new Date(date.getTime() + ((day || 0) * 86400000));
            if (zeroTime !== false) {
                timeVal = timeVal.toLocaleDateString() + ' 00:00:00';
            }

            return {
                now: date.toLocaleDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                val: timeVal
            }
        },
        getCondition = function (isUsed) {
            var activeNode = getActiveNode(),
                params = {
                    condition: {
                        number: null,
                        dirNumber: activeNode && activeNode.key,
                        title: null,
                        mediaType: 'Image',
                        resType: 'UserRes',
                        titleLike: $('#txtKeyWord').val(),
                        //createTimeFrom: dateRange.val,
                        //createTimeTo: dateRange.now
                    }
                }

            //最近上传设定fromDate为7天前
            if (activeNode.key == "RecentUpload") {
                var dateRange = getOffsetDate(new Date(), -7);
                params.condition.createTimeFrom = dateRange.val;
            }
            return params;
        },
        search = function () {
            load(1, getCondition());
        },
        load = function (index, paras) {
            $('.material-container .material-list').html('');
            var number = queryString('id'),
                url = lanh.kdesignHost + 'resource/list';

            if (paras && paras.condition) {
                switch (paras.condition.dirNumber) {
                    case "TemplateImage":
                        paras.condition.dirNumber = '';
                        paras.condition.resTypeNumber = number;
                        paras.condition.resType = 'TemplateRes';
                        break;
                    case "ComponentImage":
                        paras.condition.dirNumber = '';
                        paras.condition.resTypeNumber = number;
                        paras.condition.resType = 'ComponentRes';
                        break;
                    case "RecentUpload":
                        paras.condition.dirNumber = '';
                        paras.condition.resTypeNumber = '';
                        paras.condition.resType = 'UserRes';
                        break;
                }
            }

            var images = [],
                sortBy = $('#dropSortBy').val();

            $.ajax({
                offLoadingEffect: true,
                url: url,
                method: "POST",
                data: $.extend({
                    paging: {
                        pageIndex: index || 1,
                        pageSize: pageSize
                    },
                    sort: [{
                        sortField: sortBy.split('_')[0],
                        sortDirection: sortBy.split('_')[1]
                    }]
                }, paras),
                dataType: "json",
                success: function (result) {
                    images = result.dataList;
                    $('.material-container .material-pagination').pagination('updateItems', result.totalCount);
                    $('.material-container .material-pagination').pagination('drawPage', index);
                    render();
                }
            });

            var loadImageSize = function (imageDataItem, callback) {
                var img = new Image();

                // 如果图片被缓存，则直接返回缓存数据
                if (img.complete) {
                    callback && callback.call(imageDataItem, {
                        width: img.width,
                        height: img.height
                    });
                } else {
                    // 完全加载完毕的事件
                    img.onload = function () {
                        callback && callback.call(imageDataItem, {
                            width: img.width,
                            height: img.height
                        });
                    }
                    img.onerror = function () {
                        callback && callback.call(imageDataItem, {
                            width: 0,
                            height: 0
                        });
                    }
                }
            }

            //矫正浮动框的位置
            var regulatePosition = function (currentDom, parent, offset) {
                //边界值
                var offsetVal = offset || 100,//计算最后显示位置的偏移量
                    paddingVal = 10,//判断是否超出边界的偏移量
                    boundary = {
                        top: $(parent).offset().top,
                        left: $(parent).offset().left,
                        bottom: $(parent).offset().top + $(parent).height(),//50是标题的高度
                        right: $(parent).offset().left + $(parent).width()
                    },
                    current = {
                        top: $(currentDom).offset().top,
                        left: $(currentDom).offset().left,
                        bottom: $(currentDom).offset().top + $(currentDom).height(),
                        right: $(currentDom).offset().left + $(currentDom).width()
                    },
                    difference = {
                        top: current.top - boundary.top,
                        left: current.left - boundary.left,
                        bottom: current.bottom - boundary.bottom,
                        right: current.right - boundary.right
                    };


                return {
                    top: function () {
                    },
                    left: function () {
                    },
                    right: function () {
                        if (difference.right + paddingVal > 0) {
                            var left = $(currentDom).position().left - (difference.right + offsetVal);
                            $(currentDom).css('left', left);
                        }
                        return this;
                    },
                    bottom: function () {
                        if (difference.bottom + paddingVal > 0) {
                            var top = $(currentDom).position().top - (difference.bottom + offsetVal);
                            $(currentDom).css('top', top);
                        }
                        return this;
                    }
                }
            }


            var render = function () {
                //TODO:有个bug：加载图片的时候是异步的，所以可能会导致排序功能错乱（图片大的肯定会后加载，会导致跟创建的是排序规则冲突）
                for (var i = 0, ii = (images || []).length; i < ii; i++) {
                    //TODO：
                    //1、由于前端通过JS获取图片大小是异步的，所以这个地方做了比较特殊的处理；
                    //2、$.tmpl是支持数组的，但由于此处需要绑定各种事件和异步加载图片处理，所以不能使用数组的方式进行渲染
                    // loadImageSize(images[i], function (imageSize) {
                    var dataItem = images[i];
                    dataItem.originalSrc = lanh.filePath.design + dataItem.file.split('\\').join('/');

                    var imageDom = $.tmpl(Kdo.MATERIAL_CELL_TEMPLATE, {
                        number: dataItem.number,
                        src: dataItem.originalSrc,
                        name: dataItem.title,
                        width: dataItem.width,
                        height: dataItem.height
                    }).appendTo('.material-container .material-list');

                    bindDataItemEvent(imageDom, dataItem);

                    //});
                }
            }

            var bindDataItemEvent = function (imageDom, dataItem) {
                $(imageDom).on('click', function (event) {
                    selectImage.call(imageDom, event, dataItem);
                });

                $(imageDom).hover(function () {
                    if (dataItem.width <= 0) {
                        $(this).find('.data-popup').hide();
                        $(this).find('.search-icon').hide();
                    }
                });

                $(imageDom).find('.search-icon').off('mouseenter')
                    .on('mouseenter', function () {
                        var viewDom = $(this).parent().find('.image-view'),
                            parentDom = $('.material-container').parent().parent();
                        if (dataItem.width <= 0) {
                            return false;
                        }
                        //为了不让浮动Div有闪烁的效果此处使用了 无效坐标 的方式来隐藏浮动块
                        $('.material-container .material-list').find('.image-view').not(viewDom).css({
                            top: '-20000px',
                            left: '-20000px'
                        });
                        viewDom.css({
                            top: '70px',
                            left: '-10px'
                        });
                        regulatePosition(viewDom, parentDom).bottom().right();

                        viewDom.off('mouseleave').on('mouseleave', function () {
                            $(this).css({
                                top: '-20000px',
                                left: '-20000px'
                            });
                        });

                        viewDom.off('click').on('click', function () {
                            Kdo.utils.asyncOpenWindow(childWindow => {
                                childWindow.location = dataItem.originalSrc;
                            });
                            return false;
                        });

                    });
            }


        },
        openWindow = function (callback) {
            confirmCallback = callback;
            $.get('views/common/upload/manage-material.tpl.html')
                .success(function (result) {
                    Kdo.modal.create({
                        title: '选择图片',
                        template: result,
                        width: 880
                    });
                    initMenu();
                    initEvent();
                });
        },
        showOwnedMenu = function () {
            $('.material-container #default-menu').hide();
            $('.material-container #owned-menu').show();
        },
        hideOwnedMenu = function () {
            $('.material-container #default-menu').show();
            $('.material-container #owned-menu').hide();
        },
        openUploadWindow = function (event) {
            if (!$(".tree-container").children().length) {
                return false;
            }
            //如果kcms_user为true，则判定当前是编辑人员操作。所以不用选择“真实文件夹”   Added by Dyllon 2016.06.08
            var _realFolder = !sessionStorage.getItem("kcms_user"),
                activeNode = getActiveNode(_realFolder),
                _resType = "";
            if (!!_realFolder) {
                _resType = "UserRes";
            } else {
                switch (Kdo.utils.url.queryString("type").toLowerCase()) {
                    case "component":
                        _resType = "ComponentRes";
                        break;
                    case "template":
                        _resType = "TemplateRes";
                        break;
                }
            }
            if (!activeNode) return false;

            Kdo.upload.material(function (files) {
                setTimeout(function () {
                    load(1, getCondition());
                }, 500);
            }, {
                    query: {
                        resType: _resType,
                        mediaType: 'Image',
                        dirNumber: activeNode.key
                    },
                    path: getCurrentFolderPath(_realFolder)
                });
        },
        confirm = function () {
            if (!selectedImage) {
                alert('请先选择图片');
                return false;
            }
            var activeNode = getActiveNode(),
                imageNumber = selectedImage.number,
                templateNumber = queryString('id');

            confirmCallback(selectedImage);
            cancel();

            //选择图片并运用到模块中才关联
            //$.post(lanh.kdesignHost + 'resource/install', { resourceNumber: imageNumber, templateNumber: templateNumber })
            //.success(function (result) {
            //    console.log('----success----');
            //    var result = confirmCallback && confirmCallback(result || {}, selectedImage);
            //    if (result !== false) {
            //        cancel();
            //    }
            //})
            //.error(function (result) { console.log('----error----'); console.error(result.responseText || result); })

        },
        cancel = function (target) {
            Kdo.modal.cancel($(target || $('.material-container #btn_confirm')));
        };

    var selectedImage;
    var selectImage = function (event, data) {
        selectedImage = data;

        $(this).parent().find('li.selected').removeClass('selected');
        $(this).addClass('selected');
    }


    window.Kdo = $.extend(true, window.Kdo || {}, {
        material: {
            open: openWindow,
            cancel: cancel
        },
        MATERIAL_CELL_TEMPLATE: templateString,
        MATERIAL_MENU_TEMPLATE: menuTemplateString
    });


});