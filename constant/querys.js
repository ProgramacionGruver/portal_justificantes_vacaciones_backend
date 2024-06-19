export const queryUsuarios = {
    obtenerUsuariosProgramadores: "SELECT numero_empleado FROM [portal_sistemas].[dbo].[usuarios] WHERE (puesto LIKE 'PROGRAMADOR%' OR puesto LIKE 'AUXILIAR DE SISTEMAS') AND estatus = 1",
  }