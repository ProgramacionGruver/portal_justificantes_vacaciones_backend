import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'
import SolicitudDetalle from './SolicitudDetalle.js'
import CatalogoEstatus from './CatalogoEstatus.js'
 
const AutorizacionesSolicitudes = db.define('autorizaciones_solicitudes', {
    idAutorizacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idSolicitudDetalle: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'NO ACTION'
    },
    numeroEmpleadoAutoriza: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nombreEmpleadoAutoriza: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    idTipoAutorizacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    idEstatusAutorizacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    comentario: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
    {
        sequelize,
        modelName: "autorizaciones_solicitudes",
    })
 
SolicitudDetalle.hasMany(AutorizacionesSolicitudes, { foreignKey: 'idSolicitudDetalle' })
AutorizacionesSolicitudes.belongsTo(SolicitudDetalle, { foreignKey: 'idSolicitudDetalle'})
 
CatalogoEstatus.hasMany(AutorizacionesSolicitudes, { foreignKey: 'idEstatusAutorizacion' })
AutorizacionesSolicitudes.belongsTo(CatalogoEstatus, { foreignKey: 'idEstatusAutorizacion' })
 
export default AutorizacionesSolicitudes