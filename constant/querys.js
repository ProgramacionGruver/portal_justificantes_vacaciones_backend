export const queryUsuarios = {
    obtenerUsuariosProgramadores: "SELECT numero_empleado FROM [portal_sistemas].[dbo].[usuarios] WHERE (puesto LIKE 'PROGRAMADOR%' OR puesto LIKE 'AUXILIAR DE SISTEMAS') AND estatus = 1",
  }

export const queryObtenerEmpleado = (numero_empleado) => {
  return `
  SELECT [idUsuario]
      ,[numero_empleado]
      ,[nombre]
      ,[usuario]
      ,[correo]
      ,[puesto]
      ,[contrasena]
      ,[fechaAlta]
      ,[idPuesto]
      ,[departamento]
      ,[centroTrabajo]
      ,[idDepartamentoSucursal]
      ,[siglasCentroTrabajo]
      ,[numeroEmpleadoJefe]
      ,[fechaNacimiento]
      ,[rfc]
      ,[curp]
      ,[sexo]
      ,[lugarNacimiento]
      ,[estadoCivil]
      ,[direccion]
      ,[codigoPostal]
      ,[ciudad]
      ,[estado]
      ,[telefono]
      ,[division]
      ,[estatus]
      ,[createdAt]
      ,[updatedAt]
      ,[sueldo]
      ,[turnoLunesViernes]
      ,[turnoSabados]
  FROM [portal_sistemas].[dbo].[usuarios] 
  WHERE numero_empleado = ${numero_empleado}
  `
}