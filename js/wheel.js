// This is a JavaScript file containing a bilevel partition with floating text layer
// Robert James Brennan 12357031
/* References

    https://gist.github.com/ezyang/4236639    Computing text roation
    http://nelsonslog.wordpress.com/2011/04/11/d3-scales-and-interpolation/  Scaling and interpolating
    http://bl.ocks.org/mbostock/5100636     ArcTween
    http://bl.ocks.org/mbostock/5944371     Bilevel partition D3js example
    http://www.asktheguru.info/kb/viewanswer/32033360/    function e i check if the animated element's data e lies within the visible angle span given in d if e

*/

function runWheel(){
     var width = $(document).innerWidth(),
        height = $(document).innerHeight(),
        radius = 0;
        
        width = width - (width * .05);
        height = height - (height * .05);
        
        //height = height - height/2;
        radius = Math.min(width, height)/2;
    
    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);
    
    var y = d3.scale.sqrt()
        .range([0, radius]);
    
    var color = d3.scale.ordinal().range(["#B87094","#CC0000","#FF3399","#FF6600","#CCCC00","#1975FF","#33CC33"]);;
    
    var svg = d3.select("#wheel").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ") rotate(-90 0 0)");
    
    var partition = d3.layout.partition()
        .value(function (d) {
        return d.size;
    });
    
    var arc = d3.svg.arc()
        .startAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
    })
        .endAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
    })
        .innerRadius(function (d) {
        return Math.max(0, y(d.y));
    })
        .outerRadius(function (d) {
        return Math.max(0, y(d.y + d.dy));
    });
    

    var root = getData();
    
    var g = svg.selectAll("g")
        .data(partition.nodes(root))
        .enter().append("g");
    
    var path = g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
        return color((d.children ? d : d.parent).name);
    })
        .on("click", click);
    

    var text = g.append("text")
        .attr("x", function (d) {
        return y(d.y);
    })
        .attr("font-family", "bold arial")
        .attr("font-size", "15px")
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .attr("transform", function (d) {
        return "rotate(" + computeTextRotation(d) + ")";
    })
        .text(function (d) {
        return d.name;
    })
        .style("fill", "white");
    
    function computeTextRotation(d) {
        var angle = x(d.x + d.dx / 2) - Math.PI / 2;
        return angle / Math.PI * 180;
    }
    
    function click(d) {
        // fade elements out of sight
        if (d.size !== undefined) {
            d.size += 100;
        };
        text.transition().attr("opacity", 0);
    
        path.transition()
            .duration(750)
            .attrTween("d", arcTween(d))
            .each("end", function (e, i) {
            // check if the animated element's data e lies within the visible angle span given in d
            if (e.x >= d.x && e.x < (d.x + d.dx)) {
                // get a selection of the associated text element
                var arcText = d3.select(this.parentNode).select("text");
                // fade in the text element and recalculate positions
                arcText.transition().duration(750)
                    .attr("opacity", 1)
                    .attr("transform", function () {
                    return "rotate(" + computeTextRotation(e) + ")"
                })
                    .attr("x", function (d) {
                    return y(d.y);
                });
            }
        });
    } //});
    
    // Word wrap!
    var insertLinebreaks = function (t, d, width) {
        alert(0)
        var el = d3.select(t);
        var p = d3.select(t.parentNode);
        p.append("g")
            .attr("x", function (d) {
            return y(d.y);
        })
        
        .attr("transform", function (d) {
            return "rotate(" + computeTextRotation(d) + ")";
        })
        //p
        .append("foreignObject")
            .attr('x', -width / 2)
            .attr("width", width)
            .attr("height", 100)
            .append("xhtml:p")
            .attr('style', 'word-wrap: break-word; text-align:center;')
            .html(d.name);
        alert(1)
        el.remove();
        alert(2)
    };
    

    
    
    d3.select(self.frameElement).style("height", height + "px");
    
    // Interpolate the scales!
    function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function (d, i) {
            return i ? function (t) {
                return arc(d);
            } : function (t) {
                x.domain(xd(t));
                y.domain(yd(t)).range(yr(t));
                return arc(d);
            };
        };
    }
    
    function getData() {
        return {
            "name": "Mood",
            "children": [
                {"name": "mad",
                 "children": [
                     {"name": "hurt","size": 60}, 
                     {"name": "hostile","size": 60}, 
                     {"name": "angry","size":60}, 
                     {"name": "rage","size":60}, 
                     {"name": "hateful","size":60}, 
                     {"name": "critical","size":60}
                     ]
                }, 
                {"name": "sad",
                    "children": [
                        {"name": "sleepy","size": 60}, 
                        {"name": "bored","size": 60}, 
                        {"name": "lonely","size": 60}, 
                        {"name": "depressed","size": 60}, 
                        {"name": "ashamed","size": 60}, 
                        {"name": "guilty","size": 60}
                    ]
                }, 
                {"name": "scared",
                    "children": [
                        {"name": "rejected","size": 60}, 
                        {"name": "confused","size": 60}, 
                        {"name": "helpless","size": 60}, 
                        {"name": "submissive","size": 60}, 
                        {"name": "insecure","size": 60}, 
                        {"name": "anxious","size": 60}
                    ]
                }, 
                {"name": "joyful",
                    "children": [
                        {"name": "excited","size": 60}, 
                        {"name": "sexy","size": 60}, 
                        {"name": "energetic","size": 60}, 
                        {"name": "playful","size": 60}, 
                        {"name": "creative","size": 60}, 
                        {"name": "aware","size": 60}
                    ]
                }, 
                    {"name": "peaceful",
                        "children": [
                        {"name": "content","size": 60}, 
                        {"name": "thoughtful","size": 60}, 
                        {"name": "intimate","size": 60}, 
                        {"name": "loving","size": 60}, 
                        {"name": "trusting","size": 60}, 
                        {"name": "nurturing","size": 60}
                    ]
                }, 
                    {"name": "powerful",
                    "children": [
                        {"name": "faithful","size": 60}, 
                        {"name": "important","size": 60}, 
                        {"name": "hopeful","size": 60}, 
                        {"name": "appreciated","size": 60}, 
                        {"name": "respected","size": 60}, 
                        {"name": "proud","size": 60}
                    ]
                }
    
            ]
        }
    };
}