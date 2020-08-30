var UMLCreateInstantiation = function(text1, text2)
{
var instantiator = new joint.shapes.standard.Rectangle();
instantiator.position(100, 30);
instantiator.resize(100, 40);
instantiator.attr({
    body: {
        fill: "blue"
    },
    label: {
        text: text1,
        fill: "white"
    }
});

var instantiatee = new joint.shapes.standard.Rectangle();
instantiatee.position(400, 30);
instantiatee.resize(100, 40);
instantiatee.attr({
    body: {
        fill: "blue"
    },
    label: {
        text: text2,
        fill: "white"
    }
});

var link = new joint.shapes.standard.Link();
link.source(instantiator);
link.target(instantiatee);

link.attr({
    line: {
        strokeDasharray: "5 5"
    }
});

return {
    "instantiator": instantiator,
    "instantiatee": instantiatee,
    "link": link
};

};

var UMLCreateAbstractClass = function(name, abstractFunctions)
{
    var rect = new joint.shapes.uml.Abstract({
        position: {x:100, y: 50},
        size: {width: 240, height: 100},
        name: name,
        attributes: [], // string list
        methods: abstractFunctions,
        attrs: {
            '.uml-class-name-text': {
                'font-style': 'italic',
                'font-weight': 'bold'
            },
            '.uml-class-methods-text': {
                ref: '.uml-class-methods-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle',
                'font-style': 'italic'
            }
        }
        /*attrs: {
            '.uml-class-name-rect': {
                fill: '#feb662',
                stroke: '#ffffff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect': {
                fill: '#fdc886',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-methods-rect': {
                fill: '#fdc886',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-text': {
                ref: '.uml-class-attrs-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            },
            '.uml-class-methods-text': {
                ref: '.uml-class-methods-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            }
        }*/
    });

    return rect;
}

var UMLCreateClass = function(name, functions)
{
    return UMLCreateClassWithMembers(name, [], functions);
}

var UMLCreateClassWithMembers = function(name, members, functions)
{
    var rect = new joint.shapes.uml.Class({
        position: {x:100, y: 200},
        size: {width: 240, height: 100},
        name: name,
        attributes: members, // string list
        methods: functions,
        /*attrs: {
            '.uml-class-name-rect': {
                fill: '#feb662',
                stroke: '#ffffff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect': {
                fill: '#fdc886',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-methods-rect': {
                fill: '#fdc886',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-text': {
                ref: '.uml-class-attrs-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            },
            '.uml-class-methods-text': {
                ref: '.uml-class-methods-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            }
        }*/
    });

    return rect;

}

var UMLCreateDescription = function(funcName, text)
{
    var rect = new joint.shapes.uml.Class({
        position: {x:100, y: 200},
        size: {width: 240, height: 100},
        name: funcName,
        attributes: [text], // string list
        methods: [],
        /*attrs: {
            '.uml-class-name-rect': {
                fill: '#feb662',
                stroke: '#ffffff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-rect': {
                fill: '#fdc886',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-methods-rect': {
                fill: '#fdc886',
                stroke: '#fff',
                'stroke-width': 0.5
            },
            '.uml-class-attrs-text': {
                ref: '.uml-class-attrs-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            },
            '.uml-class-methods-text': {
                ref: '.uml-class-methods-rect',
                'ref-y': 0.5,
                'y-alignment': 'middle'
            }
        }*/
    });

    return rect;

}

var UMLCreateInheritance = function(childClass, parentClass)
{
    var relation = new joint.shapes.standard.Link({
        source: {
            id: childClass.id
        },
        target: {
            id: parentClass.id
        }
    });

    relation.attr({
            line: {
                targetMarker: {
                    fill: "white"
                }
            }
    })

    return relation;
}

var UMLCreateDelegation = function(delegatee, delegator)
{
    var relation = new joint.shapes.standard.Link({
        source: {
            id: delegatee.id
        },
        target: {
            id: delegator.id
        }
    });

    /*relation.attr({
            line: {
                targetMarker: {
                    fill: "white"
                }
            }
    });*/

    return relation;
}

var UMLCreateDescriptionConnection = function(containingClass, descriptionClass)
{
    var relation = new joint.shapes.standard.Link({
        source: {
            id: containingClass.id
        },
        target: {
            id: descriptionClass.id
        }
    });

    relation.attr({
            line: {
                strokeDasharray: "5 5",
                targetMarker: {
                    "type": "circle",
                    "r": 5,
                    "cx": 5,
                    fill: "white"
                }
            }
    })

    return relation;
}

