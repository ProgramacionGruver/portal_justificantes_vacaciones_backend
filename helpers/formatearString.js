export const formatName = (fullName) => {
    return fullName
      .toLowerCase() // convertir toda la cadena a minúsculas
      .split(" ") // dividir la cadena en palabras
      .map((word) => {
        // capitalizar la primera letra y dejar el resto en minúsculas
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" "); // unir las palabras en una cadena
  }