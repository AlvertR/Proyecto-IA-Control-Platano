//*****Proyecto de Inteligencia Atificial
//*****Ramirez Romero Alvaro
//*****Vega Ledezam Emmanuel
//*****Apoyado en el canal [Ringa Tech](https://youtube.com/c/RingaTech)
var video;
var canvas;
var altoCamara = 720;
var anchoCamara = 720;
var amarillo = {r: 255, g: 255, b: 0};
var distanciaAceptableColor = 150;
var sensibilidadGiro = 1.3;

function mostrarCamara() {
	video = document.getElementById("video");
	canvas = document.getElementById("canvas");

	var opciones = {
		audio: false,
		video: {
			width: anchoCamara, height: altoCamara
		}
	};

	if(navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia(opciones)
		    .then(function(stream) {
		    	video.srcObject = stream;
		    	procesarCamara();
		    })
		    .catch(function(err) {
		    	console.log("A ocurrido un error", err);
		    })
	} else {
		console.log("No existe la funcion getUserMedia  X|");
	}
}

function procesarCamara() {
	var ctx = canvas.getContext("2d");
	ctx.drawImage(video, 0, 0, anchoCamara, altoCamara, 0, 0, canvas.width, canvas.height);
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixeles = imgData.data;
	var objetos = [];

	for (var p=0; p < pixeles.length; p += 4) {
		var rojo = pixeles[p];
		var verde = pixeles[p+1];
		var azul = pixeles[p+2];
		var alpha = pixeles[p+3];

		var distancia = Math.sqrt(
			Math.pow(amarillo.r-rojo, 2) +
			Math.pow(amarillo.g-verde,2) +
			Math.pow(amarillo.b-azul, 2)
		);

		if (distancia < distanciaAceptableColor) {
			var y = Math.floor(p / 4 / canvas.width);
			var x = (p/4) % canvas.width;

			//Agrupacion
			if (objetos.length == 0) {
				//Es mi primer objeto, hola mundo
				var objeto = new Objeto(x, y);
				objetos.push(objeto);
			} else {
				//Revisar si esta cerca. Si si, se une a el
				//Si no, creo uno nuevo
				var encontrado = false;
				for (var pl=0; pl < objetos.length; pl++) {
					if (objetos[pl].estaCerca(x, y)) {
						objetos[pl].agregarPixel(x, y);
						encontrado = true;
						break;
					}
				}

				if (!encontrado) {
					var objeto = new Objeto(x, y);
					objetos.push(objeto);
				}
			}
		}
	}

	ctx.putImageData(imgData, 0, 0);
	objetos = unirObjetos(objetos);
	var masGrande = null;
	var mayorTamano = -1;

	for (var pl=0; pl < objetos.length; pl++) {
		var width = objetos[pl].xMaxima - objetos[pl].xMinima;
		var height = objetos[pl].yMaxima - objetos[pl].yMinima;
		var area = width * height;

		if (area > 1500) {
			if (masGrande === null || area > mayorTamano) {
				masGrande = objetos[pl];
				mayorTamano = area;
			}
		}
	}

	if (masGrande !== null) {
		masGrande.dibujar(ctx);
		document.getElementById("info").innerHTML = masGrande.grados;
		var base = 0;//270
		var nuevosGrados = base + (masGrande.grados*-1) * sensibilidadGiro;
		document.getElementById("nave")
		    .style.transform="rotate(" + nuevosGrados + "deg)";
	    var ancho = masGrande.xMaxima - masGrande.xMinima;
	    enviarMovimiento(masGrande.grados, masGrande.yMinima, ancho);
	}

	setTimeout(procesarCamara, 20);
}

/**
 Esta funcion tiene como objetivo recibir un arreglo de objetos "Objeto" que pueden tener
 intersecciones entre ellos (rectangulos dentro de otros rectangulos, o con cualquier interseccion)
 Regresa un arreglo en donde, si encontro intersecciones, une esos objetos.
 Es decir puede regresar el mismo arreglo, o uno con menos objetos (pero mas grandes)
 */
function unirObjetos(objetos) {
	var salir = false;

	//Comparamos todos contra todos
	for (var p1=0; p1 < objetos.length; p1++)  {
		for (var p2=0; p2 < objetos.length; p2++) {

			if (p1 == p2) continue; //Si es el mismo, no lo consideres, y ya

			var objeto1 = objetos[p1];
			var objeto2 = objetos[p2];

			//Intersectan?
			var intersectan = objeto1.xMinima < objeto2.xMaxima &&
				objeto1.xMaxima > objeto2.xMinima &&
			    objeto1.yMinima < objeto2.yMaxima && 
			    objeto1.yMaxima > objeto2.yMinima;

		    if (intersectan) {
		    	//Pasar los pixeles del p2 al p1
		    	for (var p=0; p < objeto2.pixeles.length; p++) {
		    		objeto1.agregarPixel(
		    			objeto2.pixeles[p].x,
		    			objeto2.pixeles[p].y
	    			);
		    	}
		    	//borrar el p2
		    	objetos.splice(p2, 1);
		    	salir = true;
		    	break;
		    }

		}

		if (salir) {
			break;
		}
	}

	//Si encontre una interseccion, reprocesemos todo de nuevo
	//con el arreglo modificado
	if (salir) {
		return unirObjetos(objetos);
	} else {
		//Ya no hubo intersecciones, salir
		return objetos;
	}
}

var ultimoUrl = null;

function enviarMovimiento(grados, yMinima, ancho) {
	var movimiento = "0"; //0 = no hay mov. -1 mov izq, 1 mov der
	//izquierda derecha o quieto
	if (grados >= 18) {
		movimiento = "-1";
	} else if (grados <= -18) {
		movimiento = "1";
	}
	//brincar
	var brincar = "0";
	if (yMinima <= 30) {
		brincar = "1";
	}
	//acelerar
	var acelerar = "0";
	if (ancho >= 240) {
		acelerar = "1";
	}
	var bomba = "0";
	if (ancho >= 300) {
		bomba = "1";
	}
	//arriba y abajo
	var arriba = "0";
	if (yMinima <= 100) {
		arriba = "1";
	} else if (yMinima >= 300) {
		arriba = "-1";
	}

	var url = "http://localhost:3000?movimiento=" + movimiento + 
	    "&bomba=" + bomba + "&arriba=" + arriba;
	    //para jugar con mario
	//var url = "http://localhost:3000?movimiento=" + movimiento + 
	    //"&brincar=" + brincar + "&acelerar=" + acelerar;

	if (ultimoUrl === null || url !== ultimoUrl) {
		ultimoUrl = url;

		$.get(url, function(response) {
			console.log(response);
		});
	}
}