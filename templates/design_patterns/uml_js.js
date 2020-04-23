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

