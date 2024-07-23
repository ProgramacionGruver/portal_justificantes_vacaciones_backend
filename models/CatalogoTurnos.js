import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const CatalogoTurnos = db.define('catalogo_turnos', {
    idTurno: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    turno: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    editedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    turnoEspecial: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
    
},
{
    sequelize,
    modelName: "catalogo_turnos",
})

export default CatalogoTurnos