var UMLCreateCompositionConnection = function(containerClass, component)
{

    var link = new joint.shapes.standard.Link();
    link.source(containerClass);
    link.target(component);
    
    link.attr({
        line: {
            /*trokeDasharray: "5 5",*/
            sourceMarker: {
                fill: "white",
                "stroke-width": 1,
                "type": "image",
                "xlink:href": "./diamond.png",
                "width": 24,
                "height": 24,
                "y": -12
            }
        }
    });

    /*link.appendLabel({
        attrs: {
            text: {
                text: 'Test Message'
            }
        },
        position: {
            distance: 40
        }
    });*/

    return link;
}

var adjustVertices = function(graph, cell) {

    // if `cell` is a view, find its model
    cell = cell.model || cell;

    if (cell instanceof joint.dia.Element) {
        // `cell` is an element

        _.chain(graph.getConnectedLinks(cell))
            .groupBy(function(link) {

                // the key of the group is the model id of the link's source or target
                // cell id is omitted
                return _.omit([link.source().id, link.target().id], cell.id)[0];
            })
            .each(function(group, key) {

                // if the member of the group has both source and target model
                // then adjust vertices
                if (key !== 'undefined') adjustVertices(graph, _.first(group));
            })
            .value();

        return;
    }

    // `cell` is a link
    // get its source and target model IDs
    var sourceId = cell.get('source').id || cell.previous('source').id;
    var targetId = cell.get('target').id || cell.previous('target').id;

    // if one of the ends is not a model
    // (if the link is pinned to paper at a point)
    // the link is interpreted as having no siblings
    if (!sourceId || !targetId) return;

    // identify link siblings
    var siblings = _.filter(graph.getLinks(), function(sibling) {

        var siblingSourceId = sibling.source().id;
        var siblingTargetId = sibling.target().id;

        // if source and target are the same
        // or if source and target are reversed
        return ((siblingSourceId === sourceId) && (siblingTargetId === targetId))
            || ((siblingSourceId === targetId) && (siblingTargetId === sourceId));
    });

    var numSiblings = siblings.length;
    switch (numSiblings) {

        case 0: {
            // the link has no siblings
            break;

        } case 1: {
            // there is only one link
            // no vertices needed
            cell.unset('vertices');
            break;

        } default: {
            // there are multiple siblings
            // we need to create vertices

            // find the middle point of the link
            var sourceCenter = graph.getCell(sourceId).getBBox().center();
            var targetCenter = graph.getCell(targetId).getBBox().center();
            var midPoint = g.Line(sourceCenter, targetCenter).midpoint();

            // find the angle of the link
            var theta = sourceCenter.theta(targetCenter);

            // constant
            // the maximum distance between two sibling links
            var GAP = 20;

            _.each(siblings, function(sibling, index) {

                // we want offset values to be calculated as 0, 20, 20, 40, 40, 60, 60 ...
                var offset = GAP * Math.ceil(index / 2);

                // place the vertices at points which are `offset` pixels perpendicularly away
                // from the first link
                //
                // as index goes up, alternate left and right
                //
                //  ^  odd indices
                //  |
                //  |---->  index 0 sibling - centerline (between source and target centers)
                //  |
                //  v  even indices
                var sign = ((index % 2) ? 1 : -1);

                // to assure symmetry, if there is an even number of siblings
                // shift all vertices leftward perpendicularly away from the centerline
                if ((numSiblings % 2) === 0) {
                    offset -= ((GAP / 2) * sign);
                }

                // make reverse links count the same as non-reverse
                var reverse = ((theta < 180) ? 1 : -1);

                // we found the vertex
                var angle = g.toRad(theta + (sign * reverse * 90));
                var vertex = g.Point.fromPolar(offset, angle, midPoint);

                // replace vertices array with `vertex`
                sibling.vertices([vertex]);
            });
        }
    }
}

/*
var rect = new joint.shapes.standard.Rectangle();
rect.position(100, 30);
rect.resize(100, 40);
rect.attr({
    body: {
        fill: "blue"
    },
    label: {
        text: "Hello",
        fill: "white"
    }
});
rect.addTo(graph);

var rect2 = rect.clone();
rect2.translate(300, 0);
rect2.attr("label/text", "world!");
rect2.addTo(graph);

var link = new joint.shapes.standard.Link();
link.source(rect);
link.target(rect2);

link.attr({
    line: {
        strokeDasharray: "5 5",
        targetMarker: {
            fill: "white",
            "stroke-width": 1,
            "type": "image",
            "xlink:href": "./diamond.png",
            "width": 24,
            "height": 24,
            "y": -12
        }
    }
});

link.addTo(graph);
*/

