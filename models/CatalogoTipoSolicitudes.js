import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const CatalogoTipoSolicitudes = db.define('catalogo_tipo_solicitudes', {
    idTipoSolicitud: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombreSolicitud: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    claveSolicitud: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    editedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    }
    
},
{
    sequelize,
    modelName: "catalogo_tipo_solicitudes",
})

export default CatalogoTipoSolicitudes