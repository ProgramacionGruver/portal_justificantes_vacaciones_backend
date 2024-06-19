export const decodificarContraseña = (cifrado) => {
    let palabra = ''
    for (let i = 0;i < cifrado.length;i++) {
      const codigoCaracter = cifrado.charCodeAt(i)
  
      if (codigoCaracter >= 65 && codigoCaracter <= 90) {
        // Letra mayúscula
        const letraDescifrada = String.fromCharCode(
          ((codigoCaracter - 65 - 3 + 26) % 26) + 65
        )
        palabra += letraDescifrada
      } else if (codigoCaracter >= 97 && codigoCaracter <= 122) {
        // Letra minúscula
        const letraDescifrada = String.fromCharCode(
          ((codigoCaracter - 97 - 3 + 26) % 26) + 97
        )
        palabra += letraDescifrada
      } else {
        // Otros caracteres no cambian
        palabra += cifrado.charAt(i)
      }
    }
    return palabra
  }



  export const obtenerIdAccesos = (palabra) => {
    const numerosEncontrados = palabra.match(/\d+/g)
  
    const primeraParte = numerosEncontrados[0]
    const segundaParte = numerosEncontrados[numerosEncontrados.length - 1]
  
    return {  idParticipante: primeraParte,
              idClima: segundaParte
          }
  }
  