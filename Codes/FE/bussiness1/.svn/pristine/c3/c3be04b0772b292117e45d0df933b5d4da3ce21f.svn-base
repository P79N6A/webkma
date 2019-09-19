import * as d3 from 'd3';
export default class {
    constructor(config) {
        var defaults = {
            wrapId: '',
            width: 375, // 总画布svg的宽
            height: 610,
            dataset: [], //数据
            r: 30,      // 头像的半径 [30 - 45]
            linkColor: '#bad4ed',    //链接线默认的颜色
            strokeColor: '#7ecef4', // 头像外围包裹的颜色
            strokeDisableColor: '#ccc', // 屋子节点时头像外框颜色
            strokeWidth: 2 // 头像外围包裹的宽度
        };
        this.config = $.extend(true, defaults, config);
        this.prevPos = [0, 0];
    }

    setAttr(obj, json) {
        for (var key in json) {
            obj.attr(key, json[key]);
        }
    }

    //操作数据children
    optionChildren(t) {
        if (!!t.children) {
            t._children = t.children;
            t.children = null;
            t.data.closed = true;
        } else {
            t.children = t._children;
            t._children = null;
            t.data.closed = false;
        }
    }

    //数据转换，得到可作画的数据
    dataPretreatment() {
        let self = this;
        //创建一个树状图
        this.tree = d3.tree().size([360, 120]).separation(function (t, e) {
            return (t.parent == e.parent ? 1 : 2) / t.depth
        });
        //创建一个层级布局
        this.treeData = d3.hierarchy(self.config.dataset);

        // 数据开关状态初始化
        this.treeData.descendants().forEach(function (item, e) {
            item.data.closed = true === item.data.closed;
            item.data.closed && self.optionChildren(item);
        });


    }

