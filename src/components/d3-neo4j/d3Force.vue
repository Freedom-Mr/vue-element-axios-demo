<template>
  <div class="graphDiv"></div>
</template>

<script>
  import * as d3 from "d3"; //d3
  import dataTest from "./script/data";
  import imgTest from "./svg/id.svg";
  import { scaleOrdinal } from "d3-scale"; //d3 插值器

  export default {
    //父组件传入的class 参数
    props: {
      className: {
        type: String,
        default: "d3svg"
      }
    },
    //参数
    data() {
      return {
        neo4jData: "",
        width: 0,
        height: 0,
        container: undefined, //容器
        graph: undefined, //图
        info: undefined, //信息
        node: undefined, //节点标签array
        circle: undefined, // 信息圆饼
        nodes: undefined, //节点 数据jsonarray
        relationship: undefined, //关系标签array

        relationshipOutline: undefined, //关系外线
        relationshipOverlay: undefined, //关系覆盖
        relationshipText: undefined, //关系文字
        relationships: undefined, //关系 数据jsonarray
        simulation: undefined, //力量布局
        svg: undefined, //svg
        svgNodes: undefined, //svg 节点根标签 g
        svgRelationships: undefined, //svg关系根标签

        ctrlArr: [], //中间存储的数组
        options: {
          arrowSize: 4, // 箭头尺寸
          zoomFit: true, // 变焦适合
          nodeRadius:25,
        }
      };
    },
    //初始化
    beforeCreate() {
      this.$nextTick(() =>{
        window.addEventListener("resize", this.resizeCanvas);
        // 调整绘图大小
        this.resizeCanvas();
        // 初始化元素
        this.containerInit();
        //初始化布局
        this.simulation = this.initSimulation();
        //加载数据
        this.loadNeo4jData();
      });
    },
    methods: {
      /**
       * 重置绘图大小
       */
      resizeCanvas() {
        this.width = this.$el.offsetWidth;
        this.height = this.$el.offsetHeight;
      },
      /**
       * 初始化元素
       */
      containerInit() {
        let that = this;
        //实例化容器
        this.container = d3.select(".graphDiv");
        this.container.html("");
        //svg 容器
        this.svg = this.container
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .attr("class", this.className)
          .call(
            d3
              .zoom()
              .scaleExtent([1 / 2, 12])
              .on("zoom", this.zoom)
          )
          .on("dblclick.zoom", null) // 取消双击缩放
          .on("click", function() {
            // svg绘图空间点击事件
            // 取消 单选和多选
            if (
              that.node &&
              that.node._groups &&
              that.node._groups[0] &&
              that.node._groups[0].length > 0
            ) {
              that.node.each(function(d) {
                d.multiSelected = false;
                d.previouslySelected = false;
              });
              that.node.classed("multiSelected", false);
            }
          })
          .append("g")
          .attr("width", this.width)
          .attr("height", this.height);
        this.svgRelationships = this.svg
          .append("g")
          .attr("class", "relationships");
        this.svgNodes = this.svg.append("g").attr("class", "nodes");
      },
      zoom() {
        //设置鼠标缩放
        this.svg.attr("transform", d3.event.transform);
      },
      //初始化布局
      initSimulation() {
        let simulation = d3
          .forceSimulation()
          .force(
            "collide",
            d3
              .forceCollide()
              .radius(45)
              .iterations(20)
          )
          .force(
            "link",
            d3
              .forceLink()
              .id(function(d) {
                return d.id;
              })
              .distance(115)
          )
          .force("charge", d3.forceManyBody().distanceMax(1))
          .force("center", d3.forceCenter(this.width / 2, this.height / 2));
        return simulation;
      },
      //加载数据
      loadNeo4jData() {
        let that = this;
        this.nodes = [];
        this.relationships = [];
        that.neo4jData = dataTest;
        this.updateWithNeo4jData(that.neo4jData);

      },
      /**
       * 布局实时监测内元素位置
       */
      ticked() {
        let that = this;
        this.tickNodes(); // 实时节点监测
        that.tickRelationships(); //实时关系监测
        that.tickCircle(); // 实时监测圆饼位置
      },
      /**
       * 监测节点
       */
      tickCircle() {
        let that = this;
        if (that.circle) {
          if (that.nodes) {
            let node = that.nodes.filter(function(d) {
              return d.selected;
            });
            if (node[0] && node[0].x && node[0].y) {
              that.circle.attr("transform", function() {
                return "translate(" + node[0].x + ", " + node[0].y + ")";
              });
            }
          }
        }
      },
      /**
       * 旋转
       * @param {*} source
       * @param {*} target
       */
      rotation(source, target) {
        return (
          (Math.atan2(target.y - source.y, target.x - source.x) * 180) / Math.PI
        );
      },
      /**
       * 监测关系线
       */
      tickRelationships() {
        if (this.relationship) {
          let that = this;
          this.relationship.attr("transform", function(d) {
            let angle = that.rotation(d.source, d.target);
            return (
              "translate(" +
              d.source.x +
              ", " +
              d.source.y +
              ") rotate(" +
              angle +
              ")"
            );
          });
          this.tickRelationshipsTexts(); //监测关系文字
          this.tickRelationshipsOutlines(); //监测关系外部线
        }
      },
      /**
       * 关系文字监测
       */
      tickRelationshipsTexts() {
        let that = this;
        this.relationshipText.attr("transform", function(d) {
          let angle = (that.rotation(d.source, d.target) + 360) % 360,
            mirror = angle > 90 && angle < 270,
            center = {
              x: 0,
              y: 0
            },
            n = that.unitaryNormalVector(d.source, d.target),
            nWeight = mirror ? 2 : -3,
            point = {
              x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight,
              y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight
            },
            rotatedPoint = that.rotatePoint(center, point, angle);

          return (
            "translate(" +
            rotatedPoint.x +
            ", " +
            rotatedPoint.y +
            ") rotate(" +
            (mirror ? 180 : 0) +
            ")"
          );
        });
      },
      /**
       * 统一正常导航
       *
       * @param {*}source
       * @param {*}target
       * @param {*}newLength
       */
      unitaryNormalVector(source, target, newLength) {
        let center = {
            x: 0,
            y: 0
          },
          vector = this.unitaryVector(source, target, newLength);

        return this.rotatePoint(center, vector, 90);
      },
      /**
       * 旋转
       * @param {*} cx
       * @param {*} cy
       * @param {*} x
       * @param {*} y
       * @param {*} angle
       */
      rotate(cx, cy, x, y, angle) {
        let radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = cos * (x - cx) + sin * (y - cy) + cx,
          ny = cos * (y - cy) - sin * (x - cx) + cy;

        return {
          x: nx,
          y: ny
        };
      },
      /**
       * 统一导航
       *
       * @param {*}
       *            source
       * @param {*}
       *            target
       * @param {*}
       *            newLength
       */
      unitaryVector(source, target, newLength) {
        let length =
          Math.sqrt(
            Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
          ) / Math.sqrt(newLength || 1);

        return {
          x: (target.x - source.x) / length,
          y: (target.y - source.y) / length
        };
      },
      /**
       * 旋转节点
       * @param {*} c
       * @param {*} p
       * @param {*} angle
       */
      rotatePoint(c, p, angle) {
        return this.rotate(c.x, c.y, p.x, p.y, angle);
      },
      /**
       * 关系外部线监测
       */
      tickRelationshipsOutlines() {
        let that = this;
        this.relationship.each(function() {
          let rel = d3.select(this),
            outline = rel.select(".outline"),
            text = rel.select(".text"),
            nodeRadius = 10; //节点半径
          // bbox = text.node().getBBox(),
          // padding = 3;

          outline.attr("d", function(d) {
            let center = {
                x: 0,
                y: 0
              },
              angle = that.rotation(d.source, d.target),
              textBoundingBox = text.node().getBBox(),
              textPadding = 5,
              u = that.unitaryVector(d.source, d.target),
              textMargin = {
                x:
                  (d.target.x -
                    d.source.x -
                    (textBoundingBox.width + textPadding) * u.x) *
                  0.5,
                y:
                  (d.target.y -
                    d.source.y -
                    (textBoundingBox.width + textPadding) * u.y) *
                  0.5
              },
              n = that.unitaryNormalVector(d.source, d.target),
              rotatedPointA1 = that.rotatePoint(
                center,
                {
                  x: 0 + (nodeRadius + 1) * u.x - n.x,
                  y: 0 + (nodeRadius + 1) * u.y - n.y
                },
                angle
              ),
              rotatedPointB1 = that.rotatePoint(
                center,
                {
                  x: textMargin.x - n.x,
                  y: textMargin.y - n.y
                },
                angle
              ),
              rotatedPointC1 = that.rotatePoint(
                center,
                {
                  x: textMargin.x,
                  y: textMargin.y
                },
                angle
              ),
              rotatedPointD1 = that.rotatePoint(
                center,
                {
                  x: 0 + (nodeRadius + 1) * u.x,
                  y: 0 + (nodeRadius + 1) * u.y
                },
                angle
              ),
              rotatedPointA2 = that.rotatePoint(
                center,
                {
                  x: d.target.x - d.source.x - textMargin.x - n.x,
                  y: d.target.y - d.source.y - textMargin.y - n.y
                },
                angle
              ),
              rotatedPointB2 = that.rotatePoint(
                center,
                {
                  x:
                    d.target.x -
                    d.source.x -
                    (nodeRadius + 1) * u.x -
                    n.x -
                    u.x * that.options.arrowSize,
                  y:
                    d.target.y -
                    d.source.y -
                    (nodeRadius + 1) * u.y -
                    n.y -
                    u.y * that.options.arrowSize
                },
                angle
              ),
              rotatedPointC2 = that.rotatePoint(
                center,
                {
                  x:
                    d.target.x -
                    d.source.x -
                    (nodeRadius + 1) * u.x -
                    n.x +
                    (n.x - u.x) * that.options.arrowSize,
                  y:
                    d.target.y -
                    d.source.y -
                    (nodeRadius + 1) * u.y -
                    n.y +
                    (n.y - u.y) * that.options.arrowSize
                },
                angle
              ),
              rotatedPointD2 = that.rotatePoint(
                center,
                {
                  x: d.target.x - d.source.x - (nodeRadius + 1) * u.x,
                  y: d.target.y - d.source.y - (nodeRadius + 1) * u.y
                },
                angle
              ),
              rotatedPointE2 = that.rotatePoint(
                center,
                {
                  x:
                    d.target.x -
                    d.source.x -
                    (nodeRadius + 1) * u.x +
                    (-n.x - u.x) * that.options.arrowSize,
                  y:
                    d.target.y -
                    d.source.y -
                    (nodeRadius + 1) * u.y +
                    (-n.y - u.y) * that.options.arrowSize
                },
                angle
              ),
              rotatedPointF2 = that.rotatePoint(
                center,
                {
                  x:
                    d.target.x -
                    d.source.x -
                    (nodeRadius + 1) * u.x -
                    u.x * that.options.arrowSize,
                  y:
                    d.target.y -
                    d.source.y -
                    (nodeRadius + 1) * u.y -
                    u.y * that.options.arrowSize
                },
                angle
              ),
              rotatedPointG2 = that.rotatePoint(
                center,
                {
                  x: d.target.x - d.source.x - textMargin.x,
                  y: d.target.y - d.source.y - textMargin.y
                },
                angle
              );

            return (
              "M " +
              rotatedPointA1.x +
              " " +
              rotatedPointA1.y +
              " L " +
              rotatedPointB1.x +
              " " +
              rotatedPointB1.y +
              " L " +
              rotatedPointC1.x +
              " " +
              rotatedPointC1.y +
              " L " +
              rotatedPointD1.x +
              " " +
              rotatedPointD1.y +
              " Z M " +
              rotatedPointA2.x +
              " " +
              rotatedPointA2.y +
              " L " +
              rotatedPointB2.x +
              " " +
              rotatedPointB2.y +
              " L " +
              rotatedPointC2.x +
              " " +
              rotatedPointC2.y +
              " L " +
              rotatedPointD2.x +
              " " +
              rotatedPointD2.y +
              " L " +
              rotatedPointE2.x +
              " " +
              rotatedPointE2.y +
              " L " +
              rotatedPointF2.x +
              " " +
              rotatedPointF2.y +
              " L " +
              rotatedPointG2.x +
              " " +
              rotatedPointG2.y +
              " Z"
            );
          });
        });
      },
      /**
       * 实时监测点坐标
       */
      tickNodes() {
        if (this.node) {
          this.node.attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
          });
        }
      },
      /**
       * 更新neo4j数据
       * @param {*} neo4jData
       */
      updateWithNeo4jData(neo4jData) {
        let d3Data = this.neo4jDataToD3Data(neo4jData); //neo4j数据转换为d3数据
        //处理数据
        console.log('123',d3Data)
        if (d3Data) {
          this.updateWithD3Data(d3Data); //更新d3数据
        }
      },
      /**
       * 包含方法判断
       * @param {*}array
       * @param {*}id
       */
      contains(array, id) {
        let filter = array.filter(function(elem) {
          return elem.id === id;
        });
        return filter.length > 0;
      },
      /**
       * neo4j数据转d3数据
       * @param {*} data
       */
      neo4jDataToD3Data(data) {
        let graph = {
          nodes: [],
          relationships: []
        };
        if (data) {
          let that = this;
          data.results.forEach(function(result) {
            result.data.forEach(function(data) {
              if (data.graph.nodes && data.graph.nodes.length > 0) {
                data.graph.nodes.forEach(function(node) {
                  if (!that.contains(graph.nodes, node.id)) {
                    // 比对是否包含
                    node.labels = node.labels.filter(function(d) {
                      return d.indexOf("user_") === -1;
                    });
                    node.selected = false; // 设置节点未被单选
                    node.multiSelected = false; // 设置节点未被多选
                    graph.nodes.push(node);
                  }
                });
              }
              if (
                data.graph.relationships &&
                data.graph.relationships.length > 0
              ) {
                data.graph.relationships.forEach(function(relationship) {
                  relationship.source = relationship.startNode;
                  relationship.target = relationship.endNode;
                  relationship.selected = false; // 设置线未被单选
                  relationship.multiSelected = false; // 设置线未被多选
                  graph.relationships.push(relationship);
                });

                data.graph.relationships.sort(function(a, b) {
                  // 排序
                  if (a.source > b.source) {
                    return 1;
                  } else if (a.source < b.source) {
                    return -1;
                  } else {
                    if (a.target > b.target) {
                      return 1;
                    }

                    if (a.target < b.target) {
                      return -1;
                    } else {
                      return 0;
                    }
                  }
                });
                for (let i = 0; i < data.graph.relationships.length; i++) {
                  if (
                    i !== 0 &&
                    data.graph.relationships[i].source ===
                    data.graph.relationships[i - 1].source &&
                    data.graph.relationships[i].target ===
                    data.graph.relationships[i - 1].target
                  ) {
                    data.graph.relationships[i].linknum =
                      data.graph.relationships[i - 1].linknum + 1;
                  } else {
                    data.graph.relationships[i].linknum = 1;
                  }
                }
              }
            });
          });
        }
        return graph;
      },
      /**
       * 更新d3数据
       * @param {*} d3Data
       */
      updateWithD3Data(d3Data) {
        this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
      },
      /**
       * 更新节点和关系
       * @param {*} n
       * @param {*} r
       */
      updateNodesAndRelationships(n, r) {
        this.updateRelationships(n, r); //更新关系
        this.updateNodes(n); //更新节点
        this.simulation.nodes(this.nodes).on("tick", this.ticked); //布局添加 节点
        this.simulation.force("link").links(this.relationships); //布局添加 关系
        this.simulation.alphaTarget(0.01).restart();
        if (this.circle) {
          // 判断是否已存在半圆，如果存在则删除
          this.circle.remove();
        }
      },
      /**
       * 更新节点
       * @param {*} n
       */
      updateNodes(n) {
        let that = this;
        let nodeArr = [];
        that.nodes.forEach(d => {
          //过滤已有关系线
          n.forEach(v => {
            if (v.id === d.id) {
              nodeArr.push(v);
            }
          });
        });
        nodeArr.forEach(d => {
          n.splice(n.indexOf(d), 1);
        });
        //通过类别进行排序

        Array.prototype.push.apply(this.nodes, n);
        this.node = this.svgNodes
          .selectAll(".node")
          .data(this.nodes.filter(d => d.id && !d.type));
        let nodeEnter = this.appendNodeToGraph(); //添加节点到图
        this.node = nodeEnter.merge(this.node);
      },
      /**
       * 添加节点到图
       */
      appendNodeToGraph() {
        let n = this.appendNode(); //添加节点
        this.appendTextToNode(n); //节点添加文字
        return n;
      },
      /**
       * //节点添加文字
       */
      appendTextToNode(node) {
        let that =this;
        /**
         * 节点单击方法
         */
        function clickNode(d) {
          debugger
          console.log(typeof that.onNodeClick)
          if (typeof that.onNodeClick === "function") {
            that.onNodeClick(d);
          }
        }
        /**
         * 鼠标覆盖
         */
        function mouseOver(d) {
          // d3.select(this).style("fill", "black");
          if (that.info) {
            that.updateInfo(d);
          }
        }
        /**
         * 鼠标移除
         */
        function mouseOut(d) {
          // d3.select(this).style("fill", function(d) {
          //   that.color(d.properties.pagerank);
          // });
          // d3.select(this).style("stroke", d => that.color(d.properties.pagerank));
          if (that.info) {
            // 如果有选中的节点 则显示其节点的内容 ，反之 则清除内容
            let relationship = that.relationship.filter(function(d) {
              return d.selected === true;
            });
            if (relationship.data().length > 0) {
              that.updateInfo(relationship.data()[0]);
            } else {
              that.clearInfo(d);
            }
          }
        }
        node
          .append("text")
          .attr('fill', '#fff')
          //.attr('font-weight', 'bolder')
          .attr('font-size', function (d) {
            return '10px';
          })
          .attr('pointer-events', 'none')
          .attr('text-anchor', 'middle')
          .attr('y', function (d) {
            return '20px';
          })
          .html(d => 123);

        node
          .append("g")
          .attr("class", "img")
          .append('image')
          .attr('height', function (d) {
            return '25px';
          })
          .attr('width', function (d) {
            return '25px';
          })
          .attr('x', function (d) {
            return '-13px';
          })
          .attr('xlink:href', function (d) { //根据图片路径加载对应的图片
            //return d.img;
            return imgTest;
          })
          .attr('y', function (d) {
            return '-20px';
          });

        node
          .append("circle")
          .attr("class", "nodecircle")
          .attr("r", 30)
          .attr("fill", 'transparent')
          //.attr("stroke", d => that.color(d.properties.pagerank))
          .on("click", clickNode)
          .on("mouseover", mouseOver)
          .on("mouseout", mouseOut);

      },
      /**
       * 节点返回
       * @param {*}d
       */
      stickNode(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        let that = this;
        if (d.selected || d.multiSelected) {
          that.node
            .filter(function(d) {
              return d.multiSelected;
            })
            .each(function(d) {
              d.fx += d3.event.dx;
              d.fy += d3.event.dy;
            });
        }
      },
      /**
       * 节点返回
       * @param {*}d
       */
      stickCircle(node) {
        if (this.circle && node.x && node.y) {
          this.circle.attr("transform", function() {
            return "translate(" + node.x + ", " + node.y + ")";
          });
        }
      },
      /**
       * 添加节点
       */
      appendNode() {
        let that = this;
        /**
         * 节点拖拽结束事件
         * @param {*} d
         */
        let dragEnded = function() {
          d3.event.subject.active = false;
          if (!d3.event.active) that.simulation.alphaTarget(0);
        };
        /**
         * 节点拖拽中事件
         * @param {*} d
         */
        let dragged = function(d) {
          // d3.event.subject.fx = d3.event.x;
          // d3.event.subject.fy = d3.event.y;
          //实时监听拖拽节点
          that.stickNode(d);
          that.stickCircle(d);
        };
        /**
         * 节点拖拽开始事件
         * @param {*} d
         */
        let dragStarted = function(d) {
          if (!d3.event.active) that.simulation.alphaTarget(0.3).restart();
          // d3.event.subject.fx = d3.event.subject.x;
          // d3.event.subject.fy = d3.event.subject.y;
          if (d.selected || d.multiSelected) {
            that.node
              .filter(function(d) {
                return d.multiSelected;
              })
              .each(function(d) {
                // d.fixed |= 2;
                d.fx = d.x;
                d.fy = d.y;
              });
          } else {
            d.fx = d.x;
            d.fy = d.y;
          }
        };
        let dragsubject = function() {
          return that.simulation.find(d3.event.x, d3.event.y);
        };

        let node = this.node
          .enter()
          .append("g")
          .attr("class", "node");

        node.call(
          d3
            .drag()
            .subject(dragsubject)
            .on("start", dragStarted) //节点拖拽开始事件
            .on("drag", dragged) //节点拖拽中事件
            .on("end", dragEnded)
        ); //节点拖拽结束事件
        return node;
      },
      /**
       * 鼠标进入节点方法
       * @param {*}d
       */
      onNodeMouseEnter(d) {
        let that = this;
        // 高亮所选节点相连的线的功能
        that.relationship.classed("hover", false);
        that.relationship.classed("hover", function(p) {
          return (p.hover = d === p.source || d === p.target);
        });
      },
      /**
       * 节点单击事件
       */
      // let ctrlArr = [];//多选节点后放入数组中
      // 多选节点后放入数组中 初始值 用于多节点查询
      onNodeClick(d) {

        let that = this;
        that.onNodeMouseEnter(d); // 节点相连的关系高亮
        // ctrl 多选功能
        if (d3.event.ctrlKey || d3.event.metaKey) {
          // metaKey : 按住 或 持续
          d.selected = false;
          if (that.ctrlArr.length > 0 && !that.ctrlArr[0].multiSelected) {
            // 如果
            // 数组长度大于0，同时第一个元素的多选属性为false
            // 则说明是单选操作，则情况数组
            that.ctrlArr = [];
          }
          that.node.classed("selected", false); // 取消单选效果
          that.node
            .filter(function(p) {
              p.selected = false;
              return d === p;
            })
            .classed("multiSelected", function(d) {
              // 如果当前元素是多选状态 则删除该元素
              if (d.multiSelected) {
                that.ctrlArr.splice(that.ctrlArr.indexOf(d), 1);
              } else {
                // 反之则增加该元素
                that.ctrlArr.push(d);
              }
              return (d.multiSelected = !d.multiSelected);
            });
          d3.event.stopImmediatePropagation();
        } else if (
          (!d.selected && d.multiSelected) ||
          (!d.selected && !d.multiSelected)
        ) {
          // 单元操作 每次都清空元素 再添加，保持只存在一个元素
          that.ctrlArr = [];
          that.ctrlArr.push(d);

          d.multiSelected = false;
          that.node.filter(function(p) {
            p.multiSelected = false;
            return d === p;
          });
          that.node.classed("multiSelected", false); // 取消多选效果
          // 单选功能
          that.node.classed("selected", function(p) {
            return (p.selected = d === p);
          });
          this.appendCircle(d); // 添加半圆功能选择
        } else if (
          (d.selected && !d.multiSelected) ||
          (d.selected && d.multiSelected)
        ) {
          // 元素为选中效果， 则清空该数据
          that.ctrlArr = [];

          d.multiSelected = false;
          d.selected = !d.selected;
          that.node.filter(function(p) {
            p.multiSelected = false;
            return d === p;
          });
          that.node.classed("selected", false); // 取消单选效果
          that.node.classed("multiSelected", false); // 取消多选效果
        } else {
          this.appendCircle(d); // 添加半圆功能选择
        }
      },
      /**
       * 添加圆环选项 1.创建生成器 2.转化数据 3.绘制
       */
      appendCircle(d) {
        var that = this;
        var cirData = [{
          name: '解锁',
          title: '解锁'
        }, {
          name: '扩展',
          title: '扩展'
        }, {
          name: '删除',
          title: '删除'
        }]
        var data = [5, 5, 5]; //弧形分段数据
        var outerRadius = 80, //外弧度
          innerRadius = outerRadius / 2.5, //内弧度
          cornerRadius = 10; //中心角度
        var pie = d3.pie() //创建一个新的饼图生成器
          .padAngle(.02); //为填充的弧设置相邻弧之间的角度。
        var arc = d3.arc() //创建一个新的电弧发生器
          .padRadius(outerRadius)
          .innerRadius(innerRadius); //设置内半径。
        if (this.circle) { //判断是否已存在半圆，如果存在则删除
          this.circle.remove()
        }
        var svg = this.svg.append("g")
          .attr('class', 'nodeCircle')
          .attr("transform", "translate(" + d.x + "," + d.y + ")") //绘图的位置
          .on('mouseleave', function (d) { //节点鼠标离开事件
            if (that.circle) { //判断是否已存在半圆，如果存在则删除
              that.circle.remove()
            }
          })
        svg.selectAll("path")
          .data(pie(data)) //生成对应分区的圆饼 计算给定数据集的弧角
          .enter().append("path")
          .attr('fill', function (d) {
            switch (d.index) {
              case 0:
                return '#37bab7'
                break;
              case 1:
                return '#c9903e'
                break;
              case 2:
                return '#b7b927'
                break;
              case 3:
                return '#fe8767'
                break;
              case 4:
                return '#30c159'
                break;
              default:
                return '#30c159'
                break;
            }
          })
          .attr('name', function (d) {
            return cirData[d.index].name
          })
          .each(function (d, i) {
            //遍历 设置每个分区的属性
            addtext(svg, cirData, i)
            d.outerRadius = outerRadius - 20;
          })
          .attr("d", arc) //叠加圆弧
          .on("mouseover", arcTween(outerRadius - 5, 0))
          .on("click", arcClick)
          .on("mouseout", arcTween(outerRadius - 20, 150));
        this.circle = svg ////外环

        //圆弧单击事件
        function arcClick(d) {
          var thatArc = this
          var clickName = d3.select(thatArc).attr('name')

          if (clickName === '解锁') {
            var node = svgNode.filter(function (d) {
              return d.selected === true
            });
            let data2 = node.data();
            node.data()[0].fx = node.data()[0].fy = null;
          }
          else if (clickName === '删除') {
            setNow();

            var node = svgNode.filter(function (d) {
              return d.selected === true
            });
            var data2 = node.data();
            var link = svgLink.filter(function (d) {
              var falt = false;
              data2.forEach(function (f) {
                if (d.source.id === f.id || d.target.id === f.id) {
                  falt = true;
                }
              });
              // if (d.source.id === data2[0].id || d.target.id === data2[0].id) {
              //     falt = true;
              // }
              return falt;

            });
            var data3 = link.data();


            data2.forEach(function (d) {
              for (var i = 0, flag = true, len = nodes.length; i < len; flag ? i++ : i) {
                if (nodes[i] && nodes[i].id === d.id) {
                  nodes.splice(i, 1);
                  flag = false;
                } else {
                  flag = true;
                }
              }
            });
            data3.forEach(function (d) {
              for (var i = 0, flag = true, len = links.length; i < len; flag ? i++ : i) {
                if (links[i] && links[i].id === d.id) {
                  links.splice(i, 1);
                  flag = false;
                } else {
                  flag = true;
                }
              }
            });
            node.remove();
            link.remove();
            that.circle.remove();
            setFlag();

          }
          else if (clickName === '扩展') {
            setNow();
            console.log(flagArray);

            var node = svgNode.filter(function (d) {
              return d.selected === true
            });
            var data2 = node.data();
            var add = {
              "links": [{"id": a.toString(), "source": a.toString(), "target": data2[0].id, "text": "参与"}],
              "nodes": [{"id": a.toString(), "label": ["虚拟账号", "QQ群号"], "name": "645746", "type": "QQ群号", "value": a.toString()}]
            }

            a++;
            //2f3c53b1cce14fdc928792b15276794a
            drawGraph(add.nodes, add.links);
            simulation.restart();

            setFlag();

            // if (data2[0].related && JSON.stringify(data2[0].related) !== "[]") {
            //     extendNodeData = data2[0];
            //     layer.open({
            //         type: 2,
            //         //closeBtn: 0,
            //         area: ['400px', '260px'],
            //         skin: 'layui-layer-lan',
            //         title: '扩展类型',
            //         shade: [0.8, '#393D49'],
            //         shadeClose: false,
            //         fixed: true,
            //         offset: "200px",
            //         scrollbar: true,
            //         content: 'page/mod_5/mod_1/extend.html',
            //         end: function () {
            //         }
            //     });
            // } else {
            //     layer.msg('暂无数据', {time: 3000, icon: 0});
            // }
          } else if (clickName === '全体解锁') {
            simulation.restart();
            nodes.forEach(d => { //过滤已有关系线
              d.fx = d.fy = null;
            })
          } else if (clickName === '全体锁定') {
            simulation.stop();
          } else if (clickName === '其他') {
            console.log('其他了')
          }
        }

        //半圆增加文字
        function addtext(element, cirData, i) {
          debugger
          element.append('text')
            .attr('class', function (d) {
              return 'circleText' + i
            })
            .attr('transform', function (d) {
              switch (i) {
                case 0:
                  return 'rotate(65, -5 0)'
                  break;
                case 1:
                  return 'translate(-40,30)'
                  break;
                case 2:
                  return 'translate(-5,-35)'
                  break;
                case 3:
                  return 'rotate(250, -42 12)'
                  break;
                case 4:
                  return 'rotate(320, -20 -40)'
                  break;
                default:
                  return ''
                  break;
              }
            })
            .attr('fill', '#8bf1d7')
            .attr('font-size', function (d) {
              return '12.5px';
            })
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .attr('y', function (d) {
              // 计算 对应的文字的位置坐标
              var y = Math.sin(Math.PI / 180 * (360 / cirData.length) * (i - 0.8)) * 1.8 * 25
              return y + 'px';
            })
            .attr('x', function (d) {
              var x = Math.cos(Math.PI / 180 * (360 / cirData.length) * (i - 0.8)) * 1.8 * 25
              return x + 'px';
            })
            .html(function (d) {
              return cirData[i].name
            });
        }

        //鼠标hover变大效果
        function arcTween(outerRadius, delay) {
          return function () {
            d3.select(this)
              .transition()
              .delay(delay)
              .attrTween("d", function (d) {
                var i = d3.interpolate(d.outerRadius, outerRadius);
                return function (t) {
                  d.outerRadius = i(t);
                  return arc(d);
                };
              });
          };
        }
      },
      /**
       * 更新关系
       * @param {*} r
       */
      updateRelationships(n, r) {
        let relationsArr = [];
        this.relationships.forEach(d => {
          //过滤已有关系线
          r.forEach(v => {
            if (v.id === d.id) {
              relationsArr.push(v);
            }
          });
        });
        relationsArr.forEach(d => {
          //过滤已有关系线
          r.splice(r.indexOf(d), 1);
        });
        Array.prototype.push.apply(this.relationships, r);

        //创建数据关联的连线G
        this.relationship = this.svgRelationships
          .selectAll(".relationship")
          .data(this.relationships, function(d, i) {
            return i;
            // return d.id;
          });
        let relationshipEnter = this.appendRelationshipToGraph(); //添加关系线到图  //.data(this.relationships) 将d3 json格式数据，转换为对应的d3格式数据
        this.relationship = relationshipEnter.relationship.merge(
          this.relationship
        ); //d3格式数据 合并   this.relationship以及都是d3格式数据了
        this.relationshipOutline = this.svg.selectAll(".relationship .outline"); //添加外部关系线
        this.relationshipOutline = relationshipEnter.outline.merge(
          this.relationshipOutline
        );
        this.relationshipText = this.svg.selectAll(".relationship .text"); //添加关系文字
        this.relationshipText = relationshipEnter.text.merge(
          this.relationshipText
        );
      },
      /**
       * 添加关系线到图
       */
      appendRelationshipToGraph() {
        let relationship = this.appendRelationship(), //添加关系
          text = this.appendTextToRelationship(relationship), //添加关系文字
          outline = this.appendOutlineToRelationship(relationship); //添加外部关系线
        return {
          relationship: relationship,
          outline: outline,
          text: text
        };
      },
      /**
       * 添加外部关系线 如果是虚线 则显示为虚线
       * @param {*} r
       */
      appendOutlineToRelationship(r) {
        return (
          r
            .append("path")
            .attr("class", "outline")
            .attr("data-lineType", function() {
              return 0;
            })
            .attr("stroke", function() {
              return "#fff";
            })
            .attr("stroke-dasharray", function() {
              return "5,5";
            })
            .attr("stroke-linecap", function() {
              return "butt";
            })
            .attr("stroke-width", "1")
        );
      },
      /**
       * 添加关系
       */
      appendRelationship() {
        return this.relationship
          .enter()
          .append("g")
          .attr("class", "relationship");
      },
      /**
       * 添加关系文字
       * @param {*} r
       */
      appendTextToRelationship(r) {
        return r
          .append("text")
          .attr("class", "text")
          .attr("fill", "#fff")
          .attr("font-size", "8px")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
          .text(function(d) {
            return d.type;
          });
      },
      beforeDestroy() {
        window.removeEventListener("resize", this.resizeCanvas);
      }
    }
  };
</script>

<style scoped>
  .graphDiv {
    width: 100%;
    height: 100%;
  }
  .node {
    stroke-width: 2.5px;
    stroke-opacity: 0.5;
  }

  .link {
    fill: none;
    stroke: #bbb;
  }

  .nodetext {
    pointer-events: none;
    font: 10px sans-serif;
  }
</style>
