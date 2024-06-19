export const formatearOrganigrama = (empleadoObj, usuarios, personasDepartamento) => {

    const empleado = usuarios.find((elemento) => elemento.numero_empleado === empleadoObj.empleado);
   
    const organigrama = {
      id: empleado.numero_empleado,
      name: empleado.nombre,
      title: empleado.puesto,
      data: {
        numero: empleado.numero,
        nombre: empleado.nombre,
        puesto: empleado.puesto,
        correo: empleado.correo,
        telefono: empleado.telefono,
        centro: empleado.centro,
        sucursal: empleado.sucursal,
        division: empleado.division,
        sucursal: empleadoObj.sucursal,
        departamento: empleadoObj.departamento
      },
      children: [],
    };
  
    const empleadosRelacionadosempleadoObj = personasDepartamento.filter((e) => e.jefeDirecto === empleadoObj.empleado);
  
    empleadosRelacionadosempleadoObj.forEach((empleadoRelacionado) => {
      const subOrganigrama = formatearOrganigrama(empleadoRelacionado, usuarios, personasDepartamento);
      organigrama.children.push(subOrganigrama);
    });
  
    return organigrama;
  };