    //创建容器等元素
    creatEle() {
        let self = this;
        d3.select('#' + self.config.wrapId).select('svg').remove();
        this.svg = d3.select('#' + self.config.wrapId).append('svg');
        this.setAttr(self.svg, {
            class: 'svg',
            width: self.config.width,
            height: self.config.height
        });
        this.gmind = this.svg.select('.gmind');
        if (this.gmind.length > 0) {
            this.gmind.empty();
        } else {
            this.gmind = this.svg.append('g').attr('class', 'gmind');
        };
        this.gmind.attr('transform', "translate(0 , 0)");
        this.glink = this.gmind.append('g').attr('class', 'glink').attr('transform', "translate(" + self.config.width / 2 + "," + self.config.height / 2 + ")");
        this.gnode = this.gmind.append('g').attr('class', 'gnode').attr('transform', "translate(" + self.config.width / 2 + "," + self.config.height / 2 + ")");
        let zoom = d3.zoom().scaleExtent([.7, 2]).translateExtent([[-.7 * self.config.width, -.7 * self.config.height], [1.7 * self.config.width, 1.7 * self.config.height]]).on("zoom", function () {
            let t = "scale(" + d3.event.transform.k + ")"
                , e = "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")";
            self.gmind.attr("transform", e + t);
        });
        this.svg.call(zoom);
    }

    // 坐标位置处理函数
    position(x, y) {
        let r = (x - 90) / 180 * Math.PI;
        return [y * Math.cos(r), y * Math.sin(r)];
    }


    nodes_redraw(nodes){
        let nodeUpdate = this.gnode.selectAll(".node")
            .data(nodes, function(d){
                return d.id;
            });

        //获取节点的enter部分
        let nodeEnter = nodeUpdate.enter();
        //获取节点的exit部分
        let nodeExit = nodeUpdate.exit();
        this.nodes_enter(nodeEnter);
        this.nodes_update(nodeUpdate);
        this.nodes_exit(nodeExit);
    }

    drawRootNode() {
        let self = this,
        firstNode = d3.select('.firstNode'),
        headImg = '';
        
        if(!firstNode.select('defs')._groups[0][0]){   
            let pattern = firstNode.append("defs").append("pattern")
            .attr("id", 'avatarRootNodeImg');
            this.setAttr(pattern, {
                "id": 'avatarRootNodeImg',
                "class": "patternclass",
                'patternUnits': 'objectBoundingBox',
                "x": "0",
                "y": "0",
                "width": "1",
                "height": "1"
            });
            headImg = pattern.append("image")
                .attr("xlink:href", self.config.dataset.face)
                .attr("src", self.config.dataset.face);

            this.setAttr(headImg, {
                "class": "rect",
                'patternUnits': 'objectBoundingBox',
                "width": 70,
                "height": 100,
                "background-color": "#fff",
                "preserveAspectRatio": "xMidYMin slice"
            });
            firstNode.append('rect').attr('x', function(d){
                return d.pos[0] - 35;
            }).attr('y', function(d){
                return d.pos[1] - 50;
            }).attr( 'fill', "#fff")
            .attr('width', 70)
            .attr('height', 100)
            .attr('rx', 5)
            .attr('ry', 5);

            firstNode.append('rect').attr('x', function(d){
                return d.pos[0] - 35;
            }).attr('y', function(d){
                return d.pos[1] - 50;
            }).attr( 'fill', "url(#avatarRootNodeImg)")
            .attr('width', 70)
            .attr('height', 100)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr("stroke-width", self.config.strokeWidth)
            .attr("stroke", self.config.strokeColor);
            
        }
    }

    nodes_enter (nodeEnter) {
        // 节点的 Enter 部分的处理办法
        let self = this
        , enterNodes = nodeEnter.append("g")
        , scalR = d3.scaleLinear().domain([0, 1, 5, 10]).range([30, 20, 10, 5]);

        enterNodes
        .attr("class", function (d) {
            if(!d.parent) {
                return 'firstNode node';
            }
            return 'node';
        })
        .attr("transform", function (d) {
            return "translate(" + (self.prevNode && self.prevNode.pos[0] || self.prevPos[0]) + "," + (self.prevNode && self.prevNode.pos[1] || self.prevPos[1]) + ")";
        })
        .attr('opacity', 0);
        
        this.defs = this.defs || this.gmind.append("defs");
        let patterns = ''
            , headImgArr = [];

        patterns = this.defs.selectAll("pattern.patternclass").data(self.nodes).enter().append("pattern")
            .attr("id", function (d, index) {
                return 'avatar' + d.data.userId || d.data.id;
            });
        this.setAttr(patterns, {
            "class": "patternclass",
            'patternUnits': 'objectBoundingBox',
            "x": "0",
            "y": "0",
            "width": "100%",
            "height": "100%"
        });

        headImgArr = patterns.append("image")
            .attr("xlink:href", function (d) {
                return d.data.face; // 修改节点头像
            })
            .attr("src", function (d) {
                return d.data.face; // 修改节点头像
            })
            .attr("width", function(d){
                return 40;
            })
            .attr("height", function(d){
                return 40;
            });

        this.setAttr(headImgArr, {
            "class": "circle",
            "preserveAspectRatio": "xMidYMin slice"
        });
        
        enterNodes.append("circle").attr("r", function(d){
            return scalR(d.depth);
        })
        .attr('cx', 0).attr('cy',0)
        .attr("fill", function (d) {
            return ("url(#avatar" + d.data.userId + ")");
        }).attr("stroke", function(d){
            if(d.children || d._children){
                return self.config.strokeColor;
            } else {
                return self.config.strokeDisableColor;
            }
        })
        .attr("stroke-width", self.config.strokeWidth)
        .on('mouseover', function (d) {
            if(d.children || d._children){
                d3.select(this).attr('stroke-width', 3);
                d3.select(this).attr('stroke', '#a3e5f9');
            } 
        })
        .on('mouseout', function (d) {
            if(d.children || d._children){
                d3.select(this).attr('stroke-width', self.config.strokeWidth);
                d3.select(this).attr('stroke', self.config.strokeColor);
            } 
        });

        this.drawRootNode();
        // this.gnode.selectAll('.oldDefs').transition().duration(600).remove();
        // defs.attr('class','oldDefs');

        enterNodes.transition()
        .duration(500)
        .attr("transform", function (d) {
            return "translate(" + d.pos[0] + "," + d.pos[1] + ")";
        })
        .attr('opacity', 1)
        enterNodes.on("click", function (d) {
            self.prevPos = d.pos;
            self.prevNode = d;
            self.optionChildren(d);
            self.redraw(d);
        });
    }

    nodes_update(nodeUpdate) {
        // 点的 Update 部分的处理办法
        let updateNodes = nodeUpdate.transition()
            .duration(500)
            .attr('opacity', 1)
            .attr("transform", function (d) {
                return "translate(" + d.pos[0] + "," + d.pos[1] + ")";
            });
    }

    nodes_exit(nodeExit) {
        //节点的 Exit 部分的处理办法
        let self = this;
        let exitNodes = nodeExit.transition()
            .duration(500)
            .attr("transform", function (d) {
                // return "translate(" + self.prevPos[0] + "," + self.prevPos[1] + ")";
                return "translate(" + (self.prevNode && self.prevNode.pos[0] || self.prevPos[0]) + "," + (self.prevNode && self.prevNode.pos[1] || self.prevPos[1]) + ")";
            })
            .remove();
        // let exitPatterns = this.defs.selectAll("pattern.patternclass").data(self.nodes).exit().transition()
        // .duration(500).remove();
    }
    
    links_redraw(links) {
        //获取连线的update部分
        let linkUpdate = this.glink.selectAll(".link")
            .data(links, function(t) {
                return t.target.id
            });

        //获取连线的enter部分
        let linkEnter = linkUpdate.enter();

        //获取连线的exit部分
        let linkExit = linkUpdate.exit();

        this.links_enter(linkEnter);
        this.links_update(linkUpdate);
        this.links_exit(linkExit);
    }
    
    getPath (t) {
        return "M" + t.source.x + "," + t.source.y + "C" + (t.source.x + t.target.x) / 2 + "," + t.source.y + " " + (t.source.x + t.target.x) / 2 + "," + t.target.y + " " + t.target.x + "," + t.target.y;
    };

    links_enter(linkEnter) {
        //连线的 Enter 部分的处理办法
        let self = this;
        let enterLinks = linkEnter.append('path');
        enterLinks
            .attr("class", "link")
            .attr("fill", "none").attr("stroke", self.config.linkColor).attr("stroke-width", 1)
            .attr('opacity', 0)
            .attr("transform", function (d) {
                return "translate(" + 0 + "," + 0 + ")";
            })
            .attr("d", function (d) {
                var r = {
                    x: (self.prevNode && self.prevNode.pos[0] || self.prevPos[0]),
                    y: (self.prevNode && self.prevNode.pos[1] || self.prevPos[1])
                };
                return self.getPath({
                    source: r,
                    target: r
                })
            })
            .transition()
            .duration(500)
            .attr('opacity', 1)
            .attr("d", function (d) {
                var e = {
                    x: d.source.pos[0],
                    y: d.source.pos[1]
                }
                , r = {
                    x: d.target.pos[0],
                    y: d.target.pos[1]
                };
                return "M" + e.x + "," + e.y + "L" + r.x + "," + r.y
            });
        !!self.config.onloadFn && self.config.onloadFn();
    }

    links_update(linkUpdate) {
        //连线的 Update 部分的处理办法
        let self = this;
        linkUpdate.transition()
            .duration(500)
            .attr("d", function (d) {
                var e = {
                    x: d.source.pos[0],
                    y: d.source.pos[1]
                }
                , r = {
                    x: d.target.pos[0],
                    y: d.target.pos[1]
                };
                return "M" + e.x + "," + e.y + "L" + r.x + "," + r.y
            });
    }

    links_exit(linkExit) {
        //连线的 Exit 部分的处理办法
        let self = this;
        linkExit.transition()
            .duration(500)
            .attr("d", function (d) {

                var r = {
                    x: (self.prevNode && self.prevNode.pos[0] || self.prevPos[0]),
                    y: (self.prevNode && self.prevNode.pos[1] || self.prevPos[1])
                }
                  , n = {
                    x: (self.prevNode && self.prevNode.pos[0] || self.prevPos[0]),
                    y: (self.prevNode && self.prevNode.pos[1] || self.prevPos[1])
                };
                return "M" + r.x + "," + r.y + "L" + n.x + "," + n.y
            })
            .remove();
    }

    //具体绘制方法
    redraw() {
        let self = this;
        //初始化树状图，也就是传入数据,并得到绘制树基本数据
        this.tree(self.treeData);
        // 得到边和节点（已经完成转换的）
        this.nodes = this.treeData.descendants();
        this.links = this.treeData.links();
        // nodes数据坐标位置处理
        this.nodes.forEach(function (node, i) {
            node.y = 120 * node.depth,
            node.pos = self.position(node.x, node.y);
        });
        
        // 生成唯一主键
        for (var e = 0; e < this.nodes.length; e++)
            this.nodes[e].id || (this.nodes[e].id = self.nodeKey,
            self.nodeKey++);
        for (var e = 0; e < this.links.length; e++)
            this.links[e].id || (this.links[e].id = self.linkKey,
            self.linkKey++);
        
        // 节点处理
        this.nodes_redraw(self.nodes);

        //  连线的处理
        this.links_redraw(self.links);

    }

    render() {
        this.nodeKey = 0;
        this.linkKey = 0;
        this.dataPretreatment();
        this.creatEle();
        this.redraw();
    }
}


