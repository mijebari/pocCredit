    var fileInput = document.querySelector('#file');
    var $loading = $('.preloader');
    //const cheminPrincipal='http://module-cognitif-dev.eu-gb.mybluemix.net';
   //const cheminPrincipal='http://localhost:3001';
    //const cheminPrincipal = 'http://test-module-cognitif.eu-gb.mybluemix.net';
    const cheminPrincipal='http://module-poc-credit.eu-gb.mybluemix.net';

    const trainingServer = cheminPrincipal + '/v1/trainingdatas';
    const nlcServer = cheminPrincipal + '/v1/nlcs'

    var nlcTestDataConst={};
    $('.del-training-data').click(function(event, param) {
      var tr = $(this).parent().parent();
      var tdId = tr.find(".hide-information");
      id = tdId["0"].outerText;

      if (id == undefined) {
        window.location.reload();
      } else {
        $.get('/training/deleteAction', {
          id: id
        }).done(function onSucess(answers) {
          tr.remove();
        }).fail(function onError(error) {
          window.location.reload(true);

        }).always(function always() {});
      }
    });


    $('.del-category-data').click(function(event, param) {
      var tr = $(this).parent().parent();
      var tdId = tr.find(".hide-information");
      id = tdId["0"].outerText;
      if (id == undefined) {
        window.location.reload();
      } else {
        $.get('/training/deleteCategory', {
          id: id
        }).done(function onSucess(answers) {
          tr.remove();
        }).fail(function onError(error) {
          window.location.reload(true);

        }).always(function always() {});
      }
    });


    $('.val-training-data').click(function(event, param) {
      var tr = $(this).parent().parent();
      var correctionOption = tr.find(".controlCategory");
      var tdId = tr.find(".hide-information");
      id = tdId["0"].outerText;


      console.log(correctionOption["0"].value);

      if (id == undefined || correctionOption["0"].value == undefined) {
        window.location.reload();
      } else {
        $.get('/training/trainingAction', {
          correction: correctionOption["0"].value,
          id: id
        }).done(function onSucess(answers) {

          tr.remove();

        }).fail(function onError(error) {
          //alert(" training wrong " + error);
          window.location.reload(true);

        }).always(function always() {

        });
      }
    });



    var getFile = function(type) {

      $.get('/training/getFile', {
        type: type
      }).done(function onSucess(answers) {
        var uriContent = "data:text/csv," + encodeURIComponent(answers);
        window.open(uriContent, type);


      }).fail(function onError(error) {
        alert(" getFile wrong ");
      }).always(function always() {

      });
    };


    $('#generateCSVFAQ').click(function(event, param) {
 
        getFile("faq");


  

    });

    $('#generateCSVIntent').click(function(event, param) {
     
        getFile("intent");



    });

    $('#generateCSVCategory').click(function(event, param) {
  
        getFile("category");


    });


    $('.deleteDataToTrained').click(function(event, param) {
      $.get('/training/deleteByTypeAction', {
        state: 'toTrained'

      }).done(function onSucess(answers) {

        window.location.reload(false);


      }).fail(function onError(error) {
        alert(" delete wrong " + JSON.stringify(error));
      }).always(function always() {

      });

    });

    $('.deleteDataToValidate').click(function(event, param) {
      $.get('/training/deleteByTypeAction', {
        state: 'toValidate'

      }).done(function onSucess(answers) {

        window.location.reload(false);


      }).fail(function onError(error) {
        alert(" delete wrong ");
      }).always(function always() {

      });

    });



    $('.deleteDataNlcTrained').click(function(event, param) {
      $.get('/training/deleteByTypeAction', {
        state: 'alreadyTrained'

      }).done(function onSucess(answers) {

        window.location.reload(false);


      }).fail(function onError(error) {
        alert(" delete wrong ");
      }).always(function always() {

      });

    });

    $('.validateTrainings').click(function(event, param) {
      console.log("training actioon");
      $.get('/training/validateTrainingsAction', {

      }).done(function onSucess(answers) {
        console.log(JSON.stringify(answers));
        //  window.location.reload(true);


      }).fail(function onError(error) {
        alert(" delete wrong ");
      }).always(function always() {
        window.location.reload();

      });

    });

    $('#inputFileNLC').change(function() {
      var fileInput = document.querySelector("#inputFileNLC");

      var type = prompt("Quel est le type du fichier nlc? (faq ou intent)");
      if (type === 'faq' || type === 'intent') {
        console.log(fileInput.files[0]);

        var data = new FormData();

        data.append("csv", fileInput.files[0]);
        data.append("type", type);
        console.log(data);
        $loading.show();


        $.ajax({
          url: trainingServer + '/uploadFile',
          type: 'POST',
          data: data,
          cache: false,
          dataType: 'json',
          processData: false, // Don't process the files
          contentType: false, // Set content type to false as jQuery will tell the server its a query string request
          success: function(data2, textStatus, jqXHR) {
            console.log(data2);
            console.log(textStatus);
            console.log(jqXHR);
          },

          error: function(resultat, statut, erreur) {
            alert("erreur file send");
            console.log(resultat);
            console.log(statut);
            console.log(erreur);
          },

          complete: function(resultat, statut) {
            $loading.hide();
            window.location.reload(true);

          }

        })
      }
    });


