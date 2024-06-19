import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const CatalogoEstatus = db.define('catalogo_estatus', {
    idEstatusSolicitud: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombreEstatus: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
    
},
{
    sequelize,
    modelName: "catalogo_estatus",
    freezeTableName: true
})

export default CatalogoEstatus