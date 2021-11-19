# Proyecto-IA-Control-Platano
Proyecto de Inteligencia Artificial, Controlar un videojuego con un plátano.
By Ramírez Romero ALvaro y Vega Ledezma Emmanuel
### Código

Este es el código fuente para el video "Programa un plátano para controlar videojuegos" apoyado del canal [Ringa Tech](https://youtube.com/c/RingaTech)

### Cómo utilizarlo
Este código cuenta con las siguientes secciones
#### NET
El código de .NET está programado en C#, utilizando Visual Studio 2019 y .NET Framework 4.7. Se trata de una aplicación de consola que compila a un ejecutable. Dicho ejecutable acepta algunos textos para convertirlos en señales para simular teclas del teclado.
Nota: se debe compilar el poryecto .NET antes de iniciar el servidor.
#### NODE
Se utilizo un servidor web, y node.js para esto, con la librería *express*.

El código del archivo HTML en Chrome, ahora requiere que:
1. Abramos una línea de comando y naveguemos a la carpeta "node"
2. La primera vez necesitamos instalar las dependencias. Para esto ejecutamos el comando "npm update" (ojo, es necesario contar con Node.js instalado previamente).
3. Finalmente levantamos el servidor con "node index.js"
4. Podemos detenerlo con Ctrl+C
5. Para ver la aplicación, es necesario ir a un explorador y poner en el URL: http://localhost:3000/index.html
Nota: el juego o emulador pueden no registrar la simulacion de teclas, se recomienda probar con el emulador snes.

### Con esto terminamos el proyecto.