$('#inputFileCategory').change(function() {
      var fileInput = document.querySelector("#inputFileCategory");

       var type = 'category';

        var data = new FormData();

        data.append("csv", fileInput.files[0]);
        data.append("type", type);
        //console.log(data);
        $loading.show();


        $.ajax({
          url: nlcServer + '/uploadFile',
          type: 'POST',
          data: data,
          cache: false,
          dataType: 'json',
          processData: false, // Don't process the files
          contentType: false, // Set content type to false as jQuery will tell the server its a query string request
          success: function(data2, textStatus, jqXHR) {
            console.log(data2);
            console.log(textStatus);
            console.log(jqXHR);
          },

          error: function(resultat, statut, erreur) {
            alert("erreur file send");
            console.log(resultat);
            console.log(statut);
            console.log(erreur);
          },

          complete: function(resultat, statut) {
            $loading.hide();
            window.location.reload(true);

          }

        })
      
    });


    $('#sentenceChangeModal').on('show.bs.modal', function(event) {
      var td = $(event.relatedTarget) // Button that triggered the modal
      var recipient = td.data('whatever') // Extract info from data-* attributes
      var recipient2 = td.data('whatever2') // Extract info from data-* attributes
        //  var id = button.data('idSentence') // Extract info from data-* attributes
        //alert(id);
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this)
      modal.find('.modal-title').text('Modify sentence ')
      modal.find('#old-sentence').text(recipient)
      modal.find('.modal-body input').val(recipient)
    })


    $('.btn-change-sentence').click(function(event, param) {
      //alert("ok");
      var p = $(this).parent().parent();
      var sentences = p.find("#recipient-name");
      var sentence = sentences["0"].value;
      var oldSentences = p.find("#old-sentence");
      var oldSentence = oldSentences["0"].textContent;
      console.log(sentence);
      console.log(oldSentence)

      if (sentence == undefined || oldSentence == undefined) {
        window.location.reload();
      } else {
        $.get('/training/modifySentence', {
          sentence: oldSentence,
          newsentence: sentence
        }).done(function onSucess(answers) {
          window.location.reload();

        }).fail(function onError(error) {
          alert(" change wrong ");
        }).always(function always() {


        });
      }
    });

    $('#correctionChangeModal').on('show.bs.modal', function(event) {
      var td = $(event.relatedTarget) // Button that triggered the modal
      var sentence = td.data('whatever') // Extract info from data-* attributes
      var id = td.data('whatever2') // Extract info from data-* attributes
 
      var correction = td.data('whatever3') // Extract info from data-* attributes
      var types = td.data('whatever4') // Extract info from data-* attributes

      var modal = $(this)

      //modal.find('.modal-title').text('Modify the category ')
      modal.find('#correction-sentence').text(sentence)
      modal.find('#category-id').text(id)
      var select=modal.find('#SelectCategoryCorrection');
      var opt ;
      var t;
      var optgroupintent=document.createElement( "optgroup" );
      var optgroupfaq=document.createElement( "optgroup" );

      optgroupfaq.setAttribute( "label","FAQ" );
      optgroupintent.setAttribute( "label","INTENT" );

      for (var num in types) {
        opt = document.createElement( "option" );
        opt.setAttribute( "value",types[num].name );
        t = document.createTextNode(types[num].name);
        opt.append(t);
        if(types[num].name==correction){
          opt.setAttribute( "selected","selected");
        }
        if(types[num].type=="faq"){
          optgroupfaq.append(opt);
        }
        else{
          optgroupintent.append(opt);

        }
      }
      select.append(optgroupfaq);
      select.append(optgroupintent);
    })
    
    $('.btn-change-correction').click(function(event, param) {


      var m = $(this).parent().parent();
      var select=m.find('#SelectCategoryCorrection');
      var newValue=select[0].value;
      var categoryIds = m.find("#category-id");
      var categoryId = categoryIds["0"].textContent;

      $.get('/training/setCategory', {
           category: newValue,
           id: categoryId
        }).done(function onSucess(answers) {
           window.location.reload();

         }).fail(function onError(error) {
           alert(" change wrong ");
        }).always(function always() {


         });
     });


    $('.btn-add-sentence').click(function(event, param) {
      //alert("ok");
      var p = $(this).parent().parent();
      var sentences = p.find("#recipient-name");
      var sentence = sentences["0"].value;

      if (sentence == undefined ) {
        window.location.reload();
      } else {
        $.get('/training/newSentence', {
          sentence: sentence,
        }).done(function onSucess(answers) {
          window.location.reload();

        }).fail(function onError(error) {
          alert(" change wrong ");
        }).always(function always() {


        });
      }
    });


    $('.btn-add-category').click(function(event, param) {
      var p = $(this).parent().parent();
      var categoriesinput = p.find("#recipient-name");
      var categoriesradios = p.find('.form-group-category');

      var category = categoriesinput["0"].value;
      var radios = categoriesradios.find('.control-label-type');

      var radiotab = radios.children('input');
      var type = 'faq';

      for (var i = 0, length = radiotab.length; i < length; i++) {

        if (radiotab[i].checked) {
          
          type = radiotab[i].value;
          break;
        }
      }


      if (category == undefined || category == undefined) {
        window.location.reload();
      } else {
        $.get('/training/newCategory', {
          name: category,
          type: type
        }).done(function onSucess(answers) {
          window.location.reload();

        }).fail(function onError(error) {
          alert(" change wrong ");
        }).always(function always() {


        });
      }


    });

