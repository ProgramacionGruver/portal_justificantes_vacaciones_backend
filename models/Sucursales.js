import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const Sucursales = db.define('sucursales', {
    idSucursal: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    claveSucursal: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    nombreSucursal: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    seguimientoRH: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    seguimientoCopiaRH: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gerenciaAdministrativa: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
    
},
{
    sequelize,
    modelName: "sucursales",
})

export default Sucursales