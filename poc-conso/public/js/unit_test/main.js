// Initialize the editor with a JSON schema

JSONEditor.defaults.options.theme = 'bootstrap3';
JSONEditor.defaults.options.iconlib = "fontawesome4";


$.post('/unit_test/getTest', {}).done(function onSucess(result) {
    var starting_value_tests = result.tests;
    var starting_value_ctx = result.default_context;

    var editor_ctx = new JSONEditor(document.getElementById('editor_ctx_holder'), {
        schema: {
            type: "object",
            title: "Default context",
            "options": {
                "collapsed": true
            },
            properties: {

                "card": {
                    "type": "array",
                    "format": "table",
                    "options": {
                        "collapsed": true
                    },
                    "items": {
                        "type": "object",
                        "properties": {
                            "field": {
                                "type": "string"
                            },
                            "value": {
                                "type": "string"
                            }
                        }
                    }
                },
                "client": {
                    "type": "array",
                    "format": "table",
                    "options": {
                        "collapsed": true
                    },
                    "items": {
                        "type": "object",
                        "properties": {
                            "field": {
                                "type": "string"
                            },
                            "value": {
                                "type": "string"
                            }
                        }
                    }
                }
            }

        },
        startval: starting_value_ctx,
        // Disable additional properties
        no_additional_properties: true,

        // Require all properties by default
        required_by_default: true,
        disable_properties: true,
        disable_edit_json: true,
    });

    // Initialize the editor
    var editor_unit_test = new JSONEditor(document.getElementById('editor_unit_test_holder'), {
        //collapsed : true,

        // Enable fetching schemas via ajax
        ajax: true,

        // The schema for the editor_unit_test
        schema: {
            type: "array",
            format: "tabs",
            title: "Unit Test",
            items: {
                title: "Unit test",
                headerTemplate: "{{i}} - {{self.name}}",
                oneOf: [{
                    $ref: "/schemas/unit_test.json",
                    title: "Unit_test"
                }]
            }
        },

        // Seed the form with a starting value
        startval: starting_value_tests,

        // Disable additional properties
        no_additional_properties: true,

        // Require all properties by default
        required_by_default: true,
        disable_properties: true,
        disable_edit_json: true,

    });


    // Hook up the submit button to log to the console
    document.getElementById('submit').addEventListener('click', function() {
        // Get the value from the editor_unit_test
        console.log(editor_unit_test.getValue());

        var obj = {
            default_context: editor_ctx.getValue(),
            tests: editor_unit_test.getValue()
        }

        $.post('/unit_test/saveTest', {
            unit_tests: obj
        }).done(function onSucess(result) {
            if (result) {
                console.log('ok')
            }

        }).fail(function onError(error) {
            console.log(JSON.stringify(error));
        }).always(function always() {
            // do sth
        });


    });


}).fail(function onError(error) {
    console.log(error)
});

$('#run').click(function(e) {
    e.preventDefault();
    $('#test_result').html('');

    var $this = $(this);
    $this.button('loading');
    $.post('/unit_test/runTest', {}).done(function onSucess(result) {
        if (typeof result.err === 'undefined') {
            $('#test_result').html(generateResult(result));
            $('#result_tests').DataTable();
        } else {
            $('#test_result').html('<div class="alert alert-danger">' + result.err + '</div>');
        }
    }).fail(function onError(error) {
        console.log(error)
        $('#test_result').html('<div class="alert alert-info">The run still run in background. Please come later if this page to see the result.</div>');
    }).always(function always() {
        $this.button('reset');
    });
});

$(document).ready(function () {
    $('.ibm').hide();
    $('#result_tests').DataTable();
});

function generateResult(result) {
    var html = '<table id="result_tests" class="table table-striped"><thead><tr><th>Result</th><th>Name</th><th>Expected</th><th>Obtained</th></tr></thead><tbody>'

    for (var i = 0; i < result.length; i++) {
        var item = result[i];
        html += '<tr>'
        html += '<th scope="row">' + item.passed + '</th>'
        html += '<td>' + item.name + '</td>'
        html += '<td>' + item.expected_result + '</td>'
        html += '<td>' + item.obtained_result + '</td>'
        html += '</tr>'
    }

    html += '</tbody></table>'

    return html;
}