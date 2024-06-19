import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const CatalogoMotivos = db.define('catalogo_motivos', {
    idMotivo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombreMotivo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    claveMotivo: {
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
    modelName: "catalogo_motivos",
})

export default CatalogoMotivos