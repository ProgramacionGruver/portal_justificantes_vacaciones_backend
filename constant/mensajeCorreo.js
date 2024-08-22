import { formatearFechaCorreo } from "../helpers/formatearFecha.js"

export const mensajeCorreoMesVacaciones = (usuario, aniversario) => {
  return `
    <table border='1' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
      <thead bgcolor='#1052A0' text='white'>
          <tr>
            <th colspan='2' style='padding: 16px; background-color: #408493; color: white;'>¡Recordatorio! <br> Te queda un mes para pedir tus vacaciones anuales antes de que expiren.</th>
          </tr>
      </thead>
      <tbody bgcolor='white' text='black'>
          <tr>
            <td style='padding: 12px;'>Fecha de aniversario:</td>
            <td style='padding: 12px;'>${formatearFechaCorreo(aniversario)}</td>
          </tr>
          <tr>
            <td style='padding: 12px;'>Número de empleado:</td>
            <td style='padding: 12px;'>${usuario.numero_empleado}</td>
          </tr>
          <tr>
            <td style='padding: 12px;'>Nombre: </td>
            <td style='padding: 12px;'>${usuario.nombre}</td>
          </tr>
          <tr>
            <td style='padding: 12px;'>Haz click aqui para solicitarlos:</td>
            <td style='padding: 12px;'><a
                  href='https://www.gruver.com.mx/portal_justificantes_vacaciones/#/'
                  style='color: #58ACFA; text-decoration: none;'>Portal de Justificantes, Vacaciones y Días económicos</a></td>
          </tr>
      </tbody>
    </table>
      `
}

export const mensajeCorreoSolicitudesPendientes = (objeto) => {
  return `
    <table border='1' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
      <thead bgcolor='#1052A0' text='white'>
          <tr>
            <th colspan='2' style='padding: 16px; background-color: #408493; color: white;'>¡Recordatorio! <br> Tienes solicitudes de Justificantes y Vacaciones pendientes de autorizar antes del cierre del periodo.</th>
          </tr>
      </thead>
      <tbody bgcolor='white' text='black'>
          <tr>
            <td style='padding: 12px;'>No. solicitudes pendientes:</td>
            <td style='padding: 12px;'>${objeto.solicitudesPendientes}</td>
          </tr>
          <tr>
            <td style='padding: 12px;'>Número de empleado:</td>
            <td style='padding: 12px;'>${objeto.numero_empleado}</td>
          </tr>
          <tr>
            <td style='padding: 12px;'>Nombre: </td>
            <td style='padding: 12px;'>${objeto.nombre}</td>
          </tr>
          <tr>
            <td style='padding: 12px;'>Ingresa a revisar al modulo de <strong>Mis Autorizaciones:</strong></td>
            <td style='padding: 12px;'><a
                  href='https://www.gruver.com.mx/portal_justificantes_vacaciones/#/'
                  style='color: #58ACFA; text-decoration: none;'>Portal de Justificantes, Vacaciones y Días económicos</a></td>
          </tr>
      </tbody>
    </table>
      `
}