$('.btn-test-nlc').click(function(event, param) {
     var p = $(this).parent().parent();
      var input = p.find("#test-nlc-input");
      var sentence = input["0"].value;
     // console.log(input);

        $.get('/training/testNLC', {
          sentence: sentence,
        }).done(function onSucess(answers) {

console.log(answers);
nlcTestDataConst=answers;
$('#testSentenceModal').modal('show')
        }).fail(function onError(error) {
          alert(" change wrong ");
        }).always(function always() {


        });
      

    });

$('#testSentenceModal').on('show.bs.modal', function (event) {
 // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)

  //modal.find('.modal-body textarea').val(nlcTestDataConst.data.classes.toString());
  var divResult = modal.find('.modal-body #result-test');
  divResult.empty();
  //document.getElementById("link")
    console.log(modal.find('.modal-body #sentence-test'));
  modal.find('.modal-body #sentence-test').text("sentence: "+nlcTestDataConst.data.text);
  console.log(nlcTestDataConst.data.text);
  
  var span;
  var node;
    var textnode
      console.log(nlcTestDataConst.data.text);

  nlcTestDataConst.data.classes.forEach(function(arrayItem) {
    console.log(arrayItem.class_name);
   span = document.createElement("span");
           span.className="label label-info nlc-result";

        textnode = document.createTextNode(""+arrayItem.class_name+" ("+String(arrayItem.confidence*100).substring(0, 4)+"%)"); // Create a text node
         span.appendChild(textnode);
divResult.append(span);
//divResult.append(document.createElement("br"));
      });
})





    $('#responseChangeModal').on('show.bs.modal', function(event) {
      var td = $(event.relatedTarget) // Button that triggered the modal
      var recipient = td.data('whatever') // Extract info from data-* attributes
      var recipient2 = td.data('whatever2') // Extract info from data-* attributes
      var recipient3 = td.data('whatever3') // Extract info from data-* attributes
        //  var id = button.data('idresponse') // Extract info from data-* attributes
        //alert(id);
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this)
      modal.find('.modal-title').text('Modify response of class '+recipient3)
      modal.find('#old-response').text(recipient)
      modal.find('#category-id').text(recipient2)
      modal.find('.modal-body input').val(recipient)

    })


    $('.btn-change-response').click(function(event, param) {
      //alert("ok");
      var p = $(this).parent().parent();
      var responses = p.find("#recipient-name");
      var response = responses["0"].value;
      var oldresponses = p.find("#old-response");


      var oldresponse = oldresponses["0"].textContent;
      var categoryIds = p.find("#category-id");
            var categoryId = categoryIds["0"].textContent;
      console.log(response);
      console.log(oldresponse)
      console.log(categoryId)

      if (response == undefined || oldresponse == undefined) {
        window.location.reload();
      } else {
        $.get('/training/setCategoryResponse', {
          id: categoryId,
          response: response
        }).done(function onSucess(answers) {
          window.location.reload();
        }).fail(function onError(error) {
          alert(" change wrong ");
        }).always(function always() {


        });
      }
      
    });

    $(document).ready(function() {
      $('#tableTraining').DataTable();

    });