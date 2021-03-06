var mapaDeZonaPorProcessos = [];


function dropzone() {


  /* The dragging code for '.draggable' from the demo above
   * applies to this demo as well so it doesn't have to be repeated. */

  // enable draggables to be dropped into this
  interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.draggable',
    // Require a 75% element overlap for a drop to be possible
    //overlap: 0.25,

    // listen for drop related events:

    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
      //draggableElement.textContent = 'Dragged in';
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
      event.relatedTarget.classList.remove('error');
      //event.relatedTarget.textContent = 'Dragged out';
      var id = event.relatedTarget.id;
      
      //$('#' +id).removeAttr('title');
      
      var nomeDaZona = event.target.id;


      var zona = _.find(mapaDeZonaPorProcessos, function (z) {
        return z.zona === nomeDaZona;
      });

      if (zona && zona.processos) {

        console.log('tamanho do array: ' + zona.processos.length);

        zona.processos = _.reject(zona.processos, function (p) {
          //aqui a comparação é com ==
          //eu quero que ele faça o casting
          return p.id == id;
        });

        console.log('novo tamanho do array: ' + zona.processos.length);
        event.target.textContent = nomeDaZona + ' - ' + zona.processos.length;

      }


    },

    ondrop: function (event) {


      var id = event.relatedTarget.id;

      var nomeDaZona = event.target.id;

      var processoDropado = _.find(processos, function (p) {
        //aqui a comparação é com ==
        //eu quero que ele faça o casting
        return p.id == id;
      });

      //var jsonString = $('#' + id).attr('json');
      //var processo = eval("(" + jsonString + ')');

      var zona = _.find(mapaDeZonaPorProcessos, function (z) {
        return z.zona === nomeDaZona;
      });

      if (!zona) {

        console.log('zona iniciada');

        mapaDeZonaPorProcessos.push({

          zona: nomeDaZona,
          processos: [processoDropado]

        });

        event.target.textContent = nomeDaZona + " - " + 1;
      } else {

        var processoEncontrado = _.find(zona.processos, function (p) {
          return p.id === processoDropado.id
        });

        if (!processoEncontrado) {
          zona.processos.push(processoDropado);
          event.target.agrupados++;
        } else {
          console.log('elemento já existe na zona: ' + JSON.stringify(processoDropado));
        }
        event.target.textContent = nomeDaZona + " - " + zona.processos.length;
      }

    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    }
  });


}



function draggable() {

  interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      restrict: {
        //restriction: "parent",
        endOnly: true,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1
        }
      },

      // call this function on every dragmove event
      onmove: dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
        var textEl = event.target.querySelector('p');

        textEl && (textEl.textContent =
          'moved a distance of ' + (Math.sqrt(event.dx * event.dx +
            event.dy * event.dy) | 0) + 'px');
      }
    });
}


function dragMoveListener(event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// this is used later in the resizing demo
window.dragMoveListener = dragMoveListener;